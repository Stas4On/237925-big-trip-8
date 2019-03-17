import moment from "moment";

export default {
  getTime: (ms) => {
    return moment(ms, `x`).format(`HH:mm`);
  },
  getDuration: (startTime, endTime) => {
    const duration = endTime - startTime;
    const currentDuration = new Date(duration);
    const minutes = currentDuration.getUTCMinutes();
    const hours = currentDuration.getUTCHours();

    return `${hours}h ${minutes}m`;
  },
  parseTimeInterval: (interval) => {
    const dividedTime = interval.split(` `);
    const startTime = moment(dividedTime[0], `HH:mm`).format(`x`);
    const endTime = moment(dividedTime[2], `HH:mm`).format(`x`);

    return {start: startTime, end: endTime};
  },
  getIcons(icons, type) {
    const currentType = type[0].toUpperCase() + type.slice(1);
    let currentIcon = ``;
    console.log(icons);console.log(currentType);

    for (const key in icons) {
      if (key === currentType) {
        currentIcon = icons[key];
      }
    }

    return currentIcon;
  }
};
