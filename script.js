/* --- ГЕНЕРАТОР ТЕМ (20 ШТУК) --- */
const themes = [
    { bg: "#0f172a", text: "#f1f5f9", accent: "#38bdf8" }, // Midnight (Default)
    { bg: "#000000", text: "#ffffff", accent: "#ffffff" }, // Pure Black
    { bg: "#ffffff", text: "#111111", accent: "#2563eb" }, // Paper White
    { bg: "#1a1a1a", text: "#e5e5e5", accent: "#10b981" }, // Matrix Green
    { bg: "#2e1065", text: "#f3e8ff", accent: "#d8b4fe" }, // Deep Purple
    { bg: "#450a0a", text: "#fef2f2", accent: "#f87171" }, // Blood Red
    { bg: "#172554", text: "#eff6ff", accent: "#60a5fa" }, // Ocean
    { bg: "#0c0a09", text: "#fafaf9", accent: "#f59e0b" }, // Gold Dark
    { bg: "#134e4a", text: "#ccfbf1", accent: "#5eead4" }, // Teal
    { bg: "#fdf4ff", text: "#4a044e", accent: "#d946ef" }, // Barbie (Light)
    { bg: "#18181b", text: "#a1a1aa", accent: "#71717a" }, // Gray Scale
    { bg: "#022c22", text: "#ecfdf5", accent: "#34d399" }, // Forest
    { bg: "#312e81", text: "#e0e7ff", accent: "#818cf8" }, // Indigo
    { bg: "#881337", text: "#fff1f2", accent: "#fb7185" }, // Rose
    { bg: "#fffbeb", text: "#78350f", accent: "#d97706" }, // Amber Light
    { bg: "#1e1b4b", text: "#e0e7ff", accent: "#c7d2fe" }, // Night Sky
    { bg: "#0f0f0f", text: "#00ff00", accent: "#00ff00" }, // Hacker
    { bg: "#27272a", text: "#e4e4e7", accent: "#a1a1aa" }, // Zinc
    { bg: "#f0f9ff", text: "#0c4a6e", accent: "#0ea5e9" }, // Sky Light
    { bg: "#280518", text: "#fbcfe8", accent: "#f472b6" }  // Pink Dark
];

// Инициализация
window.addEventListener('load', () => {
    renderBooks();
    renderThemes();
    loadSettings();
    updateClock();
    setInterval(updateClock, 1000);
});

/* --- КНИГИ --- */
function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = '';
    
    booksData.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-card';
        div.innerHTML = `
            ${book.badge ? `<span class="book-badge">${book.badge}</span>` : ''}
            <div class="book-title">${book.title}</div>
            <div class="book-author">by ${book.author}</div>
            <div class="book-preview">${book.preview}</div>
        `;
        div.onclick = () => openReader(book);
        container.appendChild(div);
    });
}

/* --- ЧИТАЛКА --- */
function openReader(book) {
    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('settings-section').classList.add('hidden');
    const reader = document.getElementById('reader-section');
    reader.classList.remove('hidden');
    
    document.getElementById('reader-title').textContent = book.title;
    document.getElementById('reader-meta').textContent = `${book.author} • ${book.genre}`;
    document.getElementById('reader-text').innerHTML = book.text;
    
    window.scrollTo(0, 0);
}

function closeReader() {
    document.getElementById('reader-section').classList.add('hidden');
    document.getElementById('home-section').classList.remove('hidden');
}

/* --- НАВИГАЦИЯ --- */
function switchTab(tab) {
    if(tab === 'home') {
        document.getElementById('home-section').classList.remove('hidden');
        document.getElementById('settings-section').classList.add('hidden');
        document.getElementById('reader-section').classList.add('hidden');
        document.querySelector('[onclick="switchTab(\'home\')"]').classList.add('active');
        document.querySelector('[onclick="switchTab(\'settings\')"]').classList.remove('active');
    } else {
        document.getElementById('home-section').classList.add('hidden');
        document.getElementById('settings-section').classList.remove('hidden');
        document.getElementById('reader-section').classList.add('hidden');
        document.querySelector('[onclick="switchTab(\'home\')"]').classList.remove('active');
        document.querySelector('[onclick="switchTab(\'settings\')"]').classList.add('active');
    }
}

/* --- ТЕМЫ --- */
function renderThemes() {
    const container = document.getElementById('themes-container');
    themes.forEach((theme, index) => {
        const dot = document.createElement('div');
        dot.className = 'theme-dot';
        dot.style.backgroundColor = theme.bg;
        dot.style.borderColor = theme.accent;
        dot.onclick = () => applyTheme(theme);
        container.appendChild(dot);
    });
}

function applyTheme(theme) {
    const root = document.documentElement.style;
    root.setProperty('--bg', theme.bg);
    root.setProperty('--text', theme.text);
    root.setProperty('--accent', theme.accent);
    root.setProperty('--panel', hexToRgba(theme.bg, 0.8)); // Магия прозрачности
    root.setProperty('--glow', hexToRgba(theme.accent, 0.4));
}

function hexToRgba(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* --- ЯЗЫК --- */
let currentLang = 'ru';
function setLang(lang) {
    currentLang = lang;
    const t = translations[lang];
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if(t[key]) el.textContent = t[key];
    });
}

/* --- ЧАСЫ (DRAG & DROP) --- */
function updateClock() {
    const now = new Date();
    document.getElementById('clock-time').textContent = 
        now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function toggleClock() {
    const clock = document.getElementById('floating-clock');
    const isChecked = document.getElementById('clock-toggle').checked;
    if(isChecked) clock.classList.remove('hidden');
    else clock.classList.add('hidden');
}

// Drag Logic
const clock = document.getElementById('floating-clock');
let isDragging = false;
let startX, startY, initialLeft, initialTop;

clock.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = clock.offsetLeft;
    initialTop = clock.offsetTop;
    clock.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    clock.style.left = `${initialLeft + dx}px`;
    clock.style.top = `${initialTop + dy}px`;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    clock.style.cursor = 'grab';
});

/* --- АНИМАЦИЯ СЕЗОНОВ --- */
let seasonInterval;
function setSeason(type) {
    const canvas = document.getElementById('ambient-canvas');
    canvas.innerHTML = '';
    clearInterval(seasonInterval);

    if (type === 'none') return;

    let colors = [];
    if (type === 'winter') colors = ['#ffffff', '#a5f3fc'];
    if (type === 'sakura') colors = ['#fbcfe8', '#f472b6'];
    if (type === 'fireflies') colors = ['#fbbf24', '#f59e0b'];

    seasonInterval = setInterval(() => {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 5 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `-10px`;
        p.style.transition = `top ${Math.random() * 5 + 5}s linear, opacity 1s`;
        
        canvas.appendChild(p);

        // Анимация падения
        setTimeout(() => {
            p.style.top = '100vh';
            if(type === 'fireflies') p.style.top = `${Math.random() * 100}vh`; // Светлячки летают хаотично
        }, 100);

        // Удаление
        setTimeout(() => p.remove(), 10000);
    }, 300);
}

function loadSettings() {
    // Тут можно добавить загрузку из LocalStorage, если нужно
    applyTheme(themes[0]); // Ставим первую тему по дефолту
}
