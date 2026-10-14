const birthdayCard = {
	from: "All of us who are lucky to know you",
	message: "Happy Birthday, Morgan!\n\nThis little card carries one big wish from all of us: may your new year be filled with good health, freedom, joy, and plenty of laughter.\n\nMay work go smoothly, good luck keep finding you, your favorite food never come with a queue, and every ordinary day hold a small surprise that makes you smile."
};

const danmakuMessages = [
	"Happy Birthday, Morgan!",
	"One more slice of cake!",
	"Good luck is on its way",
	"Keep shining this year",
	"More smiles, fewer worries",
	"May every wish come true",
	"Today is all about you",
	"Joy, today and always"
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
	mailCount.textContent = "A birthday card from all of us";
	envelopeSender.textContent = `FROM: ${birthdayCard.from}`;
	progressBar.style.width = "0%";
}

function showLetter() {
	letterNumber.textContent = "BIRTHDAY CARD";
	letterMessage.textContent = birthdayCard.message;
	letterFrom.textContent = `—— ${birthdayCard.from}`;
	nextButton.firstChild.textContent = "Take these wishes with you ";
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
		musicButton.setAttribute("aria-label", "Pause background music");
		musicButton.title = "Pause background music";
	}).catch(() => {
		musicPlaying = false;
		musicButton.classList.add("muted");
		musicButton.setAttribute("aria-label", "Play background music");
		musicButton.title = "Play background music";
	});
}

function stopMusic() {
	musicPlaying = false;
	birthdayMusic.pause();
	musicButton.classList.add("muted");
	musicButton.setAttribute("aria-label", "Play background music");
	musicButton.title = "Play background music";
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
