const CATEGORY_API_URL = "https://opentdb.com/api_category.php";
const TRIVIA_API_BASE_URL = "https://opentdb.com/api.php";
const PEXELS_API_KEY = "PFvrJcB1kFNPv2joOp3WZeLwACHBhlhRNq0aqubxgGk7mQpXiSJG8wMs";

let timerInterval;
const questions = [];
let currentQuestionIndex = 0;

// Populate categories
function populateCategories() {
    fetch(CATEGORY_API_URL)
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById("category");
            categorySelect.innerHTML = "";

            for (let i = 0; i < data.trivia_categories.length; i++) {
                const option = document.createElement("option");
                option.value = data.trivia_categories[i].id;
                option.textContent = data.trivia_categories[i].name;
                categorySelect.appendChild(option);
            }
        })
        .catch(error => console.error("Error fetching categories:", error));
}

// Start game setup
document.getElementById("start-button").onclick = () => {
    const category = document.getElementById("category").value;
    startGame(category);
};

function startGame(category) {
    document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-screen").hidden = true;
    document.getElementById("game-screen").hidden = false;
    });
    const triviaUrl = `${TRIVIA_API_BASE_URL}?amount=10&category=${category}`;
    //Questions(triviaUrl);
}

// Fetch all questions
/*function fetchQuestions(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                throw new Error("No questions available.");
            }

            questions = data.results;
            currentQuestionIndex = 0;
            showQuestion();
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
            document.getElementById("question").textContent = "Error fetching questions.";
        });
}*/
 questions = [
    {
        question: "What is the capital of France?",
        correct_answer: "Paris",
        incorrect_answers: ["Berlin", "Madrid", "Rome"]
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        correct_answer: "Harper Lee",
        incorrect_answers: ["Mark Twain", "George Orwell", "J.K. Rowling"]
    },
    {
        question: "What is the largest planet in the Solar System?",
        correct_answer: "Jupiter",
        incorrect_answers: ["Mars", "Earth", "Venus"]
    },
    {
        question: "What is the chemical symbol for water?",
        correct_answer: "H2O",
        incorrect_answers: ["O2", "H2", "HO2"]
    },
    {
        question: "What is the square root of 64?",
        correct_answer: "8",
        incorrect_answers: ["6", "7", "9"]
    },
    {
        question: "What is the longest river in the world?",
        correct_answer: "Nile",
        incorrect_answers: ["Amazon", "Yangtze", "Mississippi"]
    },
    {
        question: "Which year did World War II end?",
        correct_answer: "1945",
        incorrect_answers: ["1940", "1944", "1946"]
    },
    {
        question: "Which planet is known as the Red Planet?",
        correct_answer: "Mars",
        incorrect_answers: ["Venus", "Saturn", "Jupiter"]
    },
    {
        question: "Who painted the Mona Lisa?",
        correct_answer: "Leonardo da Vinci",
        incorrect_answers: ["Michelangelo", "Raphael", "Van Gogh"]
    },
    {
        question: "What is the hardest natural substance on Earth?",
        correct_answer: "Diamond",
        incorrect_answers: ["Gold", "Iron", "Platinum"]
    },
    {
        question: "What is the currency of Japan?",
        correct_answer: "Yen",
        incorrect_answers: ["Won", "Dollar", "Euro"]
    },
    {
        question: "Who developed the theory of relativity?",
        correct_answer: "Albert Einstein",
        incorrect_answers: ["Isaac Newton", "Galileo Galilei", "Nikola Tesla"]
    },
    {
        question: "Which gas do plants use for photosynthesis?",
        correct_answer: "Carbon Dioxide",
        incorrect_answers: ["Oxygen", "Nitrogen", "Methane"]
    },
    {
        question: "What is the smallest continent by land area?",
        correct_answer: "Australia",
        incorrect_answers: ["Europe", "Antarctica", "South America"]
    },
    {
        question: "What is the capital of Canada?",
        correct_answer: "Ottawa",
        incorrect_answers: ["Toronto", "Vancouver", "Montreal"]
    },
    {
        question: "Which metal is the best conductor of electricity?",
        correct_answer: "Silver",
        incorrect_answers: ["Gold", "Copper", "Aluminum"]
    },
    {
        question: "Who is known as the Father of Computers?",
        correct_answer: "Charles Babbage",
        incorrect_answers: ["Alan Turing", "John von Neumann", "Steve Jobs"]
    },
    {
        question: "What is the chemical symbol for gold?",
        correct_answer: "Au",
        incorrect_answers: ["Ag", "Fe", "Pb"]
    },
    {
        question: "How many bones are in the human body?",
        correct_answer: "206",
        incorrect_answers: ["200", "210", "208"]
    },
    {
        question: "Which is the tallest mountain in the world?",
        correct_answer: "Mount Everest",
        incorrect_answers: ["K2", "Kangchenjunga", "Makalu"]
    }
];
// Show current question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").textContent = questionData.question;

    const answersElement = document.getElementById("answers");
    answersElement.innerHTML = "";

    const answers = [...questionData.incorrect_answers, questionData.correct_answer];
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    for (let i = 0; i < answers.length; i++) {
        const button = document.createElement("button");
        button.textContent = answers[i];
        button.onclick = () => checkAnswer(answers[i], questionData.correct_answer);
        answersElement.appendChild(button);
    }

    fetchImage(questionData.correct_answer); // Fetch and display an image
}

// Fetch an image from Pexels
function fetchImage(keyword) {
    fetch(`https://api.pexels.com/v1/search?query=${keyword}&per_page=1`, {
        headers: { Authorization: PEXELS_API_KEY }
    })
        .then(response => response.json())
        .then(data => {
            const imageElement = document.getElementById("image");
            const photo = data.photos[0];

            if (photo) {
                imageElement.src = photo.src.medium;
                imageElement.alt = photo.alt;
                imageElement.hidden = false;
            } else {
                imageElement.hidden = true;
            }
        })
        .catch(error => {
            console.error("Error fetching image:", error);
            document.getElementById("image").hidden = true;
        });
}

// Check the selected answer
function checkAnswer(selected, correct) {
    const feedback = document.getElementById("feedback");
    feedback.textContent = selected === correct ? "Correct!" : `Wrong! The correct answer is: ${correct}`;
    feedback.hidden = false;

    currentQuestionIndex++;
    document.getElementById("next-button").hidden = false;

    document.getElementById("next-button").onclick = () => {
        feedback.hidden = true;
        document.getElementById("next-button").hidden = true;
        showQuestion();
    };
}

// End game
function endGame() {
    document.getElementById("game-screen").hidden = true;
    document.getElementById("end-screen").hidden = false;

    document.getElementById("play-again-button").onclick = () => {
        document.getElementById("end-screen").hidden = true;
        document.getElementById("start-screen").hidden = false;
        clearInterval(timerInterval);
    };
}

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
});
