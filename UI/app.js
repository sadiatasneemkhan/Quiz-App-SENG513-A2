class Question {
  constructor(qNum, question, choices, correctAnswer) {
    this.qNum = qNum;
    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
  }

  isCorrectAnswer(choice) {
    //true if the answer was correct, else false
    return this.answer === choice;
  }
}

/* Asynchronous Data Handling

    1. Fetch a set of questions from Open Trivia DB (https://opentdb.com/)
    2. Process and display questions one at a time in the UI
*/
//let's make a few global variables
let totalQuestions = 10;
let currentDifficulty = "easy";

//need async function so it actually waits for results before going into quesiton
async function initializeQuiz() {
  //create user
  const user = new User("Haniya");
  const questions = await fetchData(quizVariables.currentDifficulty);
  const quiz = new Quiz(questions);
  quiz.adjustDifficulty.call(quizVariables);
  quiz.getNextQuestion.call(quizVariables);
  //   quiz.endQuiz.call(user.addScore);
}

initializeQuiz();

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

// processData();
