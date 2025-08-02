// src/lib/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL;
export const fetchColleges = async () => {
    const res = await fetch(`${API_BASE_URL}/api/college`);
    if (!res.ok) throw new Error("Failed to fetch colleges");
    return res.json();
  };
  
  export const fetchCompetitionStages = async () => {
    const res = await fetch(`${API_BASE_URL}/api/competitionStages`);
    if (!res.ok) throw new Error("Failed to fetch competition stages");
    return res.json();
  };
  
  export const fetchUsers = async () => {
    const res = await fetch(`${API_BASE_URL}/api/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  };
  
  export const fetchAdminData = async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
    if (!res.ok) throw new Error("Failed to fetch admin data");
    return res.json();
  };
  