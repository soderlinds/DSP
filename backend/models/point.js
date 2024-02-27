class Point {
    constructor(userId, amount) {
      this.userId = userId;
      this.amount = amount;
      this.createdAt = new Date();
    }
  }
  
  module.exports = Point;
  