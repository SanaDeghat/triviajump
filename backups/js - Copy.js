// JavaScript for the enhanced game functionality
const CATEGORY_API_URL = "https://opentdb.com/api_category.php";
const TRIVIA_API_BASE_URL = "https://opentdb.com/api.php";
const PEXELS_API_URL = "https://api.pexels.com/v1/search";
const PEXELS_API_KEY = "YPFvrJcB1kFNPv2joOp3WZeLwACHBhlhRNq0aqubxgGk7mQpXiSJG8wMs"; // Replace with your Pexels API key

let questions = [];
let currentQuestionIndex = 0;
let isJumping = false;
let isGameOver = false;
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const startScreen = document.getElementById("start-screen");
    const dino = document.getElementById("dino");
    const Body = document.getElementById("body");
    const obstacle = document.getElementById("obstacle");
    const gameOverScreen = document.getElementById("gameOver");
    const questionContainer = document.getElementById("question");
    const answersContainer = document.getElementById("answers");
   // const scoreDisplay = document.createElement("div");
    

   // scoreDisplay.id = "score-display";
  //  scoreDisplay.textContent = `Score: ${score}`;
   // Body.appendChild(scoreDisplay);

    // Populate categories
    function populateCategories() {
        fetch(CATEGORY_API_URL)
            .then((response) => response.json())
            .then((data) => {
                const categorySelect = document.getElementById("category");
                categorySelect.innerHTML = "";

                data.trivia_categories.forEach((category) => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch((error) => console.error("Error fetching categories:", error));
    }

    // Start Game
    document.getElementById("start-button").onclick = () => {
        const startScreen = document.getElementById("start-screen");
    
        // Hide start screen and show game container
        Body.innerHTML = `<div class="game-container" >
        <div id="question-container">
            <p id="question">Fetching question...</p>
            <img id="image" hidden>
            <div id="answers"></div>
        </div>

        <div class="ground"></div>
        <div class="dino" id="dino"></div>
        <div class="obstacle" id="obstacle"></div>
        <div class="game-over" id="gameOver" hidden>Game Over</div>
    </div>`;
    
        const category = document.getElementById("category").value;
    
        // Fetch questions and start the game
        fetchQuestions(category).then(() => {
            startObstacleAnimation();
        });
    };
    

    // Fetch Trivia Questions
    function fetchQuestions(category) {
        const triviaUrl = `${TRIVIA_API_BASE_URL}?amount=20&category=${category}`;
        return fetch(triviaUrl)
            .then((response) => response.json())
            .then((data) => {
                questions = data.results;
                currentQuestionIndex = 0;
                showQuestion();
            })
            .catch((error) => console.error("Error fetching trivia questions:", error));
    }

    // Fetch Hint Image
// Fetch an image
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

    // Show Question
    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endGame();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.textContent = currentQuestion.question;
        fetchImage(currentQuestion.correct_answer);

        
        answersContainer.innerHTML = "";
        const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        answers.sort(() => Math.random() - 0.5);

        answers.forEach((answer) => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.onclick = () => {
                dinoJump(); // Dino jumps on any answer
              //  score += 10;
              //  scoreDisplay.textContent = `Score: ${score}`;
                currentQuestionIndex++;
                showQuestion(); // Immediately go to the next question
            };
            answersContainer.appendChild(button);
        });
    }

    // Dino Jump
    function dinoJump() {
        if (isJumping || isGameOver) return;

        isJumping = true;
        dino.classList.add("jump");

        setTimeout(() => {
            dino.classList.remove("jump");
            isJumping = false;
        }, 800); // Longer jump
    }

    // End Game
    function endGame() {
        isGameOver = true;
        gameOverScreen.hidden = false;
        obstacle.style.animationPlayState = "paused";
        document.querySelector(".ground").style.animationPlayState = "paused";
        gameOverScreen.innerHTML = `
            <p>Game Over!</p>
            <p>Your Score: ${score}</p>
            <button id="restart-button">Restart</button>
        `;

        document.getElementById("restart-button").onclick = () => {
            location.reload();
        };
    }

    // Start obstacle animation
    function startObstacleAnimation() {
        obstacle.style.animation = "moveObstacle 3.5s linear infinite"; // Slower obstacle
    }

    // Check Collision
    function checkCollision() {
        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            dinoRect.x < obstacleRect.x + obstacleRect.width &&
            dinoRect.x + dinoRect.width > obstacleRect.x &&
            dinoRect.y < obstacleRect.y + obstacleRect.height &&
            dinoRect.height + dinoRect.y > obstacleRect.y
        ) {
            endGame();
        }
    }

    // Collision Checker Loop
    setInterval(() => {
        if (!isGameOver) checkCollision();
    }, 10);

    // Initialize
    populateCategories();
});
