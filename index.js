let progressBarText = document.getElementById("progressBarText");
let progressedBar = document.getElementById("progressedBar");

let questionText = document.getElementById("questionText");

let optionBtn1 = document.getElementById("optionBtn1");
let optionBtn2 = document.getElementById("optionBtn2");
let optionBtn3 = document.getElementById("optionBtn3");
let optionBtn4 = document.getElementById("optionBtn4");

let optionBtns = [optionBtn1, optionBtn2, optionBtn3, optionBtn4];

let optionLabel1 = document.getElementById("optionLabel1");
let optionLabel2 = document.getElementById("optionLabel2");
let optionLabel3 = document.getElementById("optionLabel3");
let optionLabel4 = document.getElementById("optionLabel4");

let optionLabels = [optionLabel1, optionLabel2, optionLabel3, optionLabel4];

let fiftyFiftyPowerupText = document.getElementById("fiftyFiftyPowerupText");
let doubleScorePowerupText = document.getElementById("doubleScorePowerupText");
let skipQuestionPowerupText = document.getElementById("skipQuestionPowerupText");

let answeredQuestions = 0;
const totalQuestions = 5;

let quizComplete = false;

let questions;
let correctOption;

const lightSurfaceColor = '#2e2c2e';
const incorrectAnswerColor = '#E71D36';

async function getQuestionData() {
    try {
        const url = `https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple`
        const response = await fetch(url);

        if (!response.ok) throw new Error('Unable to locate resource');

        const data = await response.json();

        console.log(data);

        questions = data['results'];

        nextQuestion()
        updateCurrentQuestion()
    }
    catch (error) {
        console.log('Something went wrong')
        console.error(error);
    }
}

function nextQuestion() {
    progressBarText.innerText = `${answeredQuestions}/${totalQuestions}`
    progressedBar.style.width = `${answeredQuestions / totalQuestions * 100}%`;
}

function updateCurrentQuestion() {
    questionText.innerHTML = `<p>${questions[answeredQuestions]['question']}</p>`;

    correctOption = Math.floor(Math.random() * 4);
    optionLabels[correctOption].innerHTML = `<span>${questions[answeredQuestions]['correct_answer']}</span>`;

    let optionsComplete = 0

    for (let i = 0; i < 4; i++) {
        if (i == correctOption) continue;

        optionLabels[i].innerHTML = `<span>${questions[answeredQuestions]['incorrect_answers'][optionsComplete]}</span>`;
        optionsComplete++;
    }

    optionBtn1.style.backgroundColor = lightSurfaceColor;
    optionBtn2.style.backgroundColor = lightSurfaceColor;
    optionBtn3.style.backgroundColor = lightSurfaceColor;
    optionBtn4.style.backgroundColor = lightSurfaceColor;
}

function fiftyFifty() {
    const uses = Number(fiftyFiftyPowerupText.innerHTML);

    if (uses < 1) {
        window.alert('No more fifty fifty powerups');
        return;
    }

    fiftyFiftyPowerupText.innerHTML = uses - 1;
}

function doubleScore() {
    const uses = Number(doubleScorePowerupText.innerHTML);

    if (uses < 1) {
        window.alert('No more double score powerups');
        return;
    }

    doubleScorePowerupText.innerHTML = uses - 1;
}


function skipQuestion() {
    const skips = Number(skipQuestionPowerupText.innerText)

    if (skips < 1) {
        window.alert('No more skips!')
        return
    }

    if (answeredQuestions == totalQuestions) {
        quizComplete = true
        return
    }

    skipQuestionPowerupText.innerText = skips - 1;
    answeredQuestions++;

    nextQuestion()
    updateCurrentQuestion()
}

function selectOption(option) {
    if (option != correctOption) {
        optionBtns[option].style.backgroundColor = incorrectAnswerColor;
        return
    }

    answeredQuestions++;
    nextQuestion()

    if (answeredQuestions == totalQuestions) {
        questionText.innerText = 'You win'
        return;
    }

    updateCurrentQuestion();
}

function start() {
    const content = document.getElementById("questionMenu");
    content.innerHTML = `
    <p>Score: </p>

    <p id="progressBarText"></p>

    <div id="progressBar">
        <div id="progressedBar"></div>
    </div>

    <div id="question">
        <p id="questionText"></p>

        <div id="options">
            <button class="optionBtn" id="optionBtn1" onclick="selectOption(0)">
                <span class="optionText" id="optionLabel1"></span>
            </button>

            <button class="optionBtn" id="optionBtn2" onclick="selectOption(1)">
                <span class="optionText" id="optionLabel2"></span>
            </button>

            <button class="optionBtn" id="optionBtn3" onclick="selectOption(2)">
                <span class="optionText" id="optionLabel3"></span>
            </button>

            <button class="optionBtn" id="optionBtn4" onclick="selectOption(3)">
                <span class="optionText" id="optionLabel4"></span>
            </button>
        </div>
    </div>

    <div id="powerupContainer">
        <button class="powerup" id="fiftyFiftyPowerup" onclick="fiftyFifty()">
            <div class="powerupQuantity">
                <span id="fiftyFiftyPowerupText">2</span>
            </div>
        </button>

        <button class="powerup" id="doubleScorePowerup" onclick="doubleScore()">
            <div class="powerupQuantity">
                <span id="doubleScorePowerupText">2</span>
            </div>
        </button>

        <button class="powerup" id="skipQuestionPowerup" onclick="skipQuestion()">
            <span class="material-symbols-outlined powerupIcon" style="font-size: 3rem;">
                skip_next
            </span>
            <div class="powerupQuantity">
                <span id="skipQuestionPowerupText">2</span>
            </div>
        </button>
    </div>`;

    gameInit();
    getQuestionData();
}

function gameInit() {
    progressBarText = document.getElementById("progressBarText");
    progressedBar = document.getElementById("progressedBar");

    questionText = document.getElementById("questionText");

    optionBtn1 = document.getElementById("optionBtn1");
    optionBtn2 = document.getElementById("optionBtn2");
    optionBtn3 = document.getElementById("optionBtn3");
    optionBtn4 = document.getElementById("optionBtn4");

    optionBtns = [optionBtn1, optionBtn2, optionBtn3, optionBtn4];

    optionLabel1 = document.getElementById("optionLabel1");
    optionLabel2 = document.getElementById("optionLabel2");
    optionLabel3 = document.getElementById("optionLabel3");
    optionLabel4 = document.getElementById("optionLabel4");

    optionLabels = [optionLabel1, optionLabel2, optionLabel3, optionLabel4];

    fiftyFiftyPowerupText = document.getElementById("fiftyFiftyPowerupText");
    doubleScorePowerupText = document.getElementById("doubleScorePowerupText");
    skipQuestionPowerupText = document.getElementById("skipQuestionPowerupText");
}


const categories = [
    "Any Category",
    "General Knowledge",
    "Entertainment: Books",
    "Entertainment: Film",
    "Entertainment: Music",
    "Entertainment: Musicals & Theatres",
    "Entertainment: Television",
    "Entertainment: Video Games",
    "Entertainment: Board Games",
    "Science & Nature",
    "Science: Computers",
    "Science: Mathematics",
    "Mythology",
    "Sports",
    "Geography",
    "History",
    "Politics",
    "Art",
    "Celebrities",
    "Animals",
    "Vehicles",
    "Entertainment: Comics",
    "Science: Gadgets"
];

const difficulties = ['Easy', 'Medium', 'Hard'];

let difficultiesSelector = document.getElementById("difficultiesSelector");

difficultiesSelector.innerHTML = '<div id="difficultiesSelector">';

for (difficulty of difficulties) {
    console.log(difficulty);
    difficultiesSelector.innerHTML += `<div class="btn">${difficulty}</div>`;
}

difficultiesSelector.innerHTML += '</div>';
