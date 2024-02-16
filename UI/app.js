//GLOBAL BUTTON CHECKERS/GETTERS
const startButton = document.getElementById("start-quiz");
const quizPage = document.getElementById("actual-question");
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
    this.scoreHistory = this.scoreHistory;
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

  getQuestion() {
    //returns 1 question object
    return this.questions[this.questionIndex];
  }

  guess(answer) {
    const currentQuestion = this.getQuestion();
    if (currentQuestion.isCorrectAnswer(answer)) {
      this.score++;
      this.correctStreak++;
      console.log("Correct answer woohoo!")
    } else {
      this.correctStreak = 0; //reset streak
      console.log("Incorrect answer, streak broken")
    }
    this.questionIndex++;
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
    console.log(user);
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

    // Display answer option buttons
    currentQuestion.choices.forEach((choice, index) => {
      const optionButton = document.createElement("button");
      optionButton.textContent = choice;
      optionButton.id = "option" + (index + 1);
      optionButton.className = "btn btn-tertiary";
      optionButton.addEventListener("click", () => {
        quiz.guess(choice);
        displayQuiz(quiz);
      });
      answerButtons.appendChild(optionButton);
    });
  }
}

const user = new User("Hadia");
// Start quiz function
async function startQuiz() {
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
