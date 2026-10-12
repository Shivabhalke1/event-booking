/**
 * Date and time parsing helpers for event schedules
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatDateTimeRange = (startTime, endTime) => {
  if (!startTime) return 'Schedule TBA';
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;

  const datePart = formatDate(start);
  const startTimePart = formatTime(start);
  const endTimePart = end ? formatTime(end) : '';

  if (endTimePart) {
    return `${datePart} • ${startTimePart} - ${endTimePart}`;
  }
  return `${datePart} • ${startTimePart}`;
};

export const isPastEvent = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};
