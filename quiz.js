const quizQuestions = [
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
];



const quizContainer = document.getElementById("quiz-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const quizProgress = document.getElementById("quiz-progress");
const quizResult = document.getElementById("quiz-result");
const quizNav = document.querySelector(".quiz-nav");

let currentQuestionIndex = 0;
const userAnswers = new Array(quizQuestions.length).fill(null);

function renderQuestion(index) {
    const q = quizQuestions[index];

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

    quizProgress.textContent = `Question ${index + 1} of ${quizQuestions.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === quizQuestions.length - 1 ? "Submit" : "Next";
}

function submitQuiz() {
    let score = 0;
    quizQuestions.forEach((q, i) => {
        if (userAnswers[i] === q.correctIndex) score++;
    });

    quizContainer.innerHTML = "";
    quizNav.style.display = "none";
    quizResult.innerHTML = `<h3>You scored ${score} out of ${quizQuestions.length}</h3>`;
}

if (quizContainer) {
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
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
        } else {
            submitQuiz();
        }
    });

    renderQuestion(currentQuestionIndex);
}