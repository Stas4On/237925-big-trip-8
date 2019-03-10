import createElement from '../src/create-element';

export default class Point {
  constructor(data) {
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._offers = data.offers;
    this._element = null;
    this._onEdit = null;

    this._onPointClick = this._onPointClick.bind(this);
  }

  _onPointClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
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

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._type.icon}</i>
          <h3 class="trip-point__title">${this._type.name} to ${[...this._destination][Math.floor(Math.random() * 5)]}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this._getTime(this._time.start)}&nbsp;&mdash; ${this._getTime(this._time.end)}</span>
            <span class="trip-point__duration">${this._getDuration(this._time.start, this._time.end)}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this._getOffers(this._offers)}
          </ul>
        </article>`;
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  _getTime(millisec) {
    let minutes = new Date(millisec).getMinutes();
    let hours = new Date(millisec).getHours();

    hours = (hours >= 10) ? hours : `0` + hours;
    minutes = (minutes >= 10) ? minutes : `0` + minutes;

    return `${hours}:${minutes}`;
  }

  _getDuration(startTime, endTime) {
    const duration = endTime - startTime;
    const minutes = new Date(duration).getMinutes();
    const hours = new Date(duration).getHours();

    return `${hours}h ${minutes}m`;
  }

  _getOffers(offersArray) {
    const OFFERS_ON_PAGE = 2;
    const selectedOffers = [];

    for (let i = offersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [offersArray[i], offersArray[j]] = [offersArray[j], offersArray[i]];
    }
    for (let i = 0; i < OFFERS_ON_PAGE; i++) {
      selectedOffers.push(offersArray[i]);
    }

    return selectedOffers.map((offer) => `<li>
              <button class="trip-point__offer">${offer.name} +&euro;&nbsp;${offer.price}</button>
            </li>`).join(``);
  }
}
