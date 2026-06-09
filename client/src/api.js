// Thin client for the Node/Express backend.
const json = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
};

export const getMenu = () => fetch("/api/menu").then(json);
export const getReviews = () => fetch("/api/reviews").then(json);
export const getSite = () => fetch("/api/site").then(json);

export const sendContact = (payload) =>
  fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(json);

// ---------------- Owner / admin ----------------
const TOKEN_KEY = "hf_admin_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const adminLogin = (username, password) =>
  fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then(json);

export const adminMe = () => fetch("/api/admin/me", { headers: authHeaders() }).then(json);

export const saveMenu = (menu) =>
  fetch("/api/admin/menu", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(menu),
  }).then(json);

// Upload an image file from the owner's device. Reads it as a base64 data URL
// and POSTs it to the server, which saves it in server/uploads/.
export const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ filename: file.name, data: reader.result }),
      })
        .then(json)
        .then((r) => resolve(r.url))
        .catch(reject);
    };
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.readAsDataURL(file);
  });
