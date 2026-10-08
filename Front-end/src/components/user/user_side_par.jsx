import { useNavigate, NavLink, Link } from "react-router-dom";
import { clearCurrentAccount, getCurrentAccount } from "../authStorage";

export default function UserSidebar() {
    const navigate = useNavigate();
    const account = getCurrentAccount();
    const initials = account?.name?.trim().charAt(0).toUpperCase() || "U";

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

            <div className="sidebar-section-label">WORKSPACE</div>
            <nav className="user-sidebar-nav" aria-label="User workspace">
                <NavLink
                    className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
                    to="/user/tasks"
                >
                    <span className="sidebar-link-icon" aria-hidden="true">▦</span>
                    My tasks
                </NavLink>
                <NavLink
                    className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
                    to="/user/settings"
                >
                    <span className="sidebar-link-icon" aria-hidden="true">⚙</span>
                    Settings
                </NavLink>
                <NavLink
                    className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
                    to="/user/team"
                >
                    <span className="sidebar-link-icon" aria-hidden="true">♧</span>
                    My teams
                </NavLink>
            </nav>

            <div className="sidebar-account">
                <div className="sidebar-avatar" aria-hidden="true">
                    {account?.photo
                        ? <img src={account.photo} alt="" />
                        : initials}
                </div>
                <div className="sidebar-account-copy">
                    <strong>{account?.name || "Your account"}</strong>
                    <span>{account?.role === "admin" ? "Admin" : "User"}</span>
                </div>
                <button className="sidebar-logout" type="button" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </aside>
    );
}
