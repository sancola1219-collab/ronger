const $ = id => document.getElementById(id);
const pick = a => a[Math.floor(Math.random() * a.length)];

// 樱花飘落
const petals = $('petals');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('i'), s = .6 + Math.random() * .9;
    p.style.cssText = `left:${Math.random() * 100}%;width:${14 * s}px;height:${10 * s}px;--dx:${(Math.random() * 160 - 60).toFixed(0)}px;animation-duration:${(9 + Math.random() * 9).toFixed(1)}s;animation-delay:${(-Math.random() * 18).toFixed(1)}s;opacity:${(.45 + Math.random() * .4).toFixed(2)}`;
    petals.appendChild(p);
  }
}

// 进场
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 小音效（不用档案，直接合成）
let ac;
const audio = () => ac || (ac = new (window.AudioContext || window.webkitAudioContext)());
function blip(freqs, type = 'sine', vol = .18, len = .5) {
  try {
    const a = audio();
    freqs.forEach((f, i) => {
      const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + i * .11;
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .015); g.gain.exponentialRampToValueAtTime(.001, t + len);
      o.connect(g).connect(a.destination); o.start(t); o.stop(t + len + .05);
    });
  } catch (e) {}
}
function popSound() {
  try {
    const a = audio(), n = Math.floor(a.sampleRate * .07), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    const s = a.createBufferSource(), g = a.createGain(), f = a.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 900 + Math.random() * 900; g.gain.value = .5;
    s.buffer = buf; s.connect(f).connect(g).connect(a.destination); s.start();
  } catch (e) {}
}

// 话题
const TOPICS = [
  '今天上班最想翻白眼的一件事是什么？', '如果明天不用上班，你第一件事想干嘛？', '最近吃到最好吃的东西是什么？',
  '你手机里最舍不得删的一张照片是什么？', '说一个你最近循环播放的歌。', '周末想宅着还是出门？',
  '有没有一部剧，你想失忆了再看一遍？', '你的下饭视频是什么类型？', '今天有没有一件小小的开心事？',
  '如果可以带薪发呆一小时，你会想什么？', '猫派还是狗派？为什么？', '小时候最想当什么？现在呢？',
  '最近有没有被什么东西可爱到？', '你点外卖最常点的是哪一家？', '如果有一天假，想去哪里走走？',
  '最近让你笑出声的一个梗是什么？', '睡前最后一件事通常是干嘛？', '你觉得自己上班的状态像什么动物？',
];
let lastTopic = '';
$('topic-btn').onclick = () => {
  let t; do { t = pick(TOPICS); } while (t === lastTopic);
  lastTopic = t;
  const el = $('topic-text'); el.textContent = t; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  blip([660, 880], 'sine', .12, .3);
};

// 御神签（只有吉，没有凶）
const RANK = ['大吉', '大吉', '中吉', '中吉', '小吉', '吉', '吉', '末吉也是吉'];
const YI = ['准时下班', '喝一杯奶茶', '摸鱼五分钟', '夸自己一句', '早点睡觉', '吃顿好的', '发呆看云', '找搭子聊天', '把闹钟往后调十分钟', '买一个小蛋糕'];
const JI = ['回老板消息太快', '跟自己较劲', '空腹开会', '熬夜刷手机', '想太多', '替别人背锅', '周末看工作群', '饿着肚子生气'];
const LUCK = ['一杯热的', '软软的抱枕', '粉色的东西', '一句“辛苦啦”', '刚出炉的面包', '下班路上的晚霞', '猫猫表情包', '甜的东西'];
$('mikuji-btn').onclick = () => {
  const box = $('mikuji-box'), slip = $('mikuji-slip');
  box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
  slip.hidden = true;
  blip([520, 440, 520, 440], 'triangle', .08, .12);
  setTimeout(() => {
    $('mikuji-rank').textContent = pick(RANK);
    $('mikuji-yi').textContent = '宜：' + pick(YI) + '、' + pick(YI.slice().reverse());
    $('mikuji-ji').textContent = '忌：' + pick(JI);
    $('mikuji-luck').textContent = '幸运物：' + pick(LUCK);
    slip.hidden = false;
    $('mikuji-btn').textContent = '再抽一支';
    blip([784, 988, 1319], 'sine', .16, .7);
  }, 750);
};

// 下班倒计时
const offSel = $('off-time');
try { const s = localStorage.getItem('rg-off'); if (s) offSel.value = s; } catch (e) {}
offSel.onchange = () => { try { localStorage.setItem('rg-off', offSel.value); } catch (e) {} tick(); };
const pad = n => String(n).padStart(2, '0');
function tick() {
  const now = new Date(), day = now.getDay(), [h, m] = offSel.value.split(':').map(Number);
  const start = new Date(now); start.setHours(9, 0, 0, 0);
  const off = new Date(now); off.setHours(h, m, 0, 0);
  const clock = $('off-clock'), msg = $('off-msg'), bar = $('off-bar');
  if (day === 0) { clock.textContent = '休息中'; bar.style.width = '100%'; msg.textContent = '今天是星期天！一周就这一天，躺着就是正事。'; }
  else if (now >= off) { clock.textContent = '下班啦'; bar.style.width = '100%'; msg.textContent = '还愣着干嘛，快跑！今天辛苦了。'; }
  else {
    const left = Math.floor((off - now) / 1000);
    clock.textContent = `${pad(Math.floor(left / 3600))}:${pad(Math.floor(left / 60) % 60)}:${pad(left % 60)}`;
    const p = Math.max(0, Math.min(1, (now - start) / (off - start)));
    bar.style.width = (p * 100).toFixed(1) + '%';
    msg.textContent = now < start ? '还没到上班时间，再赖一下床。' : p < .3 ? '刚开始，深呼吸，先喝口水。' : p < .6 ? '已经过了一小半，你可以的。' : p < .85 ? '过大半了！想想晚上吃什么。' : '快了快了，开始收拾桌面吧。';
  }
  const toSun = day === 0 ? 0 : 7 - day;   // 她一周只休星期天
  $('off-weekend').textContent = toSun === 0 ? '今天就是休息日 ✿' : toSun === 1 ? '明天就休息啦，撑住 ✿' : `离星期天还有 ${toSun} 天`;
}
tick(); setInterval(tick, 1000);

// 泡泡纸
const wrap = $('bubbles'), TOTAL = 30;
let popped = 0;
function newSheet() {
  popped = 0; wrap.innerHTML = '';
  for (let i = 0; i < TOTAL; i++) { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', '泡泡'); wrap.appendChild(b); }
  $('pop-msg').textContent = '一颗一颗捏，烦恼一个一个没。';
}
wrap.addEventListener('pointerdown', e => {
  const b = e.target.closest('button');
  if (!b || b.classList.contains('popped')) return;
  b.classList.add('popped'); b.disabled = true; popped++; popSound();
  if (navigator.vibrate) navigator.vibrate(12);
  $('pop-msg').textContent = popped === TOTAL ? '全捏完啦！压力清零，给你一朵小红花 ✿' : `已经捏了 ${popped} 颗，压力 -${Math.round(popped / TOTAL * 100)}%`;
  if (popped === TOTAL) blip([784, 988, 1175, 1568], 'sine', .16, .6);
});
$('pop-reset').onclick = newSheet;
newSheet();

// 联络方式（index.html 底部 CONTACT 有填才显示）
const labels = { wechat: '微信', qq: 'QQ', douyin: '抖音', xhs: '小红书' };
const ul = $('contact');
Object.entries(CONTACT).forEach(([k, v]) => { if (!v) return; const li = document.createElement('li'); li.innerHTML = `<b>${labels[k]}</b>`; li.append(v); ul.appendChild(li); });
if (ul.children.length) $('contact-empty').style.display = 'none';
$('year').textContent = new Date().getFullYear();

// 背景音乐：一进站先试着播；被浏览器挡下来的话，第一次点或碰画面就开始
const bgm = $('bgm'), mbtn = $('music');
let fade, musicTouched = false;
const ramp = (to, done) => {
  clearInterval(fade);
  let ticks = 0;
  fade = setInterval(() => {
    const v = bgm.volume + (to > bgm.volume ? .04 : -.06);
    if (++ticks > 25 || (to > bgm.volume && v >= to) || (to <= bgm.volume && v <= to)) { bgm.volume = to; clearInterval(fade); done && done(); }
    else bgm.volume = Math.max(0, Math.min(1, v));
  }, 80);
};
const setMusic = on => {
  mbtn.classList.toggle('on', on); mbtn.setAttribute('aria-pressed', on);
  if (on) { bgm.volume = 0; bgm.play().then(() => ramp(.5)).catch(() => setMusic(false)); }
  else ramp(0, () => bgm.pause());
};
mbtn.onclick = e => { e.stopPropagation(); musicTouched = true; setMusic(bgm.paused || !mbtn.classList.contains('on')); };
mbtn.addEventListener('pointerdown', () => { musicTouched = true; }, true);
const autoStart = () => {
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => removeEventListener(ev, autoStart, true));
  if (!musicTouched && bgm.paused) setMusic(true);
};
['pointerdown', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, autoStart, true));
bgm.volume = 0;
bgm.play().then(() => { if (!musicTouched) { mbtn.classList.add('on'); mbtn.setAttribute('aria-pressed', true); ramp(.5); } }).catch(() => {});
