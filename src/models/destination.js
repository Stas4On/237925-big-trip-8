export default class Destination {
  constructor(data) {
    this.name = data.name;
    this.pictures = data.pictures;
    this.description = data.description;
  }

  static parseOne(data) {
    return new Destination(data);
  }

  static parseAll(data) {
    return data.map(Destination.parseOne);
  }
}
