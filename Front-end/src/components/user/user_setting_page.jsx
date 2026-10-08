import { useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentAccount, updateProfilePhoto } from "../authStorage";
import UserSidebar from "./user_side_par";
import "../style.css";

const MAX_PHOTO_SIZE = 1024 * 1024;

export default function UserSettingsPage() {
    const [account, setAccount] = useState(getCurrentAccount);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    function handlePhotoChange(event) {
        const file = event.target.files?.[0];
        event.target.value = "";
        setMessage("");
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage("Choose an image file to use as your profile photo.");
            return;
        }

        if (file.size > MAX_PHOTO_SIZE) {
            setMessage("Choose an image smaller than 1 MB.");
            return;
        }

        setBusy(true);
        const reader = new FileReader();
        reader.onload = () => {
            try {
                if (typeof reader.result !== "string") {
                    throw new Error("The selected image could not be read.");
                }
                updateProfilePhoto(reader.result);
                setAccount(getCurrentAccount());
                setMessage("Profile photo updated.");
            } catch (error) {
                setMessage(error.message || "Unable to save the profile photo.");
            } finally {
                setBusy(false);
            }
        };
        reader.onerror = () => {
            setMessage("Unable to read this image. Please try another file.");
            setBusy(false);
        };
        reader.readAsDataURL(file);
    }

    function handleRemovePhoto() {
        try {
            updateProfilePhoto("");
            setAccount(getCurrentAccount());
            setMessage("Profile photo removed.");
        } catch (error) {
            setMessage(error.message || "Unable to remove the profile photo.");
        }
    }

    if (!account) {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>Log in to view your settings</h1>
                    <p>Your profile settings are available after you log in.</p>
                    <Link className="dashboard-action" to="/login">Go to login</Link>
                </section>
            </main>
        );
    }

    const initials = account.name?.trim().charAt(0).toUpperCase() || "U";

    return (
        <main className="user-dashboard">
            <UserSidebar />
            <section className="dashboard-main" aria-labelledby="settings-title">
                <header className="dashboard-heading">
                    <span className="visual-label">YOUR ACCOUNT</span>
                    <h1 id="settings-title">Settings</h1>
                    <p>Manage your profile and personal details.</p>
                </header>

                <section className="settings-card" aria-labelledby="profile-title">
                    <div className="settings-card-heading">
                        <div>
                            <h2 id="profile-title">Profile photo</h2>
                            <p>Choose a photo to help personalize your workspace.</p>
                        </div>
                    </div>

                    <div className="profile-photo-editor">
                        <div className="profile-photo-preview">
                            {account.photo
                                ? <img src={account.photo} alt={`${account.name} profile`} />
                                : <span aria-hidden="true">{initials}</span>}
                        </div>
                        <div className="profile-photo-controls">
                            <label className={`dashboard-action${busy ? " is-disabled" : ""}`}>
                                {busy ? "Uploading photo…" : "Browse device"}
                                <input
                                    className="photo-file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    disabled={busy}
                                />
                            </label>
                            {account.photo && (
                                <button
                                    className="dashboard-text-action"
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    disabled={busy}
                                >
                                    Remove photo
                                </button>
                            )}
                            <span className="settings-help">Image files only, up to 1 MB.</span>
                        </div>
                    </div>

                    {message && <p className="settings-message" role="status">{message}</p>}
                </section>

                <section className="settings-card account-details" aria-labelledby="account-title">
                    <h2 id="account-title">Account details</h2>
                    <dl>
                        <div><dt>User name</dt><dd>{account.name}</dd></div>
                        <div><dt>Email</dt><dd>{account.email}</dd></div>
                        <div><dt>Account type</dt><dd>{account.role === "admin" ? "Admin" : "User"}</dd></div>
                    </dl>
                </section>
            </section>
        </main>
    );
}
