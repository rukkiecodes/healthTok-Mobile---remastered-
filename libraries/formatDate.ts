export const formatCustomDate = (dateObj: {
  day: number;
  month: string;
  year: string;
}) => {
  const { day, month, year } = dateObj;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthIndex = monthNames.indexOf(month);
  const paddedDay = String(day).padStart(2, '0');
  const paddedMonth = String(monthIndex + 1).padStart(2, '0');

  return `${paddedDay}/${paddedMonth}/${year}`;
};
