// helloviza/client/src/utils/googleAuth.js
import { api } from "./api";

export async function onGoogleCredential(credential) {
  // send { credential } exactly; backend /api/auth/google will verify & set cookie
  const res = await api.post("/api/auth/google", { credential });
  if (res?.user) {
    localStorage.setItem("hv_user", JSON.stringify(res.user));
    window.dispatchEvent(new StorageEvent("storage", { key: "hv_user" }));
  }
  return res?.user;
}
