const API_URL = '/api';

let currentFilter = 'all';
let selectedFormCategory = 'anniversary';

const categoryLabels = {
    'general': 'סתם כי בא לי 💭',
    'anniversary': 'יום שנה 🥂',
    'birthday': 'יום הולדת 🎂',
    'love': 'יום אהבה 🥰'
};

document.addEventListener('DOMContentLoaded', () => {
    loadGreetings();
    loadGallery();
});

// ניהול טאבים
function switchView(viewName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${viewName}`).classList.add('active');
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${viewName}View`).classList.add('active');
}

// ניהול ברכות
function filterGreetings(category) {
    currentFilter = category;
    loadGreetings();
}

function selectFormCategory(category) {
    selectedFormCategory = category;
}

async function loadGreetings() {
    const container = document.getElementById('greetingsContainer');
    try {
        const response = await fetch(`${API_URL}/greetings`);
        const greetings = await response.json();
        container.innerHTML = '';

        const filtered = currentFilter === 'all' ? greetings : greetings.filter(g => g.category === currentFilter);

        filtered.forEach(g => {
            const card = document.createElement('div');
            card.className = 'greeting-card';
            card.innerHTML = `<div class="category-tag">${categoryLabels[g.category]}</div><p>${g.text}</p><button class="delete-btn" onclick="deleteGreeting('${g._id}')">מחיקה 🗑️</button>`;
            container.appendChild(card);
        });
    } catch (e) { console.error(e); }
}

async function addGreeting() {
    const text = document.getElementById('greetingText').value;
    if (!text) return;
    await fetch(`${API_URL}/greetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, category: selectedFormCategory })
    });
    document.getElementById('greetingText').value = '';
    loadGreetings();
}

async function deleteGreeting(id) {
    await fetch(`${API_URL}/greetings/${id}`, { method: 'DELETE' });
    loadGreetings();
}

// ניהול גלריה
async function loadGallery() {
    const container = document.getElementById('galleryContainer');
    const response = await fetch(`${API_URL}/photos`);
    const photos = await response.json();
    container.innerHTML = '';
    photos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `<img src="${p.imageUrl}"><button class="delete-btn" onclick="deletePhoto('${p._id}')">מחיקה 🗑️</button>`;
        container.appendChild(card);
    });
}

async function handlePhotoUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        await fetch(`${API_URL}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: e.target.result })
        });
        loadGallery();
    };
    reader.readAsDataURL(file);
}

async function deletePhoto(id) {
    await fetch(`${API_URL}/photos/${id}`, { method: 'DELETE' });
    loadGallery();
}