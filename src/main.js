import makeFilter from '../src/make-filter.js';
import Point from '../src/point';
import PointEdit from '../src/point-edit';
import getData from '../src/get-data';

const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const filters = document.querySelector(`.trip-filter`);

filters.insertAdjacentHTML(`beforeend`, makeFilter(`everything`, true));
filters.insertAdjacentHTML(`beforeend`, makeFilter(`future`));
filters.insertAdjacentHTML(`beforeend`, makeFilter(`past`));

const pointsContainer = document.querySelector(`.trip-day__items`);

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
      return points.filter((it) => it.date > Date.now());

    case `filter-past`:
      return points.filter((it) => it.date < Date.now());
  }
};

filters.onchange = (evt) => {
  const filterName = evt.target.id;
  const filteredTasks = filterPoints(dataPoints, filterName);
  renderPoints(filteredTasks, pointsContainer);
};

renderPoints(dataPoints, pointsContainer);
