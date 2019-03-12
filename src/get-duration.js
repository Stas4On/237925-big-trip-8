export default (startTime, endTime) => {
  const duration = endTime - startTime;
  const minutes = new Date(duration).getMinutes();
  const hours = new Date(duration).getHours();

  return `${hours}h ${minutes}m`;
};
