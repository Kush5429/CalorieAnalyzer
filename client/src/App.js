const handleAnalyze = async () => {
  try {
    const response = await fetch("/.netlify/functions/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredientList: recipeText }), // ✅ match backend
    });

    const data = await response.json();
    console.log("DEBUG: Response from API:", data);

    // parse and set nutrition
    if (data && data.calories) {
      setCalories(data.calories);
      setProtein(data.protein);
      setFat(data.fat);
      setCarbs(data.carbs);
    } else {
      console.warn("DEBUG: No nutrition data returned");
    }
  } catch (err) {
    console.error("Error analyzing recipe:", err);
  }
};
