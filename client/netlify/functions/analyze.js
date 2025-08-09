const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { recipe } = JSON.parse(event.body || "{}");

    if (!recipe) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Recipe text is required" }),
      };
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing Spoonacular API key" }),
      };
    }

    const apiUrl = `https://api.spoonacular.com/recipes/analyze?apiKey=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Recipe Analysis",
        ingredientList: recipe,
      }),
    });

    const rawText = await response.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("Spoonacular returned non-JSON:", rawText);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Invalid JSON from Spoonacular" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify([data]),
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
