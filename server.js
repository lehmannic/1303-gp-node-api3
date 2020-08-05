const express = require("express"); // importing a CommonJS module
const morgan = require("morgan");
const helmet = require("helmet");


// [3]
// const hubsRouter = require("./hubs/hubs-router.js");
const apiRouter = require("./api/router.js");

const server = express();
server.use(express.json());
//  [1]
server.use(morgan("dev"));
server.use(helmet());
// [5a]
server.use(ourLogger);

//  [2] & [3]
server.use("/api", checkPass("mellon"), apiRouter);
// moved
// server.use("/api/hubs", morgan("tiny"), hubsRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});
//  [4]
function ourLogger(req, res, next) {
  // read name from headers
  const name = req.headers.name;
  // write name to req
  req.name = name;
  console.log(`${req.name} sent a ${req.method} request to ${req.url}`);
  next();
}
//  [5b]
function checkPass(password) {
  return function (req, res, next) {
    //  [6]
    if (req.headers.authorization === password) {
      next();
    } else {
      res.status(401).json({ you: "cannot pass" });
    }
  };
}

module.exports = server;

// [NOTES]

//  [1]
//  morgan:
//  --> logs every request that is made
//  --> https://www.npmjs.com/package/morgan
//  helmet:
//  --> free extra security...always use it
//  --> https://www.npmjs.com/package/helmet

//  [2]
//  this is how you use middleware locally
//  --> can pass array of middleware
//  --> read left to right
//  --> probably wouldn't only use morgan locally, just a teaching tool

//  [3]
//  nesting routers
//  --> api >> hubsRouter
//  --> server doesn't need to know about hubsRouter on api

//  [4]
//  building out our own middleware logger
//  --> next() calls the next middleware and passes request along
//  --> eventually some middleware will have a response that ends whole request
//  the DUTY of a middleware
//    1. call next() OR
//    2. produce a response

//  [5a] [75 min into lecture]
//  why don't we have to do ``` server.use(ourLogger()) ```
//  --> we do it that way for morgan("dev") and  helmet()
//  --> ourLogger is just a pointer to a function
//  --> next() does not return anything...undefined
//  [b]
//  if we want to pass something into ourLogger(something)
//  --> have to write the middleware function a little different
