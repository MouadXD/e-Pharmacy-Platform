const isoToRedableDate = (date) => {
  const newDate = new Date(date);

  const humanReadableDate = newDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const humanReadableTime = newDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${humanReadableDate} ${humanReadableTime}`;
};

export default isoToRedableDate;
