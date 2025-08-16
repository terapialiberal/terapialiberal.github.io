/**
 * TERAPIA LIBERAL - BLOG SYSTEM
 * JavaScript principal para el sitio
 */

class TerapiaLiberal {
    constructor() {
        this.apiUrl = '/data/posts.json';
        this.init();
    }

    init() {
        this.loadPosts();
        this.setupEventListeners();
    }

    // Cargar posts desde el archivo JSON
    async loadPosts() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            
            if (document.getElementById('featured-post')) {
                this.renderFeaturedPost(data.featured);
            }
            
            if (document.getElementById('posts-grid')) {
                this.renderPostsGrid(data.posts);
            }
        } catch (error) {
            console.error('Error cargando posts:', error);
            this.showError('Error cargando el contenido');
        }
    }

    // Renderizar post destacado
    renderFeaturedPost(post) {
        const container = document.getElementById('featured-post');
        if (!container || !post) return;

        container.innerHTML = `
            <div class="section-bg rounded-2xl p-8">
                <div class="featured-content">
                    <div class="featured-video">
                        <div class="video-thumbnail-featured" onclick="window.open('${post.video_url}', '_blank')">
                            <img src="https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg" 
                                 alt="${post.title}" loading="lazy">
                            <div class="play-button-featured">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                    </div>
                    <div class="featured-text">
                        <div class="date-badge mb-4">${post.date} - DESTACADO</div>
                        <h4 class="text-3xl font-bold mb-4 gold-text">${post.title}</h4>
                        <p class="text-gray-300 mb-6 text-lg leading-relaxed">${post.description}</p>
                        <div class="flex gap-4 flex-wrap">
                            <a href="/posts/${post.slug}.html" class="btn-gradient text-lg px-6 py-3">
                                <i class="fas fa-file-alt"></i> Ver Análisis Completo
                            </a>
                            <a href="${post.video_url}" target="_blank" class="btn-primary text-lg px-6 py-3">
                                <i class="fab fa-youtube"></i> Ver Video
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizar grid de posts
    renderPostsGrid(posts) {
        const container = document.getElementById('posts-grid');
        if (!container || !posts) return;

        const postsHTML = posts.map(post => `
            <div class="post-card">
                <div class="video-thumbnail mb-4" onclick="window.open('${post.video_url}', '_blank')">
                    <img src="https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg" 
                         alt="${post.title}" loading="lazy">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="flex-grow flex flex-col">
                    <div class="date-badge mb-3">${post.date}</div>
                    <h4 class="text-xl font-bold mb-3 gold-text">${post.title}</h4>
                    <p class="text-gray-300 mb-4 flex-grow">${post.description}</p>
                    <div class="flex gap-3 mt-auto">
                        <a href="/posts/${post.slug}.html" class="btn-gradient text-sm">Ver Análisis</a>
                        <a href="${post.video_url}" target="_blank" class="btn-gradient text-sm">Ver Video</a>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = postsHTML;
    }

    // Event listeners
    setupEventListeners() {
        // Smooth scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Lazy loading manual para navegadores antiguos
        this.setupLazyLoading();
    }

    // Lazy loading setup
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Mostrar mensajes de error
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        
        const container = document.querySelector('main') || document.body;
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Mostrar mensajes de éxito
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        
        const container = document.querySelector('main') || document.body;
        container.insertBefore(successDiv, container.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Utilidad para formatear fechas
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Utilidad para crear slug desde título
    static createSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
            .replace(/\s+/g, '-') // Espacios a guiones
            .replace(/-+/g, '-') // Múltiples guiones a uno
            .trim('-');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new TerapiaLiberal();
});

// Exportar para uso en otros archivos
window.TerapiaLiberal = TerapiaLiberal;