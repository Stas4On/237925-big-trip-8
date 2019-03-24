import makeFilter from '../src/make-filter.js';
import Point from '../src/point';
import PointEdit from '../src/point-edit';
import getData from '../src/get-data';

const filters = document.querySelector(`.trip-filter`);

filters.insertAdjacentHTML(`beforeend`, makeFilter(`everything`, true));
filters.insertAdjacentHTML(`beforeend`, makeFilter(`future`));
filters.insertAdjacentHTML(`beforeend`, makeFilter(`past`));

const pointsContainer = document.querySelector(`.trip-day__items`);

const dataPoint = getData();
const pointComponent = new Point(dataPoint);
const pointEditComponent = new PointEdit(dataPoint);

pointsContainer.appendChild(pointComponent.render());

pointComponent.onEdit = () => {
  pointEditComponent.render();
  pointsContainer.replaceChild(pointEditComponent.element, pointComponent.element);
  pointComponent.unrender();
};

pointEditComponent.onSubmit = (newObject) => {
  dataPoint.price = newObject.price;
  dataPoint.type = newObject.type;
  dataPoint.destination = newObject.destination;
  dataPoint.time = newObject.time;
  dataPoint.offers = newObject.offers;

  pointComponent.update(dataPoint);
  pointComponent.render();
  pointsContainer.replaceChild(pointComponent.element, pointEditComponent.element);
  pointEditComponent.unrender();
};

const filterList = document.querySelectorAll(`.trip-filter__item`);

for (let i = 0; i < filterList.length; i++) {
  filterList[i].addEventListener(`click`, () => {
    const input = filterList[i].previousElementSibling;

    if (!input.checked) {
      pointsContainer.innerHTML = ``;
      const newPoint = new Point(getData());
      pointsContainer.appendChild(newPoint.render());
    }
  });
}
