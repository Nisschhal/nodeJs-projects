// for filing/ file system
const fs = require("fs");
const fsP = require("fs").promises;
const path = require("path");
const os = require("os");
// for logs item
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvent = async (msg) => {
  const date = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const logItem = `${date}\t${uuid()}\t${os.version}\t${msg}\n`;
  console.log(logItem);
  if (!fs.existsSync("./logs")) {
    fsP.mkdir("./logs");
  }

  try {
    await fsP.appendFile(
      path.join(__dirname, "logs", "log-events.txt"),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};
module.exports = logEvent;
// logEvent("logged in ");
// console.log(format(new Date(), "yyyy-MM-dd\tHH:mm:ss"));

// console.log(uuid());
