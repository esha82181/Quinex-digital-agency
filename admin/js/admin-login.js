/* =========================================================
   QUINEX ADMIN — Login page logic
   ========================================================= */
 
// ⚠️ Change this if your backend runs on a different URL/port
const API_BASE_URL = 'http://localhost:5000';
 
document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, skip straight to the dashboard
  if (localStorage.getItem('quinexAdminToken')) {
    window.location.href = 'dashboard.html';
    return;
  }
 
  const form = document.getElementById('adminLoginForm');
  const errorMsg = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.remove('is-visible');
 
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
 
    loginBtn.classList.add('is-loading');
    loginBtn.disabled = true;
 
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
 
      const result = await response.json();
 
      if (!response.ok || !result.success) {
        errorMsg.textContent = result.message || 'Invalid username or password.';
        errorMsg.classList.add('is-visible');
        return;
      }
 
      // Store the JWT and go to the dashboard
      localStorage.setItem('quinexAdminToken', result.token);
      window.location.href = 'dashboard.html';
    } catch (error) {
      errorMsg.textContent = 'Could not reach the server. Is the backend running?';
      errorMsg.classList.add('is-visible');
    } finally {
      loginBtn.classList.remove('is-loading');
      loginBtn.disabled = false;
    }
  });
});