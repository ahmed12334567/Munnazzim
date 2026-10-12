import { Link } from "react-router-dom";
import { getCurrentAccount } from "../authStorage";
import UserSidebar from "./user_side_par";
import "../style.css";

export default function UserTasksPage() {
    const account = getCurrentAccount();

    if (!account || account.role === "admin") {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>{account ? "User workspace only" : "Log in to view your tasks"}</h1>
                    <p>{account ? "Admin accounts use the admin workspace." : "Log in to continue."}</p>
                    <Link className="dashboard-action" to={account ? "/admin/team" : "/login"}>
                        {account ? "Go to admin workspace" : "Go to login"}
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="user-dashboard">
            <UserSidebar />
            <section className="dashboard-main" aria-labelledby="tasks-title">
                <header className="dashboard-heading">
                    <span className="visual-label">YOUR WORKSPACE</span>
                    <h1 id="tasks-title">My tasks</h1>
                    <p>Task data will appear here when task endpoints are available.</p>
                </header>

                <section className="dashboard-empty">
                    <h2>Task management is not available yet</h2>
                    <p>The current backend does not provide endpoints to list, create, update, or assign tasks. This page does not save simulated tasks.</p>
                    <Link className="dashboard-action" to="/user/team">View team availability</Link>
                </section>
            </section>
        </main>
    );
}
