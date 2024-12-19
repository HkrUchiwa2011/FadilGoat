// Navigation entre les écrans
const screens = {
    welcome: document.getElementById("welcome-screen"),
    main: document.getElementById("main-screen"),
    quiz: document.getElementById("quiz-screen"),
    calculator: document.getElementById("calculator-screen"),
    snake: document.getElementById("snake-screen"),
    password: document.getElementById("password-screen"),
    average: document.getElementById("average-screen"),
};

const showScreen = (screen) => {
    Object.values(screens).forEach((s) => s.classList.add("hidden"));
    screen.classList.remove("hidden");
};

// Navigation
document.getElementById("explore-btn").addEventListener("click", () => showScreen(screens.main));
document.getElementById("quiz-btn").addEventListener("click", () => {
    showScreen(screens.quiz);
    startQuiz();
});
document.getElementById("calculator-btn").addEventListener("click", () => {
    showScreen(screens.calculator);
    createCalculator();
});
document.getElementById("snake-btn").addEventListener("click", () => {
    showScreen(screens.snake);
    startSnake();
});
document.getElementById("password-btn").addEventListener("click", () => showScreen(screens.password));
document.getElementById("average-btn").addEventListener("click", () => showScreen(screens.average));

// Quiz
let currentLevel = 1; // Niveau actuel
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let helpPoints = 50;

// Charger les questions
async function loadQuestions() {
    const response = await fetch("questions.json");
    const data = await response.json();
    const levelData = data.levels.find((level) => level.level === currentLevel);
    if (levelData) {
        questions = levelData.questions;
    } else {
        alert(`Le niveau ${currentLevel} n'est pas disponible.`);
        questions = [];
    }
}

async function startQuiz() {
    await loadQuestions();
    if (questions.length > 0) {
        score = 0;
        helpPoints = 50;
        currentQuestionIndex = 0;
        document.getElementById("help-points").innerText = helpPoints;
        document.getElementById("score").innerText = score;
        showQuestion();
    }
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("question").innerText = currentQuestion.question;
    const answersEl = document.getElementById("answers");
    answersEl.innerHTML = "";
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.onclick = () => checkAnswer(index);
        answersEl.appendChild(button);
    });
}

document.getElementById("help-btn").addEventListener("click", () => {
    if (helpPoints >= 50) {
        helpPoints -= 50;
        document.getElementById("help-points").innerText = helpPoints;
        revealAnswer();
    } else {
        alert("Vous n'avez pas assez de points pour utiliser une aide !");
    }
});

function revealAnswer() {
    const correctIndex = questions[currentQuestionIndex].correct;
    const answerButtons = document.querySelectorAll("#answers button");
    answerButtons.forEach((btn, index) => {
        if (index === correctIndex) {
            btn.style.backgroundColor = "lime";
        }
    });
}

function checkAnswer(index) {
    if (index === questions[currentQuestionIndex].correct) {
        score += 10;
        document.getElementById("score").innerText = score;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        alert("Quiz terminé !");
        showScreen(screens.main);
    }
}

// Calculatrice
function createCalculator() {
    const buttons = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"];
    const calcButtons = document.getElementById("calc-buttons");
    calcButtons.innerHTML = "";
    buttons.forEach((btn) => {
        const button = document.createElement("button");
        button.innerText = btn;
        button.onclick = () => handleCalculatorInput(btn);
        calcButtons.appendChild(button);
    });
}

let calcInput = "";

function handleCalculatorInput(input) {
    if (input === "=") {
        calcInput = eval(calcInput).toString();
    } else {
        calcInput += input;
    }
    document.getElementById("calc-display").value = calcInput;
}

// Snake
function startSnake() {
    const canvas = document.getElementById("snake-game");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "lime";
    ctx.fillRect(10, 10, 20, 20); // Exemple minimal
}

// Moyennes
document.getElementById("calculate-average-btn").addEventListener("click", () => {
    const grades = document.querySelector(".grades").value.split(",").map(Number);
    const validGrades = grades.filter((g) => !isNaN(g));
    const average = validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length;
    document.getElementById("average-result").innerText = `Moyenne : ${average.toFixed(2)}`;
})
