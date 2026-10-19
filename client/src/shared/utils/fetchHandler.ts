import { apiUrl } from "../config/api.ts";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchHandler<T>(
    path: string,
    reqInit: RequestInit = {},
    retried = false,
): Promise<T> {
    const response = await fetch(apiUrl(path), {
        ...reqInit,
        headers: {
            "Content-Type": "application/json",
            ...reqInit.headers,
        },
        credentials: "include",
    });

    if (response.status === 401 && !retried) {
        const refreshed = await refreshToken();

        if (refreshed) {
            return fetchHandler<T>(path, reqInit, true);
        }

        throw new Error("Session expired.");
    }

    if (!response.ok) {
        let message = "Something went wrong";

        try {
            const data = await response.json();
            message = data.message ?? message;
        } catch {
            message = await response.text();
        }

        throw new Error(message);
    }

    const result = (await response.json()) as ApiResponse<T>;

    return result.data;
}

let refreshPromise: Promise<boolean> | null = null;

function refreshToken(): Promise<boolean> {
    if (!refreshPromise) {
        refreshPromise = fetch(apiUrl("api/v1/auth/refresh"), {
            method: "POST",
            credentials: "include",
        })
            .then((res) => res.ok)
            .catch(() => false)
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}