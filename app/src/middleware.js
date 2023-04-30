
const ERROR_TYPE = {
  METAR: "metar",
  AXIOS_SERVER_RESPONSE: "axios-server-response",
  AXIOS_NO_RESPONSE: "axios-no-response",
};

function errorLogger(error, req, res, next) { // for logging errors
  console.error(error); // or using any fancy logging library
  next(error); // forward to next middleware
}

function errorResponder(error, req, res, next) { // responding to client
  res.header("Content-Type", 'application/json');
  if (error.type === ERROR_TYPE.METAR)
    res.status(400).send(JSON.stringify(error.message, null, 4));
  else if (error.type === ERROR_TYPE.AXIOS_SERVER_RESPONSE) // arbitrary condition check
    res.status(error.response.status).send(JSON.stringify(error, null, 4));
  else if (error.type === ERROR_TYPE.AXIOS_NO_RESPONSE)
    res.status(500).send(JSON.stringify(error.request, null, 4));
  else next(error); // forwarding exceptional case to fail-safe middleware
}

function failSafeHandler(error, req, res, next) { // generic handler
  res.status(500).send(JSON.stringify(error.message, null, 4));
}

module.exports = {
  errorLogger,
  errorResponder,
  failSafeHandler,
  ERROR_TYPE
};
