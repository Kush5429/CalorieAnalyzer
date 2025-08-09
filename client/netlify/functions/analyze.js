const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { recipe } = JSON.parse(event.body);
    console.log("Received recipe:", recipe);

    if (!recipe) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing recipe input." }),
      };
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing Spoonacular API key");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing Spoonacular API key." }),
      };
    }

    // Prepare body params (everything except apiKey)
    const params = new URLSearchParams();
    params.append('ingredientList', recipe);
    params.append('servings', '1');

    // ✅ apiKey goes in the query string, not in the body
    const response = await fetch(
      `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const data = await response.json();
    console.log("🔍 API response:", JSON.stringify(data));

    if (!Array.isArray(data)) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Unexpected response from Spoonacular API." }),
      };
    }

    const result = data.map((item) => ({
      original: item.originalString,
      calories: item.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount || 0,
      fat: (item.nutrition?.nutrients?.find((n) => n.name === "Fat")?.amount || 0) + "g",
      carbohydrates: (item.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")?.amount || 0) + "g",
      protein: (item.nutrition?.nutrients?.find((n) => n.name === "Protein")?.amount || 0) + "g",
      nutrition: item.nutrition
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: err.message }),
    };
  }
};
