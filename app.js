// 后续只需要替换这里的署名和祝福内容，页面其他部分无需修改。
const birthdayCard = {
	from: "所有惦记你的我们",
	message: "Morgan，生日快乐！\n\n这一张小小的电子卡，装着大家共同的心意：愿你新的一岁平安、健康、自由、快乐，认真生活，也尽情大笑。\n\n愿工作顺利，好运持续加载；想吃的都不排队，想做的都有回应，偶尔偷个懒也不会被发现。愿每一个普通日子，都藏着让你嘴角上扬的小惊喜。"
};

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
const birthdayMusic = document.querySelector("#birthdayMusic");

let danmakuTimer;
let musicPlaying = false;
let isOpening = false;

function updateEnvelope() {
	mailCount.textContent = "一封来自大家的生日贺卡";
	envelopeSender.textContent = `来自：${birthdayCard.from}`;
	progressBar.style.width = "0%";
}

function showLetter() {
	letterNumber.textContent = "BIRTHDAY CARD";
	letterMessage.textContent = birthdayCard.message;
	letterFrom.textContent = `—— ${birthdayCard.from}`;
	nextButton.firstChild.textContent = "收下大家的祝福 ";
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
	envelope.disabled = true;
	progressBar.style.width = "100%";
	window.setTimeout(() => {
		finale.hidden = false;
		burstDanmaku();
	}, 260);
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

function startMusic() {
	birthdayMusic.play().then(() => {
		musicPlaying = true;
		musicButton.classList.remove("muted");
		musicButton.setAttribute("aria-label", "关闭背景音乐");
		musicButton.title = "关闭背景音乐";
	}).catch(() => {
		musicPlaying = false;
		musicButton.classList.add("muted");
		musicButton.setAttribute("aria-label", "播放背景音乐");
		musicButton.title = "点击播放背景音乐";
	});
}

function stopMusic() {
	musicPlaying = false;
	birthdayMusic.pause();
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
	window.clearInterval(danmakuTimer);
});
