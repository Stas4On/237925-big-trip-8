import Component from './component';
import utils from './utils';

export default class Point extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._offers = data.offers;
    this._element = null;
    this._onEdit = null;

    this._onPointClick = this._onPointClick.bind(this);
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${utils.getIcons(this._type)}</i>
          <h3 class="trip-point__title">${utils.getCapitalizeWord(this._type)} to ${this._destination}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${utils.getTime(this._time.start)}&nbsp;&mdash; ${utils.getTime(this._time.end)}</span>
            <span class="trip-point__duration">${utils.getDuration(this._time.start, this._time.end)}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${Point.getOffers(this._offers)}
          </ul>
        </article>`;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  _onPointClick(evt) {
    evt.stopPropagation();
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  update(data) {
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._offers = data.offers;
  }

  bind() {
    this._element.closest(`.trip-point`)
      .addEventListener(`click`, this._onPointClick);
  }

  unbind() {
    this._element.closest(`.trip-point`)
      .removeEventListener(`click`, this._onPointClick);
  }

  static getOffers(offersArray) {
    const selectedOffers = [];

    for (const offer of offersArray) {
      if (offer.checked) {
        selectedOffers.push(offer);
      }
    }

    return selectedOffers.map((offer) => `<li class="trip-point__offer-item">
              <button class="trip-point__offer">${offer.name} +&euro;&nbsp;${offer.price}</button>
            </li>`).join(``);
  }
}
