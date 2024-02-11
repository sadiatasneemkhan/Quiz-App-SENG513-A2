//Question: Represents a single quiz question, 
//including the text, choices, and the correct answer

export default class Question {
    constructor(text, choices, correctAnswer) {
      this.text = text;
      this.choices = choices;
      this.correctAnswer = correctAnswer;
    }
  }
  
  