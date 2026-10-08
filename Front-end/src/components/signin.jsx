import { useState } from "react";
import { createAccount } from "./authStorage";
import "./style.css";
import { Link } from "react-router-dom";

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [created, setCreated] = useState(false);
    const [busy, setBusy] = useState(false);

    function updateField(event) {
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setBusy(true);

        try {
            await createAccount(formData);
            setCreated(true);
            setMessage("Account created. You can now log in.");
        } catch (error) {
            setMessage(error.message || "Unable to create your account.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card" aria-label="Create account">
                <aside className="login-visual">
                    <a className="login-brand" href="/" aria-label="Monazem home">
                        <span className="brand-mark" aria-hidden="true">M</span>
                        <span>Monazem</span>
                    </a>

                    <div className="visual-copy">
                        <span className="visual-label">A CLEARER WAY TO WORK</span>
                        <h1>Make room for your best work.</h1>
                        <p>Create your account and get your workspace organized.</p>
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
                        <span className="form-eyebrow">GET STARTED</span>
                        <h2>Create your account</h2>
                        <p>Enter your details to join Monazem.</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="signup-name">Full name</label>
                            <input
                                id="signup-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                minLength={2}
                                maxLength={80}
                                placeholder="Your name"
                                value={formData.name}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="signup-email">Email</label>
                            <input
                                id="signup-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                maxLength={254}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="signup-password">Password</label>
                            <input
                                id="signup-password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={128}
                                placeholder="At least 8 characters"
                                value={formData.password}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="signup-confirm-password">Confirm password</label>
                            <input
                                id="signup-confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={128}
                                placeholder="Enter your password again"
                                value={formData.confirmPassword}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <button className="login-submit" type="submit" disabled={busy || created}>
                            <span>{busy ? "Creating account…" : "Create account"}</span>
                            <span aria-hidden="true">→</span>
                        </button>

                        {message && (
                            <p className="form-message" role="status">{message}</p>
                        )}
                    </form>

                    <p className="login-note">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}