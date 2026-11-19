// ===== 小人退散：打小人（木屐拍纸人）、刺小人（给稻草小人扎针） =====
// 用到 main.js 的 $、pick、blip 和 games.js 的 bonk。小人是画出来的卡通角色，不是任何真人。

// stage：0 得意 1 慌了 2 哭了 3 晕了
function paperDoll(stage = 0) {
  const eyes = stage >= 3 ? '<path d="M38 34l8 8m0-8l-8 8M54 34l8 8m0-8l-8 8" stroke="#2d3a5c" stroke-width="3" stroke-linecap="round"/>'
    : stage === 2 ? '<path d="M37 38q5-5 10 0M53 38q5-5 10 0" stroke="#2d3a5c" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M40 43q-3 8 0 12M60 43q3 8 0 12" stroke="#8fd0ea" stroke-width="3.5" stroke-linecap="round"/>'
    : '<circle cx="42" cy="38" r="3" fill="#2d3a5c"/><circle cx="58" cy="38" r="3" fill="#2d3a5c"/>';
  const brows = stage === 0 ? '<path d="M35 30l11 4M65 30l-11 4" stroke="#2d3a5c" stroke-width="3" stroke-linecap="round"/>' : '';
  const mouth = stage === 0 ? '<path d="M42 50q8 6 16 0" stroke="#2d3a5c" stroke-width="3" fill="none" stroke-linecap="round"/>'
    : stage === 1 ? '<ellipse cx="50" cy="51" rx="5" ry="4" fill="#2d3a5c"/>' : '<path d="M42 53q8-6 16 0" stroke="#2d3a5c" stroke-width="3" fill="none" stroke-linecap="round"/>';
  const extra = (stage >= 1 ? '<path d="M72 26q4 7 0 10q-4-3 0-10z" fill="#8fd0ea"/>' : '') + (stage >= 3 ? '<text x="20" y="20" font-size="14" fill="#f3b33d">★</text><text x="72" y="16" font-size="11" fill="#f3b33d">★</text>' : '');
  return `<svg viewBox="0 0 100 150" aria-hidden="true"><path d="M50 8a26 26 0 0 1 22 40l22 10l-5 18l-20-6l4 70H27l4-70l-20 6l-5-18l22-10A26 26 0 0 1 50 8z" fill="#fffdf8" stroke="#2d3a5c" stroke-width="3" stroke-linejoin="round"/>
    <text x="50" y="104" text-anchor="middle" font-size="22" fill="#e2543d" font-family="ZCOOL KuaiLe, sans-serif">小人</text>${eyes}${brows}${mouth}${extra}</svg>`;
}
function strawDoll(stage = 0) {
  const eyes = stage >= 2 ? '<path d="M38 36l8 8m0-8l-8 8M54 36l8 8m0-8l-8 8" stroke="#2d3a5c" stroke-width="3" stroke-linecap="round"/>' : '<circle cx="42" cy="40" r="3.2" fill="#2d3a5c"/><circle cx="58" cy="40" r="3.2" fill="#2d3a5c"/>';
  const mouth = stage === 0 ? '<path d="M43 50q7 5 14 0" stroke="#2d3a5c" stroke-width="3" fill="none" stroke-linecap="round"/>' : stage === 1 ? '<ellipse cx="50" cy="52" rx="5" ry="4" fill="#2d3a5c"/>' : '<path d="M41 53q3-4 6 0t6 0t6 0" stroke="#2d3a5c" stroke-width="3" fill="none" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 100 150" aria-hidden="true"><g fill="#ecc98a" stroke="#2d3a5c" stroke-width="3" stroke-linejoin="round"><path d="M30 62L6 52l-3 16l26 12zM70 62l24-10l3 16l-26 12zM36 108l-8 36h16l6-30l6 30h16l-8-36z"/><rect x="29" y="56" width="42" height="58" rx="14"/><circle cx="50" cy="38" r="25"/></g>
    <g stroke="#b98a55" stroke-width="2" stroke-linecap="round"><path d="M38 70v32M50 68v38M62 70v32M40 20v8M50 16v9M60 20v8"/></g><g stroke="#e2543d" stroke-width="4" stroke-linecap="round"><path d="M31 62h38M33 108h34M14 58l-3 14M86 58l3 14"/></g>${eyes}${mouth}</svg>`;
}

// ---------- 打小人 ----------
const CHANT = ['打你个小人头，坏话没人听', '打你个小人嘴，是非全吞回', '打你个小人手，功劳抢不走', '打你个小人脚，走路自己摔', '打得好！', '啪！', '退散！', '再来一下！'];
const SLAP_MAX = 30;
let slapN = 0;
const slapDoll = $('slap-doll'), slapZone = $('slap-zone');
function slapDraw() {
  slapDoll.innerHTML = paperDoll(slapN >= SLAP_MAX ? 3 : slapN >= 20 ? 2 : slapN >= 8 ? 1 : 0);
  $('slap-n').textContent = slapN; $('slap-bar').style.width = Math.min(100, slapN / SLAP_MAX * 100) + '%';
}
slapZone.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (slapN >= SLAP_MAX) return;
  slapN++; slapDraw(); bonk(slapN % 5 === 0);
  slapDoll.classList.remove('ouch'); void slapDoll.offsetWidth; slapDoll.classList.add('ouch');
  const r = slapZone.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  const g = document.createElement('i'); g.className = 'geta'; g.style.left = x + 'px'; g.style.top = y + 'px'; slapZone.appendChild(g); setTimeout(() => g.remove(), 380);
  if (slapN % 3 === 0 || slapN === 1) { const f = document.createElement('span'); f.className = 'shout'; f.textContent = pick(CHANT.slice(4)); f.style.left = x + 'px'; f.style.top = y + 'px'; slapZone.appendChild(f); setTimeout(() => f.remove(), 700); }
  if (slapN >= SLAP_MAX) { slapDoll.classList.add('gone'); $('slap-msg').textContent = '小人已退散！从今天起，坏话都绕着蓉儿走。'; blip([784, 988, 1319], 'sine', .16, .6); }
  else if (slapN % 4 === 0) $('slap-msg').textContent = CHANT[(slapN / 4 - 1) % 4] + '！';
});
$('slap-reset').onclick = () => { slapN = 0; slapDoll.classList.remove('gone', 'ouch'); slapDraw(); $('slap-msg').textContent = '用木屐拍它！拍满 30 下就退散。'; };
slapDraw();

// ---------- 刺小人 ----------
const PIN_SAY = ['背后说坏话', '甩锅', '抢功劳', '打小报告', '阴阳怪气', '画大饼', '爱告状', '笑里藏刀', '挑拨离间', '占小便宜', '两面三刀', '爱翻旧账'];
const PIN_MAX = PIN_SAY.length;
let pinN = 0;
const pinZone = $('pin-zone'), pinDoll = $('pin-doll'), pinLayer = $('pin-layer');
function pinDraw() { pinDoll.innerHTML = strawDoll(pinN >= PIN_MAX ? 2 : pinN >= 5 ? 1 : 0); $('pin-n').textContent = pinN; $('pin-left').textContent = PIN_MAX - pinN; }
pinZone.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (pinN >= PIN_MAX) return;
  const r = pinDoll.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { $('pin-msg').textContent = '扎歪了，瞄准稻草小人再扎。'; blip([240], 'sine', .08, .2); return; }
  const z = pinZone.getBoundingClientRect(), x = e.clientX - z.left, y = e.clientY - z.top, say = PIN_SAY[pinN];
  pinN++; pinDraw();
  const p = document.createElement('i'); p.className = 'pin'; p.style.left = x + 'px'; p.style.top = y + 'px'; p.style.setProperty('--a', (Math.random() * 50 - 25).toFixed(0) + 'deg'); p.style.setProperty('--c', pick(['#e2543d', '#f3b33d', '#2d3a5c', '#9bb86e', '#f29cb0'])); pinLayer.appendChild(p);
  const f = document.createElement('span'); f.className = 'shout'; f.textContent = '扎走「' + say + '」'; f.style.left = Math.min(z.width - 80, Math.max(80, x)) + 'px'; f.style.top = y + 'px'; pinZone.appendChild(f); setTimeout(() => f.remove(), 900);
  pinDoll.classList.remove('jolt'); void pinDoll.offsetWidth; pinDoll.classList.add('jolt');
  blip([900 + pinN * 40], 'triangle', .12, .18); if (navigator.vibrate) navigator.vibrate(12);
  if (pinN >= PIN_MAX) { $('pin-msg').textContent = '十二根针扎满，小人的坏心眼全漏光了。'; blip([784, 988, 1319], 'sine', .16, .6); }
  else $('pin-msg').textContent = `扎走了「${say}」，还剩 ${PIN_MAX - pinN} 根针。`;
});
$('pin-reset').onclick = () => { pinN = 0; pinLayer.innerHTML = ''; pinDraw(); $('pin-msg').textContent = '点稻草小人身上，想扎哪里扎哪里。'; };
pinDraw();
