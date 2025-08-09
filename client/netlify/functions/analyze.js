const fetch = require("node-fetch"); // v2

exports.handler = async (event) => {
  try {
    const { recipe } = JSON.parse(event.body || "{}");

    // Make sure we have something to send
    if (!recipe || !recipe.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No recipe provided" }),
      };
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;

    const formBody = new URLSearchParams();
    formBody.append("ingredientList", recipe.trim());
    formBody.append("servings", "1");

    const response = await fetch(
      `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Spoonacular API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Analyze function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
