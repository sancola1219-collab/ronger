// ===== 老板出气区：打地鼠版「揍老板」、十秒沙包 =====
// 用到 main.js 里的 $、pick、blip、audio。老板是画出来的卡通人物，不是任何真人。

function bonk(strong) {
  try {
    const a = audio(), t = a.currentTime, o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(strong ? 260 : 320, t); o.frequency.exponentialRampToValueAtTime(70, t + .16);
    g.gain.setValueAtTime(.22, t); g.gain.exponentialRampToValueAtTime(.001, t + .2);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + .22);
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate(18);
}

// stage：0 嚣张 1 冒汗 2 挂彩 3 晕了
function bossSVG(stage = 0) {
  const eyes = stage >= 3
    ? '<path d="M33 46l8 8m0-8l-8 8M59 46l8 8m0-8l-8 8" stroke="#2d3a5c" stroke-width="3.5" stroke-linecap="round"/>'
    : '<circle cx="37" cy="50" r="3.2" fill="#2d3a5c"/><circle cx="63" cy="50" r="3.2" fill="#2d3a5c"/>';
  const brows = stage === 0 ? '<path d="M29 38l14 5M71 38l-14 5" stroke="#2d3a5c" stroke-width="3.5" stroke-linecap="round"/>'
    : '<path d="M29 43l14-4M71 43l-14-4" stroke="#2d3a5c" stroke-width="3.5" stroke-linecap="round"/>';
  const mouth = stage === 0 ? '<path d="M40 70q10-7 20 0" stroke="#2d3a5c" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    : stage < 3 ? '<ellipse cx="50" cy="70" rx="7" ry="5" fill="#2d3a5c"/>'
    : '<path d="M38 70q4-5 8 0t8 0t8 0" stroke="#2d3a5c" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  const extra = (stage >= 1 ? '<path d="M78 40q4 7 0 10q-4-3 0-10z" fill="#8fd0ea"/>' : '')
    + (stage >= 2 ? '<circle cx="60" cy="17" r="8" fill="#f29cb0" stroke="#2d3a5c" stroke-width="2.5"/><rect x="24" y="56" width="13" height="6" rx="2" fill="#fff" stroke="#2d3a5c" stroke-width="1.5" transform="rotate(-20 30 59)"/>' : '')
    + (stage >= 3 ? '<text x="14" y="22" font-size="15" fill="#f3b33d">★</text><text x="78" y="20" font-size="12" fill="#f3b33d">★</text>' : '');
  return `<svg viewBox="0 0 100 104" aria-hidden="true"><path d="M30 84l20 9l20-9l6 20H24z" fill="#fff" stroke="#2d3a5c" stroke-width="3"/><path d="M50 90l-5 14h10z" fill="#e2543d"/>
    <ellipse cx="50" cy="52" rx="30" ry="33" fill="#f8cfa6" stroke="#2d3a5c" stroke-width="3"/><path d="M21 44q3-27 29-25q25-2 29 23q-14-13-30-11q-16 1-28 13z" fill="#2d3a5c"/>
    <g fill="rgba(255,255,255,.45)" stroke="#2d3a5c" stroke-width="2.5"><rect x="27" y="43" width="20" height="14" rx="4"/><rect x="53" y="43" width="20" height="14" rx="4"/></g><path d="M47 49h6" stroke="#2d3a5c" stroke-width="2.5"/>
    ${eyes}${brows}${mouth}${extra}</svg>`;
}
const catSVG = `<svg viewBox="0 0 100 104" aria-hidden="true"><path d="M24 36l4-22l18 12zM76 36l-4-22l-18 12z" fill="#fff" stroke="#2d3a5c" stroke-width="3" stroke-linejoin="round"/><ellipse cx="50" cy="60" rx="32" ry="30" fill="#fff" stroke="#2d3a5c" stroke-width="3"/>
  <circle cx="38" cy="56" r="3.5" fill="#2d3a5c"/><circle cx="62" cy="56" r="3.5" fill="#2d3a5c"/><path d="M46 66q4 4 8 0" stroke="#2d3a5c" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="66" r="5" fill="#f29cb0" opacity=".7"/><circle cx="70" cy="66" r="5" fill="#f29cb0" opacity=".7"/></svg>`;

// ---------- 揍老板（打地鼠） ----------
const BOSS_SAY = ['这个很简单', '今晚加个班', '周日来一下', '再改一版', '年轻人要多吃苦', '我就说两句', '在吗？', '下班前给我', '格局打开'];
const whack = { on: false, score: 0, time: 30, spawn: null, clock: null };
const holes = $('holes');
for (let i = 0; i < 9; i++) holes.insertAdjacentHTML('beforeend', '<div class="hole"><button type="button" class="mole" tabindex="-1" aria-label="冒出来的头"></button><span class="say"></span></div>');
const moles = [...holes.querySelectorAll('.mole')];
function moleDown(m) { m.classList.remove('up'); m.parentNode.classList.remove('talk'); clearTimeout(m._t); }
function moleUp() {
  const free = moles.filter(m => !m.classList.contains('up'));
  if (!free.length) return;
  const m = pick(free), cat = Math.random() < .14;
  m.dataset.kind = cat ? 'cat' : 'boss'; m.dataset.hit = '';
  m.innerHTML = cat ? catSVG : bossSVG(0);
  m.parentNode.querySelector('.say').textContent = cat ? '我是同事喵' : pick(BOSS_SAY);
  m.classList.add('up'); m.parentNode.classList.add('talk');
  m._t = setTimeout(() => moleDown(m), 700 + whack.time * 12);
}
function whackEnd() {
  whack.on = false; clearInterval(whack.spawn); clearInterval(whack.clock); moles.forEach(moleDown);
  const s = whack.score, best = Math.max(s, +(localStorage.getItem('rg-whack') || 0));
  try { localStorage.setItem('rg-whack', best); } catch (e) {}
  $('whack-msg').textContent = (s >= 30 ? '打工战神！老板明天请假了。' : s >= 18 ? '下手很稳，气消了一大半吧？' : s >= 8 ? '热身完毕，再来一局更准。' : '手下留情了？再来一局！') + `（最高 ${best} 下）`;
  $('whack-go').textContent = '再揍一局'; $('whack-go').disabled = false;
  blip([784, 988, 1319], 'sine', .16, .6);
}
$('whack-go').onclick = () => {
  if (whack.on) return;
  whack.on = true; whack.score = 0; whack.time = 30;
  $('whack-score').textContent = 0; $('whack-time').textContent = 30; $('whack-msg').textContent = '老板冒头就揍，别打到同事小猫！'; $('whack-go').disabled = true;
  moleUp();
  whack.spawn = setInterval(moleUp, 620);
  whack.clock = setInterval(() => { whack.time--; $('whack-time').textContent = whack.time; if (whack.time <= 0) whackEnd(); }, 1000);
};
holes.addEventListener('pointerdown', e => {
  const m = e.target.closest('.mole');
  if (!m || !whack.on || !m.classList.contains('up') || m.dataset.hit) return;
  m.dataset.hit = '1';
  const say = m.parentNode.querySelector('.say');
  if (m.dataset.kind === 'cat') { whack.score = Math.max(0, whack.score - 2); say.textContent = '打错啦 -2'; blip([300, 220], 'sawtooth', .1, .25); }
  else { whack.score++; m.innerHTML = bossSVG(3); say.textContent = pick(['哎哟！', '别打了！', '给你加薪！', '放你假！']); bonk(); }
  $('whack-score').textContent = whack.score;
  clearTimeout(m._t); m._t = setTimeout(() => moleDown(m), 320);
});

// ---------- 老板沙包（十秒连打） ----------
const bag = { on: false, hits: 0, end: 0, clock: null, side: 1 };
const bagEl = $('bag'), bagFace = $('bag-face');
const SHOUT = ['砰！', '还我周日！', '加班费！', '不改了！', '我要下班！', '啪！', '涨工资！', '别画饼！'];
function bagDraw() { bagFace.innerHTML = bossSVG(bag.hits >= 45 ? 3 : bag.hits >= 22 ? 2 : bag.hits >= 8 ? 1 : 0); }
function bagEnd() {
  bag.on = false; clearInterval(bag.clock);
  const n = bag.hits, best = Math.max(n, +(localStorage.getItem('rg-bag') || 0));
  try { localStorage.setItem('rg-bag', best); } catch (e) {}
  $('bag-time').textContent = '0.0';
  $('bag-msg').textContent = (n >= 70 ? '十秒 ' + n + ' 拳！你的手是缝纫机吗？' : n >= 45 ? n + ' 拳，老板已经晕了，舒服。' : n >= 20 ? n + ' 拳，再快一点他就晕了。' : n + ' 拳，今天手下留情了。') + `（最高 ${best} 拳）`;
  $('bag-go').textContent = '再打十秒'; $('bag-go').disabled = false;
  blip([784, 988, 1319], 'sine', .16, .6);
}
$('bag-go').onclick = () => {
  if (bag.on) return;
  bag.on = true; bag.hits = 0; bag.end = Date.now() + 10000; bagDraw();
  $('bag-hits').textContent = 0; $('bag-msg').textContent = '用力点沙包！越快越好！'; $('bag-go').disabled = true;
  bag.clock = setInterval(() => { const left = Math.max(0, bag.end - Date.now()); $('bag-time').textContent = (left / 1000).toFixed(1); if (left <= 0) bagEnd(); }, 80);
};
bagEl.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (!bag.on) { if (!$('bag-go').disabled) $('bag-go').click(); else return; }
  bag.hits++; bag.side = -bag.side;
  $('bag-hits').textContent = bag.hits; bagDraw(); bonk(bag.hits % 5 === 0);
  bagEl.style.setProperty('--swing', (bag.side * (10 + Math.random() * 8)).toFixed(0) + 'deg');
  bagEl.classList.remove('hit'); void bagEl.offsetWidth; bagEl.classList.add('hit');
  const r = bagEl.getBoundingClientRect(), f = document.createElement('span');
  f.className = 'shout'; f.textContent = bag.hits % 4 === 0 ? pick(SHOUT) : '+1';
  f.style.left = (e.clientX - r.left) + 'px'; f.style.top = (e.clientY - r.top) + 'px';
  bagEl.appendChild(f); setTimeout(() => f.remove(), 700);
});
bagDraw();
