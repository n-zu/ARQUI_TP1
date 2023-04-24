const {ERROR_TYPE} = require("./middleware");
module.exports = {
  handleError : function (error, res, next) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      error.type = ERROR_TYPE.AXIOS_SERVER_RESPONSE;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      error.type = ERROR_TYPE.AXIOS_NO_RESPONSE;
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    next(error);
  },

};
