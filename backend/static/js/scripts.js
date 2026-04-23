// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');
const previewInfo = document.getElementById('previewInfo');
const removeBtn = document.getElementById('removeBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const result = document.getElementById('result');
const errorMsg = document.getElementById('errorMsg');
const diagnosis = document.getElementById('diagnosis');
const confidenceVal = document.getElementById('confidenceVal');
const confidenceFill = document.getElementById('confidenceFill');
const probabilities = document.getElementById('probabilities');
const recText = document.getElementById('recText');

let currentFile = null;
const API_URL = '/predict';

// Class Configuration
const classConfig = {
    'NonDemented': {
        name: 'Non-Demented (Normal)',
        color: '#10b981',
        recommendation: '✅ Fungsi kognitif Anda dalam batas normal. Tetap jaga kesehatan otak dengan pola hidup sehat, olahraga teratur, dan stimulasi mental seperti membaca atau bermain puzzle.'
    },
    'VeryMildDemented': {
        name: 'Very Mild Demented (Sangat Ringan)',
        color: '#f59e0b',
        recommendation: '⚠️ Terdeteksi gangguan kognitif ringan. Disarankan konsultasi ke dokter spesialis saraf untuk monitoring lebih lanjut. Intervensi dini dapat memperlambat progresi.'
    },
    'MildDemented': {
        name: 'Mild Demented (Ringan)',
        color: '#ef4444',
        recommendation: '🩺 Menunjukkan tanda-tanda demensia tahap awal. Segera konsultasikan dengan dokter spesialis saraf untuk pemeriksaan lebih lanjut dan rencana terapi.'
    },
    'ModerateDemented': {
        name: 'Moderate Demented (Sedang)',
        color: '#dc2626',
        recommendation: '🏥 Demensia tahap sedang. Diperlukan penanganan medis intensif dan dukungan keluarga.'
    }
};

const classOrder = ['NonDemented', 'VeryMildDemented', 'MildDemented', 'ModerateDemented'];

// Upload Handlers
uploadZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
});

removeBtn.addEventListener('click', resetUpload);

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '#6366f1';
});

uploadZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'rgba(255,255,255,0.1)';
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'rgba(255,255,255,0.1)';
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) handleFileSelect(file);
});

function handleFileSelect(file) {
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewInfo.innerHTML = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        preview.classList.add('active');
        uploadZone.style.display = 'none';
        analyzeBtn.disabled = false;
        result.classList.remove('active');
        error.classList.remove('active');
        loading.classList.remove('active');
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    currentFile = null;
    fileInput.value = '';
    preview.classList.remove('active');
    uploadZone.style.display = 'block';
    analyzeBtn.disabled = true;
    result.classList.remove('active');
    error.classList.remove('active');
}

// Predict Function
async function predictImage() {
    if (!currentFile) return;
    
    loading.classList.add('active');
    result.classList.remove('active');
    error.classList.remove('active');
    analyzeBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('file', currentFile);
    
    try {
        const response = await fetch(API_URL, { method: 'POST', body: formData });
        const data = await response.json();
        
        loading.classList.remove('active');
        analyzeBtn.disabled = false;
        
        if (data.success) {
            displayResults(data);
        } else {
            showError(data.error || 'Gagal memproses gambar');
        }
    } catch (err) {
        loading.classList.remove('active');
        analyzeBtn.disabled = false;
        showError('Koneksi error. Pastikan server backend berjalan.');
    }
}

function displayResults(data) {
    const predictedClass = data.predicted_class;
    const config = classConfig[predictedClass] || classConfig['NonDemented'];
    const confidence = data.confidence * 100;
    
    diagnosis.textContent = config.name;
    document.querySelector('.diagnosis-result').style.background = `linear-gradient(135deg, ${config.color}20, ${config.color}10)`;
    
    let current = 0;
    const interval = setInterval(() => {
        if (current >= confidence) {
            clearInterval(interval);
        } else {
            current += confidence / 30;
            if (current > confidence) current = confidence;
            confidenceVal.textContent = Math.floor(current) + '%';
            confidenceFill.style.width = current + '%';
        }
    }, 20);
    
    let probHtml = '';
    classOrder.forEach(className => {
        if (data.probabilities[className] !== undefined) {
            const prob = data.probabilities[className] * 100;
            const cfg = classConfig[className];
            probHtml += `
                <div class="prob-item">
                    <div class="prob-name">
                        <div class="prob-dot" style="background: ${cfg.color}"></div>
                        ${cfg.name}
                    </div>
                    <div class="prob-bar">
                        <div class="prob-fill" style="width: 0%; background: ${cfg.color}" data-width="${prob}"></div>
                    </div>
                    <div class="prob-percent">0%</div>
                </div>
            `;
        }
    });
    probabilities.innerHTML = probHtml;
    
    setTimeout(() => {
        document.querySelectorAll('.prob-fill').forEach(bar => {
            const target = parseFloat(bar.dataset.width);
            let currentWidth = 0;
            const interval = setInterval(() => {
                if (currentWidth >= target) {
                    clearInterval(interval);
                } else {
                    currentWidth += target / 25;
                    if (currentWidth > target) currentWidth = target;
                    bar.style.width = currentWidth + '%';
                    bar.parentElement.nextElementSibling.textContent = currentWidth.toFixed(1) + '%';
                }
            }, 20);
        });
    }, 100);
    
    recText.textContent = config.recommendation;
    
    const recBox = document.querySelector('.recommendation-wrapper');
    if (predictedClass === 'NonDemented') {
        recBox.style.background = 'rgba(16,185,129,0.1)';
        recBox.style.borderLeftColor = '#10b981';
    } else if (predictedClass === 'VeryMildDemented') {
        recBox.style.background = 'rgba(245,158,11,0.1)';
        recBox.style.borderLeftColor = '#f59e0b';
    } else {
        recBox.style.background = 'rgba(239,68,68,0.1)';
        recBox.style.borderLeftColor = '#ef4444';
    }
    
    result.classList.add('active');
}

function showError(message) {
    errorMsg.textContent = message;
    error.classList.add('active');
}

function closeError() {
    error.classList.remove('active');
}

window.predictImage = predictImage;
window.closeError = closeError;

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Navbar Active Link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}