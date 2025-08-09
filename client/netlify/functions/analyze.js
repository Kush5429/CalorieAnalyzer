// analyze.js - CommonJS version for Netlify

const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { ingredientList } = JSON.parse(event.body || '{}');

    console.log("DEBUG: Ingredient list received:", ingredientList);

    if (!ingredientList || ingredientList.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Ingredient list is required.' }),
      };
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
      console.error("ERROR: SPOONACULAR_API_KEY not found in environment variables");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing API key on server.' }),
      };
    }

    const response = await fetch(
      `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientList,
          servings: 1
        }),
      }
    );

    const text = await response.text();

    console.log("DEBUG: Raw response from Spoonacular:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("ERROR: Spoonacular did not return valid JSON");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Invalid response from Spoonacular', raw: text }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("ERROR in analyze function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
