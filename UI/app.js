import Question from "./logic/question.js";
import Quiz from "./logic/quiz.js";
import User from "./logic/user.js";

const question1 = new Question(
  "What is the capital of France?",
  ["Paris", "Germany", "Berlin"],
  "Paris"
);
console.log(question1.text); // Output: "What is the capital of France?"

const question2 = new Question(
  "What is the largest mammal?",
  ["Elephant", "Blue whale", "Rabbit"],
  "Blue whale"
);
console.log(question2.text); // Output: "What is the largest mammal?"

const quiz = new Quiz([question1, question2]);
const user = new User("Asma");

/* Asynchronous Data Handling

    1. Fetch a set of questions from Open Trivia DB (https://opentdb.com/)
    2. Process and display questions one at a time in the UI
*/

async function fetchData() {
    const maxRetries = 3; // Max number of retries
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=50&category=27&type=multiple");
            
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After') || 10; // Default to 10 seconds
                console.log(`Rate limit exceeded. Retrying after ${retryAfter} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000)); // Waiting before retrying
                retryCount++;
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error; 
        }
    }
    
    throw new Error("Max retries exceeded. Unable to fetch data."); // Throw an error if max retries are reached
}


async function processData(){
    try {
        const questionData = await fetchData();
        console.log("Question Data:", questionData); // Loggin the fetched data

        if (questionData.results && questionData.results.length > 0) {
            const question = questionData.results[0].question;
            const options = questionData.results[0].incorrect_answers.concat(questionData.results[0].correct_answer);
            
            // Shuffle the options
            options.sort(() => Math.random() - 0.5);
            
            document.getElementById("actual-question").innerHTML = question;

            // Update option buttons in UI
            for (let i = 0; i < options.length; i++) {
                const optionButton = document.getElementById(`option${i + 1}`);
                if (optionButton) {
                    optionButton.textContent = options[i];
                } else {
                    console.error(`Option button with id 'option${i + 1}' not found.`);
                }
            }
        } else {
            console.error("No question data found.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

processData();
