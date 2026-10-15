import { api } from "./api";

export const authService = {
	current: () => api.get("/auth/me"),
	login: (values) => api.post("/auth/login", values),
	register: (values) => api.post("/auth/register", values),
	logout: () => api.post("/auth/logout", {}),
};
