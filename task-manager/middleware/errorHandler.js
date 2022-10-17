const { logEvent } = require("./logEvents");

// middleware to check send error into errlog file
const errorHandler = (err, req, res, next) => {
  logEvent("errLogs.txt", `${err.name}: ${err.message}`);
  res.status(500).send(err.message);
};

module.exports = errorHandler;
