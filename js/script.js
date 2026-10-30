/* ==========================================================================
   Sagar's Birthday Site — behaviour
   Content lives in js/messages.js (window.BirthdayContent).
   ========================================================================== */
(() => {
  'use strict';

  const allContent = window.BirthdayContent;
  if (!allContent) return;

  // Language comes from ?lang=hi (default: en).
  const requested = new URLSearchParams(window.location.search).get('lang');
  const lang = requested && allContent[requested] ? requested : 'en';
  const content = allContent[lang];
  const ui = content.ui;
  const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key]);

  document.documentElement.classList.add('js');

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const on = (target, type, handler, options) => {
    if (target) target.addEventListener(type, handler, options);
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /** Replaces text and replays the pop-in animation. */
  function swapText(node, text) {
    node.classList.remove('is-pop');
    void node.offsetWidth; // restart the CSS animation
    node.textContent = text;
    node.classList.add('is-pop');
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      /* fall through to the legacy path */
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (error) {
      ok = false;
    }
    area.remove();
    return ok;
  }

  /* ------------------------------------------------------------------ Toast */
  const Toast = (() => {
    const node = $('#toast');
    let timer = 0;
    return {
      show(message) {
        if (!node) return;
        node.textContent = message;
        node.classList.add('is-visible');
        clearTimeout(timer);
        timer = setTimeout(() => node.classList.remove('is-visible'), 2400);
      }
    };
  })();

  /* --------------------------------------------------------------- Confetti */
  const Confetti = (() => {
    const canvas = $('#confetti-canvas');
    const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    const colors = ['#7C3AED', '#FF4D8D', '#38BDF8', '#FDE047', '#FFFFFF', '#34D399'];
    let particles = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter((p) => p.y < height + 20 && p.life > 0);
      for (const p of particles) {
        p.vy += 0.16;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life -= 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(1, p.life / 40);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (particles.length) {
        frame = requestAnimationFrame(step);
      } else {
        frame = 0;
        ctx.clearRect(0, 0, width, height);
        window.removeEventListener('resize', resize);
      }
    }

    /** originX / originY are fractions of the viewport (0–1). */
    function burst(originX = 0.5, originY = 0.5, count = 90) {
      if (!ctx || prefersReducedMotion) return;
      const small = window.innerWidth < 600;
      const total = small ? Math.round(count * 0.65) : count;
      if (!frame) {
        resize();
        window.addEventListener('resize', resize);
      }
      for (let i = 0; i < total; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 9;
        particles.push({
          x: originX * width,
          y: originY * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5,
          size: 6 + Math.random() * 7,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.35,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 90 + Math.random() * 70
        });
      }
      if (!frame) frame = requestAnimationFrame(step);
    }

    /** Fires a burst from the centre of an element. */
    function burstFrom(node, count) {
      const rect = node.getBoundingClientRect();
      burst(
        (rect.left + rect.width / 2) / window.innerWidth,
        (rect.top + rect.height / 2) / window.innerHeight,
        count
      );
    }

    return { burst, burstFrom };
  })();

  /* ------------------------------------------------------------------ Sound */
  const Sound = (() => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const button = $('#sound-toggle');
    const icon = $('#sound-icon');
    // Happy Birthday: [frequency Hz, beats]
    const tune = [
      [392, 0.75], [392, 0.25], [440, 1], [392, 1], [523, 1], [494, 2],
      [392, 0.75], [392, 0.25], [440, 1], [392, 1], [587, 1], [523, 2],
      [392, 0.75], [392, 0.25], [784, 1], [659, 1], [523, 1], [494, 1], [440, 1],
      [698, 0.75], [698, 0.25], [659, 1], [523, 1], [587, 1], [523, 2]
    ];
    const beat = 0.42;
    let audio = null;
    let enabled = false;
    let loopTimer = 0;

    function tone(freq, start, duration, type = 'sine', volume = 0.12) {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(audio.destination);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    }

    function playTune() {
      if (!audio) return;
      let time = audio.currentTime + 0.1;
      for (const [freq, beats] of tune) {
        tone(freq, time, beats * beat * 0.95, 'triangle', 0.07);
        time += beats * beat;
      }
      loopTimer = setTimeout(playTune, (time - audio.currentTime + 2) * 1000);
    }

    function setEnabled(value) {
      if (value && !AudioCtx) {
        Toast.show(ui.soundUnsupported);
        return;
      }
      enabled = value;
      if (button) {
        button.setAttribute('aria-pressed', String(enabled));
        button.setAttribute('aria-label', enabled ? ui.soundOff : ui.soundOn);
      }
      if (icon) icon.textContent = enabled ? '🔊' : '🔇';
      if (enabled) {
        try {
          audio = new AudioCtx();
          playTune();
        } catch (error) {
          enabled = false;
          audio = null;
        }
      } else {
        clearTimeout(loopTimer);
        if (audio) audio.close().catch(() => {});
        audio = null;
      }
    }

    /** Short sound effects; silently do nothing when sound is off. */
    function sfx(name) {
      if (!enabled || !audio) return;
      const t = audio.currentTime;
      const effects = {
        pop: () => tone(520, t, 0.12, 'square', 0.06),
        tada: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.09, 0.4, 'triangle', 0.12)),
        blow: () => [700, 520, 380, 260].forEach((f, i) => tone(f, t + i * 0.07, 0.15, 'sawtooth', 0.04)),
        coin: () => { tone(988, t, 0.1, 'square', 0.06); tone(1319, t + 0.1, 0.35, 'square', 0.06); }
      };
      if (effects[name]) effects[name]();
    }

    on(button, 'click', () => setEnabled(!enabled));

    return { sfx };
  })();

  /* ------------------------------------------------------------- Background */
  function buildBalloons() {
    const layer = $('#balloons');
    if (!layer || prefersReducedMotion) return;
    const palette = ['#FF4D8D', '#7C3AED', '#38BDF8', '#FDE047'];
    const count = window.innerWidth < 600 ? 6 : 10;
    for (let i = 0; i < count; i++) {
      const balloon = el('span', 'balloon');
      balloon.style.setProperty('--x', `${(i / count) * 92 + Math.random() * 6}%`);
      balloon.style.setProperty('--size', `${44 + Math.random() * 30}px`);
      balloon.style.setProperty('--color', palette[i % palette.length]);
      balloon.style.setProperty('--dur', `${18 + Math.random() * 14}s`);
      balloon.style.setProperty('--delay', `${-Math.random() * 25}s`);
      layer.appendChild(balloon);
    }
  }

  function buildHearts() {
    const layer = $('#hearts');
    if (!layer) return;
    const symbols = ['❤️', '💖', '✨', '💜', '🎈'];
    for (let i = 0; i < 14; i++) {
      const heart = el('span', 'heart', symbols[i % symbols.length]);
      heart.style.setProperty('--x', `${Math.random() * 94}%`);
      heart.style.setProperty('--size', `${1 + Math.random() * 1.1}rem`);
      heart.style.setProperty('--dur', `${6 + Math.random() * 6}s`);
      heart.style.setProperty('--delay', `${-Math.random() * 8}s`);
      layer.appendChild(heart);
    }
  }

  function mountCakes() {
    const template = $('#cake-template');
    if (!template) return;
    $$('[data-cake]').forEach((slot) => slot.appendChild(template.content.cloneNode(true)));
  }

  /* ----------------------------------------------------------- Scroll reveal */
  function setupReveals() {
    const targets = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    targets.forEach((node) => observer.observe(node));
  }

  /* ---------------------------------------------------------------- Language */
  function applyLanguage() {
    document.documentElement.lang = content.htmlLang;
    document.title = content.title;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', content.description);

    const toggle = $('#lang-toggle');
    if (toggle) {
      toggle.textContent = content.switchLabel;
      toggle.href = `?lang=${content.switchTo}`;
      toggle.setAttribute('hreflang', content.switchTo);
      toggle.lang = content.switchTo;
    }
    const soundButton = $('#sound-toggle');
    if (soundButton) soundButton.setAttribute('aria-label', ui.soundOn);

    // English text is already in the HTML; only translated keys are swapped in.
    $$('[data-i18n]').forEach((node) => {
      const value = content.text[node.dataset.i18n];
      if (value !== undefined) node.textContent = value;
    });
    $$('[data-i18n-aria]').forEach((node) => {
      const value = content.text[node.dataset.i18nAria];
      if (value !== undefined) node.setAttribute('aria-label', value);
    });
    // Cake button resets to its translated label.
    const cakeBtn = $('#cake-btn');
    if (cakeBtn) cakeBtn.textContent = ui.cakeBlow;
  }

  /* ------------------------------------------------------- Name + scroll hint */
  /** Splits text into user-perceived characters (keeps Devanagari matras attached). */
  function splitGraphemes(text) {
    if (window.Intl && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter(lang).segment(text), (s) => s.segment);
    }
    return Array.from(text);
  }

  /** Splits the name into letters so each one can bounce in a wave. */
  function setupNameWave() {
    $$('[data-wave]').forEach((node) => {
      const text = node.textContent;
      node.setAttribute('aria-label', text);
      node.replaceChildren();
      splitGraphemes(text).forEach((char, i) => {
        const letter = el('span', 'name-wave__letter', char);
        letter.setAttribute('aria-hidden', 'true');
        letter.style.animationDelay = `${i * 0.12}s, ${i * -0.4}s`;
        node.appendChild(letter);
      });
    });
  }

  function setupScrollHint() {
    const hint = $('#scroll-hint');
    if (!hint) return;
    on(hint, 'click', () => {
      const next = $('#quiz');
      if (next) next.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
    const hide = () => {
      if (window.scrollY > 40) {
        hint.classList.add('is-hidden');
        window.removeEventListener('scroll', hide);
      }
    };
    window.addEventListener('scroll', hide, { passive: true });
  }

  /* -------------------------------------------------------------------- Quiz */
  function setupQuiz() {
    const root = $('#quiz-app');
    if (!root) return;
    const { questions, titles, labels } = content.quiz;
    const letters = ['A', 'B', 'C', 'D'];
    let index = 0;
    let scores = { food: 0, sleep: 0, bluff: 0 };
    let advanceTimer = 0;

    function renderQuestion() {
      const question = questions[index];
      root.replaceChildren();

      const progress = el('div', 'quiz__progress');
      questions.forEach((_, i) => progress.appendChild(el('span', i < index ? 'quiz__dot is-done' : 'quiz__dot')));
      root.appendChild(progress);
      root.appendChild(el('p', 'quiz__step', fill(ui.step, { n: index + 1, total: questions.length })));
      root.appendChild(el('h3', 'quiz__question', question.prompt));

      const list = el('div', 'quiz__options');
      question.options.forEach((option, i) => {
        const choice = el('button', 'quiz__option');
        choice.type = 'button';
        choice.appendChild(el('span', 'quiz__letter', letters[i]));
        choice.appendChild(el('span', 'quiz__label', option.label));
        const emoji = el('span', 'quiz__emoji', option.emoji);
        emoji.setAttribute('aria-hidden', 'true');
        choice.appendChild(emoji);
        choice.addEventListener('click', () => choose(option, choice, list));
        list.appendChild(choice);
      });
      root.appendChild(list);
    }

    function choose(option, choice, list) {
      $$('button', list).forEach((b) => { b.disabled = true; });
      choice.classList.add('is-selected');
      Sound.sfx('pop');
      for (const key of Object.keys(option.weights)) scores[key] += option.weights[key];
      advanceTimer = setTimeout(() => {
        index += 1;
        if (index < questions.length) renderQuestion();
        else renderResult();
      }, prefersReducedMotion ? 0 : 450);
    }

    function percentages() {
      const keys = Object.keys(scores);
      const total = keys.reduce((sum, k) => sum + scores[k], 0) || 1;
      const result = {};
      let used = 0;
      keys.forEach((k, i) => {
        result[k] = i === keys.length - 1 ? 100 - used : Math.round((scores[k] / total) * 100);
        used += result[k];
      });
      return result;
    }

    function renderResult() {
      const pct = percentages();
      const winner = Object.keys(pct).sort((a, b) => pct[b] - pct[a])[0];
      root.replaceChildren();

      const result = el('div', 'quiz__result');
      result.appendChild(el('p', 'quiz__stamp', ui.stamp));
      result.appendChild(el('h3', 'quiz__result-title', titles[winner]));
      result.appendChild(el(
        'p',
        'quiz__result-text',
        fill(ui.result, { pf: pct.food, lf: labels.food, ps: pct.sleep, ls: labels.sleep, pb: pct.bluff, lb: labels.bluff })
      ));

      const bars = el('div', 'quiz__bars');
      Object.keys(pct).forEach((key) => {
        const row = el('div');
        const label = el('div', 'quiz__bar-label');
        label.appendChild(el('span', '', content.quiz.barLabels[key]));
        label.appendChild(el('span', '', `${pct[key]}%`));
        const bar = el('div', 'quiz__bar');
        const fill = el('span');
        fill.style.width = `${pct[key]}%`;
        bar.appendChild(fill);
        row.append(label, bar);
        bars.appendChild(row);
      });
      result.appendChild(bars);

      const retry = el('button', 'btn btn--ghost', ui.retry);
      retry.type = 'button';
      retry.style.marginTop = '1.5rem';
      retry.addEventListener('click', reset);
      result.appendChild(retry);
      root.appendChild(result);

      Confetti.burstFrom(result, 70);
      Sound.sfx('tada');
    }

    function reset() {
      clearTimeout(advanceTimer);
      index = 0;
      scores = { food: 0, sleep: 0, bluff: 0 };
      renderQuestion();
    }

    renderQuestion();
    return { reset };
  }

  /* ------------------------------------------------------------------- Cake */
  function setupCake() {
    const stage = $('#cake-stage');
    const cake = stage && $('.cake', stage);
    const button = $('#cake-btn');
    const message = $('#cake-message');
    let out = false;

    function setOut(value) {
      out = value;
      cake.classList.toggle('is-out', out);
      button.textContent = out ? ui.cakeRelight : ui.cakeBlow;
      if (out) {
        swapText(message, content.cake.out);
        Confetti.burstFrom(cake, 110);
        Sound.sfx('blow');
        setTimeout(() => Sound.sfx('tada'), 250);
      } else {
        swapText(message, content.cake.relit);
      }
    }

    on(button, 'click', () => cake && setOut(!out));

    return {
      reset() {
        if (!cake) return;
        out = false;
        cake.classList.remove('is-out');
        button.textContent = ui.cakeBlow;
        message.textContent = '';
        message.classList.remove('is-pop');
      }
    };
  }

  /* ------------------------------------------------------------------- Gift */
  function setupGift() {
    const box = $('#gift-box');
    const button = $('#gift-btn');
    const reward = $('#reward');

    on(button, 'click', () => {
      box.classList.add('is-open');
      button.hidden = true;
      // Re-insert the reward so its staggered animations replay on every unlock.
      reward.hidden = false;
      reward.style.animation = 'none';
      void reward.offsetWidth;
      reward.style.animation = '';
      Confetti.burstFrom(box, 130);
      Sound.sfx('coin');
      setTimeout(() => Sound.sfx('tada'), 200);
      setTimeout(() => reward.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' }), 250);
    });

    return {
      reset() {
        box.classList.remove('is-open');
        button.hidden = false;
        reward.hidden = true;
      }
    };
  }

  /* ------------------------------------------------------------------ Finale */
  function setupFinale(onReplay) {
    const section = $('#finale');
    const replay = $('#replay-btn');
    const share = $('#share-btn');
    let celebrated = false;

    if (section && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          section.classList.toggle('is-active', entry.isIntersecting);
          if (entry.isIntersecting && !celebrated) {
            celebrated = true;
            Confetti.burst(0.2, 0.7, 70);
            Confetti.burst(0.8, 0.7, 70);
            Sound.sfx('tada');
          }
        });
      }, { threshold: 0.45 });
      observer.observe(section);
    } else if (section) {
      section.classList.add('is-active');
    }

    on(replay, 'click', () => {
      celebrated = false;
      onReplay();
    });

    on(share, 'click', async () => {
      const data = { title: ui.shareTitle, text: content.shareText, url: window.location.href };
      if (navigator.share) {
        try {
          await navigator.share(data);
          return;
        } catch (error) {
          if (error && error.name === 'AbortError') return;
        }
      }
      const ok = await copyText(window.location.href);
      Toast.show(ok ? ui.shareCopied : fill(ui.shareManual, { url: window.location.href }));
    });
  }

  /* ------------------------------------------------------- Welcome / replay */
  function setupWelcome(resetAll) {
    const welcome = $('#welcome');
    const experience = $('#experience');
    const openButton = $('#open-surprise');
    let timer = 0;

    function open() {
      openButton.classList.add('is-pressed');
      Confetti.burstFrom(openButton, 150);
      Sound.sfx('tada');
      welcome.classList.add('is-leaving');
      clearTimeout(timer);
      timer = setTimeout(() => {
        welcome.hidden = true;
        experience.hidden = false;
        experience.classList.remove('is-entering');
        void experience.offsetWidth;
        experience.classList.add('is-entering');
        document.body.classList.remove('is-locked');
        window.scrollTo(0, 0);
        openButton.classList.remove('is-pressed');
      }, prefersReducedMotion ? 0 : 650);
    }

    function close() {
      resetAll();
      experience.hidden = true;
      welcome.hidden = false;
      void welcome.offsetWidth;
      welcome.classList.remove('is-leaving');
      document.body.classList.add('is-locked');
      welcome.scrollTop = 0;
      openButton.focus({ preventScroll: true });
    }

    on(openButton, 'click', open);
    return { close };
  }

  /* -------------------------------------------------------------------- Init */
  function init() {
    mountCakes();
    buildBalloons();
    buildHearts();
    setupReveals();
    applyLanguage();
    setupNameWave();
    setupScrollHint();
    const quiz = setupQuiz();
    const cake = setupCake();
    const gift = setupGift();

    const welcome = setupWelcome(() => {
      if (quiz) quiz.reset();
      cake.reset();
      gift.reset();
    });
    setupFinale(() => welcome.close());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
