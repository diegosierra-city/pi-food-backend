const axios = require("axios");
const { Diet } = require("../db.js");
const { Op } = require("sequelize");
require('dotenv').config();
const {
 API_URL,API_KEY
} = process.env;

async function getDiets(req, res) {
 let listDiets=[]
 
 try {
 //
 listDiets = await Diet.findAll(); 
 //return res.status(403).json(listDiets);
 // si esta vacía se carga la primera vez desde el API 
 if(listDiets.length===0){
  ///initial values
 listDiets=[ 'vegetarian']//,'vegan','gluten free'
 listDiets.map(async (di)=>{
 await Diet.create({name:di}) 
 })
let response = await axios.get(
   `${API_URL}/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true`
 );
//recorro todos los resultados y saco las diets de cada uno, si no existe la incluyo en la DB
//return res.status(201).json(response.data);
 response.data.results.map(async (recipe)=>{
  if(recipe.diets.length>0){
    
   recipe.diets.map(async (d)=>{
    //listDiets.push(d)
    if(!listDiets.find(e=>e.name===d)){
     listDiets.push({name:d})
     await Diet.create({name:d})// in DB
    }
   })
  }
 })

 } 
 
  return res.status(202).json(listDiets);
  
 } catch (error) {
   return res.status(500).json(error.message);
 }

}

module.exports = { getDiets }