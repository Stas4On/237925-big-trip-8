import Point from '../src/point';
import PointEdit from '../src/point-edit';
import API from '../src/api';
import Filter from '../src/filter';
import TotalCost from '../src/total-cost';
import statistic from '../src/statistic';
import moment from "moment";
import Day from './day';
import Sorter from "./sorter";
import ModelPoint from './models/point';

const BAR_HEIGHT = 55;
const LABELS_FOR_STAT_MONEY = [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`];
const LABELS_FOR_STAT_TRANSPORT = [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`];
const AUTHORIZATION = `Basic dXNlcjpwYXNzd29yZA==${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const mainBlock = document.querySelector(`.main`);
const tripDayContainer = document.querySelector(`.trip-points`);
const statisticBlock = document.querySelector(`.statistic`);
const viewSwitches = document.querySelectorAll(`.view-switch__item`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeCtx = document.querySelector(`.statistic__time-spend`);
const newEventButton = document.querySelector(`.new-event`);

const filtersList = {
  names: [
    `everything`,
    `future`,
    `past`,
  ],
  isChecked: `everything`,
};
const sortingList = {
  names: [
    `event`,
    `time`,
    `price`,
  ],
  isChecked: `event`,
};

const newPointData = {
  isFavorite: false,
  type: `taxi`,
  description: ``,
  pictures: [],
  time: {
    start: Date.now(),
    end: Date.now()
  },
  price: 0,
  offers: [],
  destination: ``,
};

let dataPoints = null;
let destinations = null;
let offers = null;
let filteredPoints = null;
let sortedPoints = null;

tripDayContainer.innerHTML = `Loading route...`;

moneyCtx.height = BAR_HEIGHT * 6;
transportCtx.height = BAR_HEIGHT * 4;

const getSortedTripPointsByDay = (points) => {
  let result = {};
  for (let point of points) {
    const day = moment(point.time.start).format(`D MMM YY`);

    if (!result[day]) {
      result[day] = [];
    }

    result[day].push(point);
  }

  return result;
};

const renderDays = (days) => {
  tripDayContainer.innerHTML = ``;
  const pointSortedDay = getSortedTripPointsByDay(days);

  Object.entries(pointSortedDay).forEach((points) => {
    const [day, eventList] = points;
    const dayTripPoints = new Day(day).render();

    tripDayContainer.appendChild(dayTripPoints);

    const distEvents = dayTripPoints.querySelector(`.trip-day__items`);
    renderPoints(eventList, distEvents);
  });
};

const renderPoints = (points, container) => {
  container.innerHTML = ``;

  for (const point of points) {
    const pointComponent = new Point(point);
    const pointEditComponent = new PointEdit(point);

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

      pointEditComponent.lockSave();
      pointEditComponent.hideError();

      api.updatePoint({id: point.id, data: point.toServerData()})
      .then((newPoint) => {
        pointEditComponent.unlockSave();
        pointEditComponent.unlockDelete();
        pointComponent.update(newPoint);
        pointComponent.render();
        container.replaceChild(pointComponent.element, pointEditComponent.element);
        pointEditComponent.unrender();
        setTotalCost(dataPoints);
      })
      .catch(() => {
        pointEditComponent.shake();
        pointEditComponent.unlockSave();
        pointEditComponent.showError();
      });
    };

    pointEditComponent.onDelete = (({id}) => {

      pointEditComponent.lockDelete();

      api.deletePoint({id})
      .then(() => api.getPoint())
      .then((response) => {
        renderDays(response);
        setTotalCost(response);
      })
      .then(() => {
        pointEditComponent.unrender();
      })
      .catch(() => {
        pointEditComponent.shake();
        pointEditComponent.unlockDelete();
        pointEditComponent.showError();
      });
    });

    pointEditComponent.onKeydownEsc = () => {
      pointComponent.render(tripDayContainer);
      container.replaceChild(pointComponent.element, pointEditComponent.element);
      pointEditComponent.unrender();
    };

    container.appendChild(pointComponent.render());
  }
};

const filterPoints = (points, filterName) => {
  switch (filterName) {
    case `future`:
      return points.filter((point) => moment(point.time.start).isAfter(moment(), `day`));

    case `past`:
      return points.filter((point) => moment(point.time.start).isBefore(moment(), `day`));

    default:
      return points;
  }
};

const sortPoints = (points, sortName) => {
  const comparePrice = (a, b) => {
    return b.price - a.price;
  };

  const compareTime = (a, b) => {
    return a.time.start - b.time.start;
  };

  const compareInterval = (a, b) => {
    return (b.time.end - b.time.start) - (a.time.end - a.time.start);
  };

  switch (sortName) {
    case `time`:
      return points.sort(compareInterval);

    case `price`:
      return points.sort(comparePrice);

    default:
      return points.sort(compareTime);
  }
};

const renderFilter = (dataFilters) => {
  const container = document.querySelector(`.trip-filter__list`);

  container.innerHTML = ``;

  for (const name of dataFilters.names) {
    const filter = {
      name,
      isChecked: dataFilters.isChecked === name
    };
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.id.split(`-`)[1];
      filtersList.isChecked = filterName;
      if (sortedPoints === null) {
        sortedPoints = sortPoints(dataPoints, sortingList.isChecked);
      }

      filteredPoints = filterPoints(sortedPoints, filterName);
      renderDays(filteredPoints);
      renderStatistic(filteredPoints);
    };

    container.appendChild(filterComponent.render());
  }
};

const renderStatistic = (points) => {
  const dataMoney = getMoneyStatData(points, LABELS_FOR_STAT_MONEY);
  const dataTransport = getTransportStatData(points, LABELS_FOR_STAT_TRANSPORT);
  const dataTime = getTimeStatData(points);

  statistic.moneyChart(moneyCtx, LABELS_FOR_STAT_MONEY, dataMoney);
  statistic.transportChart(transportCtx, LABELS_FOR_STAT_TRANSPORT, dataTransport);
  statistic.timeSpendChart(timeCtx, dataTime.labels, dataTime.data);
};

const renderSort = (dataSort) => {
  const container = document.querySelector(`.trip-sorting__list`);

  container.innerHTML = ``;

  for (const name of dataSort.names) {
    const sort = {
      name,
      isChecked: dataSort.isChecked === name
    };
    const sortingComponent = new Sorter(sort);

    sortingComponent.onSort = (evt) => {
      const sortName = evt.target.id.split(`-`)[1];
      sortingList.isChecked = sortName;

      if (!filteredPoints) {
        filteredPoints = filterPoints(dataPoints, filtersList.isChecked);
      }

      sortedPoints = sortPoints(filteredPoints, sortName);
      renderDays(sortedPoints);
    };

    container.appendChild(sortingComponent.render());
  }
};

const setTotalCost = (points) => {
  const container = document.querySelector(`.trip__total`);
  let total = {
    cost: 0
  };

  container.innerHTML = ``;

  for (const point of points) {
    total.cost += point.price;

    for (const offer of point.offers) {
      if (offer.checked) {
        total.cost += offer.price;
      }
    }
  }

  const totalCostComponent = new TotalCost(total);

  container.appendChild(totalCostComponent.render());
};

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

const getTimeStatData = (points) => {
  const values = [];
  const labels = [];

  for (const point of points) {
    const contains = labels.indexOf(point.type);
    const start = moment(+point.time.start);
    const end = moment(+point.time.end);
    const hours = end.diff(start, `hour`, true);

    if (contains === -1) {
      labels.push(point.type);
      values.push(hours);
    } else {
      values[contains] += hours;
    }
  }

  return {labels, data: values.map((value) => Math.round(value))};
};

newEventButton.addEventListener(`click`, () => {
  newEventButton.disabled = true;

  const point = ModelPoint.parseOne(newPointData);
  const newPointEditComponent = new PointEdit(point);

  newPointEditComponent.allDestinations = destinations;
  newPointEditComponent.allOffers = offers;

  tripDayContainer.insertBefore(newPointEditComponent.render(), tripDayContainer.firstChild);

  newPointEditComponent.onSubmit = (newObject) => {
    point.price = newObject.price;
    point.type = newObject.type;
    point.isFavorite = newObject.isFavorite;
    point.destination = newObject.destination;
    point.pictures = newObject.pictures;
    point.description = newObject.description;
    point.time = newObject.time;
    point.offers = newObject.offers;

    newPointEditComponent.lockSave();
    newPointEditComponent.hideError();

    api.createPoint({point: point.toServerData()})
    .then(() => {
      newPointEditComponent.unlockSave();
    })
    .then(() => api.getPoint())
    .then((points) => {
      dataPoints = points;
      renderDays(points);
      newEventButton.disabled = false;
      newPointEditComponent.unrender();
      setTotalCost(points);
    })
    .catch(() => {
      newPointEditComponent.shake();
      newPointEditComponent.unlockSave();
      newPointEditComponent.showError();
    });
  };
  newPointEditComponent.onDelete = () => {
    newPointEditComponent.lockDelete();
    newPointEditComponent.unrender();
    renderDays(dataPoints);
    newEventButton.disabled = false;
  };

  newPointEditComponent.onKeydownEsc = () => {
    newPointEditComponent.unlockDelete();
    newPointEditComponent.unrender();
    renderDays(dataPoints);
    newEventButton.disabled = false;
  };
});

document.addEventListener(`DOMContentLoaded`, () => {
  renderFilter(filtersList);
  renderSort(sortingList);

  for (const control of viewSwitches) {
    control.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      document.querySelector(`.view-switch__item--active`).classList.remove(`view-switch__item--active`);
      evt.target.classList.add(`view-switch__item--active`);

      switch (evt.target.hash) {
        case `#stats`:
          mainBlock.classList.add(`visually-hidden`);
          statisticBlock.classList.remove(`visually-hidden`);
          renderStatistic(dataPoints);
          break;

        case `#table`:
          mainBlock.classList.remove(`visually-hidden`);
          statisticBlock.classList.add(`visually-hidden`);
      }
    });
  }

  Promise.all([api.getPoint(), api.getDestinations(), api.getOffers()])
  .then(([responsePoints, responseDestinations, responseOffers]) => {
    dataPoints = responsePoints;
    destinations = responseDestinations;
    offers = responseOffers;
  })
  .then(() => {
    renderDays(dataPoints);
    setTotalCost(dataPoints);
  })
  .catch(() => {
    tripDayContainer.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
});
