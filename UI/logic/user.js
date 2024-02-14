//User: Represents a user taking the quiz and
//could include properties like username and score history

class User {
  constructor(username) {
    this.username = username;
    this.scoreHistory = [];
  }

  addScore(score) {
    this.scoreHistory.push(score);
  }

  getScoreHistory() {
    return this.scoreHistory;
  }
}
export default User;
