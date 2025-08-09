const handleAnalyze = async () => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe: recipeText }), // whatever input you use
    });

    const data = await response.json();

    if (!data || data.length === 0) {
      console.error("No data returned from API");
      return;
    }

    const nutrients = data[0]?.nutrition?.nutrients || [];

    const getNutrientAmount = (name) =>
      nutrients.find((n) => n.name === name)?.amount || 0;

    const calories = getNutrientAmount("Calories");
    const protein = getNutrientAmount("Protein");
    const fat = getNutrientAmount("Fat");
    const carbs = getNutrientAmount("Carbohydrates");

    setNutrition({
      calories,
      protein,
      fat,
      carbs,
    });

  } catch (err) {
    console.error("Error analyzing recipe:", err);
  }
};
