// for filing/ file system
const fs = require("fs");
const fsP = require("fs").promises;
const path = require("path");
const os = require("os");
// for logs item
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvent = async (logFile, logMsg) => {
  const date = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const logItem = `${date}\t${uuid()}\t${os.version}\t${logMsg}\n`;
  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsP.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsP.appendFile(path.join(__dirname, "..", "logs", logFile), logItem);
  } catch (err) {
    console.log(err);
  }
};
const logger = (req, res, next) => {
  console.log(req.url, req.method, req.headers);
  logEvent("reqLogs.txt", `${req.method}\t${req.headers.origin}\t${req.url}`);
  next();
};
module.exports = { logger, logEvent };
// logEvent("logged in ");
// console.log(format(new Date(), "yyyy-MM-dd\tHH:mm:ss"));

// console.log(uuid());
