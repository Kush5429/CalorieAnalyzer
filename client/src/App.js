import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DIET_OPTIONS = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Gluten-Free'];

function App() {
  const [recipe, setRecipe] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState('');
  const [warnings, setWarnings] = useState([]);

  const handleDietChange = (e) => {
    setSelectedDiet(e.target.value);
    setWarnings([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipe.trim()) return;

    if (recipe.length > 1000) {
      alert('Input too long. Please shorten your ingredient list.');
      return;
    }
    const invalidChars = /[^a-zA-Z0-9,\s\n.()gmlcup]+/;
    if (invalidChars.test(recipe)) {
      alert('Please remove special characters or invalid entries.');
      return;
    }

    setLoading(true);
    setResult(null);
    setWarnings([]);

    try {
      // ✅ Changed for deployment compatibility
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe }),
      });

      const data = await response.json();
      setResult(data);

      if (!data.error && selectedDiet) {
        const badIngredients = data.filter((item) => {
          const name = item.original.toLowerCase();
          if (selectedDiet === 'Vegan') {
            return name.includes('egg') || name.includes('milk') || name.includes('cheese') || name.includes('butter') || name.includes('yogurt');
          }
          if (selectedDiet === 'Vegetarian') {
            return name.includes('chicken') || name.includes('fish') || name.includes('meat') || name.includes('bacon') || name.includes('beef');
          }
          if (selectedDiet === 'Keto') {
            return item.carbohydrates && parseFloat(item.carbohydrates) > 10;
          }
          if (selectedDiet === 'Gluten-Free') {
            return name.includes('wheat') || name.includes('flour') || name.includes('bread') || name.includes('pasta');
          }
          return false;
        });

        if (badIngredients.length > 0) {
          setWarnings([
            `❌ This recipe contains non-${selectedDiet.toLowerCase()} ingredients like: ${badIngredients
              .map((i) => i.original)
              .join(', ')}.`,
          ]);
        }
      }

      if (!data.error) {
        const history = JSON.parse(localStorage.getItem('nutritionHistory') || '[]');
        history.push({ recipe, result: data, date: new Date().toISOString() });
        localStorage.setItem('nutritionHistory', JSON.stringify(history));
      }
    } catch (error) {
      setResult({ error: 'Failed to analyze recipe.' });
    }

    setLoading(false);
  };

  const downloadCSV = () => {
    if (!result || result.error) return;
    let csv = 'Ingredient,Calories,Fat,Carbs,Protein\n';
    result.forEach((item) => {
      csv += `${item.original},${item.calories},${item.fat},${item.carbohydrates},${item.protein}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nutrition_report.csv';
    link.click();
  };

  let total = { calories: 0, fat: 0, carbs: 0, protein: 0 };
  if (result && !result.error && Array.isArray(result)) {
    total = result.reduce(
      (acc, item) => {
        acc.calories += parseFloat(item.calories) || 0;
        acc.fat += parseFloat(item.fat) || 0;
        acc.carbs += parseFloat(item.carbohydrates) || 0;
        acc.protein += parseFloat(item.protein) || 0;
        return acc;
      },
      { calories: 0, fat: 0, carbs: 0, protein: 0 }
    );
  }

  const chartData = [
    { name: 'Fat', value: total.fat },
    { name: 'Carbs', value: total.carbs },
    { name: 'Protein', value: total.protein },
  ];

  const COLORS = ['#f87171', '#fbbf24', '#34d399'];

  return (
    <div className={`min-h-screen transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-lime-50 to-green-100 text-gray-800'}`}>
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-green-600 dark:text-lime-400">🥗 Calorie Analyzer</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} /> Dark Mode
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)} /> Show Advanced Info
          </label>
          <a
            href="https://spoonacular.com/food-api"
            className="text-green-700 hover:underline dark:text-green-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Spoonacular
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-4">Know What You Eat</h2>
          <p className="text-lg mb-4">
            Input your recipe ingredients to get instant nutritional information.
            Discover calories, macros, and get smarter about what’s on your plate!
          </p>
          <img
            src="landing.jpeg"
            alt="Healthy food"
            className="rounded-lg shadow-md w-full object-cover max-h-96"
          />
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-lg font-medium">Paste your recipe ingredients:</span>
              <textarea
                className="mt-2 w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-400 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                rows={6}
                placeholder="e.g. 2 eggs, 1 cup milk, 2 cheese cubes"
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700 font-medium dark:text-gray-200">Select Diet Mode (optional):</span>
              <select
                className="mt-1 w-full border-gray-300 rounded p-2 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                value={selectedDiet}
                onChange={handleDietChange}
              >
                <option value="">-- No Diet Selected --</option>
                {DIET_OPTIONS.map((diet) => (
                  <option key={diet} value={diet}>
                    {diet}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold shadow-md transition"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {warnings.length > 0 && (
            <div className="bg-yellow-100 text-yellow-800 p-4 mt-4 rounded shadow dark:bg-yellow-900 dark:text-yellow-300">
              {warnings.map((w, i) => (
                <p key={i}>⚠️ {w}</p>
              ))}
            </div>
          )}

          {result && (
            <div className="mt-6">
              {result.error ? (
                <p className="text-red-600 font-medium dark:text-red-400">{result.error}</p>
              ) : (
                <>
                  <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded mb-4 dark:bg-green-900 dark:border-lime-400">
                    <h4 className="font-semibold mb-1">Total Nutrition (Approx.):</h4>
                    <p className="text-sm">
                      Calories: {total.calories.toFixed(2)} kcal | Fat: {total.fat.toFixed(2)} g | Carbs: {total.carbs.toFixed(2)} g | Protein: {total.protein.toFixed(2)} g
                    </p>
                    {showAdvanced && (
                      <p className="text-xs mt-2">
                        Micronutrients (example): Vitamin A: 120µg, Iron: 1.5mg, Vitamin C: 25mg
                      </p>
                    )}
                  </div>

                  <button
                    onClick={downloadCSV}
                    className="text-sm text-blue-600 hover:underline mb-4 dark:text-blue-400"
                  >
                    📥 Download CSV Report
                  </button>

                  <div className="w-full h-64 mb-4">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">Ingredient Breakdown</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {result.map((item, index) => (
                      <div key={index} className="bg-gray-100 p-3 rounded shadow-sm dark:bg-gray-700">
                        <div className="font-medium">{item.original}</div>
                        <div className="text-sm">
                          Calories: {item.calories} kcal <br />
                          Fat: {item.fat} | Carbs: {item.carbohydrates} | Protein: {item.protein}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
