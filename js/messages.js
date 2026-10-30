/*
 * All the editable birthday content lives here, per language.
 * The language comes from the URL: index.html?lang=hi  (default: en).
 *
 * - `en` text for static HTML lives in index.html itself; only `hi` needs a `text` map.
 *   Keys in `text` match the data-i18n / data-i18n-aria attributes in index.html.
 * - `ui`, `quiz`, `cake` are used by script.js for dynamic content.
 * Plain script (not an ES module) so the site also works when opened via file://.
 */
window.BirthdayContent = {
  en: {
    htmlLang: 'en',
    switchLabel: 'हिन्दी',
    switchTo: 'hi',
    title: 'Happy Birthday, Sagar! 🎂 The Official Birthday Surprise',
    description: 'An extremely important birthday surprise for Sagar: a fake statistics dashboard, a quiz, a cake, and a very legitimate gift.',
    shareText: 'Sagar, an extremely important human, has a birthday surprise waiting. Open it. 🎂',
    ui: {
      soundOn: 'Turn birthday sound on',
      soundOff: 'Turn birthday sound off',
      soundUnsupported: 'Sound is not supported in this browser 🤷',
      step: 'Question {n} of {total}',
      stamp: 'OFFICIAL DIAGNOSIS',
      result: 'Your birthday personality is {pf}% {lf}, {ps}% {ls}, and {pb}% {lb}.',
      retry: '🔄 Take It Again',
      cakeBlow: '💨 Blow Out the Candles',
      cakeRelight: '🕯️ Relight the Candles',
      shareTitle: 'Happy Birthday, Sagar! 🎂',
      shareCopied: 'Link copied! Now go spread the chaos 🔗',
      shareManual: 'Copy this link: {url}'
    },
    quiz: {
      questions: [
        {
          prompt: "What's Sagar's birthday priority?",
          options: [
            { emoji: '🍰', label: 'Cake', weights: { food: 3 } },
            { emoji: '🍕', label: 'Free food', weights: { food: 2, bluff: 1 } },
            { emoji: '💸', label: 'Birthday money', weights: { bluff: 2, food: 1 } },
            { emoji: '😎', label: 'Pretending to be mature', weights: { bluff: 3 } }
          ]
        },
        {
          prompt: "What's his superpower?",
          options: [
            { emoji: '😴', label: 'Sleeping anywhere', weights: { sleep: 3 } },
            { emoji: '🍔', label: 'Eating without getting full', weights: { food: 3 } },
            { emoji: '🫡', label: 'Ignoring responsibilities', weights: { sleep: 2, bluff: 1 } },
            { emoji: '😎', label: 'Being unnecessarily confident', weights: { bluff: 3 } }
          ]
        },
        {
          prompt: "What's his plan for the future?",
          options: [
            { emoji: '💰', label: 'Become rich', weights: { bluff: 2, food: 1 } },
            { emoji: '🌟', label: 'Become famous', weights: { bluff: 3 } },
            { emoji: '🛌', label: 'Sleep for another five minutes', weights: { sleep: 3 } },
            { emoji: '🤷', label: 'Figure it out later', weights: { sleep: 1, bluff: 2 } }
          ]
        }
      ],
      titles: {
        food: 'Supreme Snack Commander 🍕',
        sleep: 'Professional Chill Master 🏆',
        bluff: 'Chief Executive of Pretending 😎'
      },
      labels: { food: 'food', sleep: 'sleep', bluff: 'pretending to have your life together' },
      barLabels: { food: 'Food', sleep: 'Sleep', bluff: 'Pretending' }
    },
    cake: {
      out: 'Your wish has been submitted to the universe. Estimated delivery: 3–5 business lifetimes.',
      relit: 'The candles are back. The universe says: "Make it a good one this time."'
    },
    text: {}
  },

  hi: {
    htmlLang: 'hi',
    switchLabel: 'English',
    switchTo: 'en',
    title: 'जन्मदिन मुबारक, सागर! 🎂 आधिकारिक बर्थडे सरप्राइज़',
    description: 'सागर के लिए एक बेहद ज़रूरी बर्थडे सरप्राइज़: मज़ेदार आँकड़े, एक क्विज़, केक और एक बिल्कुल असली गिफ्ट।',
    shareText: 'सागर, एक बेहद ज़रूरी इंसान, के लिए बर्थडे सरप्राइज़ तैयार है। खोलो। 🎂',
    ui: {
      soundOn: 'बर्थडे साउंड चालू करें',
      soundOff: 'बर्थडे साउंड बंद करें',
      soundUnsupported: 'इस ब्राउज़र में साउंड सपोर्ट नहीं है 🤷',
      step: 'सवाल {n} / {total}',
      stamp: 'आधिकारिक निदान',
      result: 'तुम्हारी बर्थडे पर्सनैलिटी {pf}% {lf}, {ps}% {ls}, और {pb}% {lb} है।',
      retry: '🔄 दोबारा खेलो',
      cakeBlow: '💨 मोमबत्तियाँ बुझाओ',
      cakeRelight: '🕯️ मोमबत्तियाँ फिर जलाओ',
      shareTitle: 'जन्मदिन मुबारक, सागर! 🎂',
      shareCopied: 'लिंक कॉपी हो गया! अब जाकर धमाल मचाओ 🔗',
      shareManual: 'यह लिंक कॉपी करो: {url}'
    },
    quiz: {
      questions: [
        {
          prompt: 'सागर के जन्मदिन की पहली प्राथमिकता क्या है?',
          options: [
            { emoji: '🍰', label: 'केक', weights: { food: 3 } },
            { emoji: '🍕', label: 'मुफ़्त का खाना', weights: { food: 2, bluff: 1 } },
            { emoji: '💸', label: 'बर्थडे के पैसे', weights: { bluff: 2, food: 1 } },
            { emoji: '😎', label: 'समझदार होने की एक्टिंग', weights: { bluff: 3 } }
          ]
        },
        {
          prompt: 'उसकी सुपरपावर क्या है?',
          options: [
            { emoji: '😴', label: 'कहीं भी सो जाना', weights: { sleep: 3 } },
            { emoji: '🍔', label: 'पेट भरे बिना खाते जाना', weights: { food: 3 } },
            { emoji: '🫡', label: 'ज़िम्मेदारियाँ अनदेखी करना', weights: { sleep: 2, bluff: 1 } },
            { emoji: '😎', label: 'बेवजह कॉन्फिडेंट रहना', weights: { bluff: 3 } }
          ]
        },
        {
          prompt: 'भविष्य के लिए उसका प्लान क्या है?',
          options: [
            { emoji: '💰', label: 'अमीर बनना', weights: { bluff: 2, food: 1 } },
            { emoji: '🌟', label: 'मशहूर बनना', weights: { bluff: 3 } },
            { emoji: '🛌', label: 'पाँच मिनट और सो जाना', weights: { sleep: 3 } },
            { emoji: '🤷', label: 'बाद में सोचेंगे', weights: { sleep: 1, bluff: 2 } }
          ]
        }
      ],
      titles: {
        food: 'सुप्रीम स्नैक कमांडर 🍕',
        sleep: 'प्रोफेशनल चिल मास्टर 🏆',
        bluff: 'चीफ़ एक्ज़ीक्यूटिव ऑफ़ एक्टिंग 😎'
      },
      labels: { food: 'खाना', sleep: 'नींद', bluff: 'ज़िंदगी संभली हुई दिखाने की एक्टिंग' },
      barLabels: { food: 'खाना', sleep: 'नींद', bluff: 'एक्टिंग' }
    },
    cake: {
      out: 'तुम्हारी इच्छा ब्रह्मांड को भेज दी गई है। अनुमानित डिलीवरी: 3–5 बिज़नेस जन्मों में।',
      relit: 'मोमबत्तियाँ वापस आ गईं। ब्रह्मांड कहता है: "इस बार कुछ अच्छा माँगना।"'
    },
    text: {
      w_badge: '🚨 ब्रेकिंग न्यूज़ 🚨',
      w_h_a: 'एक बेहद ज़रूरी इंसान, ',
      name: 'सागर',
      w_h_b: ' आज के दिन पैदा हुआ था!',
      w_sub: 'वैज्ञानिक आज भी हैरान हैं कि इसके आने से पहले दुनिया चलती कैसे थी।',
      w_open: '🎁 अपना बर्थडे सरप्राइज़ खोलो',
      ticker: 'ब्रेकिंग: केक का स्टॉक खतरनाक स्तर पर ✦ लोकल लीजेंड उम्र के हिसाब से बर्ताव करने को तैयार नहीं ✦ विशेषज्ञ: झपकी फिलहाल टाल दी गई ✦ मोमबत्तियों की गिनती गोपनीय ✦ जन्मदिन वाला भाई समझदार बनने की एक्टिंग करते पकड़ा गया ✦ ',
      h_hb: 'जन्मदिन मुबारक, ',
      name_bang: 'सागर!',
      h_sub: 'एक साल और बड़े। एक साल और समझदार। मज़ाक कर रहे हैं, हमने चेक कर लिया।',
      h_badge: '🏅 आधिकारिक तौर पर लीजेंड बनने के 1 साल और करीब',
      h_scroll: 'ऊपर स्वाइप करो',
      h_scroll_aria: 'आगे बढ़ने के लिए ऊपर स्वाइप करो',
      quiz_title: '🧪 सागर अपना जन्मदिन कैसे मना रहा है',
      quiz_lead: 'तीन सवाल। शून्य सटीकता। पूरा निदान।',
      stats_title: '📊 सागर के जन्मदिन के आँकड़े',
      stats_lead: 'वैज्ञानिक रूप से असत्यापित। कानूनी रूप से संदिग्ध। पूरी तरह काल्पनिक।',
      swipe: '👈 कार्ड स्वाइप करो 👉',
      s_age_l: 'उम्र का स्तर',
      s_age_v: 'एक्सपर्ट नौसिखिया',
      s_wis_l: 'समझदारी',
      s_wis_v: 'लोड हो रहा है... 12%',
      s_cool_l: 'कूलनेस',
      s_cool_n: '(खुद से प्रमाणित)',
      s_sleep_l: 'नींद का शेड्यूल',
      s_sleep_v: 'पता नहीं',
      s_proc_l: 'टालमटोल',
      s_proc_v: 'लीजेंड्री',
      s_cake_l: 'केक की खपत',
      s_cake_v: 'असीमित',
      s_resp_l: 'ज़िम्मेदारी का स्तर',
      s_resp_v: 'कनेक्शन टाइम आउट',
      cake_title: 'इच्छा माँगो, सागर! 🎂',
      cake_btn: '💨 मोमबत्तियाँ बुझाओ',
      gift_title: '🎁 तुम्हारा खास बर्थडे गिफ्ट',
      gift_lead: 'हमने तुम्हारे लिए करोड़ों खर्च करके कुछ खास बनाया है।',
      gift_btn: 'मेरा गिफ्ट खोलो',
      r_ach: '🏆 उपलब्धि अनलॉक!',
      r_title: 'बधाई हो, सागर!',
      r_lead: 'तुमने आधिकारिक तौर पर जीता है:',
      r_1: 'आज के लिए बेहिसाब बहाने।',
      r_2: 'बर्थडे के खाने पर सबसे पहला हक़।',
      r_3: 'बिल्कुल कुछ न करने की इजाज़त।',
      r_4: '"बर्थडे लीजेंड" की शानदार उपाधि।',
      r_terms: '24 घंटे के लिए वैध। शर्तें लागू: इरिटेट मत करना।',
      f_title: 'मज़ाक अपनी जगह, जन्मदिन मुबारक, सागर ❤️',
      f_p1: 'अच्छे लोग साथ हों तो ज़िंदगी और खूबसूरत हो जाती है, और आज का दिन सिर्फ़ तुम्हें सेलिब्रेट करने का है। तुम्हारा साल खुशियों, कामयाबी, यादगार पलों और अच्छी सेहत से भरा रहे, और इतने पैसे हों कि खाना ऑर्डर करने से पहले बैंक बैलेंस देखना न पड़े।',
      f_p2: 'हँसते रहो, आगे बढ़ते रहो, और ऐसे ही कमाल के इंसान बने रहो।',
      f_p3: 'एक और साल के नाम: पागलपन भरी यादें, बड़ी जीतें, और थोड़े संदिग्ध फ़ैसले।',
      f_sign: 'जन्मदिन मुबारक, सागर! 🎂🥳',
      f_replay: '🔁 सरप्राइज़ दोबारा चलाओ',
      f_share: '🔗 यह वेबसाइट शेयर करो',
      f_foot: 'ढेर सारे प्यार, केक और थोड़े अजीब मज़ाक के साथ बनाया गया।'
    }
  }
};
