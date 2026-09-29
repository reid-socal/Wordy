console.log("Wordly game starting...");

// ========== GAME STATE ==========
const gameState = {
  targetWord: "",
  guesses: [],
  currentAttempt: 0,
  maxAttempts: 6,
  status: "playing", // "playing", "won", "lost"
  wins: 0
};


// const WORD_LIST = [
//   "apple", "brave", "crane", "drive", "eagle",
//   "flame", "grape", "house", "input", "joker",
//   "knife", "lemon", "music", "noble", "ocean",
//   "piano", "queen", "radio", "snake", "tiger",
//   "unity", "voice", "water", "xenon", "yacht",
//   "zebra"
// ];

// ========== WORD LIST ==========
const WORD_LIST = [
  "cindy"
];


const VALID_SET = new Set([...VALID_GUESSES, ...WORD_LIST]);

// ========== DOM ELEMENTS ==========
const gameBoard = document.getElementById("game-board");
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const messageEl = document.getElementById("message");
const attemptsEl = document.getElementById("attempts");
const winsEl = document.getElementById("wins");
const newGameBtn = document.getElementById("new-game-btn");

// ========== GAME FUNCTIONS ==========

/**
 * Get a random word from the word list
 */
function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
}

/**
 * Initialize a new game
 */
function initGame() {
  gameState.targetWord = getRandomWord();
  gameState.guesses = [];
  gameState.currentAttempt = 0;
  gameState.status = "playing";

  console.log("Target word:", gameState.targetWord);

  // Clear UI
  gameBoard.innerHTML = "";
  messageEl.textContent = "";
  guessInput.value = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;

  // Create empty rows
  for (let i = 0; i < gameState.maxAttempts; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.id = `row-${i}`;

    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${i}-${j}`;
      row.appendChild(cell);
    }

    gameBoard.appendChild(row);
  }

  // Update stats
  attemptsEl.textContent = "0";
  winsEl.textContent = gameState.wins;

  console.log("Game initialized!");
}

/**
 * Validate the user's guess
 */
function validateGuess(guess) {
    if (guess === "trump") {
    return { valid: false, message: "Don't say his name!" };
  }
  if (guess.length !== 5) {
    return { valid: false, message: "Word must be 5 letters!" };
  }
  if (!/^[a-zA-Z]+$/.test(guess)) {
    return { valid: false, message: "Word must contain only letters!" };
  }
  if (!VALID_SET.has(guess.toLowerCase())) {
    return { valid: false, message: "Not a valid word" };
  }
  return { valid: true, message: "" };
}

/**
 * Check the guess against the target word
 */
function checkGuess(guess, target) {
  const result = [];
  const targetLetters = target.split("");
  const guessLetters = guess.toLowerCase().split("");

  // First pass: find exact matches (green)
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = "correct";
      targetLetters[i] = null; // Mark as used
    } else {
      result[i] = "absent"; // Default to absent
    }
  }

  // Second pass: find partial matches (yellow)
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;

    const index = targetLetters.indexOf(guessLetters[i]);
    if (index !== -1) {
      result[i] = "present";
      targetLetters[index] = null; // Mark as used
    }
  }

  return result;
}

/**
 * Update the UI with the guess result
 */
function updateBoard(guess, result) {
  const rowIndex = gameState.currentAttempt;

  for (let i = 0; i < 5; i++) {
    const cell = document.getElementById(`cell-${rowIndex}-${i}`);
    cell.textContent = guess[i].toUpperCase();
    cell.classList.add(result[i]);
  }
}


// ========== WIN EFFECTS ==========
function celebrateWin() {
  const rowIndex = gameState.currentAttempt - 1; // row that was just filled

  for (let i = 0; i < 5; i++) {
    const cell = document.getElementById(`cell-${rowIndex}-${i}`);
    cell.style.animationDelay = `${i * 100}ms`; // stagger the bounce
    cell.classList.add("win-bounce");
  }

  launchConfetti();
}

function launchConfetti(count = 80) {
  const colors = ["#6aaa64", "#c9b458", "#e74c3c", "#3498db", "#9b59b6"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(piece);

    piece.addEventListener("animationend", () => piece.remove());
  }
}


/**
 * Handle the user's guess
 */
function handleGuess() {
  const guess = guessInput.value.toLowerCase().trim();

  // Validate
  const validation = validateGuess(guess);
  if (!validation.valid) {
    messageEl.textContent = validation.message;
    return;
  }

  // Check guess
  const result = checkGuess(guess, gameState.targetWord);
  gameState.guesses.push({ word: guess, result });

  // Update UI
  updateBoard(guess, result);
  gameState.currentAttempt++;
  attemptsEl.textContent = gameState.currentAttempt;

  // Check win/lose
  if (guess === gameState.targetWord) {
    gameState.status = "won";
    gameState.wins++;
    winsEl.textContent = gameState.wins;
    messageEl.textContent = "You did it", "I LOVE YOU😘";
    messageEl.className = "message win";
    endGame();
  } else if (gameState.currentAttempt >= gameState.maxAttempts) {
    gameState.status = "lost";
    messageEl.textContent = `Game over! The word was "${gameState.targetWord}"`;
    messageEl.className = "message lose";
    endGame();
  } else {
    messageEl.textContent = `Attempt ${gameState.currentAttempt}/${gameState.maxAttempts}`;
  }

  // Clear input
  guessInput.value = "";
  guessInput.focus();
}

/**
 * End the game (disable input)
 */
function endGame() {
  guessInput.disabled = true;
  guessBtn.disabled = true;
}

// ========== EVENT LISTENERS ==========
guessBtn.addEventListener("click", handleGuess);

guessInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleGuess();
  }
});

newGameBtn.addEventListener("click", initGame);

// ========== START THE GAME ==========
initGame();