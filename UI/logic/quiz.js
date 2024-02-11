//Quiz: Manages the overall quiz operations like starting 
// the quiz, keeping score, and determining the next question.

class Quiz {
    constructor(questions) {
      this.questions = questions;
      this.currentQuestionIndex = 0;
      this.score = 0;
    }
}
  export default Quiz;
  