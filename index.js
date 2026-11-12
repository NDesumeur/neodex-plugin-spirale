// Spirale : tourne la tour pour que la balle tombe par les trous, sans toucher le rouge.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Spirale</span><span class="hint">← → ou glisser à la souris : tourner la tour · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="spCanvas" width="144" height="200" role="img" aria-label="Spirale"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="spStats"></div></div>
      <div class="row"><button class="btn main" id="spNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Une balle rebondit sur les plateaux d'une tour. Tourne la tour pour amener un trou sous la balle : elle tombe au plateau suivant. Les cases rouges la cassent. Mais si elle traverse trois plateaux d'affilée, elle arrive LANCÉE et casse le plateau suivant, même rouge. Le plateau doré au fond finit le niveau. Plus on avance, plus les trous rapetissent et plus il y a de rouge.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,640px);width:auto;aspect-ratio:144/200;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "SPIRALE", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#3ab8a8", "accL": "#b0f0e8", "accS": "#2a8a7e", "accD": "#0e2a26", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#0e2a26", "spark2": "#3ab8a8", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: [".....kk.....", "....kwwk....", "..kkkwwkkk..", ".knnnwwnnnk.", "..kkkwwkkk..", ".....kook...", "..kkkwwkkk..", ".krrrwwnnnk.", "..kkkwwkkk..", ".....wwk....", "..kkkwwkkk..", ".kgggwwgggk."],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Spirale : une balle rebondit sur les plateaux d'une tour ; tourne la tour pour qu'elle tombe par les trous.
   Les zones rouges cassent la balle, sauf si elle arrive lancée (3 plateaux traversés d'affilée) : alors elle casse le plateau. Un étage au bout de chaque niveau ---------- */
const SP = {W: 144, H: 200, HUD: 12, CX: 72, RX: 54, RY: 15, TH: 5, RIN: .3, POLE: 9, GAP: 40, S: 16, G: .22, BOUNCE: -3.7};
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const sps = gstore('spirale', {games: 0, levels: 0, level: 1});
const SP_PAL = [['#3ab8a8', '#2a8a7e'], ['#6a8ae8', '#4a62b8'], ['#b87ae0', '#8a4ab8'], ['#e8a84a', '#b8782a'], ['#5ac05a', '#3a8a3a']];
let sp = null, spac = null, spMute = false;
function spBeep(f, d, type = 'square', slide = 0, vol = .04) { if (spMute) return; try { spac ??= new AudioContext(); const o = spac.createOscillator(), g = spac.createGain(), t = spac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(spac.destination); o.start(t); o.stop(t + d); } catch {} }
// un niveau : n plateaux ; chaque plateau a un trou (2 à 4 cases) et des cases rouges, de plus en plus nombreuses ; le dernier est l'arrivée
function spLevel(level, r) {
  const n = 12 + Math.min(18, level * 2), rings = [];
  let prev = null;  // le trou d'au-dessus : la balle qui tombe arrive dessous, jamais de rouge là
  for (let k = 0; k < n; k++) {
    const cells = Array(SP.S).fill(0), gw = Math.max(2, 4 - Math.floor(level / 3) - (k > n / 2 ? 1 : 0)), g0 = prev ? (prev[0] + 3 + Math.floor(r() * 6)) % SP.S : Math.floor(r() * SP.S);
    for (let i = 0; i < gw; i++) cells[(g0 + i) % SP.S] = -1;
    const reds = k === 0 ? 0 : Math.min(7, Math.floor(level / 2) + Math.floor(k / 5) + (r() < .5 ? 1 : 0));
    for (let i = 0, tries = 0; i < reds && tries < 50; tries++) { const c = Math.floor(r() * SP.S); const near = [-1, 0, 1].some(d => cells[(c + d + SP.S) % SP.S] === -1); const land = prev && ((c - prev[0] + 1) % SP.S + SP.S) % SP.S <= prev[1] + 1; if (!cells[c] && !near && !land) { cells[c] = 1; i++; } }
    prev = [g0, gw];
    rings.push({y: (k + 1) * SP.GAP, cells, broken: 0});
  }
  rings.push({y: (n + 1) * SP.GAP, cells: Array(SP.S).fill(2), broken: 0, end: true});
  return rings;
}
function spNew(level = sps.level) {
  const g = sp?.g, rnd = seeded(Date.now() % 1e9 + level);
  sp = renew(sp, {g, mode: 'ready', tick: 0, seen: 0, level, rnd, rings: spLevel(level, rnd), rot: 0, spin: 0, keys: new Set(), y: 4, vy: 0, cam: -60, combo: 0, score: 0, passed: 0, squash: 0, dead: 0, won: 0, record: false, bits: [], drag: null});
  spInfo();
}
const spCellAt = (rot, a = Math.PI / 2) => { const t = ((a - rot) % (Math.PI * 2) + Math.PI * 4) % (Math.PI * 2); return Math.floor(t / (Math.PI * 2 / SP.S)) % SP.S; };
function spUpdate() {
  const dir = (sp.keys.has('L') ? 1 : 0) - (sp.keys.has('R') ? 1 : 0);
  sp.spin = dir ? sp.spin * .6 + dir * .06 : sp.spin * .7; sp.rot += sp.spin;
  if (sp.squash) sp.squash--;
  for (const b of sp.bits) { b.x += b.vx; b.y += b.vy; b.vy += .2; b.t--; } sp.bits = sp.bits.filter(b => b.t > 0);
  if (sp.won) { sp.won++; return; }
  const py = sp.y; sp.vy = Math.min(5, sp.vy + SP.G); sp.y += sp.vy;
  for (const ring of sp.rings) {
    if (ring.broken || !(py < ring.y && sp.y >= ring.y)) continue;
    const c = ring.cells[spCellAt(sp.rot)];
    if (c === -1) { ring.broken = 1; sp.combo++; sp.passed++; sp.score += sp.combo; spBeep(300 + sp.combo * 60, .05, 'triangle'); continue; }
    if (c === 2) { sp.y = ring.y; sp.vy = 0; sp.won = 1; sps.levels++; sps.level = sp.level + 1; sp.score += 10; best('spirale', sp.level); saveGames(); spInfo(); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => spBeep(f, .12), i * 90)); return; }
    if (sp.combo >= 3) {  // lancée : la balle casse le plateau, même rouge
      ring.broken = 2; sp.score += sp.combo * 2; sp.passed++;
      for (let i = 0; i < 14; i++) sp.bits.push({x: SP.CX + (sp.rnd() - .5) * 90, y: ring.y + (sp.rnd() - .5) * 8, vx: (sp.rnd() - .5) * 3, vy: -1 - sp.rnd() * 2, t: 30, c: SP_PAL[(sp.level - 1) % 5][0]});
      sp.combo = 0; sp.vy = SP.BOUNCE * .6; spBeep(140, .2, 'sawtooth', 60, .06); continue;
    }
    if (c === 1) { sp.y = ring.y; sp.mode = 'over'; sp.dead = 0; sps.games++; sp.record = best('spirale-score', sp.score); saveGames(); spInfo(); spBeep(200, .5, 'sawtooth', 60, .07); return; }
    sp.y = ring.y; sp.vy = SP.BOUNCE; sp.combo = 0; sp.squash = 8; spBeep(440, .04, 'square', 0, .03);
    break;
  }
  sp.cam += (Math.max(sp.cam, sp.y - 70) - sp.cam) * .15;
}
// la tour, pixel par pixel dans un tampon : plateaux en ellipse (dessus éclairé à l'avant, tranche plus sombre), poteau au centre
const spHex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
let spBuf = null, spBufC = null;
function spRings(img, rings, pal, rot) {
  const {W, H, CX, RX, RY, TH, RIN, POLE} = SP, d = img.data, [sa, sb] = pal.map(spHex), red = spHex('#e0402a'), redD = spHex('#a82a1a'), gold = spHex('#ffd84a'), goldD = spHex('#c89a1a');
  for (const ring of rings) {
    const cy = Math.round(ring.y - sp.cam + 30); if (cy < -RY - TH || cy > H + RY) continue;
    const fade = ring.broken ? 0 : 1; if (!fade) continue;
    for (let y = Math.max(SP.HUD, cy - RY - 1); y <= Math.min(H - 1, cy + RY + TH); y++) for (let x = CX - RX; x <= CX + RX; x++) {
      const dx = (x - CX) / RX, dy = (y - cy) / RY, r2 = dx * dx + dy * dy;
      let top = r2 <= 1 && r2 >= RIN * RIN, side = false, a;
      if (top) { if (dy < 0 && Math.abs(x - CX) < POLE) continue; a = Math.atan2(dy, dx); }
      else { const dy2 = (y - TH - cy) / RY; if (r2 > 1 && dy > 0 && dx * dx + dy2 * dy2 <= 1) { side = true; a = Math.atan2(Math.max(0, dy2), dx); } else continue; }
      const c = ring.cells[spCellAt(rot, a)]; if (c === -1) continue;
      let col = c === 1 ? (side ? redD : red) : c === 2 ? (side ? goldD : gold) : side ? sb : sa;
      if (c === 1 && !side && ((x + y) & 3) === 0) col = redD;  // rayures des zones rouges
      const lum = side ? .8 : .78 + .3 * Math.sin(a), i = (y * W + x) * 4;
      d[i] = Math.min(255, col[0] * lum); d[i + 1] = Math.min(255, col[1] * lum); d[i + 2] = Math.min(255, col[2] * lum); d[i + 3] = 255;
      const f = (((a - rot) / (Math.PI * 2 / SP.S)) % 1 + 1) % 1;
      if ((top && r2 > .86) || f < .07) { d[i] *= .7; d[i + 1] *= .7; d[i + 2] *= .7; }  // le bord du plateau et les séparations entre cases
    }
  }
}
function spDraw() {
  const g = sp.g, {W, H, HUD, CX, POLE} = SP;
  for (; sp.seen < sp.tick; sp.seen++) if (sp.mode !== 'play') { if (sp.mode === 'over') sp.dead++; }
  g.imageSmoothingEnabled = false;
  spBuf ??= g.createImageData(W, H); spBufC ??= Object.assign(document.createElement('canvas'), {width: W, height: H});
  // le fond (dégradé en bandes) et le poteau, puis les plateaux sous la balle, la balle, les plateaux au-dessus
  const d = spBuf.data, bg = [[24, 18, 40], [30, 22, 50], [36, 26, 60]];
  for (let y = 0; y < H; y++) { const b = bg[Math.min(2, Math.floor(y / 70))]; for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; d[i] = b[0]; d[i + 1] = b[1]; d[i + 2] = b[2]; d[i + 3] = 255; } }
  for (let y = HUD; y < H; y++) for (let x = CX - POLE; x < CX + POLE; x++) { const t = (x - CX + POLE) / (2 * POLE), l = 120 + 110 * Math.sin(t * Math.PI) * (t < .4 ? 1.1 : .9), i = (y * W + x) * 4; d[i] = l; d[i + 1] = l * .94; d[i + 2] = l * .86; }
  const pal = SP_PAL[(sp.level - 1) % 5], below = sp.rings.filter(r => r.y >= sp.y - .5).reverse(), above = sp.rings.filter(r => r.y < sp.y - .5).reverse();
  spRings(spBuf, below, pal, sp.rot); g.putImageData(spBuf, 0, 0);
  // la balle : ronde, écrasée au rebond
  const by = Math.round(sp.y - sp.cam + 30 + SP.RY * .62), sq = sp.squash > 4 ? 1 : 0;
  sprite(g, sq ? ['.kkkkkk.', 'koooooOk', 'kooooOOk', '.kkkkkk.'] : ['.kkkk.', 'kwooOk', 'koooOk', 'kooOOk', 'kOOOOk', '.kkkk.'], CX - (sq ? 4 : 3), by - (sq ? 4 : 6), {k: '#2a0a10', o: '#ff6a3a', O: '#c83a1a', w: '#ffd0b0'});
  const o = spBufC.getContext('2d'), img = o.createImageData(W, H); spRings(img, above, pal, sp.rot); o.putImageData(img, 0, 0); g.drawImage(spBufC, 0, 0);
  for (const b of sp.bits) px(g, b.c, b.x, b.y - sp.cam + 30, 2, 2);
  if (sp.combo >= 3 && sp.mode === 'play' && !sp.won) pxFont(g, 'LANCÉE !', CX, by - 12, (sp.tick >> 2) % 2 ? '#ff8a3a' : '#ffd84a', 8, 'center');
  px(g, '#0e0a14', 0, 0, W, HUD);
  pxFont(g, 'Niveau ' + sp.level, 4, 9, '#ffffff', 8); pxFont(g, sp.score + ' pts', W - 4, 9, '#ffd84a', 8, 'right');
  const total = sp.rings.length - 1; px(g, '#2a2236', 4, HUD + 3, W - 8, 3); px(g, pal[0], 4, HUD + 3, Math.round((W - 8) * Math.min(1, sp.passed / total)), 3);
  if (sp.mode === 'ready') gameText(g, W, [['SPIRALE', '#ffd84a', 12], ['← → : tourner la tour', '#ffffff'], ['Évite le rouge !', '#ff8a7a']], 80);
  if (sp.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 80);
  if (sp.won > 30) gameText(g, W, [['NIVEAU ' + sp.level + ' FINI !', '#7ee07a', 12], [sp.score + ' points', '#ffffff'], [sp.won > 60 ? 'Espace : niveau suivant' : '', '#b8b0c8']], 80);
  if (sp.mode === 'over' && sp.dead > 30) gameText(g, W, [['CASSÉE !', '#ff4a3a', 12], ['Niveau ' + sp.level + ', ' + sp.score + ' points', '#ffffff'], [sp.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best['spirale-score'] || 0) + ' pts', '#ffd84a'], [sp.dead > 60 ? 'Espace : rejouer le niveau' : '', '#b8b0c8']], 80);
  if (sp.tick % 15 === 0) {  // pour les lecteurs d'écran (et le test) : où est le trou du prochain plateau
    const next = sp.rings.find(r => !r.broken && r.y > sp.y - .5), here = spCellAt(sp.rot); let side = 'aucun';
    if (next && !next.end) { const gaps = next.cells.map((c, i) => c === -1 ? i : -1).filter(i => i >= 0); if (gaps.includes(here)) side = 'dessous'; else { const dist = i => ((i - here) % SP.S + SP.S) % SP.S, m = Math.min(...gaps.map(dist)); side = m <= SP.S / 2 ? 'à gauche' : 'à droite'; } }
    g.canvas.setAttribute('aria-label', 'Spirale : niveau ' + sp.level + ', ' + sp.score + ' points, ' + sp.passed + ' plateaux sur ' + (sp.rings.length - 1) + (sp.won ? ', niveau fini' : sp.mode === 'over' ? ', cassée' : '') + '. Trou ' + side + (next && next.cells[here] === 1 ? ', rouge dessous' : '') + '.');
  }
}
function spInfo() {
  $('spStats').replaceChildren(...[['Meilleur niveau', games.best.spirale || 0], ['Meilleur score', games.best['spirale-score'] || 0], ['Niveaux finis', sps.levels], ['Parties', sps.games]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !sp || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (sp.won) { if ((k === ' ' || k === 'Enter') && sp.won > 60) { e.preventDefault(); spNew(sps.level); sp.mode = 'play'; } return; }
  if (sp.mode === 'over') { if ((k === ' ' || k === 'Enter') && sp.dead > 60) { e.preventDefault(); spNew(sp.level); sp.mode = 'play'; } return; }
  if (k === 'p' || k === 'P' || k === 'Escape') { if (sp.mode === 'play') sp.mode = 'pause'; else if (sp.mode === 'pause') sp.mode = 'play'; return; }
  if (k === 'ArrowLeft' || k === 'q' || k === 'a') { e.preventDefault(); sp.keys.add('L'); if (sp.mode !== 'over') sp.mode = 'play'; }
  else if (k === 'ArrowRight' || k === 'd') { e.preventDefault(); sp.keys.add('R'); if (sp.mode !== 'over') sp.mode = 'play'; }
  else if ((k === ' ' || k === 'Enter') && sp.mode !== 'play') { e.preventDefault(); sp.mode = 'play'; }
});
document.addEventListener('keyup', e => { if (!sp) return; if (['ArrowLeft', 'q', 'a'].includes(e.key)) sp.keys.delete('L'); if (['ArrowRight', 'd'].includes(e.key)) sp.keys.delete('R'); });
{ const cv = $('spCanvas');  // à la souris : glisser de gauche à droite fait tourner la tour
  cv.onpointerdown = e => { e.preventDefault(); if (!sp) return; if (sp.won > 60) { spNew(sps.level); sp.mode = 'play'; return; } if (sp.mode === 'over') { if (sp.dead > 60) { spNew(sp.level); sp.mode = 'play'; } return; } sp.mode = 'play'; sp.drag = e.clientX; cv.setPointerCapture?.(e.pointerId); };
  cv.onpointermove = e => { if (sp?.drag == null) return; const r = cv.getBoundingClientRect(); sp.rot -= (e.clientX - sp.drag) / r.width * Math.PI * 1.6; sp.drag = e.clientX; };
  cv.onpointerup = () => { if (sp) sp.drag = null; }; }
$('spNew').onclick = () => { spNew(sp?.level || sps.level); $('spNew').blur(); };
{  // vérification : chaque plateau a un trou et des cases sûres à côté ; un joueur automatique qui vise les trous finit les niveaux 1, 5 et 12 ; le rouge casse la balle
  const bad = [], keep = sp, keepS = JSON.stringify(sps), keepB = [games.best.spirale, games.best['spirale-score']];
  spMute = true;
  for (const lv of [1, 5, 12]) {
    sp = null; spNew(lv); sp.mode = 'play';
    for (const r of sp.rings) if (!r.end && (!r.cells.includes(-1) || r.cells.filter(c => c === 0).length < 4)) bad.push('plateau ' + lv);
    for (let t = 0; t < 6000 && sp.mode === 'play' && !sp.won; t++) {
      const next = sp.rings.find(r => !r.broken && r.y > sp.y - .5); sp.keys.clear();
      if (next && !next.end) { const here = spCellAt(sp.rot), dist = i => ((i - here) % SP.S + SP.S) % SP.S, way = l => l.some(i => dist(i) <= SP.S / 2 && dist(i) === Math.min(...l.map(dist))) ? 'R' : 'L';
        // comme un joueur : vise le trou, mais si la balle va toucher du rouge, file vers la case sûre la plus proche
        const soon = sp.vy > 0 && next.y - sp.y < sp.vy * 6, idx = v => next.cells.map((c, i) => c === v ? i : -1).filter(i => i >= 0);
        if (soon) { if (next.cells[here] === 1) sp.keys.add(way([...idx(0), ...idx(-1)])); } else if (next.cells[here] !== -1) sp.keys.add(way(idx(-1))); }
      spUpdate();
    }
    if (!sp.won) bad.push('niveau ' + lv + ' pas fini (' + sp.mode + ', ' + sp.passed + ')');
  }
  sp = null; spNew(1); sp.mode = 'play'; const r1 = sp.rings[1]; r1.cells.fill(1); sp.rings[0].broken = 1; sp.rot = 0;
  for (let t = 0; t < 400 && sp.mode === 'play'; t++) spUpdate();
  if (sp.mode !== 'over') bad.push('rouge sans effet');
  console.assert(!bad.length, 'spirale', bad);
  Object.assign(sps, JSON.parse(keepS)); for (const [k, v] of [['spirale', keepB[0]], ['spirale-score', keepB[1]]]) { if (v === undefined) delete games.best[k]; else games.best[k] = v; }
  sp = keep; spMute = false;
}
ctx.onOpen(() => {
  if (!sp || !sp.g) { spNew(); sp.g = $('spCanvas').getContext('2d'); }
  gameLoop(sp, 'spirale', spUpdate, spDraw); spInfo();
});
}
