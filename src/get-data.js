export default () => ({
  price: Math.floor(Math.random() * 10) * 10 + 10,
  picture: [
    `http://picsum.photos/330/140?r=${Math.random()}`,
    `http://picsum.photos/300/200?r=${Math.random()}`,
    `http://picsum.photos/300/100?r=${Math.random()}`,
    `http://picsum.photos/200/300?r=${Math.random()}`,
    `http://picsum.photos/100/300?r=${Math.random()}`
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
    `In rutrum ac purus sit amet tempus`
  ][Math.floor(Math.random() * 10)],
  type: [
    {name: `Taxi`, icon: `🚕`},
    {name: `Bus`, icon: `🚌`},
    {name: `Train`, icon: `🚂`},
    {name: `Ship`, icon: `🛳️`},
    {name: `Transport`, icon: `🚊`},
    {name: `Drive`, icon: `🚗`},
    {name: `Flight`, icon: `✈️`},
    {name: `Check in`, icon: `🏨`},
    {name: `Sightseeing`, icon: `🏛️`},
    {name: `Restaurant`, icon: `🍴`}
  ][Math.floor(Math.random() * 10)],
  destination: new Set([
    `Airport`,
    `Geneva`,
    `Chamonix`,
    `Amsterdam`,
    `hotel`
  ]),
  time: {
    start: Date.now() + 60 * 60 * 1000,
    end: Date.now() + Math.floor(Math.random() * 7) * 60 * 60 * 1000,
  },
  offers: [
    {name: `Add luggage`, price: 20},
    {name: `Switch to comfort class`, price: 30},
    {name: `Add meal`, price: 10},
    {name: `Choose seats`, price: 15}
  ]
});
