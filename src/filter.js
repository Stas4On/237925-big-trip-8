import Component from './component';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._isChecked = data.isChecked;
    this._name = data.name;
    this._element = null;
    this._onFilter = null;

    this._onClick = this._onClick.bind(this);
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

  _onClick(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  bind() {
    this._element.querySelector(`#filter-${this._name}`)
      .addEventListener(`change`, this._onClick);
  }

  unbind() {
    this._element.querySelector(`#filter-${this._name}`)
      .removeEventListener(`change`, this._onClick);
  }
}
