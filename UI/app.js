//GLOBAL BUTTON CHECKERSS/GETTERS

const startButton = document.getElementById("start-quiz");
const quizPage = document.getElementById("actual-question");

//QUESTION CLASS
class Question {
  constructor(question, choices, correctAnswer) {
    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
  }

  isCorrectAnswer(choice) {
    //true if the answer was correct, else false
    return this.correctAnswer === choice;
  }
}

/* Asynchronous Data Handling

    1. Fetch a set of questions from Open Trivia DB (https://opentdb.com/)
    2. Process and display questions one at a time in the UI
*/

//GLOBAL VARS
//let's make a few global variables
let totalQuestions = 10;
let currentDifficulty = "easy";
// const startQuizButton =

//QUIZ CLASS

class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.score = 0;
    this.questionIndex = 0;
    this.correctStreak = 0; //to update difficulty
  }

  getQuestion() {
    //returns 1 question object
    return this.questions[this.questionIndex];
  }

  guess(answer) {
    if (this.getQuestion().isCorrectAnswer(answer)) {
      this.score++;
      this.correctStreak++;
    } else {
      this.correctStreak = 0; //reset streak
    }
    this.adjustDifficulty(); //adjust difficulty
    this.questionIndex++;
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
    // Add more conditions as needed for finer control over difficulty adjustments
  }

  isEnded() {
    console.log("quiz ended");
    console.log(`question ${this.questionIndex + 1}`);
    console.log(`question length is ${this.questions.length}`);
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
        //map all questions out
        return data.results.map(
          (q) =>
            new Question(
              q.question,
              [...q.incorrect_answers, q.correct_answer],
              q.correct_answer,
              console.log("question", q)
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
  //quiz ended - display final score
  if (quiz.isEnded()) {
    const percentage = (quiz.score / totalQuestions) * 100;
    // document.getElementById("final-score").innerHTML = percentage + "%";
    // document.getElementById("total-score").innerHTML =
    //   quiz.score + "/" + totalQuestions + " Questions";
  } else {
    //continue quiz and display questions
    let currentQuestion = quiz.getQuestion();
    console.log(currentQuestion);
    if (quizPage) {
      quizPage.innerHTML = currentQuestion.question.concat(currentDifficulty);
    }
    for (let i = 0; i < currentQuestion.choices.length; i++) {
      const optionButton = document.getElementById(`option${i + 1}`);
      if (optionButton) {
        optionButton.textContent = currentQuestion.choices[i];
      }
    }
  }
}

async function startQuiz() {
  const questions = await fetchData(currentDifficulty);
  window.quiz = new Quiz(questions);
  const boundFunction = displayQuiz(quiz);
  if (startButton) {
    startButton.addEventListener("click", boundFunction);
  }
}
document.addEventListener("DOMContentLoaded", startQuiz);

// //need async function so it actually waits for results before going into quesiton
// async function initializeQuiz() {
//   //create user
//   const user = new User("Haniya");
//   const questions = await fetchData(quizVariables.currentDifficulty);
//   const quiz = new Quiz(questions);
//   quiz.adjustDifficulty.call(quizVariables);
//   quiz.getNextQuestion.call(quizVariables);
//   //   quiz.endQuiz.call(user.addScore);
// }

// initializeQuiz();

// async function processData() {
//   try {
//     const questionData = await fetchData();
//     console.log("Question Data:", questionData); // Loggin the fetched data

//     if (questionData.results && questionData.results.length > 0) {
//       const question = questionData.results[0].question;
//       const options = questionData.results[0].incorrect_answers.concat(
//         questionData.results[0].correct_answer
//       );

//       // Shuffle the options
//       options.sort(() => Math.random() - 0.5);

//       document.getElementById("actual-question").innerHTML = question;

//       // Update option buttons in UI
//       for (let i = 0; i < options.length; i++) {
//         const optionButton = document.getElementById(`option${i + 1}`);
//         if (optionButton) {
//           optionButton.textContent = options[i];
//         } else {
//           console.error(`Option button with id 'option${i + 1}' not found.`);
//         }
//       }
//     } else {
//       console.error("No question data found.");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }
