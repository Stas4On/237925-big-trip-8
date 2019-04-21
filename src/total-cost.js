import Component from './component';

export default class TotalCost extends Component {
  constructor(data) {
    super();
    this._cost = data.cost;
  }

  get template() {
    return `<span class="trip__total-cost">Total: &euro;&nbsp;${this._cost}</span>`;
  }
}
