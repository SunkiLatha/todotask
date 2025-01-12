import React, { useState, useEffect } from "react";
import "./style.css";

function Todo() {
  const [todoTask, setTodoTask] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:5000/posts");
      const data = await response.json();
      setTodoTask(data);
    };
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
  };

  const addTask = async () => {
    if (inputVal.trim()) {
      if (editIndex !== null && todoTask[editIndex]) {
        const updatedTask = {
          text: inputVal,
          completed: todoTask[editIndex].completed,
        };
        await fetch(`http://localhost:5000/posts/${todoTask[editIndex].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        });
        const updatedTasks = todoTask.map((task, index) =>
          index === editIndex ? updatedTask : task
        );
        setTodoTask(updatedTasks);
        setEditIndex(null);
      } else {
        const newTask = { text: inputVal, completed: false };
        const response = await fetch("http://localhost:5000/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        });
        const createdTask = await response.json();
        setTodoTask([...todoTask, createdTask]);
      }
      setInputVal("");
    }
  };

  const editTask = (index) => {
    setInputVal(todoTask[index].text);
    setEditIndex(index);
  };

  const deleteTask = async (index) => {
    await fetch(`http://localhost:5000/posts/${todoTask[index].id}`, {
      method: "DELETE",
    });
    const updatedTasks = todoTask.filter((_, i) => i !== index);
    setTodoTask(updatedTasks);
  };

  const toggleCompletion = async (index) => {
    const updatedTask = {
      ...todoTask[index],
      completed: !todoTask[index].completed,
    };
    await fetch(`http://localhost:5000/posts/${todoTask[index].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    const updatedTasks = todoTask.map((task, i) =>
      i === index ? updatedTask : task
    );
    setTodoTask(updatedTasks);
  };

  return (
    <div className="container">
      <h1>ToDo List</h1>
      <input
        value={inputVal}
        onChange={handleInputChange}
        placeholder="Enter a task"
      />
      <br />
      <button onClick={addTask}>
        {editIndex !== null ? "Update Task" : "Add Task"}
      </button>
      <ul>
        {todoTask.map((task, index) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(index)}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
            <div>
              <button className="edit-button" onClick={() => editTask(index)}>
                Edit
              </button>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
