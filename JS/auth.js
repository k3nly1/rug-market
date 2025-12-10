const API_BASE = 'http://localhost:5000/api/auth';

// Перемикання між логіном та реєстрацією
function toggleAuthSection() {
  const loginSection = document.getElementById('loginSection');
  const registerSection = document.getElementById('registerSection');
  const testCredentials = document.getElementById('testCredentials');

  if (loginSection.style.display === 'none') {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    testCredentials.style.display = 'block';
  } else {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    testCredentials.style.display = 'none';
  }
}

// Показати повідомлення
function showAuthMessage(message, isSuccess = true) {
  const messageDiv = document.getElementById('authMessage');
  messageDiv.textContent = message;
  messageDiv.className = isSuccess ? 'auth-message success' : 'auth-message error';
  messageDiv.style.display = 'block';
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 4000);
}

// ========== РЕЄСТРАЦІЯ ==========
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    // Валідація
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showAuthMessage('❌ Заповніть усі поля', false);
      return;
    }

    if (password !== confirmPassword) {
      showAuthMessage('❌ Паролі не збігаються', false);
      return;
    }

    if (password.length < 6) {
      showAuthMessage('❌ Пароль повинен бути щонайменше 6 символів', false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        showAuthMessage(`✅ Реєстрація успішна! Вас автоматично перенаправлено...`, true);
        
        // Зберегти токен та дані користувача
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', `${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);

        // Перенаправити на відповідну сторінку
        setTimeout(() => {
          if (data.user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
          } else {
            window.location.href = 'user-profile.html';
          }
        }, 1500);
      } else {
        showAuthMessage(`❌ Помилка: ${data.message}`, false);
      }
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      showAuthMessage('❌ Помилка при реєстрації. Перевірте з\'єднання.', false);
    }
  });
}

// ========== ЛОГІН ==========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Валідація
    if (!email || !password) {
      showAuthMessage('❌ Заповніть email та пароль', false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        showAuthMessage(`✅ Логін успішний! Вас перенаправлено...`, true);
        
        // Зберегти токен та дані користувача
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', `${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);

        // Перенаправити на відповідну сторінку
        setTimeout(() => {
          if (data.user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
          } else {
            window.location.href = 'user-profile.html';
          }
        }, 1500);
      } else {
        showAuthMessage(`❌ Помилка логіну: ${data.message}`, false);
      }
    } catch (error) {
      console.error('Помилка логіну:', error);
      showAuthMessage('❌ Помилка при логіну. Перевірте з\'єднання.', false);
    }
  });
}

// ========== ПЕРЕВІРКА АУТЕНТИФІКАЦІЇ ==========
function checkAuth() {
  const authToken = localStorage.getItem('authToken');
  const currentPage = window.location.pathname.split('/').pop();

  // Якщо намагаються потрапити на захищену сторінку без токена
  if (!authToken && (currentPage === 'admin-dashboard.html' || currentPage === 'user-profile.html')) {
    window.location.href = 'login.html';
    return;
  }

  // Якщо залогінені і на сторінці логіну - перенаправити
  if (authToken && currentPage === 'login.html') {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'user-profile.html';
    }
  }

  // Перевірка ролей доступу
  const userRole = localStorage.getItem('userRole');
  if (authToken && userRole === 'user' && currentPage === 'admin-dashboard.html') {
    alert('❌ У вас немає доступу до адміністраторської панелі');
    window.location.href = 'user-profile.html';
  }

  if (authToken && userRole === 'admin' && currentPage === 'user-profile.html') {
    window.location.href = 'admin-dashboard.html';
  }
}

// ========== ВИХІД ==========
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  window.location.href = 'login.html';
}

// ========== ОТРИМАТИ ТОКЕН ДЛЯ ЗАПИТІВ ==========
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

document.addEventListener('DOMContentLoaded', checkAuth);
