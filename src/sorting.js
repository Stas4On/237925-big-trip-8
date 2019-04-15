import Component from './component';

export default class Sorting extends Component {
  constructor(data) {
    super();
    this._isChecked = data.isChecked;
    this._name = data.name;
    this._element = null;
    this._onSort = null;

    this._onSortButtonClick = this._onSortButtonClick.bind(this);
  }

  _onSortButtonClick(evt) {
    if (typeof this._onSort === `function`) {
      this._onSort(evt);
    }
  }

  get template() {
    return `<li><input type="radio" name="trip-sorting" id="sorting-${this._name}" value="${this._name}" ${this._isChecked ? `checked` : ``}>
	  <label class="trip-sorting__item trip-sorting__item--${this._name}" for="sorting-${this._name}">${this._name}</label></li>`;
  }

  set onSort(fn) {
    this._onSort = fn;
  }

  bind() {
    console.log(this._element.querySelector(`#sorting-${this._name}`));

    this._element.querySelector(`#sorting-${this._name}`)
      .addEventListener(`change`, this._onSortButtonClick);
  }

  unbind() {
    this._element.querySelector(`#sorting-${this._name}`)
      .removeEventListener(`change`, this._onSortButtonClick);
  }
}
