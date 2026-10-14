// 后续只需要替换这里的姓名和祝福内容，页面其他部分无需修改。
const wishes = [
	{ from: "快乐搭子", message: "生日快乐！愿你新的一岁，烦恼自动退散，好运持续加载，每天都有值得大笑的小事。" },
	{ from: "饭搭子", message: "祝你生日快乐！愿你吃喜欢的东西不排队，点的外卖永远提前到，体重秤也学会适时沉默。" },
	{ from: "办公室邻居", message: "愿新的一岁工作顺利、灵感不断，下班准时，周末加倍漫长。最重要的是，每天都开心！" },
	{ from: "老朋友", message: "认识你真好。愿往后的日子里，我们还能一起制造很多笑到停不下来的回忆。生日快乐！" },
	{ from: "神秘朋友 A", message: "愿你眼里有光，心里有爱，银行卡里有余额，手机电量永远保持在 80% 以上。" },
	{ from: "神秘朋友 B", message: "今天你最大！蛋糕第一块归你，愿望可以多许几个，快乐也必须超级加倍。" },
	{ from: "靠谱队友", message: "愿你的认真都有收获，努力都有回应。累的时候就歇一歇，我们一直都在。" },
	{ from: "气氛组代表", message: "祝 Morgan 生日快乐！愿你永远年轻，永远热烈，永远能在平凡日子里找到彩蛋。" },
	{ from: "多年好友", message: "时间会往前走，但真诚的友谊不会过期。愿每一岁的你，都比上一岁更自在。" },
	{ from: "所有惦记你的人", message: "最后一封，装着大家共同的愿望：愿你平安、健康、自由、快乐。Morgan，生日快乐！" }
];

const danmakuMessages = [
	"Morgan 生日快乐！",
	"今天可以多吃一块蛋糕",
	"好运正在派送中",
	"新的一岁继续闪闪发光",
	"笑口常开，烦恼拜拜",
	"愿望统统实现",
	"今天你最大",
	"快乐不止今天"
];

const intro = document.querySelector("#intro");
const celebration = document.querySelector("#celebration");
const startButton = document.querySelector("#startButton");
const musicButton = document.querySelector("#musicButton");
const envelope = document.querySelector("#envelope");
const envelopeSender = document.querySelector("#envelopeSender");
const mailCount = document.querySelector("#mailCount");
const progressBar = document.querySelector("#progressBar");
const dialog = document.querySelector("#letterDialog");
const closeButton = document.querySelector("#closeButton");
const nextButton = document.querySelector("#nextButton");
const letterNumber = document.querySelector("#letterNumber");
const letterMessage = document.querySelector("#letterMessage");
const letterFrom = document.querySelector("#letterFrom");
const finale = document.querySelector("#finale");
const replayButton = document.querySelector("#replayButton");
const danmakuLayer = document.querySelector("#danmakuLayer");

let currentIndex = 0;
let audioContext;
let musicTimer;
let danmakuTimer;
let musicPlaying = false;
let isOpening = false;

function updateEnvelope() {
	const wish = wishes[currentIndex];
	mailCount.textContent = `第 ${currentIndex + 1} 封 / 共 ${wishes.length} 封`;
	envelopeSender.textContent = `来自：${wish.from}`;
	progressBar.style.width = `${(currentIndex / wishes.length) * 100}%`;
}

function showLetter() {
	const wish = wishes[currentIndex];
	letterNumber.textContent = `LETTER ${String(currentIndex + 1).padStart(2, "0")}`;
	letterMessage.textContent = wish.message;
	letterFrom.textContent = `—— ${wish.from}`;
	nextButton.firstChild.textContent = currentIndex === wishes.length - 1
		? "收好最后一封 "
		: "收好这封，继续拆下一封 ";
	dialog.showModal();
	isOpening = false;
}

function openEnvelope() {
	if (isOpening) return;
	isOpening = true;
	envelope.classList.add("opening");
	window.setTimeout(showLetter, 520);
}

function closeLetter() {
	dialog.close();
	envelope.classList.remove("opening");
}

function advanceLetter() {
	closeLetter();
	if (currentIndex === wishes.length - 1) {
		envelope.disabled = true;
		progressBar.style.width = "100%";
		window.setTimeout(() => {
			finale.hidden = false;
			burstDanmaku();
		}, 260);
		return;
	}
	currentIndex += 1;
	updateEnvelope();
}

function spawnDanmaku(text, forceTop) {
	const item = document.createElement("span");
	item.className = "danmaku";
	item.textContent = text;
	item.style.top = `${forceTop ?? (12 + Math.random() * 76)}%`;
	item.style.animationDuration = `${7 + Math.random() * 4}s`;
	item.style.color = ["#247a78", "#d74f3f", "#8a6811"][Math.floor(Math.random() * 3)];
	danmakuLayer.appendChild(item);
	item.addEventListener("animationend", () => item.remove());
}

function startDanmaku() {
	spawnDanmaku(danmakuMessages[0], 18);
	danmakuTimer = window.setInterval(() => {
		const message = danmakuMessages[Math.floor(Math.random() * danmakuMessages.length)];
		spawnDanmaku(message);
	}, 1800);
}

function burstDanmaku() {
	danmakuMessages.slice(0, 5).forEach((message, index) => {
		window.setTimeout(() => spawnDanmaku(message, 14 + index * 15), index * 180);
	});
}

function playNote(frequency, startTime, duration) {
	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();
	oscillator.type = "sine";
	oscillator.frequency.value = frequency;
	gain.gain.setValueAtTime(0.0001, startTime);
	gain.gain.exponentialRampToValueAtTime(0.07, startTime + 0.03);
	gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
	oscillator.connect(gain).connect(audioContext.destination);
	oscillator.start(startTime);
	oscillator.stop(startTime + duration + 0.05);
}

function playMusicPhrase() {
	if (!musicPlaying || !audioContext) return;
	const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 392];
	const start = audioContext.currentTime + 0.05;
	notes.forEach((note, index) => playNote(note, start + index * 0.32, 0.28));
}

function startMusic() {
	audioContext ??= new AudioContext();
	audioContext.resume();
	musicPlaying = true;
	musicButton.classList.remove("muted");
	musicButton.setAttribute("aria-label", "关闭背景音乐");
	musicButton.title = "关闭背景音乐";
	playMusicPhrase();
	musicTimer = window.setInterval(playMusicPhrase, 3000);
}

function stopMusic() {
	musicPlaying = false;
	window.clearInterval(musicTimer);
	musicButton.classList.add("muted");
	musicButton.setAttribute("aria-label", "播放背景音乐");
	musicButton.title = "播放背景音乐";
}

function toggleMusic() {
	if (musicPlaying) stopMusic();
	else startMusic();
}

function startExperience() {
	intro.hidden = true;
	celebration.hidden = false;
	updateEnvelope();
	startMusic();
	startDanmaku();
}

function replay() {
	currentIndex = 0;
	finale.hidden = true;
	envelope.disabled = false;
	updateEnvelope();
}

startButton.addEventListener("click", startExperience);
musicButton.addEventListener("click", toggleMusic);
envelope.addEventListener("click", openEnvelope);
closeButton.addEventListener("click", closeLetter);
nextButton.addEventListener("click", advanceLetter);
replayButton.addEventListener("click", replay);

dialog.addEventListener("click", (event) => {
	if (event.target === dialog) closeLetter();
});

window.addEventListener("beforeunload", () => {
	window.clearInterval(musicTimer);
	window.clearInterval(danmakuTimer);
});
