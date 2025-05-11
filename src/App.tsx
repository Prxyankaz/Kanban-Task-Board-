import React, { useEffect, useState } from "react";
import { loadFromLocalStorage } from "./store/kanbanStore";
import ProjectSidebar from "./components/ProjectSidebar";
import TaskBoard from "./components/TaskBoard";
import "./index.css";

const App = () => {
  // State for theme; default to light.
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Load Kanban state from localStorage
    loadFromLocalStorage();
    
    // Load the saved theme from localStorage, if available.
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Update the data attribute on <html> so that CSS can adjust styles.
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="app">
      <header className="App-header">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>
      <ProjectSidebar />
      <TaskBoard />
    </div>
  );
  
};

export default App;
