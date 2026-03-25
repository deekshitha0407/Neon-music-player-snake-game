// --- Music Data ---
const tracks = [
    { title: "Cybernetic Pulse", artist: "Neural Synth AI", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Digital Rain", artist: "Algorithm Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Neon Horizon", artist: "GPT-Audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

let currentTrackIndex = 0;
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress');

// --- Music Player Logic ---
function loadTrack(index) {
    const track = tracks[index];
    audio.src = track.url;
    document.getElementById('track-title').innerText = track.title;
    document.getElementById('track-artist').innerText = track.artist;
    
    // Update playlist UI
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = "PAUSE";
        playBtn.style.boxShadow = "0 0 25px var(--neon-cyan)";
    } else {
        audio.pause();
        playBtn.innerText = "PLAY";
        playBtn.style.boxShadow = "0 0 15px var(--neon-cyan)";
    }
}

audio.ontimeupdate = () => {
    const pct = (audio.currentTime / audio.duration) * 100;
    progress.style.width = pct + "%";
};

document.getElementById('next-btn').onclick = () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
};

document.getElementById('prev-btn').onclick = () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
};

playBtn.onclick = togglePlay;

// --- Snake Game Logic ---
const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('game-over-overlay');

const box = 20;
let score = 0;
let gameSpeed = 100;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};
let d;

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if ((key == 37 || key == 65) && d != "RIGHT") d = "LEFT";
    else if ((key == 38 || key == 87) && d != "DOWN") d = "UP";
    else if ((key == 39 || key == 68) && d != "LEFT") d = "RIGHT";
    else if ((key == 40 || key == 83) && d != "UP") d = "DOWN";
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function draw() {
    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#00f3ff" : "#005a5f";
        ctx.strokeStyle = "black";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        
        // Glow effect for head
        if(i == 0) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00f3ff";
        } else {
            ctx.shadowBlur = 0;
        }
    }

    // Draw Food
    ctx.fillStyle = "#ff00ff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff00ff";
    ctx.fillRect(food.x, food.y, box, box);
    ctx.shadowBlur = 0;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Eat Food
    if (snakeX == food.x && snakeY == food.y) {
        score += 10;
        scoreEl.innerText = score.toString().padStart(3, '0');
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game Over Conditions
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        overlay.classList.remove('hidden');
        document.getElementById('status').innerText = "OFFLINE";
        document.getElementById('status').style.color = "var(--neon-pink)";
    }

    snake.unshift(newHead);
}

function resetGame() {
    score = 0;
    scoreEl.innerText = "000";
    snake = [{ x: 9 * box, y: 10 * box }];
    d = null;
    overlay.classList.add('hidden');
    document.getElementById('status').innerText = "ONLINE";
    document.getElementById('status').style.color = "var(--neon-cyan)";
    game = setInterval(draw, gameSpeed);
}

document.getElementById('restart-btn').onclick = resetGame;

// Initialize
loadTrack(currentTrackIndex);
let game = setInterval(draw, gameSpeed);