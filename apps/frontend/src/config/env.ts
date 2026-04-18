// env.ts
const rawUrl =
  window?.env_?.BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000";

const backendUrl = rawUrl.replace(/\/+$/, ""); 

console.log("This is backend URL", backendUrl);

export default backendUrl;