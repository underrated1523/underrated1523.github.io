export default class AnimeTierModel {
  constructor() {
    this.userId = "";
    this.animeId = 0;
    this.animeTitle = "";
    this.image = "";
    this.order = 0;
    this.labelName = "";
    this.comment = "";
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}