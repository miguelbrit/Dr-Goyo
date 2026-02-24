/**
 * Formats a time string (HH:mm) or Date object into 12h format (ej: 03:00 PM)
 */
export const formatTime12h = (time: string | Date): string => {
  try {
    const date = typeof time === 'string' 
      ? new Date(`2000-01-01T${time.includes(':') ? time : time + ':00'}`)
      : time;

    if (isNaN(date.getTime())) return String(time);

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  } catch (e) {
    return String(time);
  }
};

/**
 * Formats a Date into a readable date string with time in 12h format
 */
export const formatDateTime12h = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  
  const dateStr = d.toLocaleDateString();
  const timeStr = formatTime12h(d);
  
  return `${dateStr} • ${timeStr}`;
};
