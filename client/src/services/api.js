const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
	let response;
	try {
		response = await fetch(`${API_BASE}${path}`, {
			...options,
			credentials: "include",
			headers: {
				...(options.body ? { "Content-Type": "application/json" } : {}),
				...options.headers,
			},
		});
	} catch {
		throw new Error("SGMS API is unreachable. Start the server and check MongoDB settings in server/.env.");
	}

	if (response.status === 204) return null;

	const payload = await response.json().catch(() => ({}));
	if (!response.ok) {
		const error = new Error(payload.message || "The request could not be completed");
		error.status = response.status;
		error.details = payload.errors || [];
		throw error;
	}

	return payload;
}

export const api = {
	get: (path) => request(path),
	post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
	patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
	delete: (path) => request(path, { method: "DELETE" }),
};
