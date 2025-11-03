// src/utils/googleAuth.js  (new helper)
import { api } from "./api";

export async function onGoogleCredential(credential) {
  // the 'credential' string comes from google.accounts.id
  const res = await api.post("/api/auth/google", { credential });
  // cookie is now set by the backend; optional local cache for header
  localStorage.setItem("hv_user", JSON.stringify(res.user));
  return res.user;
}
