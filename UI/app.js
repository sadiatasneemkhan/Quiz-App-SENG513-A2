
import Question from './logic/question.js';
import Quiz from './logic/quiz.js';
import User from './logic/user.js';

const question1 = new Question("What is the capital of France?", ["Paris", "Germany", "Berlin"], "Paris");
console.log(question1.text); // Output: "What is the capital of France?"

const question2 = new Question("What is the largest mammal?", ["Elephant", "Blue whale", "Rabbit"], "Blue whale");
console.log(question2.text); // Output: "What is the largest mammal?"

const quiz = new Quiz([question1, question2]); 
const user = new User("Asma"); 

/* Dynamic Question Generator

    Create a generator function to manage the flow of quiz 
    questions (e.g., use `yield` to control presentation and
    user input to proceed to the next question)
*/

function* dynamicGenerator(){

    let id = 11;

    while (true){

        yield id;
        id++
    }
}

const generatorObject = dynamicGenerator();
console.log(generatorObject.next());
console.log(generatorObject.next());
console.log(generatorObject.next());
console.log(generatorObject.next());
//console.log(generatorObject.throw(new Error("Error message")));

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