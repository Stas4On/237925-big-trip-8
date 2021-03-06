import ModelPoint from './models/point';
import ModelDestination from "./models/destination";
import ModelOffer from './models/offer';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getPoint() {
    return this._load({url: `points`})
    .then(toJSON)
    .then(ModelPoint.parseAll);
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(toJSON)
    .then(ModelPoint.parseOne);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(toJSON)
    .then(ModelPoint.parseOne);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then(toJSON)
    .then(ModelDestination.parseAll);
  }

  getOffers() {
    return this._load({url: `offers`})
    .then(toJSON)
    .then(ModelOffer.parseAll);
  }
}
