const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { recipe } = JSON.parse(event.body);

    // Replace with your Spoonacular API call
    // Example stub response:
    const fakeResult = [
      {
        original: "2 eggs",
        calories: 150,
        fat: "10g",
        carbohydrates: "1g",
        protein: "12g",
        nutrition: {
          nutrients: [
            { name: "Vitamin A", amount: 120, unit: "µg" },
            { name: "Iron", amount: 1.5, unit: "mg" },
            { name: "Vitamin C", amount: 25, unit: "mg" },
          ]
        }
      }
    ];

    return {
      statusCode: 200,
      body: JSON.stringify(fakeResult),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
