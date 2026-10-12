import { Link } from "react-router-dom";
import { getCurrentAccount } from "../authStorage";
import AdminSidebar from "./admin_side_par";
import "../style.css";

export default function AdminAddTasksPage() {
    const account = getCurrentAccount();

    if (!account || account.role !== "admin") {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>{account ? "Admin access required" : "Log in to continue"}</h1>
                    <p>{account ? "This workspace is only available to admin accounts." : "Log in with an admin account to continue."}</p>
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
                    <h1 id="admin-tasks-title">Task management</h1>
                    <p>Task assignments are not available through the current backend.</p>
                </header>

                <section className="dashboard-empty">
                    <h2>No task endpoints are available</h2>
                    <p>The backend currently has no task creation, assignment, or listing operations. No local-only task changes are made here.</p>
                    <Link className="dashboard-action" to="/admin/team">Create a project</Link>
                </section>
            </section>
        </main>
    );
}
