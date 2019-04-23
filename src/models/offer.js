export default class Offer {
  constructor(data) {
    this.type = data.type;
    this.offers = data.offers;
  }

  static parseOne(data) {
    return new Offer(data);
  }

  static parseAll(data) {
    return data.map(Offer.parseOne);
  }
}
