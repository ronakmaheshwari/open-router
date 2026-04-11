const backendUrl =
  window?.env_?.BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000/api/v1";

export default backendUrl;