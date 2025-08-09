// netlify/functions/analyze.js

exports.handler = async (event) => {
  try {
    const { recipe } = JSON.parse(event.body);

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}&includeNutrition=true`;

    // Send as form-encoded data
    const formBody = new URLSearchParams();
    formBody.append("ingredientList", recipe);
    formBody.append("servings", "1");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Spoonacular API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Analyze function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
