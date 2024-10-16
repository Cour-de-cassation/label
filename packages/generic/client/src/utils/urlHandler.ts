export { urlHandler };

const urlHandler = {
  getApiUrl() {
    return process.env.REACT_APP_BACKEND_API_URL
        ? `${process.env.REACT_APP_BACKEND_API_URL}` : `https://rec-label-api.teamlog.intra`;
  },
};
