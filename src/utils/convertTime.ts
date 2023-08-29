export function convertTo12HourFormat(timestamp: string) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 === 0 ? 12 : hours % 12)
    .toString()
    .padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  return formattedTime;
}
