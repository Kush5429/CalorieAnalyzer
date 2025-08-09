// client/netlify/functions/analyze.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  console.log("🔹 Raw incoming body:", event.body);

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    console.error("❌ Failed to parse JSON:", e);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  console.log("🔹 Parsed ingredientList:", body?.ingredientList);

  if (!body?.ingredientList) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No ingredient list provided" })
    };
  }

  try {
    const spoonacularUrl = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${process.env.SPOONACULAR_API_KEY}`;
    console.log("🔹 Sending request to Spoonacular:", spoonacularUrl);

    const spoonacularRes = await fetch(spoonacularUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ name: body.ingredientList }])
    });

    const data = await spoonacularRes.json();
    console.log("🔹 Spoonacular API response:", JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("❌ Error calling Spoonacular:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data from Spoonacular" })
    };
  }
};
