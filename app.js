console.log("worly game starting...");


//game state
const gameState = {
    targetWord: "",
    guesses: [],
    currentAttempt: 0,
    maxAttempts: 6,
    status: "playing",
    wins: 0
}

const Word_list = [
    "apple", "brave", "flour", "glove", "plows", "great"

]

//dom elements
const gameBoard = document.getElementById("game-board");
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const messageEl = document.getElementById("message");
const attemptsEl = document.getElementById("attempts");
const winsEl = document.getElementById("wins");
const newGameBtn = document.getElementById("new-game-btn");

// get random word from wordlist

function getRandomWord() {
    const randomIndex = Math.floor(Math.random()*Word_list.length)
    return Word_list[randomIndex]
}

// initialize game
function initGame() {
    gameState.targetWord = getRandomWord();
    gameState.guesses = [];
    gameState.currentAttempt = 0;
    gameState.status = "playing";

    console.log('Target Word', gameState.targetWord)

    //clear UI
    gameBoard.innerHTML = "";
    messageEl.textContent = "";
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;

    //create emtpy rows
   for (let i = 0; i < gameState.maxAttempts; i++) {
        const row = document.createElement("div")
        row.className = "row"
        row.id = `row-${i}`

        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div")
            cell.className = "cell"
            cell.id = `cell-${i}-${j}`
            row.appendChild(cell)
            
        }
        gameBoard.appendChild(row)
    }
    attemptsEl.textContent = "0";
    winsEl.textContent = gameState.wins;
    
    console.log('game initialized')
}

function validateGuess(guess) {
    if (guess.length!== 5) {
        return { valid: false, message: "word must be 5 letters"};
    }

    if (!/^[a-zA-Z]+$/.test(guess)) {
        return { valid: false, message: "word must contain only letters"}
    }

    return { valid: true, message: ""};
}

function checkGuess(guess, target) {
    const result = [];
    const targetLetters = target.split("");
    const guessLetters = guess.toLowerCase().split("");

    //first pass find exact matches (green)
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = "correct";
            targetLetters[i] = null; //mark as used
        } else {
            result[i] =  "absent"; //default to absent
        }
    }
    
    //second pass: find partial matches (yellow)
    for (let i =0; i < 5; i++) {
        if (result[i] === "correct") continue;

        const index = targetLetters.indexOf(guessLetters[i]);
        if (index !== -1) {
            result[i] = "present";
            targetLetters[index] = null; //mark as used

        }
    }
    return result;
}


function updateBoard(guess, result) {
    const rowIndex = gameState.currentAttempt;

    for (let i = 0; i < 5; i++) {
        const cell = document.getElementById(`cell-${rowIndex}-${i}`);
        cell.textContent = guess[i].toUpperCase();
        cell.classList.add(result[i]);

    }

}

function handleGuess() {
    const guess = guessInput.value.toLowerCase().trim();

    //validate
    const validation = validateGuess(guess);
    if (!validation.valid) {
        messageEl.textContent = validation.message;
        return;
    }

    //check guess
    const result = checkGuess(guess, gameState.targetWord);
    gameState.guesses.push({ word: guess, result });

    //update UI
    updateBoard(guess, result);
    gameState.currentAttempt++;
    attemptsEl.textContent = gameState.currentAttempt;

    // Check win/lose
if (guess === gameState.targetWord) {
gameState.status = "won";
gameState.wins++;
winsEl.textContent = gameState.wins;
messageEl.textContent = "Congratulations! You won!";
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