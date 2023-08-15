const axios = require("axios");
const { User } = require("../db.js");

const { Op } = require("sequelize");
require("dotenv").config();
const { API_URL, API_KEY } = process.env;
const md5 = require("md5");

async function postUser(req, res) {
  const { type } = req.params;

  if (type === "signup") {
    if (!req.body.name || !req.body.email || !req.body.password)
      return res.status(400).send("Missing data");
    //return res.status(403).json(req.query);
    try {
      // 1. INSERT a new User
      const [newUser, created] = await User.findOrCreate({
        where: { email: req.body.email },
        defaults: {
          name: req.body.name,
          // password encriptada md5
          password: md5(req.body.password),
        },
      });

      if (!created) return res.status(403).send("This User already exists");

      return res.status(200).json(newUser);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  } else if (type === "login") {
    if (!req.body.email || !req.body.password)
      return res.status(400).send("Missing data");

    //return res.status(403).json(req.query);
    try {
      // 1. find
      const newUser = await User.findOne({
        where: {
          email: req.body.email,
          password: md5(req.body.password),
        },
      });
      //return res.status(406).json(newUser);
      if (!newUser){
        return res
          .status(400)
          .send("Error in login or password, please check your credentials");
      }
      return res.status(200).json(newUser);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = { postUser };
