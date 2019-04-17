import Point from '../src/point';
import PointEdit from '../src/point-edit';
import API from '../src/api';
import Filter from '../src/filter';
import totalCost from '../src/total-cost'
import getData from './get-data';
import statistic from '../src/statistic';
import moment from "moment";
import constants from "./constants";
import Sorting from "./sorting";
import ModelPoint from './model-point';

const BAR_HEIGHT = 55;
const LABELS_FOR_STAT_MONEY = [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`];
const LABELS_FOR_STAT_TRANSPORT = [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`];
const AUTHORIZATION = `Basic dXNlcjpwYXNzd29yZA==${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const mainBlock = document.querySelector(`.main`);
const tripTotal = document.querySelector(`.trip__total`);
const statisticBlock = document.querySelector(`.statistic`);
const viewSwitches = document.querySelectorAll(`.view-switch__item`);
const filters = document.querySelector(`.trip-filter__list`);
const tripSorting = document.querySelector(`.trip-sorting__list`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const newEvent = document.querySelector(`.new-event`);
let dataPoints;
let destinations;
let offers;

moneyCtx.height = BAR_HEIGHT * 6;
transportCtx.height = BAR_HEIGHT * 4;

const renderPoints = (points, destinations, offers) => {
  const container = document.querySelector(`.trip-day__items`);
  container.innerHTML = ``;

  for (const point of points) {
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

    const exit = (evt) => {
      if (evt.keyCode === 27) {
        evt.preventDefault();
        removeHandler();

        pointComponent.render();
        container.replaceChild(pointComponent.element, pointEditComponent.element);
        pointEditComponent.unrender();
      }
    };

    const removeHandler = () => {
      window.removeEventListener(`keydown`, exit);
    }

    pointComponent.onEdit = () => {
      pointEditComponent.render();
      container.replaceChild(pointEditComponent.element, pointComponent.element);
      pointComponent.unrender();

      window.addEventListener(`keydown`, exit);
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
    return b.price - a.price;
  };

  const compareId = (a, b) => {
    return a.id - b.id;
  };

  const compareTime = (a, b) => {
    return (b.time.end - b.time.start) - (a.time.end - a.time.start);
  };

  switch (sortName) {
    case `sorting-event`:
      return points.sort(compareId);

    case `sorting-time`:
      return points.sort(compareTime);

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
      renderPoints(filteredTasks, destinations, offers);

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
      const sortedPoints = sortPoints(dataPoints, sortName);
      renderPoints(sortedPoints, destinations, offers);
    };

    container.appendChild(sortingComponent.render());
  }
};

const renderTotalCost = (points, container) => {
  container.innerHTML = ``;
  let total = {
    cost: 0
  };

  for (const point of points) {
    total.cost += point.price;

    for (const offer of point.offers) {
      if(offer.checked) {
        total.cost += offer.price;
      }
    }
  }

  const totalCostComponent = new totalCost(total);

  container.appendChild(totalCostComponent.render());
}

renderFilter(getData().filters, filters);
renderSort(getData().sorting, tripSorting);

const getServerData = async () => {
  await api.getDestination()
  .then((data) => {
    destinations = data;
  });

  await api.getOffers()
  .then((data) => {
    offers = data;
  });

  api.getPoint()
  .then((points) => {
    dataPoints = points;
    renderPoints(points, destinations, offers);
    renderTotalCost(points, tripTotal);
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

const renderNewPoints = () => {
  const container = document.querySelector(`.trip-day__items`);
  const point = ModelPoint.parsePoint(getData().newPoint);
  const pointComponent = new Point(point);
  const pointEditComponent = new PointEdit(point);
  pointEditComponent.allDestinations = destinations;
  pointEditComponent.allOffers = offers;

  container.insertBefore(pointEditComponent.render(), container.firstChild);

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
    // hideError();
    console.log(point.toServerData());
    api.createPoint({point: point.toServerData()})
      .then((newPoint) => {
        console.log(newPoint);
        unblock();
        // pointComponent.update(newPoint);
        // pointComponent.render();
        // container.replaceChild(pointComponent.element, pointEditComponent.element);
        // pointEditComponent.unrender();
      })
      .catch(() => {
        pointEditComponent.shake();
        unblock();
        // showError();
      });
  };
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

newEvent.addEventListener(`click`, renderNewPoints);
