import makeFilter from '../src/make-filter.js';
import Point from '../src/point';
import PointEdit from '../src/point-edit';
import getData from '../src/get-data';
import statistic from '../src/statistic';
import moment from "moment";

const BAR_HEIGHT = 55;
const LABELS_FOR_STAT_MONEY = [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`];
const LABELS_FOR_STAT_TRANSPORT = [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`];

const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const mainBlock = document.querySelector(`.main`);
const statisticBlock = document.querySelector(`.statistic`);
const pointsContainer = document.querySelector(`.trip-day__items`);
const viewSwitches = document.querySelectorAll(`.view-switch__item`);
const filters = document.querySelector(`.trip-filter`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);

moneyCtx.height = BAR_HEIGHT * 6;
transportCtx.height = BAR_HEIGHT * 4;

filters.insertAdjacentHTML(`beforeend`, makeFilter(`everything`, true));
filters.insertAdjacentHTML(`beforeend`, makeFilter(`future`));
filters.insertAdjacentHTML(`beforeend`, makeFilter(`past`));

const numberPoints = getRandom(1, 8);

const getRandomPoints = (number, func) => {
  const resultPoint = [];

  for (let i = 0; i <= number; i++) {
    resultPoint.push(func());
  }

  return resultPoint;
};

const dataPoints = getRandomPoints(numberPoints, getData);

const renderPoints = (points, container) => {
  container.innerHTML = ``;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const pointComponent = new Point(point);
    const pointEditComponent = new PointEdit(point);

    pointComponent.onEdit = () => {
      pointEditComponent.render();
      container.replaceChild(pointEditComponent.element, pointComponent.element);
      pointComponent.unrender();
    };

    pointEditComponent.onSubmit = (newObject) => {
      point.price = newObject.price;
      point.type = newObject.type;
      point.destination = newObject.destination;
      point.time = newObject.time;
      point.offers = newObject.offers;

      pointComponent.update(point);
      pointComponent.render();
      container.replaceChild(pointComponent.element, pointEditComponent.element);
      pointEditComponent.unrender();
    };

    pointEditComponent.onDelete = () => {
      point.isDeleted = true;
      pointComponent.delete();
      pointEditComponent.unrender();
    };

    if (!point.isDeleted) {
      container.appendChild(pointComponent.render());
    }
  }
};

const filterPoints = (points, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return points;

    case `filter-future`:
      return points.filter((it) => moment(it.date).isAfter(moment(), 'day'));

    case `filter-past`:
      return points.filter((it) => moment(it.date).isBefore(moment(), 'day'));

    default:
      return points;
  }
};

filters.onchange = (evt) => {
  const filterName = evt.target.id;
  const filteredTasks = filterPoints(dataPoints, filterName);
  renderPoints(filteredTasks, pointsContainer);

  const dataMoney = getMoneyStatData(filteredTasks, LABELS_FOR_STAT_MONEY);
  const dataTransport = getTransportStatData(filteredTasks, LABELS_FOR_STAT_TRANSPORT);

  statistic.moneyChart(moneyCtx, LABELS_FOR_STAT_MONEY, dataMoney);
  statistic.transportChart(transportCtx, LABELS_FOR_STAT_TRANSPORT, dataTransport);
};

renderPoints(dataPoints, pointsContainer);

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
      case `Flight`:
        resultArray[formatedLabels.indexOf(`FLY`)] += 1;
        break;

      case `Taxi`:
      case `Bus`:
      case `Train`:
      case `Transport`:
        resultArray[formatedLabels.indexOf(`RIDE`)] += 1;
        break;

      case `Drive`:
        resultArray[formatedLabels.indexOf(`DRIVE`)] += 1;
        break;

      case `Ship`:
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
      case `Flight`:
        resultArray[formatedLabels.indexOf(`FLY`)] += point.price;
        break;

      case `Check-in`:
        resultArray[formatedLabels.indexOf(`STAY`)] += point.price;
        break;

      case `Drive`:
        resultArray[formatedLabels.indexOf(`DRIVE`)] += point.price;
        break;

      case `Sightseeing`:
        resultArray[formatedLabels.indexOf(`LOOK`)] += point.price;
        break;

      case `Restaurant`:
        resultArray[formatedLabels.indexOf(`EAT`)] += point.price;
        break;

      default:
        resultArray[formatedLabels.length - 1] += point.price;
        break;
    }
  }

  return resultArray;
};
