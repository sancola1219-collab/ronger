// ===== 互动小游戏：猜拳亲亲（跟爱人猜拳）、陪你聊聊（爱人问，你回，他再回你） =====
// 用到 main.js 的 $、pick、blip 和 love.js 的 loverSVG。爱人是画出来的卡通角色。

// ---------- 猜拳亲亲：先拿到 5 颗心的赢 ----------
const HAND = { rock: ['✊', '石头'], scissors: ['✌️', '剪刀'], paper: ['🖐️', '布'] };
const BEATS = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
const rps = { me: 0, him: 0, busy: false, over: false };
const rpsFace = $('rps-face'), rpsHim = $('rps-him'), rpsMe = $('rps-me');
const hearts = n => '♥'.repeat(n) + '♡'.repeat(5 - n);
function rpsDraw() { $('rps-me-score').textContent = hearts(rps.me); $('rps-him-score').textContent = hearts(rps.him); }
function rpsReset() {
  Object.assign(rps, { me: 0, him: 0, busy: false, over: false }); rpsDraw();
  rpsFace.innerHTML = loverSVG(0); rpsHim.textContent = '？'; rpsMe.textContent = '？';
  $('rps-say').textContent = '来猜拳！赢的人可以亲对方一下。'; $('rps-msg').textContent = '选一个出拳，先拿到 5 颗心的赢。'; $('rps-reset').hidden = true;
  [...$('rps-btns').children].forEach(b => b.disabled = false);
}
$('rps-btns').onclick = e => {
  const b = e.target.closest('button'); if (!b || rps.busy || rps.over) return;
  const mine = b.dataset.h, his = pick(Object.keys(HAND));
  rps.busy = true; rpsMe.textContent = HAND[mine][0]; rpsHim.textContent = '？'; rpsHim.classList.add('shake'); rpsFace.innerHTML = loverSVG(0);
  $('rps-say').textContent = '石头、剪刀……'; blip([440, 440], 'triangle', .1, .15);
  setTimeout(() => {
    rpsHim.classList.remove('shake'); rpsHim.textContent = HAND[his][0];
    const win = BEATS[mine] === his, draw = mine === his;
    if (draw) { $('rps-say').textContent = pick(['一样耶，我们太有默契了。', '心有灵犀！再来。', '又一样，你是不是偷看我？']); $('rps-msg').textContent = `都出${HAND[mine][1]}，平手。`; blip([587], 'sine', .12, .3); }
    else if (win) { rps.me++; rpsFace.innerHTML = loverSVG(1); $('rps-say').textContent = pick(['你赢了，来，脸给你亲。', '输给你我心甘情愿。', '好啦好啦，亲这边。', '你怎么这么厉害！']); $('rps-msg').textContent = `你出${HAND[mine][1]}，他出${HAND[his][1]}。你赢了，亲他一下！`; blip([784, 1047], 'sine', .15, .35); }
    else { rps.him++; rpsFace.innerHTML = loverSVG(1); $('rps-say').textContent = pick(['我赢了！啵～亲你一下。', '嘿嘿，换我亲你。', '赢了赢了，额头借我亲一下。']); $('rps-msg').textContent = `你出${HAND[mine][1]}，他出${HAND[his][1]}。他赢了，被亲了一下。`; blip([659, 523], 'sine', .14, .3); }
    rpsDraw(); rps.busy = false;
    if (rps.me >= 5 || rps.him >= 5) {
      rps.over = true; [...$('rps-btns').children].forEach(x => x.disabled = true); $('rps-reset').hidden = false;
      $('rps-say').textContent = rps.me >= 5 ? '你赢了整局！今晚的碗我洗，奶茶我请。' : '我赢了整局！奖品是：抱你一下，不许躲。';
      $('rps-msg').textContent = (rps.me >= 5 ? '你先拿到 5 颗心！' : '他先拿到 5 颗心！') + '反正谁赢都是亲亲。';
      blip([784, 988, 1319], 'sine', .16, .6);
    }
  }, 700);
};
$('rps-reset').onclick = rpsReset;
rpsReset();

// ---------- 陪你聊聊：他问一句，你选一句回，他再回你 ----------
const TALK = [
  ['今天上班怎么样？', ['累瘫了', '还行吧', '被老板念了'], ['辛苦了，来，肩膀借你靠。今晚什么都别想。', '还行就是很棒了，平平安安下班最重要。', '他念他的，你在我这儿永远满分。']],
  ['晚饭想吃什么？', ['火锅', '随便', '想吃甜的'], ['安排！毛肚我帮你涮，七上八下。', '那我说了算：你最爱的那家，走。', '奶茶加蛋糕，热量算我的。']],
  ['周日终于休息，想怎么过？', ['睡到自然醒', '出去走走', '在家追剧'], ['好，我把闹钟全关了，谁也不许吵你。', '走，我牵着你，走到哪儿算哪儿。', '零食我备好，遥控器归你。']],
  ['最近有什么烦心事吗？', ['工作太多', '有人说我闲话', '没有，就是累'], ['一件一件来，做不完也不是你的错。', '说闲话的人是太闲，你忙着变好，没空理他。', '累了就停一下，我在这儿陪你。']],
  ['要不要抱一下？', ['要！', '抱久一点', '再加一个亲亲'], ['来，抱紧。今天的委屈都挤出去。', '好，抱到你说可以为止。', '啵！亲一下，电量加满。']],
  ['睡前想听什么？', ['夸夸我', '讲个笑话', '说晚安就好'], ['你今天又认真又可爱，全世界我最喜欢你。', '老板说年轻人要多吃苦。我说：那您多吃点。', '晚安蓉儿，明天也有人惦记着你。']],
  ['下雨了，带伞了吗？', ['没带', '带了', '想淋一下'], ['站着别动，我去接你。', '真棒，那我来帮你拿包。', '那我陪你淋，回家一起喝姜茶。']],
  ['想不想要个小礼物？', ['想要花', '想要奶茶', '想要你陪'], ['一束粉色的，跟你一样好看。', '三分糖去冰，我记得的。', '这个最简单，我一直都在。']],
];
const TALK_ROUNDS = 6;
const talk = { list: [], i: 0, busy: false };
const log = $('talk-log'), opts = $('talk-opts');
function bubble(text, me) {
  const d = document.createElement('p'); d.className = 'bub ' + (me ? 'me' : 'him'); d.textContent = text; log.appendChild(d); log.scrollTop = log.scrollHeight;
}
function talkMood() { const v = Math.round(talk.i / TALK_ROUNDS * 100); $('talk-mood').textContent = v; $('talk-bar').style.width = v + '%'; }
function talkAsk() {
  talk.busy = false;
  if (talk.i >= TALK_ROUNDS) {
    bubble('今天聊得好开心。记住，不管上班多苦，都有人站你这边。', false);
    opts.innerHTML = ''; $('talk-msg').textContent = '心情值满格！明天也要开开心心的。'; $('talk-go').hidden = false; $('talk-go').textContent = '再聊一次';
    blip([784, 988, 1319], 'sine', .16, .6); return;
  }
  const [q, as] = talk.list[talk.i];
  bubble(q, false); blip([660], 'sine', .1, .2);
  opts.innerHTML = as.map((a, k) => `<button type="button" data-k="${k}">${a}</button>`).join('');
  $('talk-msg').textContent = `第 ${talk.i + 1} / ${TALK_ROUNDS} 句，选一句回他。`;
}
opts.onclick = e => {
  const b = e.target.closest('button'); if (!b || talk.busy) return;
  talk.busy = true;
  const [, as, rs] = talk.list[talk.i], k = +b.dataset.k;
  bubble(as[k], true); opts.innerHTML = ''; $('talk-msg').textContent = '他正在打字……'; blip([520], 'sine', .1, .15);
  setTimeout(() => { bubble(rs[k], false); talk.i++; talkMood(); blip([784, 1047], 'sine', .13, .3); setTimeout(talkAsk, 900); }, 800);
};
$('talk-go').onclick = () => {
  talk.list = TALK.map(t => [Math.random(), t]).sort((a, b) => a[0] - b[0]).slice(0, TALK_ROUNDS).map(x => x[1]); talk.i = 0;
  log.innerHTML = ''; talkMood(); $('talk-go').hidden = true; talkAsk();
};
