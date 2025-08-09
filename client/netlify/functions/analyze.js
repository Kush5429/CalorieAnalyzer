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
    const apiUrl = `https://api.spoonacular.com/recipes/analyze`;

    const response = await fetch(`${apiUrl}?apiKey=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ingredientList: recipe }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid JSON from Spoonacular" }),
      };
    }

    // Always return an array so frontend doesn't crash
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
