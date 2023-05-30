export { prettyLogFormatter };

const prettyLogFormatter = {
  formatErrorLog(error: any) {
    return `${new Date().toISOString()} - Error: ${error}`;
  },

  formatLog(value: any) {
    return `${new Date().toISOString()} - ${JSON.stringify(value, null, 2)}`;
  },
};
