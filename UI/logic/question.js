//Question: Represents a single quiz question,
//including the text, choices, and the correct answer
const questionButton = document.getElementById("actual-question");

export default class Question {
  constructor(qNum, question, choices, correctAnswer) {
    this.qNum = qNum;
    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
  }

  initializeUI() {
    if (questionButton) {
      document.getElementById(
        "question-number"
      ).innerHTML = `Question ${this.qNum}`;
      questionButton.innerHTML = this.question;
      for (let i = 0; i < 4; i++) {
        const optionButton = document.getElementById(`options${i + 1}`);
        if (optionButton) {
          optionButton.textContent = this.choices[i];
        } else {
          console.error(`Option button with id 'option${i + 1}' not found.`);
        }
      }
    }
  }

  checkAnswer(answer) {
    //returns true if answer was correct, and false if it was incorrect
    return answer == this.correctAnswer;
  }
}
