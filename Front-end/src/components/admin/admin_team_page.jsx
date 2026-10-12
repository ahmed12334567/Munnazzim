import { useState } from "react";
import { Link } from "react-router-dom";
import { createProject } from "../../api";
import { getCurrentAccount } from "../authStorage";
import AdminSidebar from "./admin_side_par";
import "../style.css";

export default function AdminTeamPage() {
    const [account] = useState(getCurrentAccount);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [messageIsError, setMessageIsError] = useState(false);
    const [busy, setBusy] = useState(false);

    async function handleCreateProject(event) {
        event.preventDefault();
        setMessage("");
        setBusy(true);

        try {
            await createProject({ name, description });
            setName("");
            setDescription("");
            setMessage("Project created successfully.");
            setMessageIsError(false);
        } catch (error) {
            setMessage(error.message || "Unable to create the project.");
            setMessageIsError(true);
        } finally {
            setBusy(false);
        }
    }

    if (!account || account.role !== "admin") {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>{account ? "Admin access required" : "Log in to continue"}</h1>
                    <p>{account ? "This workspace is only available to admin accounts." : "Log in with an admin account to manage projects."}</p>
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
            <section className="dashboard-main" aria-labelledby="team-title">
                <header className="dashboard-heading">
                    <span className="visual-label">ADMIN WORKSPACE</span>
                    <h1 id="team-title">Projects &amp; team</h1>
                    <p>Create a project using the project endpoint available on this server.</p>
                </header>

                <section className="settings-card create-team-card" aria-labelledby="create-project-title">
                    <div className="task-list-heading">
                        <div>
                            <h2 id="create-project-title">Create a project</h2>
                            <p>The project is created for your signed-in account.</p>
                        </div>
                    </div>
                    <form className="create-team-form" onSubmit={handleCreateProject}>
                        <div className="admin-form-field">
                            <label htmlFor="new-project-name">Project name</label>
                            <input
                                id="new-project-name"
                                type="text"
                                minLength={3}
                                maxLength={100}
                                placeholder="Project name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="admin-form-field">
                            <label htmlFor="new-project-description">Description</label>
                            <textarea
                                id="new-project-description"
                                minLength={20}
                                maxLength={1000}
                                rows={4}
                                placeholder="Describe the project (at least 20 characters)"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                required
                            />
                        </div>
                        <button className="dashboard-action" type="submit" disabled={busy}>
                            {busy ? "Creating project…" : "Create project"}
                        </button>
                    </form>
                    {message && (
                        <p className={`settings-message${messageIsError ? " is-error" : ""}`} role={messageIsError ? "alert" : "status"}>
                            {message}
                        </p>
                    )}
                </section>

                <section className="task-list-card team-list-card" aria-labelledby="team-capabilities-title">
                    <div className="task-list-heading">
                        <div>
                            <h2 id="team-capabilities-title">Team management availability</h2>
                            <p>The current backend does not expose the endpoints needed for team member search or invitations.</p>
                        </div>
                    </div>
                    <p className="settings-help">
                        User search, invitation sending, received invitations, accept/reject actions, project listing, and member listing are not available through the current API.
                    </p>
                </section>
            </section>
        </main>
    );
}
