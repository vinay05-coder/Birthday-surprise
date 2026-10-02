/* =========================================================
   BIRTHDAY WEBSITE – SCRIPT.JS
========================================================= */

/* =========================================
   ✏️ SETTINGS – edit these
========================================= */

// Secret PIN (any length – the dots on screen adjust automatically)
const SECRET_PIN = "0305";

// How loud a "blow" must be to blow out the candle with the mic
// (higher number = you have to blow harder, e.g. 70)
const BLOW_THRESHOLD = 55;


/* =========================================
   PAGE CONTROL
========================================= */

const pages = document.querySelectorAll(".page");

function showPage(id) {
    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0, 0);
}


/* =========================================
   FLOATING PARTICLES
========================================= */

const particleContainer = document.getElementById("particles");

function createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.bottom = "-10px";
    particle.style.animationDuration = (4 + Math.random() * 4) + "s";
    particleContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 8000);
}

setInterval(createParticle, 600);


/* =========================================
   PASSWORD
========================================= */

let enteredPin = "";

const pinDisplay = document.getElementById("pinDisplay");
const pinMessage = document.getElementById("pinMessage");

// build one dot per PIN digit
for (let i = 0; i < SECRET_PIN.length; i++) {
    pinDisplay.appendChild(document.createElement("span"));
}

const pinDots = pinDisplay.querySelectorAll("span");

function updatePinDisplay() {
    pinDots.forEach((dot, index) => {
        dot.classList.toggle("filled", index < enteredPin.length);
    });
}

function addDigit(digit) {
    if (enteredPin.length >= SECRET_PIN.length) return;
    enteredPin += digit;
    updatePinDisplay();
}

function removeDigit() {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDisplay();
    pinMessage.innerText = "";
}

document.querySelectorAll(".key[data-number]").forEach(key => {
    key.addEventListener("click", () => addDigit(key.dataset.number));
});

document.getElementById("clearPin").addEventListener("click", removeDigit);
document.getElementById("enterPin").addEventListener("click", checkPin);

function checkPin() {

    if (enteredPin === SECRET_PIN) {

        pinMessage.innerText = "Unlocked! 💖";
        startMusic();

        setTimeout(() => {
            showPage("envelopePage");
            enteredPin = "";
            updatePinDisplay();
            pinMessage.innerText = "";
        }, 700);

    } else {

        pinMessage.innerText = "Hmm... that's not the secret code 😉";

        document.querySelector(".password-card").animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-10px)" },
                { transform: "translateX(10px)" },
                { transform: "translateX(0)" }
            ],
            { duration: 400 }
        );

        enteredPin = "";
        updatePinDisplay();
    }
}

// keyboard support (only on the password page)
document.addEventListener("keydown", event => {

    if (!document.getElementById("passwordPage").classList.contains("active")) return;

    if (/^\d$/.test(event.key)) addDigit(event.key);
    if (event.key === "Backspace") removeDigit();
    if (event.key === "Enter") checkPin();
});


/* =========================================
   ENVELOPE → MEMORIES → LETTER → GIFT
========================================= */

const envelope = document.getElementById("envelope");

document.getElementById("openEnvelope").addEventListener("click", () => {
    envelope.classList.add("open");
    createConfetti(18);
    setTimeout(() => showPage("memoriesPage"), 1500);
});

envelope.addEventListener("click", () => envelope.classList.toggle("open"));

document.getElementById("memoryButton").addEventListener("click", () => showPage("letterPage"));

document.getElementById("giftButton").addEventListener("click", () => showPage("giftPage"));


/* =========================================
   GIFT REVEAL
========================================= */

const giftBox = document.getElementById("giftBox");
const giftIntro = document.getElementById("giftIntro");
const giftReveal = document.getElementById("giftReveal");

giftBox.addEventListener("click", () => {

    if (giftBox.classList.contains("opened")) return;

    giftBox.classList.add("opened");
    createConfetti(12);

    setTimeout(() => {
        giftIntro.style.display = "none";
        giftReveal.classList.remove("hidden");
    }, 900);
});


/* =========================================
   CAKE
========================================= */

document.getElementById("cakeButton").addEventListener("click", () => {
    showPage("cakePage");
    startMicrophone();
});

document.getElementById("blowButton").addEventListener("click", blowCandle);

function blowCandle() {

    const candle = document.getElementById("candle");

    if (candle.classList.contains("blown")) return;

    candle.classList.add("blown");

    document.getElementById("wishInstruction").innerText =
        "Your wish has been sent to the stars ✨";

    document.getElementById("wishMessage").classList.remove("hidden");

    createConfetti(25);
    playCelebration();
}


/* =========================================
   MICROPHONE – BLOW DETECTION
========================================= */

let audioContext;
let analyser;
let microphone;
let microphoneStarted = false;

async function startMicrophone() {

    if (microphoneStarted) return;

    try {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);

        microphone.connect(analyser);
        analyser.fftSize = 256;

        microphoneStarted = true;
        detectBlow();

    } catch (error) {
        console.log("Microphone permission not available.");
    }
}

function detectBlow() {

    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    let total = 0;
    for (let i = 0; i < data.length; i++) total += data[i];

    if (total / data.length > BLOW_THRESHOLD) blowCandle();

    requestAnimationFrame(detectBlow);
}


/* =========================================
   FINAL PAGE
========================================= */

document.getElementById("finalButton").addEventListener("click", () => {
    showPage("finalPage");
    startFireworks();
    createConfetti(35);
});

document.getElementById("replayButton").addEventListener("click", () => location.reload());


/* =========================================
   CONFETTI  (✏️ colours)
========================================= */

const CONFETTI_COLORS = ["#ec6a9f", "#ff9cc2", "#f6ecd8", "#f0cf7a", "#ffffff"];

function createConfetti(amount = 25) {

    for (let i = 0; i < amount; i++) {

        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.background =
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        confetti.style.animationDuration = (2.2 + Math.random() * 1.6) + "s";
        confetti.style.animationDelay = (Math.random() * 0.6) + "s";

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4500);
    }
}


/* =========================================
   FIREWORKS  (✏️ colour: FIREWORK_COLOR)
========================================= */

const FIREWORK_COLOR = "rgba(255,200,225,0.9)";
const FIREWORK_GLOW = "#ff9cc2";

let fireworksStarted = false;

function startFireworks() {

    if (fireworksStarted) return;
    fireworksStarted = true;

    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const particles = [];

    function createFirework() {

        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;

        for (let i = 0; i < 22; i++) {

            const angle = Math.PI * 2 * i / 22;
            const speed = 1.5 + Math.random() * 2.5;

            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 55
            });
        }
    }

    function animate() {

        // fade the old trails (keeps the page background visible)
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";

        for (let i = particles.length - 1; i >= 0; i--) {

            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            p.life--;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = FIREWORK_COLOR;
            ctx.shadowColor = FIREWORK_GLOW;
            ctx.shadowBlur = 8;
            ctx.fill();

            if (p.life <= 0) particles.splice(i, 1);
        }

        ctx.shadowBlur = 0;

        requestAnimationFrame(animate);
    }

    setInterval(createFirework, 2500);
    createFirework();
    animate();
}


/* =========================================
   MUSIC
========================================= */

const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

let musicPlaying = false;

// 🎵 Choose which part of the song to play
const startTime = 0; // Start at 30 seconds
const endTime = 30;   // Stop at 70 seconds

music.volume = 0.5;

function startMusic() {

    // Start the song from the selected time
    music.currentTime = startTime;

    music.play()
        .then(() => {
            musicPlaying = true;
            musicButton.innerText = "🔊";
            console.log("Birthday music started!");
        })
        .catch((error) => {
            console.log("Music could not start:", error);
            musicButton.innerText = "🎵";
        });
}


// Stop the song when it reaches the selected ending time
music.addEventListener("timeupdate", () => {

    if (music.currentTime >= endTime) {

        music.pause();

        // Reset to the beginning of the selected section
        music.currentTime = startTime;

        musicPlaying = false;
        musicButton.innerText = "🎵";
    }
});


// 🎵 Music button
musicButton.addEventListener("click", () => {

    if (music.paused) {

        // If the song has reached the end of the selected section,
        // start again from startTime
        if (music.currentTime >= endTime || music.currentTime < startTime) {
            music.currentTime = startTime;
        }

        music.play()
            .then(() => {
                musicPlaying = true;
                musicButton.innerText = "🔊";
            })
            .catch((error) => {
                console.log("Music error:", error);
            });

    } else {

        music.pause();
        musicPlaying = false;
        musicButton.innerText = "🎵";
    }
});


/* =========================================
   CELEBRATION SOUND  (✏️ sounds/celebration.mp3)
========================================= */

function playCelebration() {

    const sound = new Audio("sounds/celebration.mp3");

    sound.play().catch(() => {});
}