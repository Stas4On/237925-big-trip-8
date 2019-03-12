export default (ms) => {
  let minutes = new Date(ms).getMinutes();
  let hours = new Date(ms).getHours();

  hours = (hours >= 10) ? hours : `0` + hours;
  minutes = (minutes >= 10) ? minutes : `0` + minutes;

  return `${hours}:${minutes}`;
};
