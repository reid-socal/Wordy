const fs = require("fs");

const files = ["wordle-allowed-guesses.txt", "wordle-answers-alphabetical.txt"];
const extras = ["flack"]; // any words you find missing, add them here

const words = new Set(extras);
for (const name of files) {
    for (const line of fs.readFileSync(name, "utf8").split("\n")) {
        const w = line.trim().toLowerCase();
        if (w.length === 5 && /^[a-z]+$/.test(w)) words.add(w);
    }
}

const sorted = [...words].sort();
fs.writeFileSync(
    "words.js",
    "const VALID_GUESSES = new Set([\n" +
    sorted.map(w => `"${w}"`).join(",\n") +
    "\n]);\n"
);
console.log(sorted.length, "words written");