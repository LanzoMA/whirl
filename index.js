let livesText;
let questionNumberText;
let scoreText;
let progressedBar;

let questionText;
let optionBtns;
let fiftyFiftyPowerupText;
let doubleScorePowerupText;
let skipQuestionPowerupText;

let lives;
let score = 0;
let scoreMultiplier = 1;
let streak = 0;
let answeredQuestions = 0;
let totalQuestions;

let quizComplete = false;

let questions;
let correctOption;

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
    const categoryId = (categorySelected === 'Any Category')
        ? undefined
        : categories.findIndex(category => category === categorySelected) + 8;


    let url = `https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple&difficulty=${difficultySelected}`;

    if (categoryId !== undefined) url += `&category=${categoryId}`;

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error('Unable to locate resource');

        const data = await response.json();

        questions = data['results'];

        return new Promise((resolve, reject) => {
            resolve('Success')
        });
    }

    catch (error) {
        return new Promise((resolve, reject) => {
            reject(error)
        });
    }
}

function updateProgressBar() {
    questionNumberText.innerText = `${answeredQuestions + 1}/${totalQuestions}`
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
    streak = 0;
    answeredQuestions++;

    updateProgressBar()

    if (answeredQuestions == totalQuestions) {
        document.getElementById('questionMenu').innerHTML = document.getElementById('quizCompleteTemplate').innerHTML;
        document.getElementById('scoreText').textContent = score;
        return;
    }

    updateCurrentQuestion()
}

function showCorrectAnswer() {
    optionBtns[correctOption].classList.add('enabled-selector');
}

function selectOption(option) {
    if (option != correctOption) {
        optionBtns[option].classList.add('incorrect-selected');
        lives--;
        livesText.textContent = lives;
        streak = 0;

        if (lives == 0) {
            optionBtns.forEach(optionBtn => {
                optionBtn.disabled = true;
            })

            const powerupsBtns = Array.from(document.getElementById('powerupContainer').getElementsByClassName('powerup'));

            powerupsBtns.forEach(powerupsBtn => {
                powerupsBtn.disabled = true;
            });

            showCorrectAnswer();

            window.alert(`Game over! You ran out of lives. You reached a score of ${score}`);
        }

        return;
    }

    score += 1000 * scoreMultiplier;
    scoreText.textContent = score;
    scoreMultiplier = (0.5 * Math.floor(Math.pow(2, 0.5 * streak))) + 1;

    streak++;
    answeredQuestions++;

    updateProgressBar()

    if (answeredQuestions == totalQuestions) {
        document.getElementById('questionMenu').innerHTML = document.getElementById('quizCompleteTemplate').innerHTML;
        document.getElementById('scoreText').textContent = score;

        return;
    }

    updateCurrentQuestion();
}

async function start() {
    totalQuestions = document.getElementById('questionQuantity').value;

    if (totalQuestions > 50 || totalQuestions < 1 || totalQuestions === '') {
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

    getQuestionData().then(updateHtml)
        .then(gameInit)
        .then(() => {
            updateProgressBar();
            updateCurrentQuestion();

            if (totalQuestions < 5) {
                lives = 1;
                fiftyFiftyPowerupText.textContent = 0;
                doubleScorePowerupText.textContent = 0;
                skipQuestionPowerupText.textContent = 0;
            }

            else {
                lives = Math.round((totalQuestions / 10) * 3);
                fiftyFiftyPowerupText.textContent = Math.round((totalQuestions / 10) * 2);
                doubleScorePowerupText.textContent = Math.round((totalQuestions / 10) * 2);
                skipQuestionPowerupText.textContent = Math.round((totalQuestions / 10) * 2);
            }

            scoreText.textContent = score;
            livesText.textContent = lives;
        })
        .catch((error) => console.error(error));
}

function updateHtml() {
    document.getElementById("questionMenu").innerHTML = document.getElementById("questionTemplate").innerHTML;
}

function gameInit() {
    livesText = document.getElementById("livesText");
    scoreText = document.getElementById("scoreText");
    questionNumberText = document.getElementById("questionNumberText");
    progressedBar = document.getElementById("progressedBar");

    questionText = document.getElementById("questionText");

    optionBtns = Array.from(document.getElementById('options').getElementsByClassName('btn'));
    optionLabels = document.getElementById('options').getElementsByClassName('optionText');

    fiftyFiftyPowerupText = document.getElementById("fiftyFiftyPowerupText");
    doubleScorePowerupText = document.getElementById("doubleScorePowerupText");
    skipQuestionPowerupText = document.getElementById("skipQuestionPowerupText");
}