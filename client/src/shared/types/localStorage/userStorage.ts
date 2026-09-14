import type { User } from "../user.ts";

const USER_KEY = "user";

export function saveUserInfo(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserInfo(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearUserInfo() {
    localStorage.removeItem(USER_KEY);
}