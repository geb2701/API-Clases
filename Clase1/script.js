// Google Homepage Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const luckyBtn = document.querySelector('.lucky-btn');
    const voiceIcon = document.querySelector('.voice-icon');
    const cameraIcon = document.querySelector('.camera-icon');
    const appsLink = document.querySelector('.apps-link');
    const signinBtn = document.querySelector('.signin-btn');

    // Search functionality
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(searchUrl, '_blank');
        }
    }

    // Lucky search functionality
    function performLuckySearch() {
        const query = searchInput.value.trim();
        if (query) {
            const luckyUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI`;
            window.open(luckyUrl, '_blank');
        } else {
            // If no query, go to Google Doodles
            window.open('https://doodles.google/', '_blank');
        }
    }

    // Voice search simulation
    function voiceSearch() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'es-ES';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = function() {
                voiceIcon.style.backgroundColor = '#e8f0fe';
                voiceIcon.querySelector('svg').style.fill = '#1a73e8';
            };
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                searchInput.value = transcript;
                performSearch();
            };
            
            recognition.onerror = function(event) {
                console.log('Error en reconocimiento de voz:', event.error);
                alert('Error en el reconocimiento de voz. Por favor, intenta de nuevo.');
            };
            
            recognition.onend = function() {
                voiceIcon.style.backgroundColor = '';
                voiceIcon.querySelector('svg').style.fill = '#9aa0a6';
            };
            
            recognition.start();
        } else {
            alert('El reconocimiento de voz no está disponible en este navegador.');
        }
    }

    // Camera search simulation
    function cameraSearch() {
        alert('Función de búsqueda por cámara simulada. En una implementación real, esto abriría la cámara para buscar por imagen.');
    }

    // Apps menu simulation
    function showAppsMenu() {
        const apps = [
            { name: 'Gmail', url: 'https://mail.google.com' },
            { name: 'Maps', url: 'https://maps.google.com' },
            { name: 'YouTube', url: 'https://youtube.com' },
            { name: 'Drive', url: 'https://drive.google.com' },
            { name: 'Calendar', url: 'https://calendar.google.com' },
            { name: 'Photos', url: 'https://photos.google.com' },
            { name: 'Meet', url: 'https://meet.google.com' },
            { name: 'Chat', url: 'https://chat.google.com' }
        ];

        let menuHTML = '<div class="apps-menu" style="position: absolute; top: 60px; right: 20px; background: white; border: 1px solid #dadce0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 8px; z-index: 1000; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 320px;">';
        
        apps.forEach(app => {
            menuHTML += `
                <a href="${app.url}" target="_blank" style="display: flex; flex-direction: column; align-items: center; padding: 8px; text-decoration: none; color: #5f6368; border-radius: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f1f3f4'" onmouseout="this.style.backgroundColor=''">
                    <div style="width: 40px; height: 40px; background: #f1f3f4; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; font-size: 20px;">📱</div>
                    <span style="font-size: 12px; text-align: center;">${app.name}</span>
                </a>
            `;
        });
        
        menuHTML += '</div>';
        
        // Remove existing menu if any
        const existingMenu = document.querySelector('.apps-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Add new menu
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        
        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!e.target.closest('.apps-link') && !e.target.closest('.apps-menu')) {
                    const menu = document.querySelector('.apps-menu');
                    if (menu) menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    // Sign in simulation
    function signIn() {
        alert('Función de inicio de sesión simulada. En una implementación real, esto abriría la página de inicio de sesión de Google.');
    }

    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    luckyBtn.addEventListener('click', performLuckySearch);
    voiceIcon.addEventListener('click', voiceSearch);
    cameraIcon.addEventListener('click', cameraSearch);
    appsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showAppsMenu();
    });
    signinBtn.addEventListener('click', signIn);

    // Enter key to search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Auto-focus on search input
    searchInput.focus();

    // Search suggestions simulation
    let searchSuggestions = [
        'cómo hacer una página web',
        'clima hoy',
        'noticias de tecnología',
        'recetas de cocina',
        'traductor español inglés',
        'mapa de mi ciudad',
        'videos de música',
        'tienda online'
    ];

    let currentSuggestionIndex = 0;
    let suggestionInterval;

    function startSuggestionCycle() {
        suggestionInterval = setInterval(() => {
            searchInput.placeholder = `Buscar en Google o escribir una URL - ${searchSuggestions[currentSuggestionIndex]}`;
            currentSuggestionIndex = (currentSuggestionIndex + 1) % searchSuggestions.length;
        }, 3000);
    }

    function stopSuggestionCycle() {
        if (suggestionInterval) {
            clearInterval(suggestionInterval);
            searchInput.placeholder = 'Buscar en Google o escribir una URL';
        }
    }

    // Start suggestion cycle when page loads
    setTimeout(startSuggestionCycle, 2000);

    // Stop suggestions when user starts typing
    searchInput.addEventListener('input', function() {
        stopSuggestionCycle();
    });

    // Restart suggestions when input is cleared
    searchInput.addEventListener('blur', function() {
        if (!searchInput.value) {
            setTimeout(startSuggestionCycle, 1000);
        }
    });

    // Hover effects for search box
    searchInput.addEventListener('focus', function() {
        document.querySelector('.search-box').style.boxShadow = '0 1px 6px rgba(32, 33, 36, 0.28)';
    });

    searchInput.addEventListener('blur', function() {
        if (!searchInput.value) {
            document.querySelector('.search-box').style.boxShadow = '';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Ctrl+K or Cmd+K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    });

    // Add loading animation to buttons
    function addLoadingState(button) {
        const originalText = button.textContent;
        button.textContent = 'Cargando...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    }

    searchBtn.addEventListener('click', function() {
        addLoadingState(this);
    });

    luckyBtn.addEventListener('click', function() {
        addLoadingState(this);
    });

    // Add subtle animations
    function addFadeInAnimation() {
        const elements = document.querySelectorAll('.logo-container, .search-container, .search-buttons, .language-options');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Start animations when page loads
    setTimeout(addFadeInAnimation, 100);
}); 