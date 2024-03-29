export interface DateOptions {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  seconds?: number;
}

// function to get a new date based on date and time input
// the native Date objects handles all the date and time "overflows"
export function manipulateDate(date: Date, dateOpt: DateOptions) {
  return new Date(
    date.getFullYear() + (dateOpt?.year ?? 0),
    date.getMonth() + (dateOpt?.month ?? 0),
    date.getDate() + (dateOpt?.day ?? 0),
    date.getHours() + (dateOpt?.hour ?? 0),
    date.getMinutes() + (dateOpt?.minute ?? 0),
    date.getSeconds() + (dateOpt?.seconds ?? 0)
  );
}

/* Given a date, format to YYYY-MM-dd using norwegian locale */
export function dateToFormString(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  /* Remove default delimiters and format correctly */
  const parts = date.toLocaleDateString('en-NO', options).split(/\D/);
  return `${parts[2]}-${parts[0]}-${parts[1]}`;
}
