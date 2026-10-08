import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentAccount, getCurrentTasks, saveCurrentTasks } from "../authStorage";
import UserSidebar from "./user_side_par";
import "../style.css";

export default function UserTasksPage() {
    const [account] = useState(getCurrentAccount);
    const [tasks, setTasks] = useState(getCurrentTasks);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        function refreshAssignedTasks(event) {
            if (event.key === "monazem-demo-account") {
                setTasks(getCurrentTasks());
            }
        }

        window.addEventListener("storage", refreshAssignedTasks);
        return () => window.removeEventListener("storage", refreshAssignedTasks);
    }, []);

    function saveTasks(nextTasks) {
        try {
            saveCurrentTasks(nextTasks);
            setTasks(nextTasks);
            setMessage("");
        } catch (error) {
            setMessage(error.message || "Unable to save your tasks.");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        saveTasks([
            ...tasks,
            { id: `${Date.now()}`, title: trimmedTitle, completed: false },
        ]);
        setTitle("");
    }

    function toggleTask(taskId) {
        saveTasks(tasks.map((task) => (
            task.id === taskId ? { ...task, completed: !task.completed } : task
        )));
    }

    function removeTask(taskId) {
        saveTasks(tasks.filter((task) => task.id !== taskId));
    }

    if (!account || account.role === "admin") {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>{account ? "User workspace only" : "Log in to view your tasks"}</h1>
                    <p>{account ? "Admin accounts use the admin workspace to manage assigned tasks." : "Your personal task list is available after you log in."}</p>
                    <Link className="dashboard-action" to={account ? "/admin/add-tasks" : "/login"}>
                        {account ? "Go to admin workspace" : "Go to login"}
                    </Link>
                </section>
            </main>
        );
    }

    const completedCount = tasks.filter((task) => task.completed).length;

    return (
        <main className="user-dashboard">
            <UserSidebar />
            <section className="dashboard-main" aria-labelledby="tasks-title">
                <header className="dashboard-heading">
                    <span className="visual-label">YOUR WORKSPACE</span>
                    <h1 id="tasks-title">My tasks</h1>
                    <p>Keep your priorities clear and make progress one task at a time.</p>
                </header>

                <section className="task-summary-card" aria-label="Task progress">
                    <div>
                        <span className="summary-label">YOUR PROGRESS</span>
                        <strong>{completedCount} <span>/ {tasks.length}</span></strong>
                        <p>tasks completed</p>
                    </div>
                    <div className="task-summary-progress" aria-hidden="true">
                        <span style={{ width: `${tasks.length ? completedCount / tasks.length * 100 : 0}%` }} />
                    </div>
                </section>

                <section className="task-list-card" aria-labelledby="task-list-title">
                    <div className="task-list-heading">
                        <div>
                            <h2 id="task-list-title">Task list</h2>
                            <p>{tasks.length ? "Your tasks, including work assigned by your admin." : "Add a task to get started."}</p>
                        </div>
                    </div>
                    <form className="task-create-form" onSubmit={handleSubmit}>
                        <label className="visually-hidden" htmlFor="new-task">New task</label>
                        <input
                            id="new-task"
                            type="text"
                            maxLength={160}
                            placeholder="What needs to get done?"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />
                        <button className="dashboard-action" type="submit">Add task</button>
                    </form>

                    {message && <p className="settings-message" role="alert">{message}</p>}

                    {tasks.length > 0 && (
                        <ul className="dashboard-task-list">
                            {tasks.map((task) => (
                                <li className={`dashboard-task${task.completed ? " is-complete" : ""}`} key={task.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                        />
                                        <span>
                                            {task.title}
                                            {task.assignedBy && (
                                                <small className="task-assignment-note">
                                                    Assigned by {getCurrentAccount()?.email === task.assignedBy
                                                        ? "you"
                                                        : task.assignedBy}
                                                </small>
                                            )}
                                        </span>
                                    </label>
                                    <button
                                        className="task-remove"
                                        type="button"
                                        onClick={() => removeTask(task.id)}
                                        aria-label={`Delete ${task.title}`}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </section>
        </main>
    );
}
