import { Link } from "react-router-dom";

export default function Nav() {
    return (
        <header className="site-nav">
            <Link className="login-brand" to="/" aria-label="Monazem home">
                <span className="brand-mark" aria-hidden="true">M</span>
                <span>Monazem</span>
            </Link>
            <nav className="nav_links" aria-label="Main navigation">
                <Link to="/Home">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signin</Link>
            </nav>
        </header>
    );
}