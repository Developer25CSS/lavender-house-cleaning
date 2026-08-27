/* ============================================================
   Shared API helper. Set API_BASE once your Render backend is
   live (see lavender-house-cleaning-api README), e.g.:
   var API_BASE = "https://lavender-house-cleaning-api.onrender.com";
   ============================================================ */
var API_BASE = "";

function apiFetch(path, options) {
  options = options || {};
  options.credentials = "include";
  options.headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
  return fetch(API_BASE + path, options).then(function (res) {
    return res.json().catch(function () { return {}; }).then(function (data) {
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    });
  });
}

(function () {
  var link = document.getElementById("navAccountLink");
  if (!link || !API_BASE) return;
  apiFetch("/api/auth/me").then(function (user) {
    link.textContent = "My Account";
    link.href = user.role === "STAFF" || user.role === "ADMIN" ? "staff/dashboard.html" : "account.html";
  }).catch(function () {
    /* not logged in — leave the default Login link as-is */
  });
})();
