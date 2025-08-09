const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { ingredientList } = JSON.parse(event.body || "{}"); // ✅ match frontend
    console.log("DEBUG: Ingredient list received:", ingredientList);

    if (!ingredientList) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No ingredient list provided" }),
      };
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const apiUrl = `https://api.spoonacular.com/recipes/analyze?apiKey=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredientList }), // ✅ same name
    });

    const data = await response.json();
    console.log("DEBUG: Response from Spoonacular:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        calories: data?.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || null,
        protein: data?.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount || null,
        fat: data?.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount || null,
        carbs: data?.nutrition?.nutrients?.find(n => n.name === "Carbohydrates")?.amount || null,
      }),
    };
  } catch (error) {
    console.error("ERROR:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
};
