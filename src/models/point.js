export default class Point {
  constructor(data) {
    this.id = data.id;
    this.price = data.base_price || 0;
    this.pictures = data.destination.pictures || [];
    this.description = data.destination.description || ``;
    this.type = data.type;
    this.destination = data.destination.name || ``;
    this.time = {
      start: data.date_from || Date.now(),
      end: data.date_to || Date.now()
    };
    this.offers = data.offers.map((offer) => {
      return {
        name: offer.title,
        price: offer.price,
        checked: offer.accepted
      };
    });
    this.isFavorite = data.isFavorite || false;
  }

  toServerData() {
    return {
      'id': this.id,
      'base_price': this.price,
      'destination': {
        name: this.destination,
        description: this.description,
        pictures: this.pictures
      },
      'offers': this.offers.map((offer) => {
        return {
          title: offer.name,
          price: offer.price,
          accepted: offer.checked
        };
      }),
      'date_from': +this.time.start,
      'date_to': +this.time.end,
      'is_favorite': this.isFavorite,
      'type': this.type
    };
  }

  static parseOne(data) {
    return new Point(data);
  }

  static parseAll(data) {
    return data.map(Point.parseOne);
  }
}
