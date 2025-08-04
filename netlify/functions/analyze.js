const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
        body: JSON.stringify({ error: 'Invalid recipe input.' }),
      };
    }

    const response = await fetch('https://api.spoonacular.com/recipes/parseIngredients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        ingredientList: recipe,
        servings: '1',
        apiKey: process.env.SPOONACULAR_API_KEY,
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};
