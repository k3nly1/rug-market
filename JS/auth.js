const loginForm = document.getElementById('loginForm');

if(loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    if(!email || !password || !name) {
      alert('Будь ласка, заповніть усі поля');
      return;
    }

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());

    if(role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'user-profile.html';
    }
  });
}

function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname.split('/').pop();

  if(!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'index.html') {
    window.location.href = 'login.html';
  }

  const userRole = localStorage.getItem('userRole');
  if(isLoggedIn && userRole === 'user' && currentPage === 'admin-dashboard.html') {
    alert('❌ У вас немає доступу до адміністраторської панелі');
    window.location.href = 'user-profile.html';
  }

  if(isLoggedIn && userRole === 'admin' && currentPage === 'user-profile.html') {
    window.location.href = 'admin-dashboard.html';
  }
}

function logout() {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loginTime');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', checkAuth);
