/* =========================================================
   QUINEX ADMIN — Dashboard page logic
   Handles: auth guard, fetching quotes, rendering table,
   status updates, delete, and the detail modal.
   ========================================================= */
 
// ⚠️ Change this if your backend runs on a different URL/port
const API_BASE_URL = 'http://localhost:5000';
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ---------- AUTH GUARD ---------- */
  const token = localStorage.getItem('quinexAdminToken');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
 
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
 
  /* ---------- LOGOUT ---------- */
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('quinexAdminToken');
    window.location.href = 'login.html';
  });
 
  /* ---------- ELEMENT REFERENCES ---------- */
  const tableLoading = document.getElementById('tableLoading');
  const tableEmpty = document.getElementById('tableEmpty');
  const table = document.getElementById('quotesTable');
  const tableBody = document.getElementById('quotesTableBody');
  const modal = document.getElementById('detailModal');
  const modalBody = document.getElementById('modalBody');
 
  let allQuotes = [];
 
  /* ---------- FETCH ALL QUOTES ---------- */
  async function loadQuotes() {
    tableLoading.classList.add('is-visible');
    table.style.display = 'none';
    tableEmpty.classList.remove('is-visible');
 
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/quotes`, {
        headers: authHeaders,
      });
 
      // Token invalid/expired — send back to login
      if (response.status === 401) {
        localStorage.removeItem('quinexAdminToken');
        window.location.href = 'login.html';
        return;
      }
 
      const result = await response.json();
      allQuotes = result.data || [];
 
      renderStats(allQuotes);
      renderTable(allQuotes);
    } catch (error) {
      tableLoading.textContent = 'Could not load requests. Is the backend running?';
    } finally {
      tableLoading.classList.remove('is-visible');
    }
  }
 
  /* ---------- RENDER STAT CARDS ---------- */
  function renderStats(quotes) {
    document.getElementById('statTotal').textContent = quotes.length;
    document.getElementById('statNew').textContent = quotes.filter((q) => q.status === 'New').length;
    document.getElementById('statContacted').textContent = quotes.filter((q) => q.status === 'Contacted').length;
    document.getElementById('statInProgress').textContent = quotes.filter((q) => q.status === 'In Progress').length;
    document.getElementById('statCompleted').textContent = quotes.filter((q) => q.status === 'Completed').length;
  }
 
  /* ---------- RENDER TABLE ---------- */
  function renderTable(quotes) {
    if (!quotes.length) {
      tableEmpty.classList.add('is-visible');
      table.style.display = 'none';
      return;
    }
 
    table.style.display = 'table';
    tableBody.innerHTML = '';
 
    quotes.forEach((quote) => {
      const row = document.createElement('tr');
 
      const dateStr = new Date(quote.createdAt).toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
 
      row.innerHTML = `
        <td>${escapeHtml(quote.fullName)}</td>
        <td>${escapeHtml(quote.email)}</td>
        <td>${escapeHtml(quote.service)}</td>
        <td>${escapeHtml(quote.budget || '—')}</td>
        <td>
          <select class="admin-status-select" data-id="${quote._id}">
            ${['New', 'Contacted', 'In Progress', 'Completed']
              .map((s) => `<option value="${s}" ${s === quote.status ? 'selected' : ''}>${s}</option>`)
              .join('')}
          </select>
        </td>
        <td>${dateStr}</td>
        <td>
          <div class="admin-row-actions">
            <button class="admin-icon-btn view-btn" data-id="${quote._id}" aria-label="View details">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="admin-icon-btn danger delete-btn" data-id="${quote._id}" aria-label="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
 
      tableBody.appendChild(row);
    });
 
    attachRowEvents();
  }
 
  /* ---------- ROW EVENTS: status change, view, delete ---------- */
  function attachRowEvents() {
    // Status dropdown change
    tableBody.querySelectorAll('.admin-status-select').forEach((select) => {
      select.addEventListener('change', async () => {
        const id = select.getAttribute('data-id');
        await updateStatus(id, select.value);
      });
    });
 
    // View details
    tableBody.querySelectorAll('.view-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openDetailModal(id);
      });
    });
 
    // Delete
    tableBody.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirmed = confirm('Delete this request? This cannot be undone.');
        if (confirmed) await deleteQuote(id);
      });
    });
  }
 
  /* ---------- UPDATE STATUS ---------- */
  async function updateStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/quotes/${id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Update failed');
      await loadQuotes(); // refresh table + stats
    } catch (error) {
      alert('Could not update status. Please try again.');
    }
  }
 
  /* ---------- DELETE ---------- */
  async function deleteQuote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/quotes/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!response.ok) throw new Error('Delete failed');
      await loadQuotes();
    } catch (error) {
      alert('Could not delete this request. Please try again.');
    }
  }
 
  /* ---------- DETAIL MODAL ---------- */
  function openDetailModal(id) {
    const quote = allQuotes.find((q) => q._id === id);
    if (!quote) return;
 
    modalBody.innerHTML = `
      <p><strong>Full Name</strong>${escapeHtml(quote.fullName)}</p>
      <p><strong>Email</strong>${escapeHtml(quote.email)}</p>
      <p><strong>Phone</strong>${escapeHtml(quote.phone || '—')}</p>
      <p><strong>Company</strong>${escapeHtml(quote.companyName || '—')}</p>
      <p><strong>Service</strong>${escapeHtml(quote.service)}</p>
      <p><strong>Budget</strong>${escapeHtml(quote.budget || '—')}</p>
      <p><strong>Project Details</strong>${escapeHtml(quote.projectDetails)}</p>
      <p><strong>Preferred Contact</strong>${escapeHtml(quote.preferredContact || '—')}</p>
      <p><strong>Status</strong>${escapeHtml(quote.status)}</p>
      <p><strong>Submitted</strong>${new Date(quote.createdAt).toLocaleString()}</p>
    `;
 
    modal.classList.add('is-open');
  }
 
  document.getElementById('closeModal').addEventListener('click', () => {
    modal.classList.remove('is-open');
  });
 
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
 
  /* ---------- SMALL HELPER: prevent HTML injection from stored text ---------- */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
  }
 
  /* ---------- INITIAL LOAD ---------- */
  loadQuotes();
});