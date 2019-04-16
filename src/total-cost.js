import Component from './component';

export default class totalCost extends Component {
  constructor(data) {
    super();
    this._cost = data.cost;
    this._element = null;
  }

  get template() {
    return `<span class="trip__total-cost">Total: &euro;&nbsp;${this._cost}</span>`;
  }

  /*bind() {
    this._element.querySelector(`#filter-${this._name}`)
      .addEventListener(`change`, this._onFilterClick);
  }

  unbind() {
    this._element.querySelector(`#filter-${this._name}`)
      .removeEventListener(`change`, this._onFilterClick);
  }*/
}
