const ACCOUNT_KEY = "monazem-current-account";
let accessToken = null;

export function setCurrentAccount(account, token) {
    sessionStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    setAccessToken(token);
}

export function clearCurrentAccount() {
    sessionStorage.removeItem(ACCOUNT_KEY);
    accessToken = null;
}

export function getCurrentAccount() {
    const saved = sessionStorage.getItem(ACCOUNT_KEY);
    return saved ? JSON.parse(saved) : null;
}

export function getAccessToken() {
    return accessToken;
}

export function setAccessToken(token) {
    accessToken = token;
}

export function updateProfilePhoto(photo) {
    const account = getCurrentAccount();
    if (!account) {
        throw new Error("Please log in to update your account.");
    }

    sessionStorage.setItem(ACCOUNT_KEY, JSON.stringify({ ...account, photo }));
}
