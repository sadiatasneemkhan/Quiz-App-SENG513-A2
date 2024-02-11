import Question from './logic/question.js';
import Quiz from './logic/quiz.js';
import User from './logic/user.js';

const question1 = new Question("What is the capital of France?", ["Paris", "Germany", "Berlin"], "Paris");
console.log(question1.text); // Output: "What is the capital of France?"

const question2 = new Question("What is the largest mammal?", ["Elephant", "Blue whale", "Rabbit"], "Blue whale");
console.log(question2.text); // Output: "What is the largest mammal?"

const quiz = new Quiz([question1, question2]); 
const user = new User("Asma");

/* Asynchronous Data Handling

    1. Fetch a set of questions from Open Trivia DB (https://opentdb.com/)
    2. Process and display questions one at a time in the UI
*/

async function fetchData() {
    const response = await fetch("https://opentdb.com/api.php?amount=50&category=17");
    const data = await response.json();
    console.log(data);
}

fetchData();