const { Validator } = require("node-input-validator");
const helper = require("../helper/helper");
// const db = require("../models");
const users = require("../models/users");
var jwt = require("jsonwebtoken");
const secretKey = "meddisonHealthCare";


module.exports = {
  authenticateHeader: async function (req, res, next) {
    // console.log(req.headers, "--------in header check------------");
    const v = new Validator(req.headers, {
      secret_key: "required|string",
      publish_key: "required|string",
    });

    let errorsResponse = await helper.checkValidation(v);

    if (errorsResponse) {
      return helper.failed(res, errorsResponse);
    }
   
    if (
      req.headers.secret_key !== process.env.SECRET_KEY &&
      req.headers.publish_key !== process.env.PUBLISH_KEY
    ) {
      return helper.failed(res, "Key not matched!");
    }
    next();
  },

  authenticateJWT: async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
    
      jwt.verify(token, process.env.secretCryptoKey, async (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        }

        const existingUser = await users.findOne({
            _id: payload._id,
            loginTime:payload.loginTime
          });
         
        if (existingUser) {
          req.user = existingUser;
          next();
        } else {
          res.sendStatus(401);
        }
      });
    } else {
      res.sendStatus(401);
    }
  },

  authenticateRoute: async (req, res, next) => {
    console.log(
      "🚀 ~ file: nextHelpers.js:56 ~ authenticateRoute: ~ req:",
      req.baseUrl
    );
    let check;
    if (req.baseUrl == "admin") {
      check = 0;
    } else {
      check = 1;
    }
    const isCheckOk = await users.findOne({
      _id: req.session.user._id,
      role: check,
    });
    if (isCheckOk) {
      console.log(
        "🚀 ~ file: nextHelpers.js:71 ~ authenticateRoute: ~ isCheckOk:",
        isCheckOk
      );
      next();
    } else {
      console.log("🚀 ~ file: nextHelpers.js:73 ~ authenticateRoute: ~ else:");
      res.send("not authorized");
    }
    // const authHeader = req;
    return;
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, SECRETCRYPTO_KEY, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;

        next();
      });
    } else {
      res.sendStatus("Page not Found");
    }
  },

  verifyUser: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("object");
      jwt.verify(token, SECRETCRYPTO_KEY, async (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        }
        console.log("object,,,,,,,,", payload.data.id);
        const existingUser = await db.users.findOne({
          where: {
            id: payload.data.id,
            login_time: payload.data.login_time,
          },
        });
        console.log("existingUser,,,,,,,,,,,,,,,,,", existingUser);

        // const existingUser = await db.users.findOne({
        //   where: {
        //     id: payload.id,
        //     login_time: payload.login_time,
        //   },
        // });
        if (existingUser) {
          req.user = existingUser;
          next();
        } else {
          res.sendStatus(401);
        }
      });
    } else {
      res.sendStatus(401);
    }
  },
};
