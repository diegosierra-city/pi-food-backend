const axios = require("axios");
const { Recipe, Diet, User } = require("../db.js");
require('dotenv').config();
const {
 API_URL,API_KEY
} = process.env;

async function getRecipeById(req, res) {
 const { idRecipe } = req.params; 
 //return res.status(402).json(idRecipe);
 try {
 const arrayIdRecipe = idRecipe.split("-"); 
 //console.log('z',arrayIdRecipe[1])
 let recipeDB
 if(arrayIdRecipe[1]){//typeof idRecipe==='NaN'
/*  recipeDB = await Recipe.findOne({
  where: {id: idRecipe},
include: Diet //carga la relación con la tabla intermedia
}); */
recipeDB = await Recipe.findByPk(idRecipe,{
  include: [
    {
      model: Diet,
    },
    {
      model: User,
    },
  ],
})
 }else{
  const response = await axios.get(
   `${API_URL}/${idRecipe}/information?apiKey=${API_KEY}`
 );
recipeDB = response.data;
 }
 
 if(!recipeDB){
  throw Error("Recipe not found");
  //return res.status(404).send("Recipe not found.");
 }
  return res.status(200).json(recipeDB);
  
 } catch (error) {
   return res.status(404).json(error.message);
 }

}

module.exports = { getRecipeById }