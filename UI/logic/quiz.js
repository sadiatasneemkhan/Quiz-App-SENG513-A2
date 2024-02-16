//Quiz: Manages the overall quiz operations like starting
// the quiz, keeping score, and determining the next question.
import Question from "./question.js";
import fetchData from "./fetchData.js";

// const
// let shuffledQuestions, currentQuestionIndex;

//global button elements
const questionButton = document.getElementById("actual-question");

class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.initializeUI();
  }

  initializeUI() {
    const startButton = document.getElementById("start-quiz");
    if (startButton) {
      startButton.addEventListener("click", this.startQuiz);
    }
  }

  async startQuiz() {
    console.log("quiz startedddd suckaaaaaaa");
    this.getNextQuestion();
  }

  getNextQuestion() {
    if (this.currentQuestionIndex < this.totalQuestions) {
      this.displayCurrentQuestion();
    } else {
      // this.endQuiz();
    }
  }

  displayCurrentQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    console.log(q);
    new Question(
      this.currentQuestionIndex + 1,
      q.question,
      [...q.incorrect_answers, q.incorrect_answer],
      q.correct_answer
    );
    this.currentQuestionIndex++;
  }

  adjustDifficulty() {}

  updateStreak() {
    this.streak++;
    this.score++;
  }

  getScore() {
    return this.score;
  }

  // endQuiz() {
  //   console.log("Quiz ended");
  //   this.addScore(score);
  //   //go to final score page
  //   window.location.href = "page4.html";
  // }
}
export default Quiz;
