import moment from "moment";
import constants from "./constants";

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
  timeToMs: (value) => {
    return moment(value, `HH:mm`).format(`x`);
  },
  getIcons(type) {
    const currentType = type[0].toUpperCase() + type.slice(1);
    const currentKey = Object.keys(constants.ICONS).find((key) => key === currentType);

    return constants.ICONS[currentKey];
  },
  getCapitalizeWord(word) {
    return `${word[0].toUpperCase()}${word.substring(1)}`;
  }
};
