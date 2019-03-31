import constants from "./constants";
import moment from "moment";

export default () => ({
  price: Math.floor(Math.random() * 10) * 10 + 10,
  picture: [
    `http://picsum.photos/330/140?r=${Math.random()}`,
    `http://picsum.photos/300/200?r=${Math.random()}`,
    `http://picsum.photos/300/100?r=${Math.random()}`,
    `http://picsum.photos/200/300?r=${Math.random()}`,
    `http://picsum.photos/100/300?r=${Math.random()}`,
  ],
  description: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus`,
  ][Math.floor(Math.random() * 10)],
  type: getRandomType(),
  destination: getDestinationRandom(),
  date: getRandomDate(),
  time: {
    start: Date.now() + 60 * 60 * 1000,
    end: Date.now() + Math.floor(Math.random() * 7 + 1) * 60 * 60 * 1000,
  },
  offers: [
    {name: `Add luggage`, price: 20, checked: true},
    {name: `Switch to comfort class`, price: 30, checked: false},
    {name: `Add meal`, price: 10, checked: false},
    {name: `Choose seats`, price: 15, checked: true},
  ],
  isDeleted: false,
});

const getRandomType = () => {
  const randomType = constants.TYPE[Math.floor(Math.random() * 10)];

  return randomType.name;
};

const getDestinationRandom = () => {
  return [...constants.DESTINATION][Math.floor(Math.random() * 5)];
};

const getRandomDate = () => {
  const randomNumber = Math.random();

  if (randomNumber < 0.33) {
    return moment().subtract(1, `days`);
  } else if (randomNumber > 0.33 && randomNumber < 0.67) {
    return moment();
  } else {
    return moment().add(1, `days`);
  }
};
