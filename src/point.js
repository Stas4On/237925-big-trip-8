import Component from './component';
import utils from './utils';

export default class Point extends Component {
  constructor(data) {
    super();
    this._price = data.price;
    this._type = data.type;
    this._icons = data.icons;
    this._destination = data.destination;
    this._time = data.time;
    this._offers = data.offers;
    this._element = null;
    this._onEdit = null;

    this._onPointClick = this._onPointClick.bind(this);
  }

  _setOffersStatus(offers, checkedOffers) {
    const offersArray = [];

    checkedOffers.forEach((offer) => {
      const formattedOffer = offer.split(`-`).join(` `);
      offersArray.push(formattedOffer);
    });

    for (const offer of offers) {
      offer.checked = offersArray.indexOf(offer.name.toLowerCase()) !== -1;
    }

    return offers;
  }

  _onPointClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  _getOffers(offersArray) {
    const selectedOffers = [];

    for (let i = 0; i < offersArray.length; i++) {
      if (offersArray[i].checked) {
        selectedOffers.push(offersArray[i]);
      }
    }

    return selectedOffers.map((offer) => `<li>
              <button class="trip-point__offer">${offer.name} +&euro;&nbsp;${offer.price}</button>
            </li>`).join(``);
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${utils.getIcons(this._icons, this._type)}</i>
          <h3 class="trip-point__title">${this._type} to ${[...this._destination][Math.floor(Math.random() * 5)]}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${utils.getTime(this._time.start)}&nbsp;&mdash; ${utils.getTime(this._time.end)}</span>
            <span class="trip-point__duration">${utils.getDuration(this._time.start, this._time.end)}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this._getOffers(this._offers)}
          </ul>
        </article>`;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  bind() {
    this._element.closest(`.trip-point`)
      .addEventListener(`click`, this._onPointClick);
  }

  unbind() {
    this._element.closest(`.trip-point`)
      .removeEventListener(`click`, this._onPointClick);
  }

  update(data) {
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._time = utils.parseTimeInterval(data.time);
    this._offers = this._setOffersStatus(this._offers, data.offers);
  }
}
