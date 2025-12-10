const API_BASE = 'http://localhost:5000/api/admin';

// State for CRUD
let currentEntityType = null; // 'products', 'users', 'orders'
let currentEditId = null;
let allData = {};

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  loadDashboardStats();
});

// ========== AUTH CHECK ==========
function checkAuth() {
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  if (userRole !== 'admin') {
    alert('❌ У вас немає доступу до адміністраторської панелі');
    window.location.href = 'user-profile.html';
    return;
  }

  if (userName) {
    document.getElementById('adminGreeting').textContent = `👋 Привіт, ${userName} (Адміністратор)`;
  }
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      switchSection(section);
    });
  });

  // Add buttons
  document.getElementById('addProductBtn')?.addEventListener('click', () => openCreateModal('products'));
  document.getElementById('addCategoryBtn')?.addEventListener('click', () => openCreateModal('categories'));

  // Modal controls
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  document.querySelector('.modal-cancel')?.addEventListener('click', closeModal);
  document.getElementById('crudForm')?.addEventListener('submit', handleFormSubmit);

  // Modal close on outside click
  const modal = document.getElementById('modalForm');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

// ========== SECTION SWITCHING ==========
function switchSection(section) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById(section).classList.add('active');
  document.querySelector(`[data-section="${section}"]`).classList.add('active');

  if (section === 'products') {
    currentEntityType = 'products';
    loadProducts();
  } else if (section === 'users') {
    currentEntityType = 'users';
    loadUsers();
  } else if (section === 'orders') {
    currentEntityType = 'orders';
    loadOrders();
  } else if (section === 'categories') {
    currentEntityType = 'categories';
    loadCategories();
  }
}

// ========== DASHBOARD STATS ==========
async function loadDashboardStats() {
  try {
    const [products, orders, users] = await Promise.all([
      fetch(`${API_BASE}/products`).then(r => r.json()),
      fetch(`${API_BASE}/orders`).then(r => r.json()),
      fetch(`${API_BASE}/users`).then(r => r.json()),
    ]);

    if (products.success) allData.products = products.data;
    if (orders.success) allData.orders = orders.data;
    if (users.success) allData.users = users.data;

    // Update stats
    document.querySelectorAll('.stat-number')[0].textContent = products.data?.length || 0;
    document.querySelectorAll('.stat-number')[1].textContent = orders.data?.length || 0;
    document.querySelectorAll('.stat-number')[2].textContent = users.data?.length || 0;
  } catch (err) {
    console.error('Failed to load dashboard stats:', err);
  }
}

// ========== PRODUCTS CRUD ==========
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    allData.products = data.data;
    renderProductsTable(data.data);
  } catch (err) {
    console.error('Failed to load products:', err);
    alert('❌ Помилка завантаження товарів');
  }
}

function renderProductsTable(products) {
  const tbody = document.querySelector('#products tbody');
  if (!tbody) return;

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price} ₴</td>
      <td>${p.quantity}</td>
      <td>${p.category || '—'}</td>
      <td class="actions">
        <button class="btn btn-sm btn-edit" data-id="${p.id}">Редагувати</button>
        <button class="btn btn-sm btn-delete" data-id="${p.id}">Видалити</button>
      </td>
    </tr>
  `).join('');

  // Add event listeners to buttons
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openEditModal('products', btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteEntity('products', btn.dataset.id));
  });
}

// ========== USERS CRUD ==========
async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    allData.users = data.data;
    renderUsersTable(data.data);
  } catch (err) {
    console.error('Failed to load users:', err);
    alert('❌ Помилка завантаження користувачів');
  }
}

function renderUsersTable(users) {
  const tbody = document.querySelector('#users tbody');
  if (!tbody) return;

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.firstName} ${u.lastName}</td>
      <td>${u.email}</td>
      <td><span class="status-badge status-active">${u.role === 'admin' ? '⚙️ Адмін' : '👤 Користувач'}</span></td>
      <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString('uk-UA') : '—'}</td>
      <td class="actions">
        <button class="btn btn-sm btn-edit" data-id="${u.id}">Редагувати</button>
        <button class="btn btn-sm btn-delete" data-id="${u.id}">Видалити</button>
      </td>
    </tr>
  `).join('');

  // Add event listeners to buttons
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openEditModal('users', btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteEntity('users', btn.dataset.id));
  });
}

// ========== ORDERS CRUD ==========
async function loadOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    allData.orders = data.data;
    renderOrdersTable(data.data);
  } catch (err) {
    console.error('Failed to load orders:', err);
    alert('❌ Помилка завантаження замовлень');
  }
}

function renderOrdersTable(orders) {
  const tbody = document.querySelector('#orders tbody');
  if (!tbody) return;

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>#${o.id}</td>
      <td>Користувач #${o.userId}</td>
      <td>${o.totalAmount} ₴</td>
      <td><span class="status-badge status-${o.status}">${getStatusLabel(o.status)}</span></td>
      <td>${o.createdAt ? new Date(o.createdAt).toLocaleDateString('uk-UA') : '—'}</td>
      <td class="actions">
        <button class="btn btn-sm btn-edit" data-id="${o.id}">Редагувати</button>
        <button class="btn btn-sm btn-delete" data-id="${o.id}">Видалити</button>
      </td>
    </tr>
  `).join('');

  // Add event listeners to buttons
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openEditModal('orders', btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteEntity('orders', btn.dataset.id));
  });
}

function getStatusLabel(status) {
  const labels = {
    pending: '⏳ Очікування',
    processing: '⚙️ Обробка',
    shipped: '📦 Відправлено',
    delivered: '✅ Доставлено',
    cancelled: '❌ Скасовано',
  };
  return labels[status] || status;
}

// ========== CATEGORIES CRUD ==========
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    allData.categories = data.data;
    renderCategoriesTable(data.data);
  } catch (err) {
    console.error('Failed to load categories:', err);
    alert('❌ Помилка завантаження категорій');
  }
}

function renderCategoriesTable(categories) {
  const tbody = document.querySelector('#categories tbody');
  if (!tbody) return;

  tbody.innerHTML = categories.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.description || '—'}</td>
      <td>0</td>
      <td class="actions">
        <button class="btn btn-sm btn-edit" data-id="${c.id}">Редагувати</button>
        <button class="btn btn-sm btn-delete" data-id="${c.id}">Видалити</button>
      </td>
    </tr>
  `).join('');

  // Add event listeners to buttons
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openEditModal('categories', btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteEntity('categories', btn.dataset.id));
  });
}

// ========== MODAL OPERATIONS ==========
function openCreateModal(entityType) {
  currentEntityType = entityType;
  currentEditId = null;
  const form = document.getElementById('crudForm');
  const title = document.getElementById('modalTitle');

  form.reset();
  title.textContent = `Додати новий ${getEntityLabel(entityType)}`;
  document.getElementById('modalForm').classList.add('active');
}

function openEditModal(entityType, id) {
  currentEntityType = entityType;
  currentEditId = id;
  const title = document.getElementById('modalTitle');

  title.textContent = `Редагувати ${getEntityLabel(entityType)}`;
  document.getElementById('modalForm').classList.add('active');

  // Populate form with existing data
  const entities = allData[entityType] || [];
  const entity = entities.find(e => e.id === parseInt(id));

  if (entity) {
    document.getElementById('formName').value = entity.name || entity.firstName || '';
    document.getElementById('formDescription').value = entity.description || entity.email || '';
    document.getElementById('formPrice').value = entity.price || entity.totalAmount || '';
  }
}

function closeModal() {
  document.getElementById('modalForm').classList.remove('active');
  document.getElementById('crudForm').reset();
  currentEditId = null;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  if (!currentEntityType) return;

  const name = document.getElementById('formName').value.trim();
  const description = document.getElementById('formDescription').value.trim();
  const price = parseFloat(document.getElementById('formPrice').value) || 0;

  const payload = buildPayload(currentEntityType, { name, description, price });

  try {
    let url = `${API_BASE}/${currentEntityType}`;
    let method = 'POST';

    if (currentEditId) {
      url += `/${currentEditId}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    alert(`✅ ${currentEditId ? 'Оновлено' : 'Створено'} успішно!`);
    closeModal();

    // Reload appropriate table
    if (currentEntityType === 'products') loadProducts();
    else if (currentEntityType === 'users') loadUsers();
    else if (currentEntityType === 'orders') loadOrders();
    else if (currentEntityType === 'categories') loadCategories();

    loadDashboardStats();
  } catch (err) {
    console.error('Submit error:', err);
    alert(`❌ Помилка: ${err.message}`);
  }
}

function buildPayload(entityType, { name, description, price }) {
  switch (entityType) {
    case 'products':
      return {
        name,
        description,
        price,
        quantity: 0,
        category: 'Новий',
      };
    case 'users':
      return {
        firstName: name,
        lastName: 'Last',
        email: description,
        password: 'temp123',
        role: 'user',
      };
    case 'orders':
      return {
        userId: 1,
        totalAmount: price,
        status: 'pending',
      };
    case 'categories':
      return {
        name,
        description,
      };
    default:
      return {};
  }
}

function getEntityLabel(entityType) {
  const labels = {
    products: 'товар',
    users: 'користувача',
    orders: 'замовлення',
    categories: 'категорію',
  };
  return labels[entityType] || entityType;
}

// ========== DELETE ==========
async function deleteEntity(entityType, id) {
  if (!confirm(`Ви впевнені, що хочете видалити цей елемент?`)) return;

  try {
    const res = await fetch(`${API_BASE}/${entityType}/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    alert('✅ Видалено успішно!');

    // Reload appropriate table
    if (entityType === 'products') loadProducts();
    else if (entityType === 'users') loadUsers();
    else if (entityType === 'orders') loadOrders();
    else if (entityType === 'categories') loadCategories();

    loadDashboardStats();
  } catch (err) {
    console.error('Delete error:', err);
    alert(`❌ Помилка видалення: ${err.message}`);
  }
}

// ========== LOGOUT ==========
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// ========== MOBILE MENU (зі старого коду) ==========
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      const firstLink = mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('click', (e) => {
    if (!mobileNav.classList.contains('open')) return;
    if (burger.contains(e.target)) return;
    if (e.target.closest('.mobile-nav .nav-list, .mobile-nav .btn, .mobile-nav a')) return;
    mobileNav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      burger.focus();
    }
  });
}
