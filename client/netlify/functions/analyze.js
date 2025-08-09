import React, { useState } from "react";

export default function CalorieAnalyzer() {
  const [recipeText, setRecipeText] = useState("");
  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const handleAnalyze = async () => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: recipeText }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      // Validate the format
      if (!Array.isArray(data) || !data[0]?.nutrition?.nutrients) {
        console.error("Unexpected API response format", data);
        setNutrition({ calories: 0, protein: 0, fat: 0, carbs: 0 });
        return;
      }

      const nutrients = data[0].nutrition.nutrients;

      const getNutrientAmount = (name) => {
        const nutrient = nutrients.find((n) => n.name === name);
        return nutrient ? nutrient.amount : 0;
      };

      setNutrition({
        calories: getNutrientAmount("Calories"),
        protein: getNutrientAmount("Protein"),
        fat: getNutrientAmount("Fat"),
        carbs: getNutrientAmount("Carbohydrates"),
      });

    } catch (err) {
      console.error("Error analyzing recipe:", err);
      setNutrition({ calories: 0, protein: 0, fat: 0, carbs: 0 });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Calorie Analyzer</h1>

      <textarea
        rows="4"
        style={{ width: "100%", marginBottom: "10px" }}
        value={recipeText}
        onChange={(e) => setRecipeText(e.target.value)}
        placeholder="Enter your recipe here..."
      />

      <button onClick={handleAnalyze} style={{ marginBottom: "20px" }}>
        Analyze Now
      </button>

      <div>
        <h2>Nutrition Facts</h2>
        <p>Calories: {nutrition.calories}</p>
        <p>Protein: {nutrition.protein} g</p>
        <p>Fat: {nutrition.fat} g</p>
        <p>Carbs: {nutrition.carbs} g</p>
      </div>
    </div>
  );
}
