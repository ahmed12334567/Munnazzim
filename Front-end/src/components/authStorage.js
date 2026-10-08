const ACCOUNT_KEY = "monazem-demo-account";

async function hashPassword(password) {
    if (!globalThis.crypto?.subtle) {
        throw new Error("Secure password hashing is unavailable. Use localhost or HTTPS.");
    }

    const bytes = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(hash), (byte) =>
        byte.toString(16).padStart(2, "0")
    ).join("");
}

export async function createAccount({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = localStorage.getItem(ACCOUNT_KEY);

    if (existing && JSON.parse(existing).email === normalizedEmail) {
        throw new Error("An account with this email already exists.");
    }

    const passwordHash = await hashPassword(password);

    localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
        })
    );
}

export async function checkAccount({ email, password }) {
    const saved = localStorage.getItem(ACCOUNT_KEY);

    if (!saved) return false;

    const account = JSON.parse(saved);

    return (
        account.email === email.trim().toLowerCase() &&
        account.passwordHash === (await hashPassword(password))
    );
}