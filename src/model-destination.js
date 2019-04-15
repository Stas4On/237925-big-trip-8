export default class ModelDestination {
  constructor(data) {
    this.name = data.name;
    this.pictures = data.pictures;
    this.description = data.description;
  }

  static parseDescription(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDescription);
  }
}
