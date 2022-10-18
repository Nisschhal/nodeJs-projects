// accepted site/links to access this backend server
const whiteList = [
  "https://www.mysite.com",
  "http://localhost:3000",
  "http://localhost:3500",
];

// analysing and showing error if the cors origin is not on the whitelist
const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin);
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
