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

const renderPoints = (points) => {
  pointsContainer.innerHTML = ``;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const pointComponent = new Point(point);
    const pointEditComponent = new PointEdit(point);

    pointComponent.onEdit = () => {
      pointEditComponent.render();
      pointsContainer.replaceChild(pointEditComponent.element, pointComponent.element);
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
      pointsContainer.replaceChild(pointComponent.element, pointEditComponent.element);
      pointEditComponent.unrender();
    };

    pointEditComponent.onDelete = () => {
      point.isDeleted = true;
      pointComponent.delete();
      console.log(pointComponent.element);
      console.log(pointEditComponent.element);

      // pointsContainer.replaceChild(pointComponent.element, pointEditComponent.element);
      pointEditComponent.unrender();
    };

    if (!point.isDeleted) {
      pointsContainer.appendChild(pointComponent.render());
    }
  }
};

const filterList = document.querySelectorAll(`.trip-filter__item`);

for (let i = 0; i < filterList.length; i++) {
  filterList[i].addEventListener(`click`, () => {
    const input = filterList[i].previousElementSibling;

    if (!input.checked) {
      console.log(dataPoints);
      renderPoints(dataPoints);
    }
  });
}

renderPoints(dataPoints);
