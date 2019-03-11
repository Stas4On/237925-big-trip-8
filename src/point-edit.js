import createElement from '../src/create-element';

export default class PointEdit {
  constructor(data) {
    this._price = data.price;
    this._picture = data.picture;
    this._description = data.description;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._offers = data.offers;
    this._element = null;
    this._onSubmit = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  _getTime(millisec) {
    let minutes = new Date(millisec).getMinutes();
    let hours = new Date(millisec).getHours();

    hours = (hours >= 10) ? hours : `0` + hours;
    minutes = (minutes >= 10) ? minutes : `0` + minutes;

    return `${hours}:${minutes}`;
  }

  _getPicture(links) {
    return links.map((link) => `<img src="${link}" alt="picture from place" class="point__destination-image">`).join(``);
  }

  _getOptionDestination(destinations) {
    return [...destinations].map((destination) => `<option value="${destination}"></option>`).join(``);

  }

  _getOffersElement(offers) {
    return offers.map((offer) => `<input class="point__offers-input visually-hidden" type="checkbox" id="${this._splitString(`${offer.name}`)}" name="offer" value="${this._splitString(`${offer.name}`)}">
			<label for="${this._splitString(`${offer.name}`)}" class="point__offers-label">
				<span class="point__offer-service">${offer.name}</span> + €<span class="point__offer-price">${offer.price}</span>
          </label>`).join(``);
  }

  _splitString(str) {
    const strArray = str.split(` `);
    return strArray.map((word) => word.toLowerCase()).join(`-`);
  }

  get element() {
    return this._element;
  }

  get template() {
    return `<article class="point">
  <form action="" method="get">
    <header class="point__header">
      <label class="point__date">
        choose day
        <input class="point__input" type="text" placeholder="MAR 18" name="day">
      </label>

      <div class="travel-way">
        <label class="travel-way__label" for="travel-way__toggle">${this._type.icon}</label>

        <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

        <div class="travel-way__select">
          <div class="travel-way__select-group">
            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
            <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
            <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
            <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train" checked>
            <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
          </div>

          <div class="travel-way__select-group">
            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
            <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
            <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
          </div>
        </div>
      </div>

      <div class="point__destination-wrap">
        <label class="point__destination-label" for="destination">${this._type.name} to</label>
        <input class="point__destination-input" list="destination-select" id="destination" value="Chamonix" name="destination">
        <datalist id="destination-select">
          ${this._getOptionDestination(this._destination)}
        </datalist>
      </div>

      <label class="point__time">
        choose time
        <input class="point__input" type="text" value="${this._getTime(this._time.start)} — ${this._getTime(this._time.end)}" name="time" placeholder="00:00 — 00:00">
      </label>

      <label class="point__price">
        write price
        <span class="point__price-currency">€</span>
        <input class="point__input" type="text" value="${this._price}" name="price">
      </label>

      <div class="point__buttons">
        <button class="point__button point__button--save" type="submit">Save</button>
        <button class="point__button" type="reset">Delete</button>
      </div>

      <div class="paint__favorite-wrap">
        <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
        <label class="point__favorite" for="favorite">favorite</label>
      </div>
    </header>

    <section class="point__details">
      <section class="point__offers">
        <h3 class="point__details-title">offers</h3>

        <div class="point__offers-wrap">
          ${this._getOffersElement(this._offers)}
        </div>

      </section>
      <section class="point__destination">
        <h3 class="point__details-title">Destination</h3>
        <p class="point__destination-text">${this._description}</p>
        <div class="point__destination-images">
          ${this._getPicture(this._picture)}
        </div>
      </section>
      <input type="hidden" class="point__total-price" name="total-price" value="">
    </section>
  </form>
</article>
`;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  bind() {
    this._element.querySelector(`form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
  }

  unbind() {
    this._element.querySelector(`form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }
}
