import { useState } from "react";
import { checkAccount } from "./authStorage";
import "./style.css";
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setBusy(true);

        try {
            const valid = await checkAccount({ email, password });
            setMessage(
                valid
                    ? "Login successful."
                    : "Email or password is incorrect. If you’re new, create an account first."
            );
        } catch {
            setMessage("Unable to log in. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card" aria-label="Log in">
                <aside className="login-visual">
                    <a className="login-brand" href="/" aria-label="Monazem home">
                        <span className="brand-mark" aria-hidden="true">M</span>
                        <span>Monazem</span>
                    </a>

                    <div className="visual-copy">
                        <span className="visual-label">YOUR WORKSPACE, IN SYNC</span>
                        <h1>Everything in its place.</h1>
                        <p>Log in to pick up where you left off and keep your work moving.</p>
                    </div>

                    <div className="visual-art" aria-hidden="true">
                        <span className="art-orbit art-orbit-one" />
                        <span className="art-orbit art-orbit-two" />
                        <span className="art-core" />
                        <span className="art-dot art-dot-one" />
                        <span className="art-dot art-dot-two" />
                    </div>

                    <span className="visual-footer">FOCUSED WORK. CLEAR PROGRESS.</span>
                </aside>

                <div className="login-form-panel">
                    <div className="form-heading">
                        <span className="form-eyebrow">WELCOME BACK</span>
                        <h2>Log in to your account</h2>
                        <p>Enter your details below to continue.</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="login-password">Password</label>
                            <div className="password-input">
                                <input
                                    id="login-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                <button
                                    className="password-toggle"
                                    type="button"
                                    onClick={() => setShowPassword((shown) => !shown)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <label className="remember-option">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) => setRememberMe(event.target.checked)}
                            />
                            <span>Remember me</span>
                        </label>

                        <button className="login-submit" type="submit" disabled={busy}>
                            <span>{busy ? "Logging in…" : "Login"}</span>
                            <span aria-hidden="true">→</span>
                        </button>

                        {message && (
                            <p className="form-message" role="status">{message}</p>
                        )}
                    </form>

                    <p className="login-note">
                        Already have an account? <Link to="/signup">Create one</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}