import Point from '../src/point';
import PointEdit from '../src/point-edit';
import API from '../src/api';
import Filter from '../src/filter';
import getData from './get-data';
import statistic from '../src/statistic';
import moment from "moment";
import Sorting from "./sorting";

const BAR_HEIGHT = 55;
const LABELS_FOR_STAT_MONEY = [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`];
const LABELS_FOR_STAT_TRANSPORT = [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`];
const AUTHORIZATION = `Basic dXNlcjpwYXNzd29yZA==${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const mainBlock = document.querySelector(`.main`);
const statisticBlock = document.querySelector(`.statistic`);
const viewSwitches = document.querySelectorAll(`.view-switch__item`);
const filters = document.querySelector(`.trip-filter__list`);
const tripSorting = document.querySelector(`.trip-sorting__list`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
let dataPoints;

moneyCtx.height = BAR_HEIGHT * 6;
transportCtx.height = BAR_HEIGHT * 4;

const renderPoints = (points, destinations, offers) => {
  const container = document.querySelector(`.trip-day__items`);
  container.innerHTML = ``;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const pointComponent = new Point(point);
    const pointEditComponent = new PointEdit(point);

    const showError = () => {
      const cardPoint = pointEditComponent.element.closest(`.point`);
      cardPoint.style.boxShadow = `0 11px 20px 0 rgba(0,0,0,0.22), 0 0 0 1px red`;
    };

    const hideError = () => {
      const cardPoint = pointEditComponent.element.closest(`.point`);
      cardPoint.style.boxShadow = `0 11px 20px 0 rgba(0,0,0,0.22)`;
    };

    pointComponent.onEdit = () => {
      pointEditComponent.render();
      container.replaceChild(pointEditComponent.element, pointComponent.element);
      pointComponent.unrender();
    };

    pointEditComponent.allDestinations = destinations;
    pointEditComponent.allOffers = offers;

    pointEditComponent.onSubmit = (newObject) => {
      point.price = newObject.price;
      point.type = newObject.type;
      point.destination = newObject.destination;
      point.time = newObject.time;
      point.offers = newObject.offers;

      const block = () => {
        const buttonSubmit = pointEditComponent.element.querySelector(`.point__button[type='submit']`);
        buttonSubmit.disabled = true;
        buttonSubmit.textContent = `Saving...`;
        pointEditComponent.element.querySelector(`.point__button[type='reset']`).disabled = true;
      };

      const unblock = () => {
        const buttonSubmit = pointEditComponent.element.querySelector(`.point__button[type='submit']`);
        buttonSubmit.disabled = false;
        buttonSubmit.textContent = `Save`;
        pointEditComponent.element.querySelector(`.point__button[type='reset']`).disabled = false;
      };

      block();
      hideError();

      api.updatePoint({id: point.id, data: point.toServerData()})
      .then((newPoint) => {
        unblock();
        pointComponent.update(newPoint);
        pointComponent.render();
        container.replaceChild(pointComponent.element, pointEditComponent.element);
        pointEditComponent.unrender();
      })
      .catch(() => {
        pointEditComponent.shake();
        unblock();
        showError();
      });
    };

    pointEditComponent.onDelete = (({id}) => {
      const block = () => {
        const buttonDelete = pointEditComponent.element.querySelector(`.point__button[type='reset']`);
        buttonDelete.disabled = true;
        buttonDelete.textContent = `Deleting...`;
        pointEditComponent.element.querySelector(`.point__button[type='submit']`).disabled = true;
      };

      const unblock = () => {
        const buttonDelete = pointEditComponent.element.querySelector(`.point__button[type='reset']`);
        buttonDelete.disabled = false;
        buttonDelete.textContent = `Delete`;
        pointEditComponent.element.querySelector(`.point__button[type='submit']`).disabled = false;
      };

      block();
      api.deletePoint({id})
      .then(() => api.getPoint())
      .then(getServerData)
      .catch(() => {
        pointEditComponent.shake();
        unblock();
        showError();
      });
    });

    container.appendChild(pointComponent.render());
  }
};

const filterPoints = (points, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return points;

    case `filter-future`:
      return points.filter((point) => moment(point.time.start).isAfter(moment(), `day`));

    case `filter-past`:
      return points.filter((point) => moment(point.time.start).isBefore(moment(), `day`));

    default:
      return points;
  }
};

const sortPoints = (points, sortName) => {
  const comparePrice = (a, b) => {
    return a.price - b.price;
  };

  const compareId = (a, b) => {
    return a.id - b.id;
  };

  switch (sortName) {
    case `sorting-event`:
      return points.sort(compareId);

    case `sorting-time`:
      return points.filter((point) => moment(point.time.start).isAfter(moment(), `day`));

    case `sorting-price`:
      return points.sort(comparePrice);

    default:
      return points;
  }
};

const renderFilter = (dataFilters, container) => {
  container.innerHTML = ``;

  for (let i = 0; i < dataFilters.names.length; i++) {
    const filter = {
      name: dataFilters.names[i],
      isChecked: dataFilters.isChecked === dataFilters.names[i]
    };
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.id;
      const filteredTasks = filterPoints(dataPoints, filterName);
      renderPoints(filteredTasks);

      const dataMoney = getMoneyStatData(filteredTasks, LABELS_FOR_STAT_MONEY);
      const dataTransport = getTransportStatData(filteredTasks, LABELS_FOR_STAT_TRANSPORT);

      statistic.moneyChart(moneyCtx, LABELS_FOR_STAT_MONEY, dataMoney);
      statistic.transportChart(transportCtx, LABELS_FOR_STAT_TRANSPORT, dataTransport);
    };

    container.appendChild(filterComponent.render());
  }
};

const renderSort = (dataSort, container) => {
  container.innerHTML = ``;

  for (let i = 0; i < dataSort.names.length; i++) {
    const sort = {
      name: dataSort.names[i],
      isChecked: dataSort.isChecked === dataSort.names[i]
    };
    const sortingComponent = new Sorting(sort);

    sortingComponent.onSort = (evt) => {
      const sortName = evt.target.id;
      const sortedTasks = sortPoints(dataPoints, sortName);
      renderPoints(sortedTasks);
    };

    container.appendChild(sortingComponent.render());
  }
};

renderFilter(getData().filters, filters);
renderSort(getData().sorting, tripSorting);

const getServerData = async () => {
  const destinations = await api.getDestination()
  .then((data) => {
    return data;
  });

  const offers = await api.getOffers()
  .then((data) => {
    return data;
  });

  api.getPoint()
  .then((points) => {
    dataPoints = points;
    renderPoints(points, destinations, offers);
  });
};

getServerData();

for (const control of viewSwitches) {
  control.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    document.querySelector(`.view-switch__item--active`).classList.remove(`view-switch__item--active`);
    evt.target.classList.add(`view-switch__item--active`);

    switch (evt.target.hash) {
      case `#stats`:
        mainBlock.classList.add(`visually-hidden`);
        statisticBlock.classList.remove(`visually-hidden`);
        const dataMoney = getMoneyStatData(dataPoints, LABELS_FOR_STAT_MONEY);
        const dataTransport = getTransportStatData(dataPoints, LABELS_FOR_STAT_TRANSPORT);

        statistic.moneyChart(moneyCtx, LABELS_FOR_STAT_MONEY, dataMoney);
        statistic.transportChart(transportCtx, LABELS_FOR_STAT_TRANSPORT, dataTransport);
        break;

      case `#table`:
        mainBlock.classList.remove(`visually-hidden`);
        statisticBlock.classList.add(`visually-hidden`);
    }
  });
}

const getTransportStatData = (points, labels) => {
  const resultArray = new Array(labels.length).fill(0);
  const formatedLabels = labels.map((label) => {
    return label.split(` `)[1];
  });

  for (const point of points) {
    switch (point.type) {
      case `flight`:
        resultArray[formatedLabels.indexOf(`FLY`)] += 1;
        break;

      case `taxi`:
      case `bus`:
      case `train`:
      case `transport`:
        resultArray[formatedLabels.indexOf(`RIDE`)] += 1;
        break;

      case `drive`:
        resultArray[formatedLabels.indexOf(`DRIVE`)] += 1;
        break;

      case `ship`:
        resultArray[formatedLabels.indexOf(`SAIL`)] += 1;
        break;
    }
  }

  return resultArray;
};

const getMoneyStatData = (points, labels) => {
  const resultArray = new Array(labels.length).fill(0);
  const formatedLabels = labels.map((label) => {
    return label.split(` `)[1];
  });

  for (const point of points) {
    switch (point.type) {
      case `flight`:
        resultArray[formatedLabels.indexOf(`FLY`)] += point.price;
        break;

      case `check-in`:
        resultArray[formatedLabels.indexOf(`STAY`)] += point.price;
        break;

      case `drive`:
        resultArray[formatedLabels.indexOf(`DRIVE`)] += point.price;
        break;

      case `sightseeing`:
        resultArray[formatedLabels.indexOf(`LOOK`)] += point.price;
        break;

      case `restaurant`:
        resultArray[formatedLabels.indexOf(`EAT`)] += point.price;
        break;

      default:
        resultArray[formatedLabels.length - 1] += point.price;
        break;
    }
  }

  return resultArray;
};
