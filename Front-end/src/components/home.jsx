import { Link } from "react-router-dom";
import Nav from "./Nav";
import "./style.css";

const features = [
    {
        number: "01",
        title: "Plan your work",
        description: "Bring tasks together in one place and make the next steps clear.",
    },
    {
        number: "02",
        title: "Stay on track",
        description: "Keep priorities and deadlines visible as work moves forward.",
    },
    {
        number: "03",
        title: "See your progress",
        description: "Get a clearer view of what is done and what still needs attention.",
    },
];

export default function Home() {
    return (
        <main className="project-home">
            <Nav />

            <section className="home-hero" aria-labelledby="home-title">
                <div className="home-hero-copy">
                    <span className="visual-label">A CALMER WAY TO GET THINGS DONE</span>
                    <h1 id="home-title">
                        Make every task
                        <span> move you forward.</span>
                    </h1>
                    <p>
                        Monazem is a task management system designed to help you
                        organize your work, focus on priorities, and follow progress
                        from start to finish.
                    </p>
                    <div className="home-actions">
                        <Link className="home-primary-action" to="/signup">
                            Get started <span aria-hidden="true">→</span>
                        </Link>
                        <Link className="home-secondary-action" to="/login">
                            Log in to your account
                        </Link>
                    </div>
                </div>

                <div className="home-preview" aria-label="Task management overview">
                    <div className="preview-header">
                        <div>
                            <span className="preview-kicker">YOUR WORKSPACE</span>
                            <h2>Today&apos;s focus</h2>
                        </div>
                        <span className="preview-date">THU, OCT 08</span>
                    </div>
                    <div className="preview-progress">
                        <div className="progress-copy">
                            <span>Daily progress</span>
                            <strong>3 of 5 tasks</strong>
                        </div>
                        <div className="progress-track" aria-label="60% complete">
                            <span />
                        </div>
                    </div>
                    <ul className="preview-tasks">
                        <li className="preview-task is-complete">
                            <span className="task-check" aria-hidden="true">✓</span>
                            <span>Outline this week&apos;s priorities</span>
                            <span className="task-tag">DONE</span>
                        </li>
                        <li className="preview-task is-complete">
                            <span className="task-check" aria-hidden="true">✓</span>
                            <span>Review project updates</span>
                            <span className="task-tag">DONE</span>
                        </li>
                        <li className="preview-task">
                            <span className="task-check" aria-hidden="true" />
                            <span>Prepare the next milestone</span>
                            <span className="task-tag task-tag-active">IN PROGRESS</span>
                        </li>
                    </ul>
                    <div className="preview-footer">
                        One clear step at a time.
                    </div>
                </div>
            </section>

            <section className="home-features" aria-labelledby="features-title">
                <div className="features-heading">
                    <span className="visual-label">THE PROJECT</span>
                    <h2 id="features-title">Less scattered. More in sync.</h2>
                    <p>
                        A straightforward workspace for managing tasks and keeping
                        meaningful work moving.
                    </p>
                </div>
                <div className="feature-grid">
                    {features.map((feature) => (
                        <article className="feature-card" key={feature.number}>
                            <span className="feature-number">{feature.number}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
