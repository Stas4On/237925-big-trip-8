import Component from './component';
import utils from './utils';

export default class FilterEverything extends Component {
  constructor(data) {
    super();
    this._isChecked = data.isChecked;
    this._name = null;
    this._element = null;
    this._onFilter = null;

    this._onFilterClick = this._onFilter.bind(this);
  }

  _onFilterClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  get template() {
    return `<input 
            type="radio" 
            id="filter-${this._name}" 
            name="filter" 
            value="${this._name}" 
            ${this._isChecked ? `checked` : ``}>
                    
            <label class="trip-filter__item" 
            for="filter-${this._name}">${this._name}</label>`;
  }

  set onFilter(fn) {
    this._onFilter = fn;
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
    this._time = data.time;
    this._offers = data.offers;
  }

}
