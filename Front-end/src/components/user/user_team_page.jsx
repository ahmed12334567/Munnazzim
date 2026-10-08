import { useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentAccount, getCurrentTeams } from "../authStorage";
import UserSidebar from "./user_side_par";
import "../style.css";

export default function UserTeamPage() {
    const [account] = useState(getCurrentAccount);
    const [teams] = useState(getCurrentTeams);

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
                    <p>Teams an admin has added you to.</p>
                </header>

                {teams.length === 0 ? (
                    <section className="dashboard-empty team-empty">
                        <h2>You haven&apos;t joined a team yet</h2>
                        <p>When an admin adds you to a team, it will appear here.</p>
                        <Link className="dashboard-action" to="/user/tasks">View my tasks</Link>
                    </section>
                ) : (
                    <section className="user-team-grid" aria-label="Your teams">
                        {teams.map((team) => (
                            <article className="user-team-card" key={team.id}>
                                <div className="user-team-card-heading">
                                    <span className="team-card-mark" aria-hidden="true">♧</span>
                                    <div>
                                        <h2>{team.name}</h2>
                                        <p>{team.members.length} {team.members.length === 1 ? "member" : "members"}</p>
                                    </div>
                                </div>
                                <ul className="user-team-members">
                                    {team.members.map((member) => (
                                        <li key={member.email}>
                                            <span className="user-team-avatar" aria-hidden="true">
                                                {member.photo
                                                    ? <img src={member.photo} alt="" />
                                                    : member.name?.trim().charAt(0).toUpperCase() || "U"}
                                            </span>
                                            <span className="user-team-member-name">
                                                {member.name}
                                                {member.email === account.email && <small>You</small>}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </section>
                )}
            </section>
        </main>
    );
}
