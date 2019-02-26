import makeFilter from '../src/make-filter.js';
import makePoint from '../src/make-trip-point';

const BEGIN_COUNTER = 7;
const MIN_VALUE_COUNTER = 1;
const MAX_VALUE_COUNTER = 10; // Не включая

const renderPoints = (dist, counter) => {
  const points = new Array(counter)
    .fill()
    .map(makePoint);
  dist.insertAdjacentHTML(`beforeend`, points.join(``));
};

const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const filters = document.querySelector(`.trip-filter`);

filters.insertAdjacentHTML(`beforeend`, makeFilter(`everything`, true));
filters.insertAdjacentHTML(`beforeend`, makeFilter(`future`));
filters.insertAdjacentHTML(`beforeend`, makeFilter(`past`));

const pointsContainer = document.querySelector(`.trip-day__items`);

renderPoints(pointsContainer, BEGIN_COUNTER);

const filterList = document.querySelectorAll(`.trip-filter__item`);

for (let i = 0; i < filterList.length; i++) {
  filterList[i].addEventListener(`click`, () => {
    const input = filterList[i].previousElementSibling;

    if (!input.checked) {
      pointsContainer.innerHTML = ``;
      renderPoints(pointsContainer, getRandom(MIN_VALUE_COUNTER, MAX_VALUE_COUNTER));
    }
  });
}
