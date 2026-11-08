/*! nagish.js — כפתור נגישות של הכל בקליק · גרסה 1 · 8.11.2026
 * התקנה: <script src="nagish.js" defer data-statement="accessibility.html"></script>
 * אפשרויות (על תגית ה-script):
 *   data-statement     כתובת הצהרת הנגישות (ברירת מחדל: accessibility.html)
 *   data-statement-fn  שם פונקציה גלובלית שפותחת את ההצהרה (למשל hkOpenLegal), נקראת עם 'accessibility'
 *   data-side          right | left (ברירת מחדל: right — לשונית צמודה לקצה, באמצע הגובה)
 *   הכפתור תמיד כחול (#1F4FA8, ניגודיות 7.6 מול לבן)
 *   data-main          איפה מתחיל התוכן הראשי, לקישור הדילוג (ברירת מחדל: main, #main)
 * תיקון אוטומטי: משלים לבד תיאור לתמונות, שמות לכפתורים ולשדות, גישה במקלדת לרכיבים לחיצים וניגודיות צבעים.
 *   כיבוי: data-autofix="off". אלמנט שלא נוגעים בו: data-nagish-skip.
 * בדיקה עצמית: להוסיף לכתובת ?nagish-check — טוען את axe ומציג את כל הבעיות לפי WCAG 2.0 AA (ת"י 5568).
 * הכפתור לא מחליף התאמה של האתר עצמו. הוא תוספת לנוחות הגולשים.
 */
(function(){
  if (window.__nagish) return; window.__nagish = 1;
  var me = document.currentScript || document.querySelector('script[src*="nagish"]') || {};
  function opt(k, d){ return (me.getAttribute && me.getAttribute('data-' + k)) || d; }
  var KEY = 'nagish-v1', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch(e){ st = {}; }
  var FS = [100, 115, 130, 150, 175];
  var H = document.documentElement;
  var css = document.createElement('style'); css.id = 'nagish-page-css';
  var EXCL = ':not(#nagish-host):not(i):not([class^="ti"]):not([class*=" ti-"]):not(.material-icons):not(svg):not(svg *)';
  css.textContent =
    'html.ng-contrast body, html.ng-contrast body *' + EXCL + '{background-color:#000 !important; background-image:none !important; color:#fff !important; border-color:#fff !important; text-shadow:none !important; box-shadow:none !important;}' +
    'html.ng-contrast body a, html.ng-contrast body a *{color:#ffeb3b !important;}' +
    'html.ng-contrast body button, html.ng-contrast body [role="button"]{outline:1px solid #fff !important;}' +
    'html.ng-contrast img, html.ng-contrast video{opacity:1 !important;}' +
    'html.ng-gray{filter:grayscale(1);}' +
    'html.ng-links a{text-decoration:underline !important; outline:2px solid #FFB300 !important; outline-offset:1px; background-color:#FFF8D6 !important; color:#111 !important;}' +
    'html.ng-heads h1, html.ng-heads h2, html.ng-heads h3, html.ng-heads h4, html.ng-heads h5, html.ng-heads h6{outline:3px dashed #1F4FA8 !important; outline-offset:3px;}' +
    'html.ng-font body *' + EXCL + '{font-family:Arial, "Segoe UI", Tahoma, sans-serif !important;}' +
    'html.ng-space body *' + EXCL + '{letter-spacing:0.12em !important; word-spacing:0.16em !important; line-height:1.6 !important;}' +
    'html.ng-still *, html.ng-still *::before, html.ng-still *::after{animation-play-state:paused !important; transition:none !important; scroll-behavior:auto !important;}' +
    'html.ng-cursor, html.ng-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2748%27 height=%2748%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27M4 2l16 10-7 1.5L17 21l-3 1.5-4-7.5L4 20z%27 fill=%27%23000%27 stroke=%27%23fff%27 stroke-width=%271.2%27/%3E%3C/svg%3E") 4 2, auto !important;}' +
    'html:has(body.admin-mode) #nagish-host{display:none !important;}' +
    '#nagish-skip{position:fixed; top:-60px; right:16px; z-index:2147483001; background:#1F4FA8; color:#fff; padding:10px 16px; border-radius:8px; font:700 15px Arial, sans-serif; text-decoration:none;}' +
    '#nagish-skip:focus{top:12px; outline:3px solid #FF6F00;}';
  (document.head || H).appendChild(css);

  function applyAll(){
    var lvl = Math.max(0, Math.min(FS.length - 1, st.fs || 0));
    if (document.body) document.body.style.zoom = lvl ? (FS[lvl] / 100) : '';
    ['contrast','gray','links','heads','font','space','still','cursor'].forEach(function(k){ H.classList.toggle('ng-' + k, !!st[k]); });
    // תיאום עם עצירת התנועה שכבר קיימת באתרים של הכל בקליק
    H.classList.toggle('hk-still', !!st.still);
    try { window.hkStill = !!st.still; } catch(e){}
    if (st.still) document.querySelectorAll('video').forEach(function(v){ if (!v.paused && v.muted) v.pause(); });
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e){}
    paint();
  }

  // הכפתור יושב מחוץ ל-body, בתוך shadow DOM, כדי שההגדלה והצבעים של הדף לא ישברו אותו
  var host = document.createElement('div'); host.id = 'nagish-host';
  var side = opt('side', 'right') === 'left' ? 'left' : 'right';
  var other = side === 'right' ? 'left' : 'right';
  host.style.cssText = 'position:fixed; z-index:2147483000; top:50%; margin-top:-28px; ' + side + ':0;';
  var root = host.attachShadow ? host.attachShadow({mode:'open'}) : host;
  var C = '#1F4FA8';   // תמיד כחול
  function ic(d){ return '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; }
  var I = {
    contrast: ic('<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>'),
    gray:     ic('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M12 9v11" />'),
    links:    ic('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    heads:    ic('<path d="M5 5v14M13 5v14M5 12h8"/><path d="M17 9l2-1v11"/>'),
    font:     ic('<path d="M4 19l6-14 6 14M6.5 14h7"/><path d="M18 19v-7"/>'),
    space:    ic('<path d="M4 7h16M4 12h16M4 17h16"/><path d="M2 4v16M22 4v16"/>'),
    still:    ic('<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>'),
    cursor:   ic('<path d="M5 3l14 8-6 1.5L16 20l-2.5 1.2-3.3-7.4L5 18z"/>')
  };
  var T = [['contrast','ניגודיות גבוהה'],['gray','גווני אפור'],['links','הדגשת קישורים'],['heads','הדגשת כותרות'],['font','גופן קריא'],['space','ריווח טקסט'],['still','עצירת אנימציות'],['cursor','סמן עכבר גדול']];
  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '*{box-sizing:border-box; font-family:Arial, "Segoe UI", Tahoma, sans-serif;}' +
    '.fab{width:48px; height:56px; border:2px solid #fff; border-' + side + ':none; border-radius:' + (side === 'right' ? '12px 0 0 12px' : '0 12px 12px 0') + '; background:' + C + '; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,.35); padding:0;}' +
    '.fab:focus-visible, button:focus-visible, a:focus-visible{outline:3px solid #FF6F00; outline-offset:2px;}' +
    '.pnl{position:fixed; top:50%; transform:translateY(-50%); ' + side + ':56px; width:320px; max-width:calc(100vw - 72px); max-height:calc(100vh - 32px); overflow:auto; background:#fff; color:#111; border-radius:14px; box-shadow:0 10px 40px rgba(0,0,0,.35); padding:14px; direction:rtl; text-align:right; font-size:15px;}' +
    '@media (max-width:480px){.pnl{' + side + ':8px; ' + other + ':8px; width:auto; max-width:none;}}' +
    '.pnl[hidden]{display:none}' +
    '.hd{display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:' + C + '; color:#fff; margin:-14px -14px 12px; padding:12px 14px; border-radius:14px 14px 0 0;}' +
    'h2{font-size:17px; margin:0; color:#fff;}' +
    '.x{background:transparent; border:2px solid #fff; border-radius:8px; width:34px; height:34px; cursor:pointer; font-size:16px; color:#fff;}' +
    '.sz{display:flex; align-items:center; justify-content:space-between; gap:8px; border:1.5px solid #CFCFCF; border-radius:12px; padding:8px 10px; margin-bottom:10px;}' +
    '.sz b{font-size:15px;}' +
    '.szc{display:flex; align-items:center; gap:6px;}' +
    '.sb{min-width:44px; height:40px; border:1.5px solid #767676; background:#F7F7F7; color:#111; border-radius:10px; cursor:pointer; font-size:16px; font-weight:700;}' +
    '.szv{min-width:52px; text-align:center; font-weight:700;}' +
    '.g{display:grid; grid-template-columns:1fr 1fr; gap:8px;}' +
    '.b{border:1.5px solid #CFCFCF; background:#F7F7F7; color:#111; border-radius:12px; padding:12px 6px 10px; cursor:pointer; font-size:14px; line-height:1.25; min-height:84px; width:100%; display:flex; flex-direction:column; align-items:center; gap:6px;}' +
    '.b svg{color:' + C + ';}' +
    '.b[aria-pressed="true"]{background:' + C + '; border-color:' + C + '; color:#fff; font-weight:700;}' +
    '.b[aria-pressed="true"] svg{color:#fff;}' +
    '.ft{display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:8px; flex-wrap:wrap;}' +
    '.rs{border:1.5px solid #767676; background:#fff; color:#111; border-radius:10px; padding:9px 14px; cursor:pointer; font-size:14px; min-height:44px;}' +
    '.ft a{color:' + C + '; font-weight:700;}' +
    '.note{font-size:12px; color:#555; margin-top:8px;}' +
    '.rep{margin-top:10px; font-size:13px; max-height:260px; overflow:auto; border-top:1px solid #ddd; padding-top:8px;}' +
    '.rep li{margin-bottom:6px;}' +
    '.sr{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0);}' +
    '</style>' +
    '<button class="fab" type="button" aria-label="תפריט נגישות" aria-expanded="false" aria-controls="ngp">' +
      '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" fill="#fff"><circle cx="12" cy="4" r="2"/><path d="M19 8.5c-2.3.6-4.6.9-7 .9s-4.7-.3-7-.9l-.5 1.9c1.9.5 3.8.8 5.7 1v3.1L8.6 21l1.9.7 1.5-5.4 1.5 5.4 1.9-.7-1.6-6.5v-3.1c1.9-.2 3.8-.5 5.7-1z"/></svg>' +
    '</button>' +
    '<div class="pnl" id="ngp" role="dialog" aria-modal="false" aria-labelledby="ngt" hidden>' +
      '<div class="hd"><h2 id="ngt">תפריט נגישות</h2><button class="x" type="button" data-a="close" aria-label="סגירת תפריט הנגישות">✕</button></div>' +
      '<div class="sz"><b>גודל טקסט</b><div class="szc"><button class="sb" type="button" data-a="fs-" aria-label="הקטנת טקסט">א−</button><span class="szv" data-v="fs" aria-live="polite"></span><button class="sb" type="button" data-a="fs+" aria-label="הגדלת טקסט">א+</button></div></div>' +
      '<div class="g">' + T.map(function(t){ return '<button class="b" type="button" data-t="' + t[0] + '" aria-pressed="false">' + I[t[0]] + '<span>' + t[1] + '</span></button>'; }).join('') + '</div>' +
      '<div class="ft"><button class="rs" type="button" data-a="reset">איפוס הגדרות</button><a href="#" data-a="statement">הצהרת נגישות</a></div>' +
      '<div class="note">ההגדרות נשמרות בדפדפן שלך.</div>' +
      '<div class="rep" hidden></div>' +
      '<div class="sr" aria-live="polite" data-live></div>' +
    '</div>';
  var $ = function(s){ return root.querySelector(s); };
  var fab = $('.fab'), pnl = $('.pnl'), live = $('[data-live]');

  function paint(){
    var l = $('[data-v="fs"]'); if (l) l.textContent = FS[st.fs || 0] + '%';
    root.querySelectorAll('[data-t]').forEach(function(b){ b.setAttribute('aria-pressed', st[b.getAttribute('data-t')] ? 'true' : 'false'); });
  }
  function open(on){
    pnl.hidden = !on; fab.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on){ var f = root.querySelector('.x'); f && f.focus(); } else fab.focus();
  }
  function say(t){ live.textContent = ''; setTimeout(function(){ live.textContent = t; }, 30); }
  fab.addEventListener('click', function(){ open(pnl.hidden); });
  root.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !pnl.hidden){ e.preventDefault(); open(false); } });
  root.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('button, a') : null; if (!b) return;
    var t = b.getAttribute('data-t'), a = b.getAttribute('data-a');
    if (t){ st[t] = !st[t]; applyAll(); say(b.textContent + (st[t] ? ' פועל' : ' כבוי')); return; }
    if (a === 'close') return open(false);
    if (a === 'fs+'){ st.fs = Math.min(FS.length - 1, (st.fs || 0) + 1); applyAll(); return say('גודל טקסט ' + FS[st.fs] + '%'); }
    if (a === 'fs-'){ st.fs = Math.max(0, (st.fs || 0) - 1); applyAll(); return say('גודל טקסט ' + FS[st.fs] + '%'); }
    if (a === 'fs0'){ st.fs = 0; applyAll(); return say('גודל טקסט 100%'); }
    if (a === 'reset'){ st = {}; H.classList.remove('hk-still'); applyAll(); return say('ההגדרות אופסו'); }
    if (a === 'statement'){
      e.preventDefault();
      var fn = opt('statement-fn', '');
      if (fn && typeof window[fn] === 'function'){ open(false); window[fn]('accessibility'); return; }
      location.href = opt('statement', 'accessibility.html');
    }
  });

  // בדיקה עצמית לפי WCAG 2.0 AA (ת"י 5568), רק כשמוסיפים ?nagish-check לכתובת
  function selfCheck(){
    var rep = $('.rep'); open(true); rep.hidden = false; rep.textContent = 'בודקת את הדף לפי ת"י 5568 ולפי WCAG 2.2 העדכני…';
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
    s.onload = function(){
      window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'], exclude: [['#nagish-host']] }).then(function(r){
        var fx = fixed.alt + fixed.name + fixed.label + fixed.kbd + fixed.contrast + fixed.other;
        var fh = fx ? '<p>תוקנו אוטומטית בדף: ' + fixed.contrast + ' צבעים, ' + fixed.kbd + ' רכיבים למקלדת, ' + fixed.name + ' שמות לכפתורים, ' + fixed.label + ' שמות לשדות, ' + fixed.alt + ' תמונות, ' + fixed.other + ' אחרים. כדאי להכניס את התיקונים גם לקוד.</p>' : '';
        if (!r.violations.length){ rep.innerHTML = fh + '<b>לא נמצאו בעיות אוטומטיות בדף הזה.</b> עדיין כדאי לבדוק במקלדת ובקורא מסך.'; return; }
        var h = fh + '<b>נמצאו ' + r.violations.length + ' סוגי בעיות:</b><ul>';
        r.violations.forEach(function(v){
          var law = v.tags.indexOf('wcag2a') >= 0 || v.tags.indexOf('wcag2aa') >= 0;
          h += '<li><b>' + v.id + '</b> ' + (law ? '[חובה לפי ת"י 5568]' : '[המלצה, WCAG 2.1/2.2]') + ' (' + v.nodes.length + '): ' + v.help.replace(/</g, '&lt;') + '<br><small>' +
               v.nodes.slice(0, 3).map(function(n){ return String(n.target.join(' ')).replace(/</g, '&lt;'); }).join('<br>') + '</small></li>';
        });
        rep.innerHTML = h + '</ul>';
        try { console.table(r.violations.map(function(v){ return { id: v.id, impact: v.impact, count: v.nodes.length, help: v.help }; })); } catch(e){}
      });
    };
    s.onerror = function(){ rep.textContent = 'לא הצלחתי לטעון את כלי הבדיקה.'; };
    document.head.appendChild(s);
  }

  // קישור "דילוג לתוכן הראשי" — מופיע רק בלחיצה על Tab הראשונה
  function addSkip(){
    if (document.getElementById('nagish-skip')) return;
    var sel = opt('main', 'main, #main, [role="main"]');
    var t = document.querySelector(sel); if (!t) return;
    if (!t.id) t.id = 'nagish-main';
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    var a = document.createElement('a'); a.id = 'nagish-skip'; a.href = '#' + t.id; a.textContent = 'דילוג לתוכן הראשי';
    a.addEventListener('click', function(e){ e.preventDefault(); t.focus(); t.scrollIntoView(); });
    document.body.insertBefore(a, document.body.firstChild);
  }
  // ===== תיקון אוטומטי: משלים לבד מה שחסר בדף לפי ת"י 5568 (אפשר לכבות עם data-autofix="off") =====
  var fixed = { alt:0, name:0, label:0, kbd:0, contrast:0, other:0 };
  function lum(r, g, b){ var a = [r, g, b].map(function(v){ v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
  function ratio(c1, c2){ var l1 = lum(c1[0], c1[1], c1[2]), l2 = lum(c2[0], c2[1], c2[2]); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
  function rgba(str){ var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(str || ''); return m ? [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]] : null; }
  function bgOf(el){
    // צבע הרקע האמיתי מאחורי האלמנט. אם יש תמונה או מעבר צבע — לא נוגעים
    var layers = [];
    for (var e = el; e && e.nodeType === 1; e = e.parentElement){
      var cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      var c = rgba(cs.backgroundColor);
      if (c && c[3] > 0){ layers.push(c); if (c[3] >= 1) break; }
    }
    var out = [255, 255, 255];
    for (var i = layers.length - 1; i >= 0; i--){ var l = layers[i]; out = [0,1,2].map(function(k){ return l[k] * l[3] + out[k] * (1 - l[3]); }); }
    return out;
  }
  function fixColor(fg, bg, need){
    // מכהה (או מבהיר על רקע כהה) את הצבע עד שהניגודיות מספיקה, ושומר על הגוון
    var dark = lum(bg[0], bg[1], bg[2]) > 0.18, c = fg.slice(0, 3);
    for (var i = 0; i < 40 && ratio(c, bg) < need; i++){
      c = c.map(function(v){ return dark ? Math.max(0, v * 0.9) : Math.min(255, v + (255 - v) * 0.12); });
    }
    return 'rgb(' + c.map(Math.round).join(',') + ')';
  }
  function hint(el){
    var h = el.getAttribute('href') || '';
    if (/^tel:/i.test(h)) return 'חיוג';
    if (/^mailto:/i.test(h)) return 'שליחת מייל';
    if (/wa\.me|whatsapp/i.test(h)) return 'וואטסאפ';
    if (/instagram/i.test(h)) return 'אינסטגרם';
    if (/facebook/i.test(h)) return 'פייסבוק';
    if (/waze/i.test(h)) return 'ניווט בוויז';
    if (/maps\.google|goo\.gl\/maps/i.test(h)) return 'מפה';
    return '';
  }
  function hasName(el){
    if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title')) return true;
    if ((el.textContent || '').replace(/[\s‏‎]+/g, '').length) return true;
    var im = el.querySelector('img[alt]:not([alt=""])'); return !!im;
  }
  var NATIVE = /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|OPTION|LABEL|VIDEO|AUDIO|IFRAME)$/;
  function autofix(){
    if (opt('autofix', 'on') === 'off') return;
    if (document.body && document.body.classList.contains('admin-mode')) return;
    if (!H.getAttribute('lang')){ H.setAttribute('lang', 'he'); fixed.other++; }
    if (!H.getAttribute('dir') && !document.body.getAttribute('dir')){ H.setAttribute('dir', 'rtl'); fixed.other++; }
    var all = document.body.querySelectorAll('*'), n = Math.min(all.length, 6000);
    for (var i = 0; i < n; i++){
      var el = all[i];
      if (el.closest && el.closest('[data-nagish-skip], [aria-hidden="true"]')) continue;
      var tag = el.tagName;
      if (tag === 'IMG' && !el.hasAttribute('alt')){ el.setAttribute('alt', el.getAttribute('title') || ''); fixed.alt++; continue; }
      if (tag === 'IFRAME' && !el.getAttribute('title')){ el.setAttribute('title', 'תוכן משובץ'); fixed.other++; continue; }
      if (tag === 'SVG' || tag === 'svg'){ if (!el.getAttribute('role') && !el.getAttribute('aria-label') && !el.querySelector('title')){ el.setAttribute('aria-hidden', 'true'); } continue; }
      if ((tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') && el.type !== 'hidden' && el.type !== 'submit' && el.type !== 'button'){
        var lab = (el.id && document.querySelector('label[for="' + el.id.replace(/"/g, '') + '"]')) || el.closest('label');
        if (!lab && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')){
          var ph = el.getAttribute('placeholder') || el.getAttribute('title') || el.getAttribute('name');
          if (ph){ el.setAttribute('aria-label', ph); fixed.label++; }
        }
        continue;
      }
      if ((tag === 'A' && el.hasAttribute('href')) || tag === 'BUTTON' || el.getAttribute('role') === 'button'){
        if (!hasName(el)){ var t = hint(el); if (t){ el.setAttribute('aria-label', t); fixed.name++; } }
      }
      // אלמנט שלוחצים עליו בעכבר אבל אי אפשר להגיע אליו במקלדת
      if (!NATIVE.test(tag) && !el.hasAttribute('tabindex') && !el.getAttribute('role') && (el.onclick || el.hasAttribute('onclick'))
          && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden'
          && !/backdrop|overlay|scrim|mask/i.test(el.className + ' ' + el.id)
          && (el.textContent || '').trim() && !el.querySelector('a, button, input, select, textarea, [tabindex]')){
        el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('data-nagish-kbd', '1'); fixed.kbd++;
      }
    }
    // ניגודיות: רק טקסט שמוצג בפועל, עד 1,500 אלמנטים
    var cnt = 0;
    for (var j = 0; j < n && cnt < 1500; j++){
      var e2 = all[j];
      if (!e2.firstChild || e2.closest('[data-nagish-skip]') || e2.hasAttribute('data-nagish-c')) continue;
      var txt = false;
      for (var c = e2.firstChild; c; c = c.nextSibling) if (c.nodeType === 3 && c.nodeValue.trim()){ txt = true; break; }
      if (!txt || !e2.offsetParent && getComputedStyle(e2).position !== 'fixed') continue;
      cnt++;
      var cs = getComputedStyle(e2);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      var fg = rgba(cs.color); if (!fg) continue;
      var bg = bgOf(e2); if (!bg) continue;
      var size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
      var need = (size >= 24 || (bold && size >= 18.66)) ? 3 : 4.5;
      var f3 = fg[3] < 1 ? [0,1,2].map(function(k){ return fg[k] * fg[3] + bg[k] * (1 - fg[3]); }) : fg;
      if (ratio(f3, bg) < need){
        e2.style.setProperty('color', fixColor(f3, bg, need + 0.1), 'important');
        e2.setAttribute('data-nagish-c', '1'); fixed.contrast++;
      }
    }
  }
  document.addEventListener('keydown', function(e){
    var el = e.target;
    if (!el || !el.getAttribute || el.getAttribute('data-nagish-kbd') !== '1') return;
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); }
  });
  var afQ = null;
  function queueFix(){ if (afQ) return; afQ = setTimeout(function(){ afQ = null; try { autofix(); } catch(err){} }, 700); }

  function mount(){
    addSkip();
    H.appendChild(host);
    applyAll();
    setTimeout(function(){
      try { autofix(); } catch(err){}
      try { new MutationObserver(function(ms){ for (var i = 0; i < ms.length; i++){ if (!host.contains(ms[i].target)){ queueFix(); return; } } }).observe(document.body, { childList: true, subtree: true }); } catch(err){}
      if (/[?&]nagish-check\b/.test(location.search)) selfCheck();
    }, 1200);
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
