import { useState } from "react";
import { Link } from "react-router-dom";
import {
    addMembersToTeam,
    createTeam,
    getAllTeams,
    getCurrentAccount,
    getTeamAccounts,
} from "../authStorage";
import AdminSidebar from "./admin_side_par";
import "../style.css";

export default function AdminTeamPage() {
    const [account] = useState(getCurrentAccount);
    const [members] = useState(getTeamAccounts);
    const [teams, setTeams] = useState(getAllTeams);
    const [teamName, setTeamName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [message, setMessage] = useState("");
    const [messageIsError, setMessageIsError] = useState(false);
    const [teamSelections, setTeamSelections] = useState({});

    if (!account || account.role !== "admin") {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>{account ? "Admin access required" : "Log in to continue"}</h1>
                    <p>{account ? "This workspace is only available to admin accounts." : "Log in with an admin account to view the team."}</p>
                    <Link className="dashboard-action" to={account ? "/user/tasks" : "/login"}>
                        {account ? "Go to my tasks" : "Go to login"}
                    </Link>
                </section>
            </main>
        );
    }

    const users = members.filter((member) => member.role === "user");
    const admins = members.filter((member) => member.role === "admin");

    function toggleMember(email) {
        setSelectedMembers((selected) => (
            selected.includes(email)
                ? selected.filter((memberEmail) => memberEmail !== email)
                : [...selected, email]
        ));
    }

    function handleCreateTeam(event) {
        event.preventDefault();
        try {
            const team = createTeam(teamName, selectedMembers);
            setTeams(getAllTeams());
            setTeamName("");
            setSelectedMembers([]);
            setMessage(`Team "${team.name}" created.`);
            setMessageIsError(false);
        } catch (error) {
            setMessage(error.message || "Unable to create the team.");
            setMessageIsError(true);
        }
    }

    function toggleTeamMember(teamId, email) {
        setTeamSelections((selections) => {
            const selected = selections[teamId] ?? [];
            return {
                ...selections,
                [teamId]: selected.includes(email)
                    ? selected.filter((memberEmail) => memberEmail !== email)
                    : [...selected, email],
            };
        });
    }

    function handleAddTeamMembers(event, teamId) {
        event.preventDefault();
        const selected = teamSelections[teamId] ?? [];
        try {
            addMembersToTeam(teamId, selected);
            setTeams(getAllTeams());
            setTeamSelections((selections) => ({ ...selections, [teamId]: [] }));
            setMessage("Team members added.");
            setMessageIsError(false);
        } catch (error) {
            setMessage(error.message || "Unable to add team members.");
            setMessageIsError(true);
        }
    }

    return (
        <main className="user-dashboard">
            <AdminSidebar />
            <section className="dashboard-main" aria-labelledby="team-title">
                <header className="dashboard-heading">
                    <span className="visual-label">ADMIN WORKSPACE</span>
                    <h1 id="team-title">Team</h1>
                    <p>Review workspace accounts and each member&apos;s task progress.</p>
                </header>

                <section className="team-summary-grid" aria-label="Team overview">
                    <article className="team-summary-card">
                        <span>TEAM MEMBERS</span>
                        <strong>{users.length}</strong>
                    </article>
                    <article className="team-summary-card">
                        <span>ADMIN ACCOUNTS</span>
                        <strong>{admins.length}</strong>
                    </article>
                    <article className="team-summary-card">
                        <span>TEAMS</span>
                        <strong>{teams.length}</strong>
                    </article>
                    <article className="team-summary-card">
                        <span>OPEN TASKS</span>
                        <strong>{users.reduce((total, member) => total + member.tasks.filter((task) => !task.completed).length, 0)}</strong>
                    </article>
                </section>

                <section className="settings-card create-team-card" aria-labelledby="create-team-title">
                    <div className="task-list-heading">
                        <div>
                            <h2 id="create-team-title">Create a team</h2>
                            <p>Name the team and select the users to add.</p>
                        </div>
                    </div>
                    <form className="create-team-form" onSubmit={handleCreateTeam}>
                        <label className="visually-hidden" htmlFor="new-team-name">Team name</label>
                        <input
                            id="new-team-name"
                            type="text"
                            maxLength={80}
                            placeholder="Team name"
                            value={teamName}
                            onChange={(event) => setTeamName(event.target.value)}
                            required
                        />
                        {users.length > 0 ? (
                            <fieldset className="team-member-picker">
                                <legend>Add users to this team</legend>
                                {users.map((user) => (
                                    <label className="team-picker-option" key={user.email}>
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(user.email)}
                                            onChange={() => toggleMember(user.email)}
                                        />
                                        <span>{user.name}</span>
                                        <small>{user.email}</small>
                                    </label>
                                ))}
                            </fieldset>
                        ) : (
                            <p className="settings-help">Create user accounts before adding team members.</p>
                        )}
                        <button className="dashboard-action" type="submit">Create team</button>
                    </form>
                    {message && (
                        <p className={`settings-message${messageIsError ? " is-error" : ""}`} role={messageIsError ? "alert" : "status"}>
                            {message}
                        </p>
                    )}
                </section>

                <section className="task-list-card team-list-card" aria-labelledby="teams-list-title">
                    <div className="task-list-heading">
                        <div>
                            <h2 id="teams-list-title">Teams</h2>
                            <p>{teams.length ? "Teams and their current members." : "No teams have been created yet."}</p>
                        </div>
                    </div>
                    {teams.length > 0 && (
                        <ul className="admin-team-list">
                            {teams.map((team) => (
                                <li className="admin-team-row" key={team.id}>
                                    <div className="admin-team-name">
                                        <strong>{team.name}</strong>
                                        <span>{team.members.length} {team.members.length === 1 ? "member" : "members"}</span>
                                    </div>
                                    <div className="admin-team-chips">
                                        {team.members.map((member) => (
                                            <span className="admin-team-chip" key={member.email}>
                                                {member.name}
                                            </span>
                                        ))}
                                        {team.members.length === 0 && <span className="settings-help">No members added.</span>}
                                    </div>
                                    <form
                                        className="add-team-members-form"
                                        onSubmit={(event) => handleAddTeamMembers(event, team.id)}
                                    >
                                        <fieldset className="team-member-picker">
                                            <legend>Add users</legend>
                                            {users.filter((user) => !team.memberEmails.includes(user.email)).length > 0 ? (
                                                users
                                                    .filter((user) => !team.memberEmails.includes(user.email))
                                                    .map((user) => (
                                                        <label className="team-picker-option" key={user.email}>
                                                            <input
                                                                type="checkbox"
                                                                checked={(teamSelections[team.id] ?? []).includes(user.email)}
                                                                onChange={() => toggleTeamMember(team.id, user.email)}
                                                            />
                                                            <span>{user.name}</span>
                                                            <small>{user.email}</small>
                                                        </label>
                                                    ))
                                            ) : (
                                                <span className="settings-help">All users are already on this team.</span>
                                            )}
                                        </fieldset>
                                        <button className="dashboard-action" type="submit">Add members</button>
                                    </form>
                                </li>
                            ))}
                        </ul>
                    )}
                    {message && (
                        <p className={`settings-message${messageIsError ? " is-error" : ""}`} role={messageIsError ? "alert" : "status"}>
                            {message}
                        </p>
                    )}
                </section>

                <section className="task-list-card team-list-card" aria-labelledby="team-list-title">
                    <div className="task-list-heading">
                        <div>
                            <h2 id="team-list-title">User accounts</h2>
                            <p>{users.length ? "Users in this workspace." : "No user accounts found."}</p>
                        </div>
                        <Link className="dashboard-action" to="/admin/add-tasks">Assign a task</Link>
                    </div>

                    {users.length > 0 && (
                        <ul className="team-member-list">
                            {users.map((member) => {
                                const completed = member.tasks.filter((task) => task.completed).length;
                                const open = member.tasks.length - completed;
                                return (
                                    <li className="team-member" key={member.email}>
                                        <div className="team-member-avatar" aria-hidden="true">
                                            {member.photo
                                                ? <img src={member.photo} alt="" />
                                                : member.name?.trim().charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div className="team-member-info">
                                            <strong>{member.name}</strong>
                                            <span>{member.email}</span>
                                        </div>
                                        <div className="team-member-tasks">
                                            <strong>{open} open</strong>
                                            <span>{completed} completed</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </section>
        </main>
    );
}
