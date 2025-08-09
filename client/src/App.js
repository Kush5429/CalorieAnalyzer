import React, { useState } from "react";

function App() {
  const [recipeText, setRecipeText] = useState(""); // 🆕 store textarea value
  const [calories, setCalories] = useState(null);
  const [protein, setProtein] = useState(null);
  const [fat, setFat] = useState(null);
  const [carbs, setCarbs] = useState(null);

  const handleAnalyze = async () => {
    try {
      const response = await fetch("/.netlify/functions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientList: recipeText }), // match backend
      });

      const data = await response.json();
      console.log("DEBUG: Response from API:", data);

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

  return (
    <div>
      <textarea
        value={recipeText}
        onChange={(e) => setRecipeText(e.target.value)}
        placeholder="Enter your recipe ingredients here..."
      />
      <button onClick={handleAnalyze}>Analyze Recipe</button>

      <div>
        <p>Calories: {calories}</p>
        <p>Protein: {protein}</p>
        <p>Fat: {fat}</p>
        <p>Carbs: {carbs}</p>
      </div>
    </div>
  );
}

export default App;
