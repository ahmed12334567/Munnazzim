import { useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentAccount } from "../authStorage";
import UserSidebar from "./user_side_par";
import "../style.css";

export default function UserTeamPage() {
    const [account] = useState(getCurrentAccount);

    if (!account || account.role === "admin") {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>{account ? "User workspace only" : "Log in to view your teams"}</h1>
                    <p>{account ? "Admin accounts can view team membership from the admin workspace." : "Log in to see the teams you have been added to."}</p>
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
            <section className="dashboard-main" aria-labelledby="user-team-title">
                <header className="dashboard-heading">
                    <span className="visual-label">YOUR WORKSPACE</span>
                    <h1 id="user-team-title">My teams</h1>
                    <p>Team membership will appear here when the backend provides a membership API.</p>
                </header>

                <section className="dashboard-empty team-empty">
                    <h2>Team memberships are not available yet</h2>
                    <p>The current backend has no team listing or invitation endpoints, so there is no server-backed membership data to show.</p>
                    <Link className="dashboard-action" to="/user/tasks">View my tasks</Link>
                </section>
            </section>
        </main>
    );
}
