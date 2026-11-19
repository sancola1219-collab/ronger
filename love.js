// ===== 开心一下：亲亲爱人（抓时机）、和风翻翻乐（记忆配对） =====
// 用到 main.js 的 $、pick、blip。爱人是画出来的卡通角色。

// mood：0 平常 1 被亲到 2 没亲到
function loverSVG(mood = 0) {
  const eyes = mood === 1 ? '<path d="M30 46q6-7 12 0M58 46q6-7 12 0" stroke="#2d3a5c" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    : mood === 2 ? '<circle cx="36" cy="46" r="4.5" fill="#fff" stroke="#2d3a5c" stroke-width="2.5"/><circle cx="64" cy="46" r="4.5" fill="#fff" stroke="#2d3a5c" stroke-width="2.5"/><circle cx="37" cy="46" r="1.8" fill="#2d3a5c"/><circle cx="63" cy="46" r="1.8" fill="#2d3a5c"/>'
    : '<circle cx="36" cy="46" r="3.6" fill="#2d3a5c"/><circle cx="64" cy="46" r="3.6" fill="#2d3a5c"/><circle cx="37.2" cy="44.8" r="1.2" fill="#fff"/><circle cx="65.2" cy="44.8" r="1.2" fill="#fff"/>';
  const mouth = mood === 1 ? '<path d="M41 58q9 10 18 0z" fill="#e2543d" stroke="#2d3a5c" stroke-width="2.5" stroke-linejoin="round"/>' : mood === 2 ? '<ellipse cx="50" cy="61" rx="4" ry="5" fill="#2d3a5c"/>' : '<path d="M43 59q7 6 14 0" stroke="#2d3a5c" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  const blush = mood === 1 ? .95 : .55;
  const extra = mood === 1 ? '<path d="M78 14c-5-7-15 0-8 8l8 8l8-8c7-8-3-15-8-8z" fill="#e2543d"/><path d="M17 20c-3-4-9 0-5 5l5 5l5-5c4-5-2-9-5-5z" fill="#f29cb0"/>' : mood === 2 ? '<text x="76" y="24" font-size="20" fill="#7d86a0" font-family="sans-serif">?</text>' : '';
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 44q-2-32 28-32t28 32q-10-16-28-14q-18-2-28 14z" fill="#2d3a5c"/><ellipse cx="50" cy="52" rx="31" ry="32" fill="#ffe6d6" stroke="#2d3a5c" stroke-width="3"/>
    <path d="M21 42q8-22 30-22q20 0 28 22q-12-12-27-10q-10 10-31 10z" fill="#2d3a5c"/><circle cx="26" cy="58" r="7" fill="#f29cb0" opacity="${blush}"/><circle cx="74" cy="58" r="7" fill="#f29cb0" opacity="${blush}"/>${eyes}${mouth}${extra}</svg>`;
}

// ---------- 亲亲爱人：嘴唇来回跑，跑到心形区按下去 ----------
const KISS_ROUNDS = 10;
const kiss = { on: false, n: 0, score: 0, pos: 50, phase: 0, speed: 2.2, zone: 16, last: 0, raf: 0, wait: false };
const lover = $('lover'), lips = $('kiss-lips'), zoneEl = $('kiss-zone-mark'), track = $('kiss-track');
const kissFace = m => { lover.innerHTML = loverSVG(m); };
function kissSetup() { kiss.speed = 2.2 + kiss.n * .28; kiss.zone = Math.max(7, 16 - kiss.n * .9); zoneEl.style.width = kiss.zone * 2 + '%'; }
function kissLoop(t) {
  if (!kiss.on) return;
  const dt = Math.min(.05, (t - kiss.last) / 1000 || 0); kiss.last = t;
  if (!kiss.wait) { kiss.phase += kiss.speed * dt; kiss.pos = 50 + 46 * Math.sin(kiss.phase); lips.style.left = kiss.pos + '%'; }
  kiss.raf = requestAnimationFrame(kissLoop);
}
function kissEnd() {
  kiss.on = false; cancelAnimationFrame(kiss.raf);
  const s = kiss.score; let best = 0; try { best = Math.max(s, +(localStorage.getItem('rg-kiss') || 0)); localStorage.setItem('rg-kiss', best); } catch (e) { best = s; }
  kissFace(s >= 8 ? 1 : 0);
  $('kiss-msg').textContent = (s >= 18 ? '甜度爆表！爱人说今晚的碗他洗。' : s >= 12 ? '亲得很准，爱人已经脸红了。' : s >= 6 ? '还不错，再练练就百发百中。' : '亲歪了好多下，爱人说没关系再来。') + `（最高 ${best} 分）`;
  $('kiss-go').textContent = '再亲一轮'; blip([784, 988, 1319], 'sine', .16, .6);
}
function kissNow() {
  if (!kiss.on || kiss.wait) return;
  const d = Math.abs(kiss.pos - 50), perfect = d <= 3.5, good = d <= kiss.zone;
  kiss.n++; kiss.score += perfect ? 2 : good ? 1 : 0; kiss.wait = true;
  $('kiss-n').textContent = kiss.n; $('kiss-score').textContent = kiss.score;
  kissFace(good ? 1 : 2);
  $('kiss-msg').textContent = perfect ? pick(['正中脸颊！+2', '啵！完美！+2', '亲到心坎里了！+2']) : good ? pick(['亲到啦！+1', '啵～ +1', '脸红了 +1']) : pick(['亲歪了，亲到空气。', '太早啦，再等等。', '差一点点！']);
  if (good) { lover.classList.remove('smooch'); void lover.offsetWidth; lover.classList.add('smooch'); blip(perfect ? [880, 1175, 1568] : [784, 1047], 'sine', .15, .35); if (navigator.vibrate) navigator.vibrate(15); }
  else blip([300, 240], 'triangle', .1, .25);
  setTimeout(() => { kiss.wait = false; if (kiss.n >= KISS_ROUNDS) kissEnd(); else { kissFace(0); kissSetup(); } }, 650);
}
$('kiss-go').onclick = () => {
  if (kiss.on) return kissNow();
  Object.assign(kiss, { on: true, n: 0, score: 0, phase: Math.random() * 6, wait: false, last: performance.now() });
  $('kiss-n').textContent = 0; $('kiss-score').textContent = 0; $('kiss-msg').textContent = '嘴唇跑到粉红色的心里，就按「亲！」'; $('kiss-go').textContent = '亲！';
  kissFace(0); kissSetup(); kiss.raf = requestAnimationFrame(kissLoop);
};
track.addEventListener('pointerdown', e => { e.preventDefault(); if (kiss.on) kissNow(); });
kissFace(0);

// ---------- 和风翻翻乐：十六张牌，找出八对 ----------
const ICONS = [['樱', '#f29cb0'], ['茶', '#9bb86e'], ['猫', '#f3b33d'], ['鱼', '#6fa8dc'], ['灯', '#e2543d'], ['扇', '#b48ad6'], ['月', '#2d3a5c'], ['福', '#d9773c']];
const memo = { open: [], done: 0, flips: 0, lock: false, t0: 0 };
const grid = $('memo-grid');
function memoNew() {
  const deck = [...ICONS, ...ICONS].map((c, i) => ({ c, r: Math.random() })).sort((a, b) => a.r - b.r);
  grid.innerHTML = deck.map(({ c }) => `<button type="button" class="mcard" data-k="${c[0]}" aria-label="一张盖着的牌"><span class="mface mback"></span><span class="mface mfront" style="--c:${c[1]}">${c[0]}</span></button>`).join('');
  Object.assign(memo, { open: [], done: 0, flips: 0, lock: false, t0: 0 });
  $('memo-flips').textContent = 0; $('memo-done').textContent = 0;
  let best = 0; try { best = +(localStorage.getItem('rg-memo') || 0); } catch (e) {}
  $('memo-msg').textContent = best ? `翻开两张一样的就配对成功。（最少 ${best} 次）` : '翻开两张一样的就配对成功。';
}
grid.onclick = e => {
  const c = e.target.closest('.mcard'); if (!c || memo.lock || c.classList.contains('open')) return;
  if (!memo.t0) memo.t0 = Date.now();
  c.classList.add('open'); memo.open.push(c); blip([620], 'sine', .1, .18);
  if (memo.open.length < 2) return;
  $('memo-flips').textContent = ++memo.flips;
  const [a, b] = memo.open; memo.open = [];
  if (a.dataset.k === b.dataset.k) {
    a.classList.add('ok'); b.classList.add('ok'); $('memo-done').textContent = ++memo.done; blip([784, 1047], 'sine', .15, .35);
    if (memo.done === ICONS.length) {
      const sec = Math.round((Date.now() - memo.t0) / 1000); let best = 0;
      try { best = +(localStorage.getItem('rg-memo') || 0); if (!best || memo.flips < best) { best = memo.flips; localStorage.setItem('rg-memo', best); } } catch (e) { best = memo.flips; }
      $('memo-msg').textContent = `全部配对成功！翻了 ${memo.flips} 次，用了 ${sec} 秒。` + (memo.flips <= 12 ? '记性也太好了吧！' : memo.flips <= 18 ? '很厉害！' : '脑袋放空完毕，舒服。') + `（最少 ${best} 次）`;
      blip([784, 988, 1319], 'sine', .16, .6);
    } else $('memo-msg').textContent = pick(['配对成功！', '找到一对～', '好眼力！']);
  } else {
    memo.lock = true; $('memo-msg').textContent = '不一样，记住位置再翻。';
    setTimeout(() => { a.classList.remove('open'); b.classList.remove('open'); memo.lock = false; }, 800);
  }
};
$('memo-reset').onclick = memoNew;
memoNew();
