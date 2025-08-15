#!/usr/bin/env python3
"""
TERAPIA LIBERAL - BLOG POST GENERATOR
Script para generar automáticamente las páginas HTML de los posts
"""

import json
import os
from datetime import datetime
import re
import shutil

class PostGenerator:
    def __init__(self, data_file='data/posts.json', posts_dir='posts'):
        self.data_file = data_file
        self.posts_dir = posts_dir
        self.template_path = 'templates/post_template.html'
        
        # Crear directorio de posts si no existe
        os.makedirs(posts_dir, exist_ok=True)
    
    def load_posts_data(self):
        """Cargar datos de posts desde JSON"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Archivo {self.data_file} no encontrado")
            return None
        except json.JSONDecodeError as e:
            print(f"❌ Error en JSON: {e}")
            return None
    
    def create_slug(self, title):
        """Crear slug desde título"""
        # Normalizar y limpiar
        slug = title.lower()
        
        # Reemplazar caracteres especiales
        replacements = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n',
            '¿': '', '?': '', '¡': '', '!': '', ':': '', ',': '',
            '.': '', ';': '', '(': '', ')': '', '[': '', ']': '',
            '{': '', '}': '', '"': '', "'": '', '/': '', '\\': ''
        }
        
        for old, new in replacements.items():
            slug = slug.replace(old, new)
        
        # Espacios a guiones
        slug = re.sub(r'\s+', '-', slug)
        
        # Múltiples guiones a uno
        slug = re.sub(r'-+', '-', slug)
        
        # Remover guiones al inicio y final
        slug = slug.strip('-')
        
        return slug
    
    def get_post_template(self, post):
        """Generar HTML para un post"""
        return f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{post['title']} - Análisis Terapia Liberal</title>
    
    <!-- Meta Tags para SEO -->
    <meta name="description" content="{post['description']}">
    <meta name="keywords" content="{', '.join(post.get('tags', []))}">
    <meta name="author" content="Nicolás Martínez Lage - Terapia Liberal">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{post['title']}">
    <meta property="og:description" content="{post['description']}">
    <meta property="og:image" content="https://img.youtube.com/vi/{post['video_id']}/maxresdefault.jpg">
    <meta property="og:url" content="https://terapialiberal.github.io/posts/{post['slug']}.html">
    <meta property="og:type" content="article">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{post['title']}">
    <meta name="twitter:description" content="{post['description']}">
    <meta name="twitter:image" content="https://img.youtube.com/vi/{post['video_id']}/maxresdefault.jpg">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Estilos -->
    <link rel="stylesheet" href="../assets/css/main.css">
    
    <style>
        .article-header {{
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 3rem 2rem;
            margin-bottom: 3rem;
            text-align: center;
        }}
        
        .article-content {{
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 3rem 2rem;
            line-height: 1.8;
        }}
        
        .article-content h2 {{
            color: var(--gold);
            margin: 2rem 0 1rem 0;
            font-size: 1.5rem;
        }}
        
        .article-content h3 {{
            color: var(--gold);
            margin: 1.5rem 0 1rem 0;
            font-size: 1.25rem;
        }}
        
        .article-content p {{
            margin-bottom: 1.5rem;
            color: #e5e7eb;
        }}
        
        .video-embed {{
            margin: 2rem 0;
            text-align: center;
        }}
        
        .back-link {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--gold);
            text-decoration: none;
            margin-bottom: 2rem;
            transition: all 0.3s ease;
        }}
        
        .back-link:hover {{
            transform: translateX(-4px);
        }}
        
        .tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 2rem;
        }}
        
        .tag {{
            background: rgba(212, 175, 55, 0.1);
            color: var(--gold);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            border: 1px solid rgba(212, 175, 55, 0.3);
        }}
        
        .related-posts {{
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 2rem;
            margin-top: 3rem;
        }}
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
        <a href="../new-index.html" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Volver al Inicio
        </a>

        <!-- Article Header -->
        <div class="article-header">
            <div class="date-badge mb-4">{post['date']}</div>
            <h1 class="text-4xl font-bold gold-text mb-4">{post['title']}</h1>
            <p class="text-xl text-gray-300 mb-6">{post['description']}</p>
            
            <!-- Video -->
            <div class="video-embed">
                <div class="video-thumbnail-featured" onclick="window.open('{post['video_url']}', '_blank')" style="max-width: 600px; margin: 0 auto;">
                    <img src="https://img.youtube.com/vi/{post['video_id']}/maxresdefault.jpg" alt="{post['title']}" loading="lazy">
                    <div class="play-button-featured">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="mt-4">
                    <a href="{post['video_url']}" target="_blank" class="btn-gradient">
                        <i class="fab fa-youtube"></i> Ver en YouTube
                    </a>
                </div>
            </div>
            
            {f'''
            <div class="tags">
                {' '.join([f'<span class="tag">{tag}</span>' for tag in post.get('tags', [])])}
            </div>
            ''' if post.get('tags') else ''}
        </div>

        <!-- Article Content -->
        <div class="article-content">
            {post.get('content', '<p>Contenido del análisis aquí...</p>')}
        </div>

        <!-- Navigation -->
        <div class="text-center mt-8">
            <a href="../new-index.html" class="btn-primary mr-4">
                <i class="fas fa-home"></i> Volver a la Biblioteca
            </a>
            <a href="../admin/" class="btn-gradient">
                <i class="fas fa-edit"></i> Panel Admin
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
</html>"""
    
    def generate_all_posts(self):
        """Generar todas las páginas HTML desde los datos JSON"""
        data = self.load_posts_data()
        if not data:
            return False
        
        generated_count = 0
        
        # Procesar post destacado
        if data.get('featured'):
            post = data['featured']
            if 'slug' not in post:
                post['slug'] = self.create_slug(post['title'])
            
            html_content = self.get_post_template(post)
            file_path = os.path.join(self.posts_dir, f"{post['slug']}.html")
            
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                print(f"✅ Generado: {file_path}")
                generated_count += 1
            except Exception as e:
                print(f"❌ Error generando {file_path}: {e}")
        
        # Procesar posts normales
        for post in data.get('posts', []):
            if 'slug' not in post:
                post['slug'] = self.create_slug(post['title'])
            
            html_content = self.get_post_template(post)
            file_path = os.path.join(self.posts_dir, f"{post['slug']}.html")
            
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                print(f"✅ Generado: {file_path}")
                generated_count += 1
            except Exception as e:
                print(f"❌ Error generando {file_path}: {e}")
        
        return generated_count
    
    def update_json_with_slugs(self):
        """Actualizar el JSON con los slugs generados"""
        data = self.load_posts_data()
        if not data:
            return False
        
        # Actualizar post destacado
        if data.get('featured') and 'slug' not in data['featured']:
            data['featured']['slug'] = self.create_slug(data['featured']['title'])
        
        # Actualizar posts normales
        for post in data.get('posts', []):
            if 'slug' not in post:
                post['slug'] = self.create_slug(post['title'])
        
        # Guardar JSON actualizado
        try:
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"✅ JSON actualizado: {self.data_file}")
            return True
        except Exception as e:
            print(f"❌ Error actualizando JSON: {e}")
            return False

def main():
    print("🚀 TERAPIA LIBERAL - GENERADOR DE POSTS")
    print("=" * 50)
    
    generator = PostGenerator()
    
    # Actualizar JSON con slugs
    print("\n📝 Actualizando JSON con slugs...")
    generator.update_json_with_slugs()
    
    # Generar todas las páginas
    print("\n🔨 Generando páginas HTML...")
    count = generator.generate_all_posts()
    
    print(f"\n✨ Proceso completado!")
    print(f"📄 {count} páginas generadas en el directorio 'posts/'")
    print(f"🌐 Abre 'new-index.html' para ver el resultado")
    print(f"⚙️  Panel admin disponible en 'admin/index.html'")

if __name__ == "__main__":
    main()