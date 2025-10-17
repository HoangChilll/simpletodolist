import axios from "axios";
import React, { useState, useEffect } from "react"; 
export default function Header() {
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("medium");
    const [tasks, setTasks] = useState({
        immediate: [],
        medium: [],
        light: []
    })
   useEffect(() => {
        loadTasks();
    }, []);
   const loadTasks = async () => {
        try {
            const tasksData = await fetchTasks();
            setTasks(tasksData);
        } catch (error) {
            console.error("Lỗi khi tải tasks:", error);
        }
    };
    // function sends data back to the database for processing
const addTask = async () => {
    if (task.trim() !== "") {
        try {
            const res = await axios.post("http://localhost:3000/add", {
                task: task,
                priority: priority,
            });
            console.log("Server response:", res.data);
            const newTask = {
                id: res.data.id || Date.now(),
                text: task,
                completed: false,
                priority: priority
            };
            setTasks(prev => ({
                ...prev,
                [priority]: [...prev[priority], newTask]
            }));
            // reset input
            setTask("");
            setPriority("medium");
        } catch (err) {
            console.error("Error sending data:", err);
        }
    }
};
const fetchTasks = async () => {
    try {
        console.log("🟡 Calling API...");
        const res = await axios.get("http://localhost:3000/tasks");
        console.log("🟢 Status:", res.status);
        console.log("📦 Data:", res.data);
        console.log("📦 Data type:", typeof res.data);
        console.log("📦 Data length:", Array.isArray(res.data) ? res.data.length : 'not array');
        const allTasks = res.data;
        console.log("🔍 All tasks:", allTasks);
        console.log("🔍 Immediate tasks:", allTasks.filter(task => task.priority === 'immediate'));
        console.log("🔍 Medium tasks:", allTasks.filter(task => task.priority === 'medium'));
        console.log("🔍 Light tasks:", allTasks.filter(task => task.priority === 'light'));
        
        const formattedTasks = {
            immediate: allTasks.filter(task => task.priority === 'immediate'),
            medium: allTasks.filter(task => task.priority === 'medium'),
            light: allTasks.filter(task => task.priority === 'light')
        }; 
        console.log("✅ Formatted tasks:", formattedTasks);
        return formattedTasks;
    } catch (err) {
        console.error("❌ Error getting data:", err);
        console.error("❌ Error response:", err.response?.data);
        throw err;
    }
};

    const toggleTask = (priority, taskId) => {
        setTasks(prev => ({
            ...prev,
            [priority]: prev[priority].map(task => 
                task.id === taskId 
                    ? { ...task, completed: !task.completed }
                    : task
            )
        }));
    };

    const deleteTask = async (priority, taskId) => {
       try {
              setTasks(prev => ({
                ...prev,
                [priority]: prev[priority].filter(task => task.id !== taskId)
            }));
        const res = await axios.delete("http://localhost:3000/delete", {
            data: {  
                id: taskId,
                priority: priority
            }
          }
          )
       await loadTasks();

        console.log("Server response:", res.data);

        // reset input
      } catch (err) {
        console.error("Error sending data:", err);
      }         
    };

    const priorityConfig = {
        immediate: {
            badge: "🔥 IMMEDIATE",
            title: "High Priority Tasks",
            class: "immediate"
        },
        medium: {
            badge: "⚡ MEDIUM", 
            title: "Medium Priority Tasks",
            class: "medium"
        },
        light: {
            badge: "💡 LIGHT",
            title: "Light Priority Tasks", 
            class: "light"
        }
    };

    return (
      <>
        <div className="container">
            <h1>📝 Today's Tasks</h1>
            <div className="date" id="currentDate"></div>

            <div className="add-task">
                <input
                    type="text"
                    className="task-input"
                    id="taskInput"
                    placeholder="Add a new task..."
                    onChange={(e) => setTask(e.target.value)} 
                />
                <select className="priority-select" 
                        id="prioritySelect"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}>
                    <option value="immediate">Immediate</option>
                    <option value="medium">Medium</option>
                    <option value="light">Light</option>
                </select>
                <button
                    className="btn btn-add"
                    onClick={() => addTask()}
                >
                    Add Task
                </button>
            </div>
        </div>
        <div>
            {Object.entries(priorityConfig).map(([priority, config]) => (
                <div key={priority} className="priority-section">
                    <div className={`priority-header ${config.class}`}>
                        <span className={`priority-badge ${config.class}`}>
                            {config.badge}
                        </span>
                        <span className="priority-title">{config.title}</span>
                    </div>
                    <ul className="task-list">
                        {tasks[priority].length === 0 ? (
                            <li className="empty-message">No {priority} priority tasks</li>
                        ) : (
                            tasks[priority].map(task => (
                                <li 
                                    key={task.id} 
                                    className={`task-item ${task.completed ? 'completed' : ''}`}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="task-checkbox" 
                                        checked={task.completed || false}
                                        onChange={() => toggleTask(priority, task.id)}
                                    />
                                    <span className="task-text"> {task.task || task.text || task.content || task.name || "No task name"}</span>
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => deleteTask(priority, task.id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            ))}
        </div>
        </>
    );
}
