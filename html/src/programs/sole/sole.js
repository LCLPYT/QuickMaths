import * as PARSER from "./../../modules/parser";

let inputField = document.getElementById("inputField");
let solveBtn = document.getElementById("solveBtn");
solveBtn.addEventListener("click", () => {
    solve(inputField.value);
});

function solve(text) {
    PARSER.parse(text);
}