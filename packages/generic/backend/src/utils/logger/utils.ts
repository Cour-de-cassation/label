export { getFormattedDate, getFormattedError };

function getFormattedDate() {
  return new Date().toISOString();
}

function getFormattedError(errorText: string) {
  return `${getFormattedDate()} - Error: ${errorText}`;
}
