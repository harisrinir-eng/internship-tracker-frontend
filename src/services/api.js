// ALL calls to the Express backend live in this one file.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Custom error so pages can read the HTTP status (401, 403, ...) and the server's message.
export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.status = status;
    this.details = details; // list of validation problems, if the server sent any
  }
}

async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(API_BASE_URL + path, {
      method,
      credentials: "include", // lets the browser send/receive the HttpOnly login cookie
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest", // CSRF protection: the server requires this header
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch itself failed: server not running, wrong URL or blocked by CORS
    throw new ApiError("Cannot reach the server. Is the backend running on port 5000?", 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || "Request failed.", response.status, data.errors || []);
  }
  return data;
}

// ---- Auth ----
export const registerUser = (name, email, password) => request("/auth/register", { method: "POST", body: { name, email, password } });
export const loginUser = (email, password) => request("/auth/login", { method: "POST", body: { email, password } });
export const logoutUser = () => request("/auth/logout", { method: "POST" });
export const getMe = () => request("/auth/me");

// ---- Internships ----
export function getInternships({ search = "", location = "" } = {}) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (location) params.set("location", location);
  const query = params.toString();
  return request("/internships" + (query ? "?" + query : ""));
}
export const getLocations = () => request("/internships/locations");
export const createInternship = (data) => request("/internships", { method: "POST", body: data });
export const deleteInternship = (id) => request(`/internships/${id}`, { method: "DELETE" });

// ---- Users ----
export const getAllUsers = () => request("/admin/users"); // admin only
export const getUserById = (id) => request(`/users/${id}`); // yourself, or any user if admin
