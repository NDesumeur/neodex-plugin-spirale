// lancé par le test « local » de NeoDex : joue en lisant où est le trou (comme un lecteur d'écran) et tourne la tour au clavier ;
// vérifie que la balle traverse des plateaux (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const ev = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('spCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('spCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'spirale-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500); await shot('0-depart');
  await ev('keydown', ' ');
  let held = null, l = '';
  const hold = async k => { if (held === k) return; if (held) await ev('keyup', held); held = k; if (k) await ev('keydown', k); };
  for (let i = 0; i < 300; i++) {
    l = await label();
    if (/niveau fini|cassée/.test(l)) break;
    await hold(/Trou à gauche/.test(l) ? 'ArrowRight' : /Trou à droite/.test(l) ? 'ArrowLeft' : null);
    if (i === 15) await shot('1-chute');
    if (i === 60) await shot('2-plus-bas');
    await sleep(80);
  }
  await hold(null); await sleep(1200); await shot('3-fin');
  const m = /(\d+) plateaux sur/.exec(l = await label());
  if (!m || +m[1] < 4) throw new Error('la balle devait traverser des plateaux : « ' + l + ' »');
  return l;
};
