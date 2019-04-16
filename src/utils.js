import moment from "moment";
import constants from "./constants";

export default {
  getTime: (ms) => {
    return moment(ms, `x`).startOf(`minute`).format(`HH:mm`);
  },
  getDate: (ms) => {
    return moment(ms, `x`).format(`YYYY-MM-DD HH:mm`);
  },
  getDuration: (startTime, endTime) => {
    const start = moment(+startTime);
    const end = moment(+endTime);
    const days = end.diff(start, `day`, true);
    const hours = (days - Math.floor(days)) * 24;
    const minutes = (hours - Math.floor(hours)) * 60;

    if (days >= 1) {
      return `${Math.floor(days)}d ${Math.floor(hours)}h ${Math.round(minutes)}m`;
    } else if (hours >= 1) {
      return `${Math.floor(hours)}h ${Math.round(minutes)}m`;
    }

    return `${Math.round(minutes)}m`;
  },
  timeToMs: (value) => {
    return moment(value).format(`x`);
  },
  getIcons(type) {
    const currentType = type[0].toUpperCase() + type.slice(1);
    const currentKey = Object.keys(constants.ICONS).find((key) => key === currentType);

    return constants.ICONS[currentKey];
  },
  getCapitalizeWord(word) {
    return `${word[0].toUpperCase()}${word.substring(1)}`;
  },
};
