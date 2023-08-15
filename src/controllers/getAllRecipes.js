const axios = require("axios");
const { Recipe, Diet, User } = require("../db.js");
require('dotenv').config();
const {
 API_URL,API_KEY
} = process.env;
const db = require('../utilities/bd01.json')


async function getAllRecipes(req, res) {
 try {
 let recipesDB=[];
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
})

/*   const response = await axios.get(
   `${API_URL}/complexSearch?number=100&addRecipeInformation=true&apiKey=${API_KEY}`
 );
recipesAPI = response.data.results; */


recipesAPI = db.results

  //return res.status(200).json([...recipesDB]);
  return res.status(200).json([...recipesDB,...recipesAPI]);
 } catch (error) {
   return res.status(404).json(error.message);
 }

}

module.exports = { getAllRecipes }