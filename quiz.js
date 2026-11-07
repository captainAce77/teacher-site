const quizData = {
    "Financial Accounting": {
        "Trial Balance": [
            {
                question: "What is a trial balance used for?",
                options: [
                    "To record daily cash transactions",
                    "To check that total debits equal total credits",
                    "To calculate profit directly",
                    "To list customer addresses"
                ],
                correctIndex: 1
            },
            {
                question: "Which of these is a liability?",
                options: ["Cash at bank", "Trade payables (creditors)", "Trade receivables (debtors)", "Motor vehicles"],
                correctIndex: 1
            },
            {
                question: "The accounting equation is:",
                options: [
                    "Assets = Liabilities + Capital",
                    "Assets = Liabilities - Capital",
                    "Capital = Assets + Liabilities",
                    "Liabilities = Assets + Capital"
                ],
                correctIndex: 0
            },
            {
                question: "A debit balance in a trial balance normally represents:",
                options: ["Income and liabilities", "Assets and expenses", "Only cash", "Only capital"],
                correctIndex: 1
            },
            {
                question: "If total debits do not equal total credits, this suggests:",
                options: [
                    "The business made a loss",
                    "There is an error in the ledger accounts",
                    "The business made a profit",
                    "Nothing is wrong"
                ],
                correctIndex: 1
            }
        ],
        "Final Accounts": [
            {
                question: "Gross profit is calculated as:",
                options: [
                    "Sales minus cost of goods sold",
                    "Sales minus all expenses",
                    "Cost of goods sold minus sales",
                    "Net profit plus expenses"
                ],
                correctIndex: 0
            }
        ]
    },
    "Commerce": {
        "Introduction to Commerce": [
            {
                question: "Commerce is best described as:",
                options: [
                    "Only the buying and selling of goods",
                    "All activities that facilitate trade, including aids to trade",
                    "Only manufacturing of goods",
                    "Only banking activities"
                ],
                correctIndex: 1
            }
        ]
    }
};


const quizSubjectSelect = document.getElementById("quiz-subject-select");
const quizTopicSelect = document.getElementById("quiz-topic-select");
const quizContainer = document.getElementById("quiz-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const quizProgress = document.getElementById("quiz-progress");
const quizResult = document.getElementById("quiz-result");
const quizNav = document.querySelector(".quiz-nav");

let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

function populateSubjects() {
    Object.keys(quizData).forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        quizSubjectSelect.appendChild(option);
    });
}

function populateTopics() {
    quizTopicSelect.innerHTML = "";
    const selectedSubject = quizSubjectSelect.value;
    const topics = Object.keys(quizData[selectedSubject]);

    topics.forEach(topic => {
        const option = document.createElement("option");
        option.value = topic;
        option.textContent = topic;
        quizTopicSelect.appendChild(option);
    });
}

function startQuiz() {
    const selectedSubject = quizSubjectSelect.value;
    const selectedTopic = quizTopicSelect.value;

    currentQuestions = quizData[selectedSubject][selectedTopic];
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuestions.length).fill(null);

    quizNav.style.display = "flex";
    quizResult.innerHTML = "";
    renderQuestion(currentQuestionIndex);
}

function renderQuestion(index) {
    const q = currentQuestions[index];

    let optionsHTML = "";
    q.options.forEach((option, optIndex) => {
        const isChecked = userAnswers[index] === optIndex ? "checked" : "";
        optionsHTML += `
            <label class="quiz-option">
                <input type="radio" name="question-${index}" value="${optIndex}" ${isChecked}>
                ${option}
            </label>
        `;
    });

    quizContainer.innerHTML = `
        <p class="quiz-question-text">${index + 1}. ${q.question}</p>
        ${optionsHTML}
    `;

    quizProgress.textContent = `Question ${index + 1} of ${currentQuestions.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === currentQuestions.length - 1 ? "Submit" : "Next";
}

function submitQuiz() {
    let score = 0;
    currentQuestions.forEach((q, i) => {
        if (userAnswers[i] === q.correctIndex) score++;
    });

    quizContainer.innerHTML = "";
    quizNav.style.display = "none";
    quizResult.innerHTML = `
        <h3>You scored ${score} out of ${currentQuestions.length}</h3>
        <button id="review-btn">Review Answers</button>
        <button id="retake-btn">Retake Quiz</button>
        <div id="review-container"></div>
    `;

    document.getElementById("retake-btn").addEventListener("click", startQuiz);
    document.getElementById("review-btn").addEventListener("click", showReview);

    window.dispatchEvent(new CustomEvent("quiz-finished", {
    detail: {
        subject: quizSubjectSelect.value,
        topic: quizTopicSelect.value,
        score: score,
        total: currentQuestions.length
    }
}));
}

function showReview() {
    const reviewContainer = document.getElementById("review-container");
    let html = "";

    currentQuestions.forEach((q, i) => {
        const userAnswerIndex = userAnswers[i];
        const isCorrect = userAnswerIndex === q.correctIndex;

        if (isCorrect) return;

        const userAnswerText = userAnswerIndex !== null ? q.options[userAnswerIndex] : "No answer given";

        html += `
            <div class="review-item">
                <p class="quiz-question-text">${i + 1}. ${q.question}</p>
                <p class="review-wrong">Your answer: ${userAnswerText}</p>
                <p class="review-correct">Correct answer: ${q.options[q.correctIndex]}</p>
            </div>
        `;
    });

    if (html === "") {
        html = "<p>Perfect score — no questions to review!</p>";
    }

    reviewContainer.innerHTML = html;
}

if (quizContainer) {
    populateSubjects();
    populateTopics();
    startQuiz();

    quizSubjectSelect.addEventListener("change", function () {
        populateTopics();
        startQuiz();
    });

    quizTopicSelect.addEventListener("change", startQuiz);

    quizContainer.addEventListener("change", function (event) {
        if (event.target.matches('input[type="radio"]')) {
            userAnswers[currentQuestionIndex] = parseInt(event.target.value);
        }
    });

    prevBtn.addEventListener("click", function () {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion(currentQuestionIndex);
        }
    });

    nextBtn.addEventListener("click", function () {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
        } else {
            submitQuiz();
        }
    });
}