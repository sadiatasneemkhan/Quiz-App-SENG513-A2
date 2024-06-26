//GLOBAL BUTTON CHECKERS/GETTERS
const startButton = document.getElementById("start-quiz");
const quizPage = document.getElementById("actual-question");
const currentScore = document.getElementById("current-score");
let totalQuestions = 10;
let currentDifficulty = "easy";

function decodeHTML(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\\u([\dA-Fa-f]{4})/g, (match, grp) =>
      String.fromCharCode(parseInt(grp, 16))
    );
}

//QUESTION CLASS
class Question {
  constructor(question, choices, correctAnswer) {
    choices = choices.sort(() => Math.random() - 0.5);
    this.question = decodeHTML(question);
    this.choices = choices.map((choice) => decodeHTML(choice));
    this.correctAnswer = decodeHTML(correctAnswer);
  }

  isCorrectAnswer(choice) {
    //true if the answer was correct, else false
    return this.correctAnswer === choice;
  }
}

//USER CLASS
class User {
  constructor(username) {
    this.username = username;
    this.scoreHistory = [];
  }

  addScore(score) {
    this.scoreHistory.push(score);
  }

  getScore() {
    return this.scoreHistory;
  }
}

//QUIZ CLASS
class Quiz {
  constructor(questions) {
    this.questions = questions || [];
    this.score = 0;
    this.questionIndex = 0;
    this.correctStreak = 0; //to update difficulty
  }

  getScore() {
    return this.score;
  }

  getQuestion() {
    //returns 1 question object
    return this.questions[this.questionIndex];
  }

  guess(answer) {
    const currentQuestion = this.getQuestion();
    let bool_val = false;
    if (currentQuestion.isCorrectAnswer(answer)) {
      bool_val = true;
      this.score++;
      this.correctStreak++;
      console.log(
        `Correct answer woohoo! Current difficulty level: ${currentDifficulty}`
      );
    } else {
      this.correctStreak = 0; //reset streak
      console.log(
        `Incorrect answer, streak broken. Current difficulty level: ${currentDifficulty}`
      );
    }
    this.adjustDifficulty();
    this.questionIndex++;
    return bool_val;
  }

  adjustDifficulty() {
    //increase difficulty if at least 2 questions right.
    if (this.correctStreak >= 2 && currentDifficulty === "easy") {
      currentDifficulty = "medium";
      console.log("increasing difficulty to Medium");
    } else if (this.correctStreak >= 2 && currentDifficulty === "medium") {
      currentDifficulty = "hard";
      console.log("increasing difficulty to Hard");
      //decrease difficulty if streak lost
    } else if (this.correctStreak === 0 && currentDifficulty === "hard") {
      currentDifficulty = "medium";
      console.log("streak lost. decreasing difficulty to Medium");
    } else if (this.correctStreak == 0 && currentDifficulty === "medium") {
      currentDifficulty = "easy";
      console.log("streak lost. decreasing difficulty to Easy");
    }
  }

  isEnded() {
    return this.questionIndex === this.questions.length;
  }
}

//FETCHING DATA
async function fetchData(currentDifficulty) {
  const maxRetries = 3; // Max number of retries
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=9&difficulty=${currentDifficulty}&type=multiple`
      );

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || 10; // Default to 10 seconds
        console.log(
          `Rate limit exceeded. Retrying after ${retryAfter} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Waiting before retrying
        retryCount++;
      } else {
        const data = await response.json();
        return data.results.map(
          (q) =>
            new Question(
              q.question,
              [...q.incorrect_answers, q.correct_answer],
              q.correct_answer
            )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  throw new Error("Max retries exceeded. Unable to fetch data."); // Throw an error if max retries are reached
}

function displayQuiz(quiz) {
  if (quiz.isEnded()) {
    // Quiz ended, navigate to score page
    const percentage = (quiz.score / totalQuestions) * 100;
    const score = quiz.score;
    localStorage.setItem("quizScore", quiz.score * 10);
    window.location.href = `page4.html?score=${score}`; // Navigate to score page with score as query parameter
    user.addScore(score);
    console.log(`${user.username}'s score history:`, user.getScore());
  } else {
    // Continue quiz and display questions
    let currentQuestion = quiz.getQuestion();

    // Display question text
    const questionElement = document.getElementById("actual-question");
    questionElement.textContent = currentQuestion.question;

    // Clear previous answer buttons
    const answerButtons = document.getElementById("answer-buttons");
    answerButtons.innerHTML = "";

    // Update question number
    const questionNumberElement = document.getElementById("question-number");
    questionNumberElement.textContent = `Question ${quiz.questionIndex + 1}`; // Update question number dynamically

    if (currentScore) {
      currentScore.innerHTML = quiz.getScore();
    }

    // Display answer option buttons
    currentQuestion.choices.forEach((choice, index) => {
      const optionButton = document.createElement("button");
      optionButton.textContent = choice;
      optionButton.id = "option" + (index + 1);
      optionButton.className = "btn btn-tertiary";
      optionButton.addEventListener("click", () => {
        if (quiz.guess(choice)) {
          console.log(true);
          optionButton.classList.replace("btn-tertiary", "btn-success"); // If correct, turn green
        } else {
          optionButton.classList.replace("btn-tertiary", "btn-danger");
        }

        setTimeout(() => {
          displayQuiz(quiz);
        }, 2000);
      });
      answerButtons.appendChild(optionButton);
    });
  }
}

// Start quiz function
async function startQuiz() {
  const user = new User("Hadia");
  const questions = await fetchData(currentDifficulty);
  const quiz = new Quiz(questions);
  displayQuiz(quiz);

  if (startButton) {
    startButton.addEventListener("click", () => {
      displayQuiz(quiz);
    });
  }
}

document.addEventListener("DOMContentLoaded", startQuiz);
