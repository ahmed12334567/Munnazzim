import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearCurrentAccount, getCurrentAccount } from "../authStorage";

export default function AdminSidebar() {
    const navigate = useNavigate();
    const account = getCurrentAccount();
    const initials = account?.name?.trim().charAt(0).toUpperCase() || "A";

    function handleLogout() {
        clearCurrentAccount();
        navigate("/login");
    }

    return (
        <aside className="user-sidebar">
            <Link className="login-brand user-sidebar-brand" to="/" aria-label="Monazem home">
                <span className="brand-mark" aria-hidden="true">M</span>
                <span>Monazem</span>
            </Link>

            <div className="sidebar-section-label">ADMIN WORKSPACE</div>
            <nav className="user-sidebar-nav" aria-label="Admin workspace">
                <NavLink
                    className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
                    to="/admin/add-tasks"
                >
                    <span className="sidebar-link-icon" aria-hidden="true">＋</span>
                    Assign tasks
                </NavLink>
                <NavLink
                    className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
                    to="/admin/team"
                >
                    <span className="sidebar-link-icon" aria-hidden="true">♧</span>
                    Team
                </NavLink>
                <NavLink
                    className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
                    to="/admin/settings"
                >
                    <span className="sidebar-link-icon" aria-hidden="true">⚙</span>
                    Settings
                </NavLink>
            </nav>

            <div className="sidebar-account">
                <div className="sidebar-avatar" aria-hidden="true">
                    {account?.photo ? <img src={account.photo} alt="" /> : initials}
                </div>
                <div className="sidebar-account-copy">
                    <strong>{account?.name || "Admin account"}</strong>
                    <span>Admin</span>
                </div>
                <button className="sidebar-logout" type="button" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </aside>
    );
}
