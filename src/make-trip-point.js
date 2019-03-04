const OFFERS_ON_PAGE = 2;

export default (point) => `<article class="trip-point">
          <i class="trip-icon">${point.type.icon}</i>
          <h3 class="trip-point__title">${point.type.name} to ${[...point.destination][Math.floor(Math.random() * 5)]}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${getTime(point.time.start)}&nbsp;&mdash; ${getTime(point.time.end)}</span>
            <span class="trip-point__duration">${getDuration(point.time.start, point.time.end)}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${point.price}</p>
          <ul class="trip-point__offers">
            ${getOffers(point.offers, OFFERS_ON_PAGE)}
          </ul>
        </article>`;

const getTime = (millisec) => {
  let minutes = new Date(millisec).getMinutes();
  let hours = new Date(millisec).getHours();

  hours = (hours >= 10) ? hours : `0` + hours;
  minutes = (minutes >= 10) ? minutes : `0` + minutes;

  return hours + `:` + minutes;
};

const getDuration = (startTime, endTime) => {
  const duration = endTime - startTime;
  const minutes = new Date(duration).getMinutes();
  const hours = new Date(duration).getHours();

  return hours + `h ` + minutes + `m`;
};

const getOffers = (offersArray, countOffers) => {
  const selectedOffers = [];
  for (let i = 0; i < countOffers; i++) {
    selectedOffers.push(offersArray[Math.floor(Math.random() * offersArray.length)]);
  }

  return selectedOffers.map((offer) => `<li>
              <button class="trip-point__offer">${offer.name} +&euro;&nbsp;${offer.price}</button>
            </li>`).join(``);
};
