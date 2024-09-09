function daysToStr(days) {
  let displayString = '';
  for (const [key, value] of Object.entries(days)) {
    const timeRanges = value.map(v => `${v.start}-${v.end}`).join(", ");
    displayString += `${key}: ${timeRanges}\n`;
  }
  return displayString;
}


function getDateLabel(date) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = weekdays[date.getDay()];
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}(${dayOfWeek})`;
}

function getTimeLabel(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}