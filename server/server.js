const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.SPOONACULAR_API_KEY?.replace(/"/g, ''); // clean up quotes if present

app.use(cors());
app.use(express.json());

// Basic root route
app.get('/', (req, res) => {
  res.send('✅ Calorie Analyzer API is running');
});

// Analyze route
app.post('/analyze', async (req, res) => {
  const { recipe } = req.body;

  if (!recipe || !API_KEY) {
    return res.status(400).json({ error: 'Missing recipe or API key' });
  }

  try {
    console.log('🔍 Sending to Spoonacular:', recipe);

    const response = await axios.post(
      'https://api.spoonacular.com/recipes/parseIngredients',
      new URLSearchParams({
        ingredientList: recipe,
        servings: 1,
        includeNutrition: 'true',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          apiKey: API_KEY,
        },
      }
    );

    const result = response.data.map((item) => ({
      original: item.original,
      calories: item.nutrition?.nutrients?.find((n) => n.name === 'Calories')?.amount || 0,
      fat: item.nutrition?.nutrients?.find((n) => n.name === 'Fat')?.amount + 'g',
      carbohydrates: item.nutrition?.nutrients?.find((n) => n.name === 'Carbohydrates')?.amount + 'g',
      protein: item.nutrition?.nutrients?.find((n) => n.name === 'Protein')?.amount + 'g',
    }));

    res.json(result);
  } catch (error) {
    console.error('❌ Spoonacular error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to analyze recipe.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
