import Component from './component';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._isChecked = data.isChecked;
    this._name = data.name;
    this._element = null;
    this._onFilter = null;

    this._onFilterClick = this._onFilterClick.bind(this);
  }

  _onFilterClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  get template() {
    return `<li><input 
            type="radio" 
            id="filter-${this._name}" 
            name="filter" 
            value="${this._name}" 
            ${this._isChecked ? `checked` : ``}>
            <label class="trip-filter__item" 
            for="filter-${this._name}">${this._name}</label></li>>`;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  bind() {
    console.log(this._element);
    this._element.querySelector(`.trip-filter__item`)
      .addEventListener(`click `, this._onFilterClick);
  }

  unbind() {
    this._element.querySelector(`.trip-filter__item`)
      .removeEventListener(`click `, this._onFilterClick);
  }
}
