// TaskBoard.tsx
import React, { useState } from "react";
import { useKanbanStore, TaskStatus, Task } from "../store/kanbanStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

const statusOrder: TaskStatus[] = ["todo", "inProgress", "done"];

const TaskBoard = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState("");

  const { tasks, currentProjectId, addTask, moveTask, deleteTask } = useKanbanStore();

  const handleAddTask = () => {
    if (title && currentProjectId) {
      addTask({
        title,
        description: desc,
        status,
        projectId: currentProjectId,
        dueDate,
      });
      setTitle("");
      setDesc("");
      setDueDate("");
      setStatus("todo");
    }
  };

  const grouped: Record<TaskStatus, Task[]> = {
    todo: [],
    inProgress: [],
    done: [],
  };

  tasks
    .filter((t) => t.projectId === currentProjectId)
    .forEach((t) => grouped[t.status].push(t));

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId as TaskStatus;
    moveTask(draggableId, newStatus);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="board">
      <div className="board-header">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns">
          {statusOrder.map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3>{col.toUpperCase()}</h3>
                  {grouped[col].map((t, index) => (
                    <Draggable draggableId={t.id} index={index} key={t.id}>
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h4>{t.title}</h4>
                          <p>{t.description}</p>
                          <p>Created: {new Date(t.createdAt).toLocaleString()}</p>
                          <p>
                            Due: {t.dueDate} {isOverdue(t.dueDate) && <span style={{ color: "red" }}>(Overdue)</span>}
                          </p>
                          <button
                            onClick={() =>
                              moveTask(
                                t.id,
                                col === "todo"
                                  ? "inProgress"
                                  : col === "inProgress"
                                  ? "done"
                                  : "todo"
                              )
                            }
                          >
                            Move
                          </button>
                          <button onClick={() => deleteTask(t.id)}>Delete</button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
