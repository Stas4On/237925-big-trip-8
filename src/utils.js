export default {
  getTime: (ms) => {
    const currentDate = new Date(ms);
    let minutes = currentDate.getMinutes();
    let hours = currentDate.getHours();

    hours = (hours >= 10) ? hours : `0` + hours;
    minutes = (minutes >= 10) ? minutes : `0` + minutes;

    return `${hours}:${minutes}`;
  },
  getDuration: (startTime, endTime) => {
    const duration = endTime - startTime;
    const currentDuration = new Date(duration);
    const minutes = currentDuration.getUTCMinutes();
    const hours = currentDuration.getUTCHours();

    return `${hours}h ${minutes}m`;
  },
};
