let progressBarText;
let progressedBar;
let questionText;
let optionBtns;
let fiftyFiftyPowerupText;
let doubleScorePowerupText;
let skipQuestionPowerupText;

let answeredQuestions = 0;
let totalQuestions;

let quizComplete = false;

let questions;
let correctOption;

const categories = [
    "Any Category", // 
    "General Knowledge", // 9
    "Entertainment: Books", // 10
    "Entertainment: Film", // 11
    "Entertainment: Music", // 12
    "Entertainment: Musicals & Theatres", // 13
    "Entertainment: Television", // 14
    "Entertainment: Video Games", // 15
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

let categorySelected;
let difficultySelected;

addCategorySelectors();
addDifficultySelectors();

function addCategorySelectors() {
    categories.forEach(category => {
        const element = document.createElement('div');

        element.classList.add('chip', 'toggleable');
        element.textContent = category;

        if (category === 'Any Category') {
            element.addEventListener('click', event => {

                const categoryChipSelectors = document.getElementById('categoriesSelector').getElementsByClassName('chip');

                if (event.target.classList.contains('enabled-selector')) {
                    for (let categoryChipSelector of categoryChipSelectors) {
                        categoryChipSelector.classList.add('enabled-selector');
                    }

                    categorySelected = undefined;
                }

                else {
                    for (let categoryChipSelector of categoryChipSelectors) {
                        categoryChipSelector.classList.remove('enabled-selector');
                    }

                    categorySelected = category
                }


                for (let categoryChipSelector of categoryChipSelectors) {
                    categoryChipSelector.classList.toggle('enabled-selector');
                }
            });
        }

        else {
            element.addEventListener('click', event => {
                categorySelected = category

                const categoryChipSelectors = document.getElementById('categoriesSelector').getElementsByClassName('chip');

                for (let categoryChipSelector of categoryChipSelectors) {
                    categoryChipSelector.classList.remove('enabled-selector');
                }

                event.target.classList.toggle('enabled-selector');
            });
        }

        document.getElementById("categoriesSelector").appendChild(element);
    });
}

function addDifficultySelectors() {
    const difficulties = ['Easy', 'Medium', 'Hard'];

    difficulties.forEach(difficulty => {
        const element = document.createElement('div');

        element.classList.add('chip', 'toggleable');
        element.textContent = difficulty;

        element.addEventListener('click', event => {
            difficultySelected = difficulty.toLowerCase();

            const difficultyChipSelectors = document.getElementById('difficultiesSelector').getElementsByClassName('chip');

            for (let difficultyChipSelector of difficultyChipSelectors) {
                difficultyChipSelector.classList.remove('enabled-selector');
            }

            event.target.classList.add('enabled-selector');
        });

        document.getElementById("difficultiesSelector").appendChild(element);
    });
}

async function getQuestionData() {
    let categoryId;

    if (categorySelected === 'Any Category') {
        categoryId = undefined;
    }

    else {
        categories.forEach((category, index) => {
            if (category === categorySelected) {
                categoryId = index + 8;
            }
        });
    }

    const url = (categoryId === undefined)
        ? `https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple&difficulty=${difficultySelected}`
        : `https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple&difficulty=${difficultySelected}&category=${categoryId}`;

    console.log(url);

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error('Unable to locate resource');

        const data = await response.json();

        questions = data['results'];

        updateProgressBar()
        updateCurrentQuestion()
    }

    catch (error) {
        console.log('Something went wrong')
        console.error(error);
    }
}

function updateProgressBar() {
    progressBarText.innerText = `${answeredQuestions}/${totalQuestions}`
    progressedBar.style.width = `${(answeredQuestions / totalQuestions) * 100}%`;
}

function updateCurrentQuestion() {
    questionText.innerHTML = `${questions[answeredQuestions]['question']}`;

    correctOption = Math.floor(Math.random() * 4);

    optionLabels[correctOption].innerHTML = `${questions[answeredQuestions]['correct_answer']}`;

    let optionsComplete = 0

    for (let i = 0; i < 4; i++) {
        if (i == correctOption) continue;

        optionLabels[i].innerHTML = `${questions[answeredQuestions]['incorrect_answers'][optionsComplete]}`;
        optionsComplete++;
    }

    optionBtns.forEach(optionBtn => {
        optionBtn.classList.remove('incorrect-selected');
    })
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

    updateProgressBar()
    updateCurrentQuestion()
}

function selectOption(option) {
    if (option != correctOption) {
        optionBtns[option].classList.add('incorrect-selected');
        return
    }

    answeredQuestions++;
    updateProgressBar()

    if (answeredQuestions == totalQuestions) {
        questionText.innerText = 'You win'
        return;
    }

    updateCurrentQuestion();
}

function start() {
    totalQuestions = document.getElementById('questionQuantity').value;

    if (totalQuestions > 50 || totalQuestions === '') {
        window.alert('Select the numbers of questions to be a value between 1 and 50');
        return;
    }


    if (categorySelected === undefined) {
        window.alert('A category has not been selected');
        return;
    }

    if (difficultySelected === undefined) {
        window.alert('A difficulty has not been selected');
        return;
    }

    updateHtml();
    gameInit();
    getQuestionData();
}

function updateHtml() {
    document.getElementById("questionMenu").innerHTML = `
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
}

function gameInit() {
    progressBarText = document.getElementById("progressBarText");
    progressedBar = document.getElementById("progressedBar");

    questionText = document.getElementById("questionText");

    optionBtns = Array.from(document.getElementById('options').getElementsByClassName('optionBtn'));
    optionLabels = document.getElementById('options').getElementsByClassName('optionText');

    fiftyFiftyPowerupText = document.getElementById("fiftyFiftyPowerupText");
    doubleScorePowerupText = document.getElementById("doubleScorePowerupText");
    skipQuestionPowerupText = document.getElementById("skipQuestionPowerupText");
}

