import Component from './component';

export default class Sorter extends Component {
  constructor(data) {
    super();
    this._isChecked = data.isChecked;
    this._name = data.name;
    this._element = null;
    this._onSort = null;

    this._onClick = this._onClick.bind(this);
  }

  get template() {
    return `<li><input type="radio" name="trip-sorting" id="sorting-${this._name}" value="${this._name}" ${this._isChecked ? `checked` : ``}>
	  <label class="trip-sorting__item trip-sorting__item--${this._name}" for="sorting-${this._name}">${this._name}</label></li>`;
  }

  set onSort(fn) {
    this._onSort = fn;
  }

  _onClick(evt) {
    if (typeof this._onSort === `function`) {
      this._onSort(evt);
    }
  }

  bind() {
    this._element.querySelector(`#sorting-${this._name}`)
      .addEventListener(`change`, this._onClick);
  }

  unbind() {
    this._element.querySelector(`#sorting-${this._name}`)
      .removeEventListener(`change`, this._onClick);
  }
}
