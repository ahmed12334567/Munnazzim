const ACCOUNT_KEY = "monazem-demo-account";
const CURRENT_ACCOUNT_KEY = "monazem-current-account";
const TEAM_KEY = "monazem-demo-teams";

function getAccounts() {
    const saved = localStorage.getItem(ACCOUNT_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [parsed];
}

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

export async function createAccount({ name, email, password, role = "user" }) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim().toLowerCase();
    const accounts = getAccounts();

    if (accounts.some((account) => account.email === normalizedEmail)) {
        throw new Error("An account with this email already exists.");
    }

    if (accounts.some((account) => account.name?.trim().toLowerCase() === normalizedName)) {
        throw new Error("An account with this user name already exists.");
    }

    if (role !== "user" && role !== "admin") {
        throw new Error("Choose a valid account type.");
    }

    const passwordHash = await hashPassword(password);

    localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify([...accounts, {
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role,
        }])
    );
}

export async function checkAccount({ name, email, password }) {
    const accounts = getAccounts();
    const normalizedName = (name ?? "").trim().toLowerCase();
    const normalizedEmail = (email ?? "").trim().toLowerCase();
    const account = accounts.find((candidate) => (
        (normalizedName && candidate.name?.trim().toLowerCase() === normalizedName) ||
        (normalizedEmail && candidate.email === normalizedEmail)
    ));

    if (!account || account.passwordHash !== await hashPassword(password)) return null;

    return { ...account, role: account.role === "admin" ? "admin" : "user" };
}

export function setCurrentAccount(email) {
    sessionStorage.setItem(CURRENT_ACCOUNT_KEY, email.trim().toLowerCase());
}

export function clearCurrentAccount() {
    sessionStorage.removeItem(CURRENT_ACCOUNT_KEY);
}

export function getCurrentAccount() {
    const email = sessionStorage.getItem(CURRENT_ACCOUNT_KEY);
    if (!email) return null;

    return getAccounts().find((account) => account.email === email) ?? null;
}

function updateCurrentAccount(updates) {
    const currentAccount = getCurrentAccount();
    if (!currentAccount) {
        throw new Error("Please log in to update your account.");
    }

    const accounts = getAccounts().map((account) => (
        account.email === currentAccount.email ? { ...account, ...updates } : account
    ));
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
}

export function updateProfilePhoto(photo) {
    updateCurrentAccount({ photo });
}

export function getCurrentTasks() {
    return getCurrentAccount()?.tasks ?? [];
}

export function saveCurrentTasks(tasks) {
    updateCurrentAccount({ tasks });
}

export function getTeamAccounts() {
    return getAccounts().map((storedAccount) => ({
        ...Object.fromEntries(
            Object.entries(storedAccount).filter(([key]) => key !== "passwordHash")
        ),
        role: storedAccount.role === "admin" ? "admin" : "user",
        tasks: Array.isArray(storedAccount.tasks) ? storedAccount.tasks : [],
    }));
}

function getTeams() {
    const saved = localStorage.getItem(TEAM_KEY);
    if (!saved) return [];

    const teams = JSON.parse(saved);
    if (!Array.isArray(teams)) {
        throw new Error("Saved team data is invalid.");
    }
    return teams;
}

export function getCurrentTeams() {
    const account = getCurrentAccount();
    if (!account) return [];

    const accounts = getTeamAccounts();
    return getTeams()
        .filter((team) => team.memberEmails.includes(account.email))
        .map((team) => ({
            ...team,
            members: accounts.filter((member) => team.memberEmails.includes(member.email)),
        }));
}

export function getAllTeams() {
    const accounts = getTeamAccounts();
    return getTeams().map((team) => ({
        ...team,
        members: accounts.filter((member) => team.memberEmails.includes(member.email)),
    }));
}

export function createTeam(name, memberEmails) {
    const currentAccount = getCurrentAccount();
    if (currentAccount?.role !== "admin") {
        throw new Error("Only admins can create teams.");
    }

    const normalizedName = name.trim();
    if (!normalizedName) {
        throw new Error("Enter a team name.");
    }

    const teams = getTeams();
    if (teams.some((team) => team.name.trim().toLowerCase() === normalizedName.toLowerCase())) {
        throw new Error("A team with this name already exists.");
    }

    const accounts = getAccounts();
    const normalizedMembers = [...new Set(memberEmails.map((email) => email.trim().toLowerCase()))];
    const users = normalizedMembers.filter((email) => (
        accounts.some((account) => account.email === email && account.role !== "admin")
    ));

    const nextTeam = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: normalizedName,
        memberEmails: users,
        createdBy: currentAccount.email,
    };
    localStorage.setItem(TEAM_KEY, JSON.stringify([...teams, nextTeam]));
    return nextTeam;
}

export function addMembersToTeam(teamId, memberEmails) {
    const currentAccount = getCurrentAccount();
    if (currentAccount?.role !== "admin") {
        throw new Error("Only admins can add team members.");
    }

    const accounts = getAccounts();
    const teams = getTeams();
    const team = teams.find((entry) => entry.id === teamId);
    if (!team) {
        throw new Error("The selected team no longer exists.");
    }

    const newMembers = [...new Set(memberEmails.map((email) => email.trim().toLowerCase()))]
        .filter((email) => accounts.some((entry) => entry.email === email && entry.role !== "admin"));
    const memberEmailsForTeam = [...new Set([...team.memberEmails, ...newMembers])];

    localStorage.setItem(
        TEAM_KEY,
        JSON.stringify(teams.map((entry) => (
            entry.id === teamId ? { ...entry, memberEmails: memberEmailsForTeam } : entry
        )))
    );
}

export function addTaskToAccount(email, title) {
    const currentAccount = getCurrentAccount();
    if (currentAccount?.role !== "admin") {
        throw new Error("Only admins can assign tasks.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const accounts = getAccounts();
    const target = accounts.find((account) => (
        account.email === normalizedEmail && account.role !== "admin"
    ));

    if (!target) {
        throw new Error("Choose a valid user account.");
    }

    const nextTasks = [
        ...(Array.isArray(target.tasks) ? target.tasks : []),
        {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            title: title.trim(),
            completed: false,
            assignedBy: currentAccount.email,
        },
    ];

    localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify(accounts.map((account) => (
            account.email === normalizedEmail ? { ...account, tasks: nextTasks } : account
        )))
    );
}