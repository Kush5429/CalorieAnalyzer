import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { recipe } = JSON.parse(event.body);
    console.log("🔹 Raw incoming body:", event.body);

    if (!recipe || !recipe.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No ingredient list provided" }),
      };
    }

    const ingredientList = recipe.trim();
    console.log("🔹 Parsed ingredientList:", ingredientList);

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}&includeNutrition=true`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        ingredientList,
        servings: "1",
      }),
    });

    // Debug log the raw Spoonacular reply before parsing
    const rawText = await response.text();
    console.log("🔹 Spoonacular raw response:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid JSON from Spoonacular" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("❌ Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
