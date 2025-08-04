// Use dynamic import to handle node-fetch ESM in Netlify functions
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { recipe } = JSON.parse(event.body);

    if (!recipe || typeof recipe !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid recipe input' }),
      };
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          name: recipe,
        },
      ]),
    });

    const parsed = await response.json();

    if (!Array.isArray(parsed)) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected API response' }),
      };
    }

    // Enhance nutrition data
    const enriched = parsed.map((item) => {
      return {
        original: item.original,
        calories: item.calories,
        fat: item.fat?.amount + item.fat?.unit || 'N/A',
        carbohydrates: item.carbs?.amount + item.carbs?.unit || 'N/A',
        protein: item.protein?.amount + item.protein?.unit || 'N/A',
        nutrition: {
          nutrients: item.nutrition?.nutrients || [],
        },
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(enriched),
    };
  } catch (err) {
    console.error('Analyze error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
