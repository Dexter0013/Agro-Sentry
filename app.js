// AgroSentry Application JavaScript

// Application data from the provided JSON
const appData = {
  "users": [
    {
      "id": 1,
      "name": "Dr. Priya Sharma",
      "email": "priya.sharma@agro.com", 
      "role": "Agronomist",
      "lastLogin": "2025-09-29T18:30:00Z"
    }
  ],
  "fields": [
    {
      "id": 1,
      "name": "North Field A",
      "area": "15.2 acres",
      "crop": "Wheat",
      "healthStatus": "healthy",
      "healthScore": 85,
      "lastUpdated": "2025-09-29T17:45:00Z"
    },
    {
      "id": 2,
      "name": "South Field B",
      "area": "22.8 acres", 
      "crop": "Rice",
      "healthStatus": "warning",
      "healthScore": 67,
      "lastUpdated": "2025-09-29T17:40:00Z"
    },
    {
      "id": 3,
      "name": "East Field C",
      "area": "18.5 acres",
      "crop": "Corn",
      "healthStatus": "critical",
      "healthScore": 45,
      "lastUpdated": "2025-09-29T17:50:00Z"
    }
  ],
  "sensorData": {
    "soilMoisture": 68,
    "airTemperature": 28.5,
    "humidity": 72,
    "leafWetness": 15,
    "readings": [
      {"timestamp": "2025-09-29T12:00:00Z", "soilMoisture": 65, "temperature": 26.2, "humidity": 75},
      {"timestamp": "2025-09-29T15:00:00Z", "soilMoisture": 68, "temperature": 28.5, "humidity": 72},
      {"timestamp": "2025-09-29T18:00:00Z", "soilMoisture": 70, "temperature": 25.8, "humidity": 78}
    ]
  },
  "alerts": [
    {
      "id": 1,
      "type": "warning",
      "title": "Low Soil Moisture Detected",
      "message": "South Field B showing declining soil moisture levels",
      "timestamp": "2025-09-29T17:30:00Z",
      "field": "South Field B"
    },
    {
      "id": 2,
      "type": "critical",
      "title": "Pest Risk Alert",
      "message": "High risk of aphid infestation in East Field C",
      "timestamp": "2025-09-29T16:45:00Z", 
      "field": "East Field C"
    },
    {
      "id": 3,
      "type": "info",
      "title": "Weather Update",
      "message": "Rainfall expected in next 48 hours",
      "timestamp": "2025-09-29T15:00:00Z",
      "field": "All Fields"
    }
  ],
  "vegetationIndices": [
    {"date": "2025-09-25", "ndvi": 0.75, "field": "North Field A"},
    {"date": "2025-09-26", "ndvi": 0.78, "field": "North Field A"},
    {"date": "2025-09-27", "ndvi": 0.76, "field": "North Field A"},
    {"date": "2025-09-28", "ndvi": 0.79, "field": "North Field A"},
    {"date": "2025-09-29", "ndvi": 0.82, "field": "North Field A"}
  ],
  "droneData": {
    "status": "connected",
    "gps": "26.1445°N, 91.7362°E",
    "altitude": "150m",
    "speed": "5.2 m/s",
    "batteryLevel": 78,
    "flightHistory": [
      {"date": "2025-09-29", "duration": "45 min", "area": "North Field A", "images": 127},
      {"date": "2025-09-28", "duration": "38 min", "area": "South Field B", "images": 98},
      {"date": "2025-09-27", "duration": "52 min", "area": "East Field C", "images": 156}
    ]
  },
  "predictions": [
    {
      "field": "North Field A",
      "riskType": "Disease",
      "riskLevel": "Low",
      "confidence": 92,
      "recommendation": "Continue current monitoring schedule"
    },
    {
      "field": "South Field B", 
      "riskType": "Drought Stress",
      "riskLevel": "Medium",
      "confidence": 78,
      "recommendation": "Increase irrigation frequency"
    },
    {
      "field": "East Field C",
      "riskType": "Pest Outbreak",
      "riskLevel": "High", 
      "confidence": 85,
      "recommendation": "Apply targeted pest control measures immediately"
    }
  ]
};

// Application state
let currentUser = null;
let currentSection = 'dashboard';
let charts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupAuthenticationHandlers();
    setupNavigationHandlers();
    setupModalHandlers();
    setupFormHandlers();
    setupMapLayerControls();
    setupFieldSelector();
    setupDateRangeSelector();
    updateLiveTimestamp();
    startRealTimeUpdates();
    
    // Check if user is already logged in (simulate session)
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
        setTimeout(initializeCharts, 100);
    } else {
        showAuthSection();
    }
}

// Authentication Functions
function setupAuthenticationHandlers() {
    const loginForm = document.getElementById('login-form-element');
    const registerForm = document.getElementById('register-form-element');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthForms('register');
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthForms('login');
        });
    }
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    // Simulate login validation - accept any valid email format
    if (isValidEmail(email) && password.length > 0) {
        // Find existing user or create a default one
        let user = appData.users.find(u => u.email === email);
        if (!user) {
            user = {
                id: appData.users.length + 1,
                name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                email: email,
                role: "Farmer",
                lastLogin: new Date().toISOString()
            };
            appData.users.push(user);
        }
        
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        showToast('Login successful!', 'success');
        
        // Use setTimeout to ensure DOM is ready and animations complete
        setTimeout(() => {
            showMainApp();
            setTimeout(initializeCharts, 200);
        }, 500);
    } else {
        showToast('Please enter a valid email and password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const role = document.getElementById('register-role').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!name || !email || !role || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: appData.users.length + 1,
        name: name,
        email: email,
        role: role,
        lastLogin: new Date().toISOString()
    };

    appData.users.push(newUser);
    currentUser = newUser;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    showToast('Account created successfully!', 'success');
    
    // Use setTimeout to ensure proper transition
    setTimeout(() => {
        showMainApp();
        setTimeout(initializeCharts, 200);
    }, 500);
}

function handleLogout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    showToast('Logged out successfully', 'info');
    setTimeout(showAuthSection, 300);
}

function toggleAuthForms(form) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (form === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

function showAuthSection() {
    const authSection = document.getElementById('auth-section');
    const appContainer = document.getElementById('app-container');
    
    if (authSection && appContainer) {
        authSection.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }
}

function showMainApp() {
    const authSection = document.getElementById('auth-section');
    const appContainer = document.getElementById('app-container');
    const userNameElement = document.getElementById('user-name');
    
    if (authSection && appContainer) {
        authSection.classList.add('hidden');
        appContainer.classList.remove('hidden');
        
        if (userNameElement && currentUser) {
            userNameElement.textContent = currentUser.name;
        }
        
        // Ensure dashboard is the active section
        navigateToSection('dashboard');
    }
}

// Navigation Functions
function setupNavigationHandlers() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const navLinks = document.querySelectorAll('.nav-link');

    function openSidebar() {
        sidebar.classList.add('open');
        sidebarToggle.setAttribute('aria-expanded', 'true');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
        // Focus first nav link for accessibility
        if (window.innerWidth <= 1024) {
            const firstLink = sidebar.querySelector('.nav-link');
            if (firstLink) firstLink.focus();
        }
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarToggle.setAttribute('aria-expanded', 'false');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        sidebarToggle.focus();
    }

    if (sidebarToggle && sidebar) {
        sidebarToggle.setAttribute('aria-controls', 'sidebar');
        sidebarToggle.setAttribute('aria-expanded', 'false');
        sidebarToggle.setAttribute('aria-label', 'Toggle sidebar navigation');

        sidebarToggle.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            navigateToSection(section);
            // Close sidebar on mobile/tablet after navigation
            if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    });

    // Keyboard accessibility: close sidebar with Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
}

function navigateToSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Initialize section-specific functionality
        if (sectionName === 'analytics' && !charts.ndviChart) {
            setTimeout(initializeCharts, 100);
        }
    }
}

// Modal Functions
function setupModalHandlers() {
    const modal = document.getElementById('field-modal');
    const closeModal = modal ? modal.querySelector('.modal-close') : null;
    const fieldZones = document.querySelectorAll('.field-zone');

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    fieldZones.forEach(zone => {
        zone.addEventListener('click', () => {
            const fieldName = zone.getAttribute('data-field');
            showFieldModal(fieldName);
        });
    });
}

function showFieldModal(fieldName) {
    const field = appData.fields.find(f => f.name === fieldName);
    if (!field) return;

    const modal = document.getElementById('field-modal');
    const modalTitle = document.getElementById('modal-field-name');
    const modalDetails = document.getElementById('modal-field-details');

    if (modal && modalTitle && modalDetails) {
        modalTitle.textContent = field.name;
        modalDetails.innerHTML = `
            <div class="field-detail-grid">
                <div class="field-detail-item">
                    <strong>Area:</strong> ${field.area}
                </div>
                <div class="field-detail-item">
                    <strong>Crop:</strong> ${field.crop}
                </div>
                <div class="field-detail-item">
                    <strong>Health Score:</strong> ${field.healthScore}%
                </div>
                <div class="field-detail-item">
                    <strong>Status:</strong> <span class="status status--${field.healthStatus === 'healthy' ? 'success' : field.healthStatus === 'warning' ? 'warning' : 'error'}">${field.healthStatus.toUpperCase()}</span>
                </div>
                <div class="field-detail-item">
                    <strong>Last Updated:</strong> ${formatTimestamp(field.lastUpdated)}
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
    }
}

// Form Handlers
function setupFormHandlers() {
    const profileForm = document.getElementById('profile-form');
    const droneControls = document.querySelectorAll('.drone-controls .btn');

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Profile updated successfully!', 'success');
        });
    }

    droneControls.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.textContent;
            showToast(`${action} executed successfully`, 'info');
        });
    });

    // Report generation buttons
    const reportButtons = document.querySelectorAll('.report-actions .btn');
    reportButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent;
            showToast(`${action} initiated`, 'success');
        });
    });
}

// Chart Functions
function initializeCharts() {
    if (typeof Chart === 'undefined') return;

    // NDVI Chart
    const ndviCtx = document.getElementById('ndvi-chart');
    if (ndviCtx && !charts.ndviChart) {
        charts.ndviChart = new Chart(ndviCtx, {
            type: 'line',
            data: {
                labels: appData.vegetationIndices.map(v => formatDate(v.date)),
                datasets: [{
                    label: 'NDVI',
                    data: appData.vegetationIndices.map(v => v.ndvi),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0.7,
                        max: 0.9
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Environmental Chart
    const envCtx = document.getElementById('environmental-chart');
    if (envCtx && !charts.environmentalChart) {
        charts.environmentalChart = new Chart(envCtx, {
            type: 'line',
            data: {
                labels: appData.sensorData.readings.map(r => formatTime(r.timestamp)),
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: appData.sensorData.readings.map(r => r.temperature),
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Humidity (%)',
                        data: appData.sensorData.readings.map(r => r.humidity),
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Utility Functions
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <p>${message}</p>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function updateLiveTimestamp() {
    const timestampElement = document.getElementById('live-timestamp');
    if (timestampElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        timestampElement.textContent = timeString;
    }
}

// Real-time updates simulation
function startRealTimeUpdates() {
    // Update live timestamp every second
    setInterval(updateLiveTimestamp, 1000);

    // Update sensor data every 30 seconds
    setInterval(() => {
        if (currentSection === 'sensors' || currentSection === 'dashboard') {
            simulateSensorUpdate();
        }
    }, 30000);

    // Update drone data every 10 seconds
    setInterval(() => {
        if (currentSection === 'drone-feed') {
            simulateDroneUpdate();
        }
    }, 10000);
}

function simulateSensorUpdate() {
    // Slightly randomize sensor values
    const moistureVariation = (Math.random() - 0.5) * 4; // ±2%
    const tempVariation = (Math.random() - 0.5) * 2; // ±1°C
    const humidityVariation = (Math.random() - 0.5) * 6; // ±3%

    appData.sensorData.soilMoisture = Math.max(0, Math.min(100, 
        appData.sensorData.soilMoisture + moistureVariation));
    appData.sensorData.airTemperature = Math.max(0, 
        appData.sensorData.airTemperature + tempVariation);
    appData.sensorData.humidity = Math.max(0, Math.min(100, 
        appData.sensorData.humidity + humidityVariation));

    // Update display if on sensors section
    updateSensorDisplay();
}

function updateSensorDisplay() {
    const elements = {
        soilMoisture: document.querySelector('.sensor-card:nth-child(1) .progress-value'),
        temperature: document.querySelector('.sensor-card:nth-child(2) .progress-value'),
        humidity: document.querySelector('.sensor-card:nth-child(3) .progress-value')
    };

    if (elements.soilMoisture) {
        elements.soilMoisture.textContent = Math.round(appData.sensorData.soilMoisture) + '%';
    }
    if (elements.temperature) {
        elements.temperature.textContent = appData.sensorData.airTemperature.toFixed(1) + '°C';
    }
    if (elements.humidity) {
        elements.humidity.textContent = Math.round(appData.sensorData.humidity) + '%';
    }
}

function simulateDroneUpdate() {
    // Update drone GPS coordinates slightly
    const gpsElement = document.querySelector('.metadata-item:nth-child(1) .metadata-value');
    if (gpsElement) {
        const lat = 26.1445 + (Math.random() - 0.5) * 0.001;
        const lng = 91.7362 + (Math.random() - 0.5) * 0.001;
        gpsElement.textContent = `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    }

    // Update altitude slightly
    const altElement = document.querySelector('.metadata-item:nth-child(2) .metadata-value');
    if (altElement) {
        const alt = 150 + Math.floor((Math.random() - 0.5) * 10);
        altElement.textContent = `${alt}m`;
    }

    // Update speed
    const speedElement = document.querySelector('.metadata-item:nth-child(3) .metadata-value');
    if (speedElement) {
        const speed = 5.2 + (Math.random() - 0.5) * 2;
        speedElement.textContent = `${speed.toFixed(1)} m/s`;
    }
}

// Layer control handling for maps
function setupMapLayerControls() {
    const layerCheckboxes = document.querySelectorAll('.layer-toggles input[type="checkbox"]');
    layerCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const layerName = e.target.parentNode.textContent.trim();
            const isChecked = e.target.checked;
            showToast(`${layerName} layer ${isChecked ? 'enabled' : 'disabled'}`, 'info');
        });
    });
}

// Field selector handling
function setupFieldSelector() {
    const fieldSelector = document.querySelector('.field-selector select');
    if (fieldSelector) {
        fieldSelector.addEventListener('change', (e) => {
            const selectedField = e.target.value;
            showToast(`Viewing ${selectedField === 'all' ? 'all fields' : selectedField}`, 'info');
        });
    }
}

// Date range selector handling
function setupDateRangeSelector() {
    const dateInputs = document.querySelectorAll('.date-range-selector input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', () => {
            showToast('Date range updated', 'info');
            // Re-initialize charts with new date range
            if (charts.ndviChart) {
                charts.ndviChart.destroy();
                charts.ndviChart = null;
            }
            if (charts.environmentalChart) {
                charts.environmentalChart.destroy();
                charts.environmentalChart = null;
            }
            setTimeout(initializeCharts, 100);
        });
    });
}

// Handle responsive behavior
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    // On large screens, always show sidebar, remove open class
    if (window.innerWidth > 1024) {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close modal
        const modal = document.getElementById('field-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
        
        // Close sidebar on mobile
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }
});

// Export functions for global access if needed
window.AgroSentry = {
    showToast,
    navigateToSection,
    showFieldModal,
    updateSensorDisplay
};