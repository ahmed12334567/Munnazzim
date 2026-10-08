import { useState } from "react";
import { Link } from "react-router-dom";
import {
    addTaskToAccount,
    getCurrentAccount,
    getTeamAccounts,
} from "../authStorage";
import AdminSidebar from "./admin_side_par";
import "../style.css";

export default function AdminAddTasksPage() {
    const [account] = useState(getCurrentAccount);
    const [users] = useState(() => getTeamAccounts().filter((member) => member.role === "user"));
    const [userEmail, setUserEmail] = useState(users[0]?.email ?? "");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [messageIsError, setMessageIsError] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        const taskTitle = title.trim();
        if (!taskTitle || !userEmail) return;

        try {
            addTaskToAccount(userEmail, taskTitle);
            const assignedUser = users.find((user) => user.email === userEmail);
            setTitle("");
            setMessage(`Task assigned to ${assignedUser?.name ?? "the selected user"}.`);
            setMessageIsError(false);
        } catch (error) {
            setMessage(error.message || "Unable to assign this task.");
            setMessageIsError(true);
        }
    }

    if (!account || account.role !== "admin") {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>{account ? "Admin access required" : "Log in to continue"}</h1>
                    <p>{account ? "This workspace is only available to admin accounts." : "Log in with an admin account to manage tasks."}</p>
                    <Link className="dashboard-action" to={account ? "/user/tasks" : "/login"}>
                        {account ? "Go to my tasks" : "Go to login"}
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="user-dashboard">
            <AdminSidebar />
            <section className="dashboard-main" aria-labelledby="admin-tasks-title">
                <header className="dashboard-heading">
                    <span className="visual-label">ADMIN WORKSPACE</span>
                    <h1 id="admin-tasks-title">Assign a task</h1>
                    <p>Create a task and add it to a team member&apos;s task list.</p>
                </header>

                <section className="settings-card admin-form-card">
                    {users.length === 0 ? (
                        <div className="admin-no-users">
                            <h2>No user accounts yet</h2>
                            <p>Once users have created accounts, you can assign work to them here.</p>
                            <Link className="dashboard-action" to="/admin/team">View team</Link>
                        </div>
                    ) : (
                        <form className="admin-task-form" onSubmit={handleSubmit}>
                            <div className="admin-form-field">
                                <label htmlFor="task-assignee">Assign to</label>
                                <select
                                    id="task-assignee"
                                    value={userEmail}
                                    onChange={(event) => setUserEmail(event.target.value)}
                                    required
                                >
                                    {users.map((user) => (
                                        <option key={user.email} value={user.email}>
                                            {user.name} — {user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="admin-form-field">
                                <label htmlFor="admin-task-title">Task name</label>
                                <input
                                    id="admin-task-title"
                                    type="text"
                                    maxLength={160}
                                    placeholder="Describe the task"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    required
                                />
                            </div>
                            <button className="dashboard-action" type="submit">Assign task</button>
                        </form>
                    )}
                    {message && (
                        <p className={`settings-message${messageIsError ? " is-error" : ""}`} role={messageIsError ? "alert" : "status"}>
                            {message}
                        </p>
                    )}
                </section>
            </section>
        </main>
    );
}
