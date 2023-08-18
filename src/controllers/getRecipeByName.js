const axios = require("axios");
const { Recipe, Diet, User } = require("../db.js");
const { Op } = require("sequelize");
require("dotenv").config();
const { API_URL, API_KEY } = process.env;
const db = require('../utilities/bd01.json')

async function getRecipeByName(req, res) {
  const { name } = req.query;

  if (name) {
    let listDB = [];
    let listAPI = [];
    //return res.status(403).json(req.query);
    try {
      //
      listDB = await Recipe.findAll({
        where: { title: { [Op.iLike]: `%${name}%` } },
        attributes: ["id", "title", "image"], //filtramos
        include: [
          {
            model: Diet,
          },
          {
            model: User,
          },
        ],
      });

      let response = await axios.get(
        `${API_URL}/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true&query=${name}`
      );
      listAPI = response.data;

      if (listDB.length === 0 && listAPI.totalResults === 0)
        return res
          .status(404)
          .send(`No recipe with this name '${name}' was found`);

      return res.status(200).json([...listDB, ...listAPI.results]);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  } else {
    ///all recipes
    try {
      let recipesDB = [];
      //return res.status(203).json('aqui');

      recipesDB = await Recipe.findAll({
        include: [
          {
            model: Diet,
          },
          {
            model: User,
          },
        ],
      });

      /* const response = await axios.get(
        `${API_URL}/complexSearch?number=100&addRecipeInformation=true&apiKey=${API_KEY}`
      );
      recipesAPI = response.data.results;
      return res.status(200).json([...recipesDB, ...recipesAPI]); */

      recipesAPI = db.results
   return res.status(200).json([...recipesDB,...recipesAPI]);
   
    } catch (error) {
      return res.status(404).json(error.message);
    }
  }
}

module.exports = { getRecipeByName };
