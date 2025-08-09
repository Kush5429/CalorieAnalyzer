const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    // Log raw incoming body
    console.log("🔹 Raw incoming body:", event.body);

    const body = JSON.parse(event.body || "{}");

    // Accept ingredientList or recipe
    const ingredientList = body?.ingredientList || body?.recipe;
    console.log("🔹 Parsed ingredientList:", ingredientList);

    if (!ingredientList) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No ingredient list provided" }),
      };
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ingredientList, servings: 1 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spoonacular API error: ${response.status} - ${errorText}`);
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
