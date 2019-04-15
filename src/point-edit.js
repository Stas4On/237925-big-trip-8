import Component from './component';
import utils from './utils';
import flatpickr from "flatpickr";

export default class PointEdit extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._price = data.price;
    this._pictures = data.pictures;
    this._description = data.description;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._offers = data.offers;
    this._isFavorite = data.isFavorite;
    this._element = null;
    this._onSubmit = null;
    this._onDelete = null;
    this._allDestinations = null;
    this._allOffers = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onTypeOptionClick = this._onTypeOptionClick.bind(this);
    // this._onDestinationsOptionClick = this._onDestinationsOptionClick.bind(this);
  }

  _resetOffers(offers) {
    for (const offer of offers) {
      offer.checked = false;
    }

    return offers;
  }

  _processForm(formData) {
    const entry = {
      price: ``,
      type: ``,
      destination: ``,
      time: {
        start: new Date(),
        end: new Date(),
      },
      offers: this._resetOffers(this._offers),
    };

    const pointEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }

    return entry;
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();

    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    const currentForm = this._element.querySelector(`form`);
    const formData = new FormData(currentForm);
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _onTypeOptionClick(evt) {
    const value = evt.target.value;
    const foundOffer = this._allOffers.filter((offer) => offer.type === value)[0];

    this._type = value;
    this._offers = foundOffer.offers;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  // _onDestinationsOptionClick(value) {
  //
  //   const foundDestination = this._allDestinations.filter((destination) => destination.name === value)[0];
  //   // this._destination = foundDestination.name;
  //   this._description = foundDestination.description;
  //   this._pictures = foundDestination.pictures;
  //   this.unbind();
  //   this._partialUpdate();
  //   this.bind();
  // }

  _getPicture(pictures) {
    return pictures.map((picture) => `<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`).join(``);
  }

  _getOptionDestination(destinations) {
    return destinations.map((destination) => `<option class="destination-option" value="${destination.name}"></option>`).join(``);

  }

  _getOffersElement(offers) {
    return offers.map((offer) => `<input class="point__offers-input visually-hidden" type="checkbox" id="${this._splitString(`${offer.name}`)}" name="offer" value="${this._splitString(`${offer.name}`)}" ${offer.checked ? `checked` : ``}>
			<label for="${this._splitString(`${offer.name}`)}" class="point__offers-label">
				<span class="point__offer-service">${offer.name}</span> + €<span class="point__offer-price">${offer.price}</span>
          </label>`).join(``);
  }

  _splitString(str) {
    const strArray = str.split(` `);
    return strArray.map((word) => word.toLowerCase()).join(`-`);
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
        <label class="travel-way__label" for="travel-way__toggle">${utils.getIcons(this._type)}</label>

        <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

        <div class="travel-way__select">
          <div class="travel-way__select-group">
            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
            <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
            <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
            <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight">
            <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
          </div>

          <div class="travel-way__select-group">
            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
            <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sightseeing">
            <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
          </div>
        </div>
      </div>

      <div class="point__destination-wrap">
        <label class="point__destination-label" for="destination">${utils.getCapitalizeWord(this._type)} to</label>
        <input class="point__destination-input" list="destination-select" id="destination" value="${this._destination}" name="destination">
        <datalist id="destination-select">
          ${this._getOptionDestination(this._allDestinations)}
        </datalist>
      </div>

      <label class="point__time" aria-label="choose time">
        <input class="point__input" type="text" value="${utils.getTime(this._time.start)}" name="date-start" placeholder="19:00">
        <span class="point__devider">&mdash;</span>
        <input class="point__input" type="text" value="${utils.getTime(this._time.end)}" name="date-end" placeholder="21:00">
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
        <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
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
          ${this._getPicture(this._pictures)}
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

  set allDestinations(data) {
    this._allDestinations = data;
  }

  set allOffers(data) {
    this._allOffers = data;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  bind() {
    this._element.querySelector(`form`)
    .addEventListener(`submit`, this._onSubmitButtonClick);

    this._element.querySelector(`.point__button[type='reset']`)
    .addEventListener(`click`, this._onDeleteButtonClick);

    const dateStart = this._element.querySelector(`.point__input[name='date-start']`);
    const dateEnd = this._element.querySelector(`.point__input[name='date-end']`);

    flatpickr(dateStart, {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `H:i`
    });
    flatpickr(dateEnd, {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `H:i`
    });

    const optionsType = this._element.querySelectorAll(`.travel-way__select-input`);
    // const destinationInput = this._element.querySelector(`.point__destination-input`);
    //
    // destinationInput.addEventListener(`change`, this._onDestinationsOptionClick(destinationInput.value));

    for (const option of optionsType) {
      if (option.value === this._type) {
        option.checked = true;
      }
      option.addEventListener(`click`, this._onTypeOptionClick);
    }


  }

  unbind() {
    this._element.querySelector(`form`)
    .removeEventListener(`submit`, this._onSubmitButtonClick);

    this._element.querySelector(`.point__button[type="reset"]`)
    .removeEventListener(`click`, this._onDeleteButtonClick);

    const options = this._element.querySelectorAll(`.travel-way__select-input`);

    // const destinationInput = this._element.querySelector(`.point__destination-input`);
    //
    // destinationInput.removeEventListener(`change`, this._onDestinationsOptionClick(destinationInput.value));

    for (const option of options) {
      option.removeEventListener(`click`, this._onTypeOptionClick);
    }
  }

  update(data) {
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  static createMapper(target) {
    return {
      'price': (value) => {
        target.price = +value;
        return target.price;
      },
      'travel-way': (value) => {
        target.type = value;
        return target.type;
      },
      'destination': (value) => {
        target.destination = value;
        return target.destination;
      },
      'date-start': (value) => {
        target.time.start = utils.timeToMs(value);
        return target.time;
      },
      'date-end': (value) => {
        target.time.end = utils.timeToMs(value);
        return target.time;
      },
      'offer': (value) => {
        target.offers = target.offers.map((offer) => {
          const val = value.replace(/-/g, ` `);
          if (val === offer.name.toLowerCase()) {
            offer.checked = true;
          }
          return offer;
        });
      },
    };
  }
}
