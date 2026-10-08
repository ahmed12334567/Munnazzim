import {Link} from "react-router-dom";
export default function Nav() {
    return (
        <>
            <div className="container">
                <div className="nav_brand">
                    <a className="login-brand" href="/" aria-label="Monazem home">
                        <span className="brand-mark" aria-hidden="true">M</span>
                        <span>Monazem</span>
                    </a>
                </div>
                <div className="nav_links">

                        <Link  href="/Home">About</Link>
                        <Link  href="/services">Services</Link>
                        <Link  href="/contact">Contact</Link>

                </div>
            </div>
        </>
    )
} 