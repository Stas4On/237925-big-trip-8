import utils from '../src/utils';
import ModelPoint from './models/point';

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  updatePoint({id, data}) {
    if (this._isOnline()) {
      return this._api.updatePoint({id, data})
        .then((point) => {
          this._store.setItem({key: point.id, item: point.toServerData()});

          return point;
        });
    } else {
      const point = data;

      this._needSync = true;
      this._store.setItem({key: point.id, item: point});

      return Promise.resolve(ModelPoint.parseOne(point));
    }
  }

  createPoint({point}) {
    if (this._isOnline()) {
      return this._api.createPoint({point})
        .then((point) => {
          this._store.setItem({key: point.id, item: point.toServerData()});

          return point;
        });
    } else {
      point.id = this._generateId();
      this._needSync = true;

      this._store.setItem({key: point.key, item: point});
      return Promise.resolve(ModelPoint.parseOne(point));
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});

      return Promise.resolve(true);
    }
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.map((point) => this._store.setItem({key: point.id, item: point.toServerData()}));
          return points;
        });
    } else {
      const rawPointsMap = this._store.getAll();
      const rawPoints = utils.objectToArray(rawPointsMap);
      const points = ModelPoint.parseAll(rawPoints);

      return Promise.resolve(points);
    }
  }

  syncPoints() {
    return this._api.syncPoints({points: utils.objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  _generateId() {
    return Math.random();
  }
};
