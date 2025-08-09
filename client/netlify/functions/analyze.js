// netlify/functions/analyze.js

exports.handler = async (event) => {
  try {
    const { recipe } = JSON.parse(event.body);

    // Build the Spoonacular API URL
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}&includeNutrition=true`;

    // Make the request using native fetch (no node-fetch needed)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ name: recipe }]),
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
