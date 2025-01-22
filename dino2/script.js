const PEXELS_API_KEY = "YPFvrJcB1kFNPv2joOp3WZeLwACHBhlhRNq0aqubxgGk7mQpXiSJG8wMs"; // Replace with your Pexels API key
const TRIVIA_API_BASE_URL = "https://opentdb.com/api.php";

let currentQuestionIndex = 0;
let questions = [];

document.getElementById("start-button").onclick = () => {
  const startScreen = document.getElementById("start-screen");

  // Replace start screen with game div
  startScreen.innerHTML = `
    <div id="game">
      <div id="question-container">
        <p id="question">Fetching question...</p>
        <img id="question-image" hidden>
        <div id="answers">
          <!-- Answers will be dynamically populated -->
        </div>
      </div>
      <div class="ground"></div>
      <div class="dino"></div>
    </div>
  `;

  // Start the game by fetching questions
  const category = document.getElementById("category").value;
  fetchQuestions(category);
};

// Fetch Trivia Questions
function fetchQuestions(category) {
  const triviaUrl = `${TRIVIA_API_BASE_URL}?amount=10&category=${category}`;
  fetch(triviaUrl)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
      currentQuestionIndex = 0;
      showQuestion();
    })
    .catch((error) => console.error("Error fetching trivia questions:", error));
}

// Fetch Hint Image from Pexels API
function fetchImage(keyword) {
  fetch(`https://api.pexels.com/v1/search?query=${keyword}&per_page=1`, {
    headers: { Authorization: PEXELS_API_KEY },
  })
    .then((response) => response.json())
    .then((data) => {
      const imageElement = document.getElementById("question-image");
      const photo = data.photos[0];

      if (photo) {
        imageElement.src = photo.src.medium;
        imageElement.alt = photo.alt;
        imageElement.hidden = false;
      } else {
        imageElement.hidden = true;
      }
    })
    .catch((error) => {
      console.error("Error fetching image:", error);
      document.getElementById("question-image").hidden = true;
    });
}

// Show a Question
function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endGame();
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionContainer = document.getElementById("question");
  const answersContainer = document.getElementById("answers");

  // Update the question text
  questionContainer.textContent = currentQuestion.question;

  // Fetch and display an image hint
  fetchImage(currentQuestion.correct_answer);

  // Shuffle answers
  const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
  answers.sort(() => Math.random() - 0.5);

  // Clear previous answers and add new ones
  answersContainer.innerHTML = "";
  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.onclick = () => handleAnswer(answer === currentQuestion.correct_answer);
    answersContainer.appendChild(button);
  });
}

// Handle Answer Selection
function handleAnswer(isCorrect) {
  if (isCorrect) {
    alert("Correct!");
  } else {
    alert("Wrong!");
  }

  currentQuestionIndex++;
  showQuestion();
}

// End Game
function endGame() {
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = `
    <div id="end-screen">
      <h1>Game Over!</h1>
      <p>Thanks for playing!</p>
      <button id="restart-button">Restart</button>
    </div>
  `;

  document.getElementById("restart-button").onclick = () => {
    location.reload();
  };
}
