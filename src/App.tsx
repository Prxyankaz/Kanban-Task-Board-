import React, { useEffect, useState } from "react";
import { loadFromLocalStorage } from "./store/kanbanStore";
import ProjectSidebar from "./components/ProjectSidebar";
import TaskBoard from "./components/TaskBoard";
import "./index.css";

const App = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    loadFromLocalStorage();
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
