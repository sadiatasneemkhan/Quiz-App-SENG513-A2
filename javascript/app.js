
import Question from './question.js';
import Quiz from './quiz.js';
import User from './user.js';

const question1 = new Question("What is the capital of France?", ["Paris", "Germany", "Berlin"], "Paris");
console.log(question1.text); // Output: "What is the capital of France?"

const question2 = new Question("What is the largest mammal?", ["Elephant", "Blue whale", "Rabbit"], "Blue whale");
console.log(question2.text); // Output: "What is the largest mammal?"

const quiz = new Quiz([question1, question2]); 
const user = new User("Asma"); 