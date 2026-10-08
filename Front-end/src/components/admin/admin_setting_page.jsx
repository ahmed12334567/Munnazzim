import { useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentAccount, updateProfilePhoto } from "../authStorage";
import AdminSidebar from "./admin_side_par";
import "../style.css";

const MAX_PHOTO_SIZE = 1024 * 1024;

export default function AdminSettingsPage() {
    const [account, setAccount] = useState(getCurrentAccount);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    function handlePhotoChange(event) {
        const file = event.target.files?.[0];
        event.target.value = "";
        setMessage("");
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage("Choose an image file for your profile photo.");
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

    if (!account || account.role !== "admin") {
        return (
            <main className="user-dashboard">
                <section className="dashboard-empty">
                    <h1>{account ? "Admin access required" : "Log in to continue"}</h1>
                    <p>{account ? "This workspace is only available to admin accounts." : "Log in with an admin account to manage settings."}</p>
                    <Link className="dashboard-action" to={account ? "/user/tasks" : "/login"}>
                        {account ? "Go to my tasks" : "Go to login"}
                    </Link>
                </section>
            </main>
        );
    }

    const initials = account.name?.trim().charAt(0).toUpperCase() || "A";

    return (
        <main className="user-dashboard">
            <AdminSidebar />
            <section className="dashboard-main" aria-labelledby="admin-settings-title">
                <header className="dashboard-heading">
                    <span className="visual-label">ADMIN ACCOUNT</span>
                    <h1 id="admin-settings-title">Settings</h1>
                    <p>Manage your admin profile and personal details.</p>
                </header>

                <section className="settings-card" aria-labelledby="admin-photo-title">
                    <div>
                        <h2 id="admin-photo-title">Profile photo</h2>
                        <p className="settings-intro">Choose an image from your device to personalize your account.</p>
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

                <section className="settings-card account-details" aria-labelledby="admin-account-title">
                    <h2 id="admin-account-title">Account details</h2>
                    <dl>
                        <div><dt>User name</dt><dd>{account.name}</dd></div>
                        <div><dt>Email</dt><dd>{account.email}</dd></div>
                        <div><dt>Account type</dt><dd>Admin</dd></div>
                    </dl>
                </section>
            </section>
        </main>
    );
}
