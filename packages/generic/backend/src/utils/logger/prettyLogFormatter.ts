export { prettyLogFormatter };

const prettyLogFormatter = {
  formatErrorLog(errorText: string) {
    return `${new Date().toISOString()} - Error: ${errorText}`;
  },

  formatLog(value: any) {
    return `${new Date().toISOString()} - ${JSON.stringify(value, null, 2)}`;
  },
};
