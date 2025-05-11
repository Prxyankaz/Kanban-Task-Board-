import React, { useState } from "react";
import { useKanbanStore } from "../store/kanbanStore";

const ProjectSidebar = () => {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const {
    projects,
    currentProjectId,
    addProject,
    renameProject,
    deleteProject,
    setCurrentProject,
  } = useKanbanStore();

  const handleAdd = () => {
    if (name.trim()) {
      addProject(name.trim());
      setName("");
    }
  };

  const startEditing = (projId: string, projName: string) => {
    setEditingId(projId);
    setEditName(projName);
  };

  const handleRename = () => {
    if (editingId && editName.trim()) {
      renameProject(editingId, editName.trim());
      setEditingId(null);
    }
  };

  const handleDelete = (projId: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(projId);
    }
  };

  return (
    <div className="sidebar">
      <h2>Projects</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New project"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {projects.map((proj) => (
          <li
            key={proj.id}
            className={proj.id === currentProjectId ? "active" : ""}
            onClick={() => setCurrentProject(proj.id)}
          >
            {editingId === proj.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={handleRename}
                  autoFocus
                />
              </>
            ) : (
              <>
                <span>{proj.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(proj.id, proj.name);
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(proj.id);
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectSidebar;
