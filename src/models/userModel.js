export default class UserModel {
  constructor() {
    this.userId = "";
    this.password = "";
    this.labels = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}