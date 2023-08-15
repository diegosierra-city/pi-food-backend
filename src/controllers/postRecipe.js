const axios = require("axios");
const { Recipe, Diet,RecipeDiets, User } = require("../db.js");

const { Op } = require("sequelize");
require("dotenv").config();
const { API_URL, API_KEY } = process.env;

async function postRecipe(req, res) {
  // id, title, image, summary, healthScore, steps, diets
  const recipe = req.body;
  //return res.status(202).json(req.body);

  if (
    !recipe.user_id ||
    !recipe.title ||
    !recipe.image ||
    !recipe.summary ||
    !recipe.healthScore ||
    !recipe.steps ||
    !recipe.diets
  ) return res.status(400).send("Missing data");
   
  
  //return res.status(403).json(req.query);
  try {
    // 1. INSERT a new Recipe
    const [newRecipe, created] = await Recipe.findOrCreate({
      where: { title: recipe.title },
      defaults: {
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      steps: recipe.steps,
      UserId: recipe.user_id
    }
  });

  if(!created)return res.status(403).send('A recipe with this name already exists');
    /* 
    //el error de duplicados lo genera la DB
    const newRecipe = await Recipe.create({
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      steps: recipe.steps,
    }); */
    
//return res.status(206).json(newRecipe);
    //Asociar las Dietas a la Receta
    //await newRecipe.addDiet(dietsInRecipe)
//se registra en la tabla intermedia RecipeDiets
recipe.diets.forEach(async (diet) => {
// return res.status(206).json(diet); 
      await newRecipe.addDiet(diet);
    })

    return res.status(200).json(newRecipe);//no incluye las Diets
    } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = { postRecipe };
