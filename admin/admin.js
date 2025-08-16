/**
 * TERAPIA LIBERAL - ADMIN PANEL
 * JavaScript para el panel de administración
 */

class AdminPanel {
    constructor() {
        this.posts = [];
        this.currentEditingPost = null;
        this.init();
    }

    init() {
        this.loadPosts();
        this.setupEventListeners();
        this.setDefaultDate();
    }

    // Configurar fecha por defecto
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    // Event listeners
    setupEventListeners() {
        // Form submission
        document.getElementById('post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Preview en tiempo real
        ['title', 'description', 'video_id'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.updatePreview();
            });
        });
    }

    // Manejar envío del formulario
    async handleFormSubmit() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        try {
            const post = this.createPostObject(formData);
            
            // Generar la página HTML del post
            await this.generatePostHTML(post);
            
            // Actualizar el archivo de datos
            await this.updatePostsData(post);
            
            // Actualizar el index.html
            await this.updateIndexHTML();
            
            this.showSuccess('¡Post creado exitosamente!');
            this.resetForm();
            
        } catch (error) {
            console.error('Error:', error);
            this.showError('Error al crear el post: ' + error.message);
        }
    }

    // Obtener datos del formulario
    getFormData() {
        return {
            title: document.getElementById('title').value.trim(),
            date: document.getElementById('date').value,
            video_id: document.getElementById('video_id').value.trim(),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value.trim(),
            content: document.getElementById('content').value.trim(),
            tags: document.getElementById('tags').value.trim(),
            featured: document.getElementById('featured').value === 'true'
        };
    }

    // Validar formulario
    validateForm(data) {
        if (!data.title) {
            this.showError('El título es obligatorio');
            return false;
        }
        
        if (!data.video_id) {
            this.showError('El Video ID es obligatorio');
            return false;
        }
        
        if (!data.description) {
            this.showError('La descripción es obligatoria');
            return false;
        }
        
        if (!data.content) {
            this.showError('El contenido es obligatorio');
            return false;
        }
        
        return true;
    }

    // Crear objeto post
    createPostObject(data) {
        const slug = TerapiaLiberal.createSlug(data.title);
        const dateFormatted = this.formatDateForDisplay(data.date);
        
        return {
            id: Date.now().toString(),
            title: data.title,
            slug: slug,
            date: dateFormatted,
            date_raw: data.date,
            video_id: data.video_id,
            video_url: `https://youtu.be/${data.video_id}`,
            category: data.category,
            description: data.description,
            content: data.content,
            tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            featured: data.featured,
            created_at: new Date().toISOString()
        };
    }

    // Generar página HTML del post
    async generatePostHTML(post) {
        const htmlContent = this.getPostTemplate(post);
        
        // Simular guardado del archivo (en un entorno real, esto sería una llamada al servidor)
        console.log(`Generando archivo: /posts/${post.slug}.html`);
        console.log('Contenido:', htmlContent);
        
        // Aquí deberías implementar la lógica para guardar el archivo
        // Por ahora, lo guardamos en localStorage para demostración
        localStorage.setItem(`post_${post.slug}`, htmlContent);
        
        return htmlContent;
    }

    // Template para posts individuales
    getPostTemplate(post) {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - Análisis Terapia Liberal</title>
    
    <!-- Meta Tags para SEO -->
    <meta name="description" content="${post.description}">
    <meta name="keywords" content="${post.tags.join(', ')}">
    <meta name="author" content="Nicolás Martínez Lage - Terapia Liberal">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.description}">
    <meta property="og:image" content="https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg">
    <meta property="og:url" content="https://terapialiberal.github.io/posts/${post.slug}.html">
    <meta property="og:type" content="article">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Estilos -->
    <link rel="stylesheet" href="../assets/css/main.css">
    
    <style>
        .article-header {
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 3rem 2rem;
            margin-bottom: 3rem;
            text-align: center;
        }
        
        .article-content {
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 3rem 2rem;
            line-height: 1.8;
        }
        
        .article-content h2 {
            color: var(--gold);
            margin: 2rem 0 1rem 0;
            font-size: 1.5rem;
        }
        
        .article-content h3 {
            color: var(--gold);
            margin: 1.5rem 0 1rem 0;
            font-size: 1.25rem;
        }
        
        .article-content p {
            margin-bottom: 1.5rem;
            color: #e5e7eb;
        }
        
        .video-embed {
            margin: 2rem 0;
            text-align: center;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--gold);
            text-decoration: none;
            margin-bottom: 2rem;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            transform: translateX(-4px);
        }
        
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 2rem;
        }
        
        .tag {
            background: rgba(212, 175, 55, 0.1);
            color: var(--gold);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            border: 1px solid rgba(212, 175, 55, 0.3);
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="header-content">
            <div class="logo">
                <img src="https://yt3.ggpht.com/ZzVyDrXt4x8YWoKbISHZzC9CCtkEPCN4GRET1Xxf_wssNyw7mfN-xTbBmpwEJHO0DRQrg0Dgug=s68-c-k-c0x00ffffff-no-rj" alt="Terapia Liberal">
                <h1>Terapia Liberal</h1>
            </div>
            <nav class="nav-links">
                <a href="https://www.youtube.com/@terapialiberal" target="_blank"><i class="fab fa-youtube"></i></a>
                <a href="https://x.com/terapia_liberal" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="https://www.patreon.com/terapialiberal" target="_blank"><i class="fab fa-patreon"></i></a>
            </nav>
        </div>
    </header>

    <main style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
        <a href="../index.html" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Volver al Inicio
        </a>

        <!-- Article Header -->
        <div class="article-header">
            <div class="date-badge mb-4">${post.date}</div>
            <h1 class="text-4xl font-bold gold-text mb-4">${post.title}</h1>
            <p class="text-xl text-gray-300 mb-6">${post.description}</p>
            
            <!-- Video -->
            <div class="video-embed">
                <div class="video-thumbnail-featured" onclick="window.open('${post.video_url}', '_blank')" style="max-width: 600px; margin: 0 auto;">
                    <img src="https://img.youtube.com/vi/${post.video_id}/maxresdefault.jpg" alt="${post.title}">
                    <div class="play-button-featured">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="mt-4">
                    <a href="${post.video_url}" target="_blank" class="btn-gradient">
                        <i class="fab fa-youtube"></i> Ver en YouTube
                    </a>
                </div>
            </div>
            
            ${post.tags.length > 0 ? `
            <div class="tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ` : ''}
        </div>

        <!-- Article Content -->
        <div class="article-content">
            ${post.content}
        </div>

        <!-- Navigation -->
        <div class="text-center mt-8">
            <a href="../index.html" class="btn-primary">
                <i class="fas fa-home"></i> Volver a la Biblioteca
            </a>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="social-links">
                <a href="https://www.youtube.com/@terapialiberal" target="_blank"><i class="fab fa-youtube"></i></a>
                <a href="https://x.com/terapia_liberal" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="https://www.patreon.com/terapialiberal" target="_blank"><i class="fab fa-patreon"></i></a>
            </div>
            <p class="text-gray-400">© 2025 Terapia Liberal. Análisis independiente para mentes críticas.</p>
        </div>
    </footer>

    <script src="../assets/js/main.js"></script>
</body>
</html>`;
    }

    // Actualizar datos de posts
    async updatePostsData(newPost) {
        // Si el post es destacado, remover el destacado anterior
        if (newPost.featured) {
            this.posts.forEach(post => post.featured = false);
        }
        
        this.posts.push(newPost);
        
        // Ordenar por fecha (más reciente primero)
        this.posts.sort((a, b) => new Date(b.date_raw) - new Date(a.date_raw));
        
        const data = {
            featured: this.posts.find(post => post.featured) || this.posts[0],
            posts: this.posts.filter(post => !post.featured)
        };
        
        // Guardar en localStorage (en producción sería un archivo JSON)
        localStorage.setItem('posts_data', JSON.stringify(data));
        console.log('Posts data updated:', data);
    }

    // Cargar posts existentes
    loadPosts() {
        const saved = localStorage.getItem('posts_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.posts = [data.featured, ...data.posts].filter(Boolean);
        }
        this.renderPostsList();
    }

    // Renderizar lista de posts en gestión
    renderPostsList() {
        const container = document.getElementById('posts-list-content');
        
        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="text-center p-8">
                    <i class="fas fa-inbox text-4xl text-gray-500 mb-4"></i>
                    <p class="text-gray-400">No hay posts creados aún</p>
                </div>
            `;
            return;
        }
        
        const postsHTML = this.posts.map(post => `
            <div class="post-item">
                <div>
                    <h4 class="font-bold text-white">${post.title}</h4>
                    <p class="text-sm text-gray-400">${post.date} • ${post.category}</p>
                    ${post.featured ? '<span class="text-xs bg-yellow-600 text-black px-2 py-1 rounded">DESTACADO</span>' : ''}
                </div>
                <div class="post-actions">
                    <button onclick="adminPanel.editPost('${post.id}')" class="btn-small btn-edit">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button onclick="adminPanel.deletePost('${post.id}')" class="btn-small btn-delete">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = postsHTML;
    }

    // Actualizar vista previa
    updatePreview() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const video_id = document.getElementById('video_id').value;
        
        if (!title && !description && !video_id) {
            document.getElementById('preview-section').style.display = 'none';
            return;
        }
        
        const previewHTML = `
            <div class="post-card">
                ${video_id ? `
                <div class="video-thumbnail mb-4">
                    <img src="https://img.youtube.com/vi/${video_id}/maxresdefault.jpg" alt="${title}">
                    <div class="play-button"><i class="fas fa-play"></i></div>
                </div>
                ` : ''}
                <div class="flex-grow flex flex-col">
                    <div class="date-badge mb-3">${this.formatDateForDisplay(new Date().toISOString().split('T')[0])}</div>
                    <h4 class="text-xl font-bold mb-3 gold-text">${title || 'Título del post'}</h4>
                    <p class="text-gray-300 mb-4 flex-grow">${description || 'Descripción del post'}</p>
                    <div class="flex gap-3 mt-auto">
                        <a href="#" class="btn-gradient text-sm">Ver Análisis</a>
                        <a href="#" class="btn-gradient text-sm">Ver Video</a>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('preview-content').innerHTML = previewHTML;
        document.getElementById('preview-section').style.display = 'block';
    }

    // Formatear fecha para mostrar
    formatDateForDisplay(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '/') + ' ANÁLISIS';
    }

    // Resetear formulario
    resetForm() {
        document.getElementById('post-form').reset();
        this.setDefaultDate();
        document.getElementById('preview-section').style.display = 'none';
    }

    // Editar post
    editPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        this.currentEditingPost = post;
        
        // Llenar formulario con datos del post
        document.getElementById('title').value = post.title;
        document.getElementById('date').value = post.date_raw;
        document.getElementById('video_id').value = post.video_id;
        document.getElementById('category').value = post.category;
        document.getElementById('description').value = post.description;
        document.getElementById('content').value = post.content;
        document.getElementById('tags').value = post.tags.join(', ');
        document.getElementById('featured').value = post.featured.toString();
        
        // Cambiar a la sección de crear
        showSection('create');
        
        // Cambiar texto del botón
        const submitBtn = document.querySelector('#post-form button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Post';
    }

    // Eliminar post
    deletePost(postId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
            return;
        }
        
        this.posts = this.posts.filter(p => p.id !== postId);
        this.updatePostsData({ featured: false }); // Trigger update
        this.renderPostsList();
        this.showSuccess('Post eliminado exitosamente');
    }

    // Mostrar mensaje de éxito
    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = message;
        
        const main = document.querySelector('main');
        main.insertBefore(alert, main.firstChild);
        
        setTimeout(() => alert.remove(), 5000);
    }

    // Mostrar mensaje de error
    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.textContent = message;
        
        const main = document.querySelector('main');
        main.insertBefore(alert, main.firstChild);
        
        setTimeout(() => alert.remove(), 5000);
    }
}

// Funciones globales para la navegación
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(`section-${sectionName}`).classList.add('active');
    
    // Actualizar navegación
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`nav-${sectionName}`).classList.add('active');
}

// Inicializar panel de admin
let adminPanel;
document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
});