import {
    clearCurrentAccount,
    getAccessToken,
    setAccessToken,
} from "./components/authStorage";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/+$/, "");

export class ApiError extends Error {
    constructor(message, status, validationErrors = [], diagnostics = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.validationErrors = validationErrors;
        this.diagnostics = diagnostics;
    }
}

async function readPayload(response) {
    const text = await response.text();
    if (!text) return {};

    try {
        const payload = JSON.parse(text);
        return payload && typeof payload === "object" ? payload : {};
    } catch {
        return {};
    }
}

function errorFromPayload(payload, response, method, path) {
    const status = response.status;
    const validationErrors = Array.isArray(payload.errors) ? payload.errors : [];
    const validationMessage = validationErrors
        .map((error) => error.field ? `${error.field}: ${error.message}` : error.message)
        .filter(Boolean)
        .join(". ");
    const serverMessage = typeof payload.message === "string" ? payload.message : "";
    const statusMessage = {
        401: "Your session is not valid. Please log in again.",
        409: "This request conflicts with existing data.",
        429: "Too many attempts were made. Please wait a moment and try again.",
        502: "The network gateway could not connect to the service. Please try again later.",
        503: "The service is temporarily unavailable. Please try again later.",
        504: "The service took too long to respond. Please try again later.",
    }[status];
    const diagnostics = {
        method,
        endpoint: path,
        apiOrigin: new URL(API_BASE_URL, globalThis.location?.origin).origin,
        status,
        contentType: response.headers.get("content-type"),
        requestId: response.headers.get("x-request-id"),
    };

    return new ApiError(
        validationMessage || statusMessage || (status >= 500
            ? "The server encountered a problem while processing your request. Please try again later."
            : serverMessage || "Please check your information and try again."),
        status,
        validationErrors,
        diagnostics
    );
}

async function renewSession() {
    try {
        await refreshAccessToken();
    } catch (error) {
        if (error instanceof ApiError && error.status > 0) {
            clearCurrentAccount();
            throw new ApiError(
                `Your session could not be refreshed. Please log in again. ${error.message}`,
                error.status
            );
        }
        throw error;
    }
}

async function send(path, options = {}, retryAuth = true) {
    const { auth = true, ...fetchOptions } = options;
    const token = auth ? getAccessToken() : null;
    const method = (fetchOptions.method || "GET").toUpperCase();
    const apiOrigin = new URL(API_BASE_URL, globalThis.location?.origin).origin;

    if (auth && !token && retryAuth) {
        await renewSession();
        return send(path, options, false);
    }

    const headers = new Headers(fetchOptions.headers);

    if (fetchOptions.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...fetchOptions,
            headers,
            credentials: "include",
        });
    } catch (error) {
        if (error instanceof TypeError) {
            const diagnostics = { method, endpoint: path, apiOrigin };
            console.error("API network request failed", {
                ...diagnostics,
                cause: error.name,
            });
            throw new ApiError(
                "Unable to connect to the service. Check your connection and try again.",
                0,
                [],
                diagnostics
            );
        }
        throw error;
    }

    const payload = await readPayload(response);
    if (response.status === 401 && token && retryAuth) {
        await renewSession();
        try {
            return await send(path, options, false);
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                clearCurrentAccount();
                throw new ApiError("Your session has expired. Please log in again.", 401);
            }
            throw error;
        }
    }

    if (!response.ok) {
        const apiError = errorFromPayload(payload, response, method, path);
        console.error("API request failed", apiError.diagnostics);
        throw apiError;
    }

    return payload;
}

async function refreshAccessToken() {
    const result = await send(
        "/auth/refresh",
        { method: "POST", auth: false },
        false
    );
    const accessToken = result.data?.accessToken;

    if (typeof accessToken !== "string" || !accessToken) {
        clearCurrentAccount();
        throw new ApiError("The server did not return an access token.", 500);
    }

    setAccessToken(accessToken);
}

function accountFromResponse(result) {
    const user = result.data;
    if (!user || typeof result.accessToken !== "string") {
        throw new ApiError("The server returned an incomplete account response.", 500);
    }

    return {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
    };
}

export async function registerAccount({ name, email, password, role }) {
    const result = await send("/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
            username: name,
            email,
            password,
            role,
        }),
    });
    return {
        account: accountFromResponse(result),
        accessToken: result.accessToken,
    };
}

export async function loginAccount({ email, password }) {
    const result = await send("/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email, password }),
    });
    return {
        account: accountFromResponse(result),
        accessToken: result.accessToken,
    };
}

export function logoutAccount() {
    return send("/auth/logout", {
        method: "POST",
        auth: false,
    });
}

export function createProject({ name, description }) {
    return send("/project", {
        method: "POST",
        body: JSON.stringify({ name, description }),
    });
}
