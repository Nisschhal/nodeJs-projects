// importing modules
// const os = require("os");
// const path = require("path");
/*
// global object, similar to window in JS broswer
console.log(global);
// module to get operating system info
console.log(os.type()); // returns os types: WINDOW_NT
console.log(os.version()); // returns os version: WINDOW_10 Home
console.log(os.homedir()); // retuns system home dir path

// gives the current access directory path and file name path
console.log(__dirname); //C:\Users\Mrnis\...\task-manager
console.log(__filename); // C:\Users\Mrnis\...\task-manager\server.js

// module to get path info
console.log(path.dirname(__filename)); // returns given __filename directory path
console.log(path.basename(__filename)); // returns basename of given __filename path
console.log(path.extname(__filename)); //returns the extension of give __filename path
*/
/// file system
// const fsP = require("fs").promises;
// const fs = require("fs");
// async function fileSystem() {
//   try {
//     if (fs.existsSync("./files/try.txt")) {
//       const data = await fsP.readFile(
//         path.join(__dirname, "files", "try.txt"),
//         "utf-8"
//       );
//       console.log("old", data);
//       await fsP.unlink(path.join(__dirname, "files", "try.txt"));

//       // - create, if not exists, and write file
//       fsP.writeFile(path.join(__dirname, "files", "new-try.txt"), data);

//       const newData = await fsP.readFile(
//         path.join(__dirname, "files", "new-try.txt"),
//         "utf-8"
//       );
//       console.log(newData);

//       // rename the file
//       fsP.rename(
//         path.join(__dirname, "files", "new-try.txt"),
//         path.join(__dirname, "files", "rename-try.txt")
//       );

//       fsP.appendFile("./files/rename-try.txt", "\n\nHwllow there?");

//       // create readable stream file
//       const rs = fs.createReadStream("./files/lorem.txt", {
//         encoding: "utf-8",
//       });
//       console.log(rs);
//       const ws = fs.createWriteStream("./files/new.txt");
//       rs.pipe(ws);
//     } else {
//       console.log("No such file to operate!");
//     }

//     // check if folder exists and create new dir
//     if (!fs.existsSync("./new")) {
//       await fsP.mkdir("./new");
//     }
//     if (!fs.existsSync("./logs")) {
//       fsP.mkdir("./logs");
//       await fsP.writeFile(
//         path.join(__dirname, "logs", "log-events.txt"),
//         "working?"
//       );
//     }
//   } catch (err) {
//     throw err;
//   }
// }
// fileSystem();

// - write on file
// - append on file
// - delete the file
// - rename/copy to new file

// to caught event
// const logEvent = require("./middleware/logEvents");
// port no.

const express = require("express");
const app = express();
const path = require("path");
const EventEmitter = require("events");
const cors = require("cors");
const { logger, logEvent } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./configs/corsOptions");
const PORT = process.env.PORT || 3500;
const verifyJWT = require("./middleware/verifyJWT");
class MyEmmitter extends EventEmitter {}

const myEventEmitter = new MyEmmitter();
myEventEmitter.on("log", (logFile, msg) => logEvent(logFile, msg));

setTimeout(() => {
  myEventEmitter.emit("log", "log-events.txt", "Successfully Logged In");
}, 2000);

// EXPRESS js

// MIDDLEWARE //
// CUSTOM MIDDLEWARE
app.use(logger);

// - built-in middleware to handle urlencoded and json data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// third party middleware to handle error such as cors();

app.use(cors(corsOptions));
//to get the public, server static files
app.use(express.static(path.join(__dirname, "/public")));

// root routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/api/user"));
app.use("/login", require("./routes/auth"));
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employee"));

// to handle unknown url requests
app.use("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404, Not found" });
  } else {
    res.type("txt").send("404, Not found");
  }
});

// send the error message if not accepted domain requested to backend
app.use(errorHandler);

// listening to port
app.listen(PORT, () =>
  console.log(`Server successfully connected and listening to PORT: ${PORT}`)
);
