const API = '';
let token = localStorage.getItem('token');

// Navigation
document.querySelectorAll('nav a[data-section]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        showSection(link.dataset.section);
    });
});

document.getElementById('nav-logout').addEventListener('click', e => {
    e.preventDefault();
    logout();
});

function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav a[data-section]').forEach(a => a.classList.remove('active'));
    const section = document.getElementById('section-' + name);
    const navLink = document.querySelector(`nav a[data-section="${name}"]`);
    if (section) section.classList.add('active');
    if (navLink) navLink.classList.add('active');

    if (name === 'events') loadEvents();
    if (name === 'dashboard') loadDashboard();
}

function updateNav() {
    const loginLink = document.getElementById('nav-login');
    const dashLink = document.getElementById('nav-dashboard');
    const logoutLink = document.getElementById('nav-logout');

    if (token) {
        loginLink.classList.add('hidden');
        dashLink.classList.remove('hidden');
        logoutLink.classList.remove('hidden');
    } else {
        loginLink.classList.remove('hidden');
        dashLink.classList.add('hidden');
        logoutLink.classList.add('hidden');
    }
}

function showAlert(id, message, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => el.innerHTML = '', 5000);
}

async function api(url, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(API + url, { ...options, headers });
    return res;
}

// Login
document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            username: form.get('username'),
            password: form.get('password')
        })
    });

    if (res.ok) {
        const data = await res.json();
        token = data.token;
        localStorage.setItem('token', token);
        updateNav();
        showSection('dashboard');
        e.target.reset();
    } else {
        showAlert('login-alert', 'Invalid credentials.', 'error');
    }
});

function logout() {
    token = null;
    localStorage.removeItem('token');
    updateNav();
    showSection('home');
}

// Dashboard
async function loadDashboard() {
    if (!token) return;

    const [statsRes, customersRes, inquiriesRes, usersRes] = await Promise.all([
        api('/api/admin/dashboard'),
        api('/api/customer'),
        api('/api/inquiry'),
        api('/api/users')
    ]);

    if (statsRes.status === 401 || statsRes.status === 403) {
        logout();
        showAlert('login-alert', 'Session expired. Please login again.', 'error');
        showSection('login');
        return;
    }

    if (statsRes.ok) {
        const stats = await statsRes.json();
        document.getElementById('dashboard-stats').innerHTML = `
            <div class="stat-card"><div class="stat-value">${stats.totalCustomers}</div><div class="stat-label">Customers</div></div>
            <div class="stat-card"><div class="stat-value">${stats.totalInquiries}</div><div class="stat-label">Inquiries</div></div>
            <div class="stat-card"><div class="stat-value">${stats.demoRequestsCount}</div><div class="stat-label">Demo Requests</div></div>
            <div class="stat-card"><div class="stat-value">${stats.eventRegistrationsCount}</div><div class="stat-label">Event Registrations</div></div>
        `;
    }

    if (customersRes.ok) {
        const customers = await customersRes.json();
        document.getElementById('customers-table').innerHTML = customers.map(c =>
            `<tr><td>${esc(c.name)}</td><td>${esc(c.email)}</td><td>${esc(c.phone || '')}</td><td>${esc(c.companyName || '')}</td><td>${esc(c.country || '')}</td></tr>`
        ).join('') || '<tr><td colspan="5">No customers yet</td></tr>';
    }

    if (inquiriesRes.ok) {
        const inquiries = await inquiriesRes.json();
        document.getElementById('inquiries-table').innerHTML = inquiries.map(i =>
            `<tr><td>${esc(i.name)}</td><td>${esc(i.email)}</td><td>${esc(i.interestType)}</td><td>${esc(i.message)}</td><td>${new Date(i.createdAt).toLocaleDateString()}</td><td><button class="btn btn-danger" onclick="deleteInquiry(${i.id})">Delete</button></td></tr>`
        ).join('') || '<tr><td colspan="6">No inquiries yet</td></tr>';
    }

    if (usersRes.ok) {
        const users = await usersRes.json();
        document.getElementById('users-table').innerHTML = users.map(u =>
            `<tr><td>${esc(u.username)}</td><td>${esc(u.role)}</td><td>${new Date(u.createdAt).toLocaleDateString()}</td><td><button class="btn btn-danger" onclick="deleteUser(${u.id})">Delete</button></td></tr>`
        ).join('');
    }
}

async function deleteInquiry(id) {
    if (!confirm('Delete this inquiry?')) return;
    await api(`/api/inquiry/${id}`, { method: 'DELETE' });
    loadDashboard();
}

async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    await api(`/api/users/${id}`, { method: 'DELETE' });
    loadDashboard();
}

// Create User
document.getElementById('create-user-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await api('/api/users', {
        method: 'POST',
        body: JSON.stringify({
            username: form.get('username'),
            password: form.get('password'),
            role: form.get('role')
        })
    });

    if (res.ok) {
        showAlert('users-alert', 'User created!', 'success');
        e.target.reset();
        loadDashboard();
    } else {
        const text = await res.text();
        showAlert('users-alert', text || 'Failed to create user.', 'error');
    }
});

// Events
async function loadEvents() {
    const res = await fetch(API + '/api/event');
    if (!res.ok) return;
    const events = await res.json();

    document.getElementById('home-events-count').textContent = events.length;

    document.getElementById('events-list').innerHTML = events.length ? events.map(ev =>
        `<div class="event-card">
            <div class="event-info">
                <h3>${esc(ev.title)}</h3>
                <p>${esc(ev.description)}</p>
                <p><strong>Date:</strong> ${new Date(ev.eventDate).toLocaleDateString()}</p>
            </div>
        </div>`
    ).join('') : '<p>No events available.</p>';

    const select = document.getElementById('event-select');
    select.innerHTML = '<option value="">-- Choose --</option>' +
        events.map(ev => `<option value="${ev.id}">${esc(ev.title)}</option>`).join('');
}

// Event Registration
document.getElementById('event-register-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await api('/api/event/register/public', {
        method: 'POST',
        body: JSON.stringify({
            name: form.get('name'),
            email: form.get('email'),
            phone: form.get('phone') || '',
            companyName: form.get('companyName') || '',
            country: form.get('country') || '',
            eventId: parseInt(form.get('eventId')),
            eventInterest: true
        })
    });

    if (res.ok) {
        showAlert('event-register-alert', 'Registered successfully!', 'success');
        e.target.reset();
    } else {
        showAlert('event-register-alert', 'Registration failed. You may already be registered.', 'error');
    }
});

// Contact
document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await api('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
            name: form.get('name'),
            email: form.get('email'),
            phone: form.get('phone') || '',
            message: form.get('message')
        })
    });

    if (res.ok) {
        showAlert('contact-alert', 'Message sent successfully!', 'success');
        e.target.reset();
    } else {
        showAlert('contact-alert', 'Failed to send message.', 'error');
    }
});

// Demo Request
document.getElementById('demo-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await api('/api/demo/public', {
        method: 'POST',
        body: JSON.stringify({
            name: form.get('name'),
            email: form.get('email'),
            phone: form.get('phone') || '',
            companyName: form.get('companyName'),
            country: form.get('country') || '',
            interest: form.get('interest'),
            preferredDateTime: form.get('preferredDateTime')
        })
    });

    if (res.ok) {
        showAlert('demo-alert', 'Demo requested successfully!', 'success');
        e.target.reset();
    } else {
        showAlert('demo-alert', 'Failed to submit demo request.', 'error');
    }
});

// Chat
document.getElementById('chat-send').addEventListener('click', sendChat);
document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendChat();
});

async function sendChat() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const messagesDiv = document.getElementById('chat-messages');
    messagesDiv.innerHTML += `<div class="chat-message user">${esc(message)}</div>`;
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    const res = await api('/api/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message })
    });

    if (res.ok) {
        const data = await res.json();
        messagesDiv.innerHTML += `<div class="chat-message bot">${esc(data.response)}</div>`;
    } else {
        messagesDiv.innerHTML += `<div class="chat-message bot">Sorry, something went wrong.</div>`;
    }
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Create Event (admin)
document.getElementById('create-event-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await api('/api/event', {
        method: 'POST',
        body: JSON.stringify({
            title: form.get('title'),
            description: form.get('description'),
            eventDate: form.get('eventDate')
        })
    });

    if (res.ok) {
        showAlert('create-event-alert', 'Event created!', 'success');
        e.target.reset();
    } else {
        showAlert('create-event-alert', 'Failed to create event.', 'error');
    }
});

// Utility
function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Init
updateNav();
loadEvents();
