#!/usr/bin/env python3
"""
TERAPIA LIBERAL - CONTENT MIGRATOR
Script para migrar el contenido existente al nuevo sistema
"""

import os
import json
import re
from bs4 import BeautifulSoup
from datetime import datetime

class ContentMigrator:
    def __init__(self):
        self.old_files = [
            'dueñosmaga.html',
            'trumpcbdc.html', 
            'elgrantablero.html',
            '29062025-nuevocomplejomilitar.html',
            '140625-SEGUNDAGLOBALIZACION.html',
            'zbig.html'
        ]
        
        # Mapeo de archivos a información
        self.file_mapping = {
            'dueñosmaga.html': {
                'title': 'INVESTIGACIÓN: Los Dueños de MAGA y el Futuro',
                'date': '2025-08-07',
                'video_id': '-wntkT1oDS4',
                'category': 'investigacion',
                'featured': True
            },
            'trumpcbdc.html': {
                'title': 'TRUMP es el Caballo de Troya Tecnocrático!',
                'date': '2025-07-24',
                'video_id': 'UEgEIzZ9dYo',
                'category': 'economia',
                'featured': False
            },
            'elgrantablero.html': {
                'title': 'El Gran Tablero Geopolítico - Brzezinski marca el Rumbo Multipolar',
                'date': '2025-07-05',
                'video_id': 'QTDXeE8bey0',
                'category': 'geopolitica',
                'featured': False
            },
            '29062025-nuevocomplejomilitar.html': {
                'title': 'Los Ganadores del Nuevo Complejo Militar TECNOLÓGICO',
                'date': '2025-06-29',
                'video_id': 'k3mX98Xo_qc',
                'category': 'economia',
                'featured': False
            },
            '140625-SEGUNDAGLOBALIZACION.html': {
                'title': 'El Segundo Borrador del Orden Mundial',
                'date': '2025-06-25',
                'video_id': 'zYV-hGwE-RQ',
                'category': 'geopolitica',
                'featured': False
            },
            'zbig.html': {
                'title': 'El Gran Tablero Mundial: La Profecía de Brzezinski',
                'date': '2025-07-05',
                'video_id': 'QTDXeE8bey0',
                'category': 'geopolitica',
                'featured': False
            }
        }
    
    def extract_content_from_html(self, filepath):
        """Extraer contenido principal de un archivo HTML existente"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Buscar el contenido principal
            main_content = soup.find('main') or soup.find('article') or soup.find('body')
            
            if not main_content:
                return "Contenido no encontrado"
            
            # Limpiar scripts y estilos
            for script in main_content.find_all(['script', 'style', 'nav', 'header', 'footer']):
                script.decompose()
            
            # Extraer texto limpio manteniendo estructura HTML básica
            content = str(main_content)
            
            # Limpiar clases innecesarias pero mantener estructura
            content = re.sub(r'class="[^"]*"', '', content)
            content = re.sub(r'style="[^"]*"', '', content)
            content = re.sub(r'id="[^"]*"', '', content)
            
            return content
            
        except Exception as e:
            print(f"❌ Error procesando {filepath}: {e}")
            return f"<p>Error al procesar contenido de {filepath}</p>"
    
    def extract_meta_description(self, filepath):
        """Extraer meta description del archivo"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Buscar meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc and meta_desc.get('content'):
                return meta_desc.get('content')
            
            # Si no hay meta description, usar el primer párrafo
            first_p = soup.find('p')
            if first_p:
                text = first_p.get_text().strip()
                return text[:200] + '...' if len(text) > 200 else text
            
            return "Análisis de Terapia Liberal"
            
        except Exception as e:
            return "Análisis de Terapia Liberal"
    
    def extract_keywords(self, filepath):
        """Extraer keywords del archivo"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Buscar meta keywords
            meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
            if meta_keywords and meta_keywords.get('content'):
                keywords = meta_keywords.get('content').split(',')
                return [k.strip() for k in keywords if k.strip()]
            
            # Si no hay keywords, generar algunas básicas
            title = self.file_mapping.get(os.path.basename(filepath), {}).get('title', '')
            basic_keywords = ['Terapia Liberal', 'Análisis', 'Geopolítica']
            
            if 'Trump' in title:
                basic_keywords.extend(['Trump', 'MAGA', 'Estados Unidos'])
            if 'Economía' in title or 'CBDC' in title:
                basic_keywords.extend(['Economía', 'Finanzas'])
            if 'Brzezinski' in title:
                basic_keywords.extend(['Brzezinski', 'Geopolítica'])
            
            return basic_keywords
            
        except Exception as e:
            return ['Terapia Liberal', 'Análisis']
    
    def create_slug(self, title):
        """Crear slug desde título"""
        slug = title.lower()
        
        replacements = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n',
            '¿': '', '?': '', '¡': '', '!': '', ':': '', ',': '',
            '.': '', ';': '', '(': '', ')': '', '[': '', ']': '',
            '{': '', '}': '', '"': '', "'": '', '/': '', '\\': ''
        }
        
        for old, new in replacements.items():
            slug = slug.replace(old, new)
        
        slug = re.sub(r'\s+', '-', slug)
        slug = re.sub(r'-+', '-', slug)
        slug = slug.strip('-')
        
        return slug
    
    def format_date_for_display(self, date_str):
        """Formatear fecha para mostrar"""
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            return date_obj.strftime('%d/%m/%Y') + ' ANÁLISIS'
        except:
            return date_str + ' ANÁLISIS'
    
    def migrate_all_content(self):
        """Migrar todo el contenido existente"""
        posts_data = {
            'featured': None,
            'posts': []
        }
        
        print("🔄 Migrando contenido existente...")
        
        for filename in self.old_files:
            if not os.path.exists(filename):
                print(f"⚠️  Archivo no encontrado: {filename}")
                continue
            
            file_info = self.file_mapping.get(filename, {})
            
            # Extraer información
            title = file_info.get('title', 'Título no disponible')
            date_raw = file_info.get('date', '2025-01-01')
            video_id = file_info.get('video_id', '')
            category = file_info.get('category', 'general')
            is_featured = file_info.get('featured', False)
            
            # Extraer contenido
            content = self.extract_content_from_html(filename)
            description = self.extract_meta_description(filename)
            tags = self.extract_keywords(filename)
            
            # Crear objeto post
            post = {
                'id': str(hash(filename)),
                'title': title,
                'slug': self.create_slug(title),
                'date': self.format_date_for_display(date_raw),
                'date_raw': date_raw,
                'video_id': video_id,
                'video_url': f'https://youtu.be/{video_id}',
                'category': category,
                'description': description,
                'content': content,
                'tags': tags,
                'featured': is_featured,
                'created_at': datetime.now().isoformat(),
                'migrated_from': filename
            }
            
            if is_featured:
                posts_data['featured'] = post
            else:
                posts_data['posts'].append(post)
            
            print(f"✅ Migrado: {filename} -> {post['slug']}")
        
        # Ordenar posts por fecha
        posts_data['posts'].sort(key=lambda x: x['date_raw'], reverse=True)
        
        # Guardar datos migrados
        try:
            with open('data/posts.json', 'w', encoding='utf-8') as f:
                json.dump(posts_data, f, indent=2, ensure_ascii=False)
            print(f"✅ Datos guardados en data/posts.json")
            return True
        except Exception as e:
            print(f"❌ Error guardando datos: {e}")
            return False
    
    def create_migration_report(self):
        """Crear reporte de migración"""
        report = """
# REPORTE DE MIGRACIÓN - TERAPIA LIBERAL

## Archivos Migrados:
"""
        
        for filename, info in self.file_mapping.items():
            status = "✅ Migrado" if os.path.exists(filename) else "❌ No encontrado"
            report += f"- {filename}: {info['title']} - {status}\n"
        
        report += f"""
## Nuevo Sistema:
- ✅ Panel de administración: admin/index.html
- ✅ Páginas generadas automáticamente en: posts/
- ✅ Estilos centralizados: assets/css/main.css
- ✅ JavaScript optimizado: assets/js/main.js
- ✅ Datos estructurados: data/posts.json

## Próximos Pasos:
1. Revisar contenido migrado
2. Ajustar estilos si es necesario
3. Probar panel de administración
4. Crear nuevos posts usando el panel
"""
        
        with open('MIGRATION_REPORT.md', 'w', encoding='utf-8') as f:
            f.write(report)
        
        print("📄 Reporte creado: MIGRATION_REPORT.md")

def main():
    print("🚀 TERAPIA LIBERAL - MIGRADOR DE CONTENIDO")
    print("=" * 50)
    
    migrator = ContentMigrator()
    
    # Migrar contenido
    success = migrator.migrate_all_content()
    
    if success:
        # Regenerar páginas con contenido migrado
        print("\n🔨 Regenerando páginas con contenido migrado...")
        os.system('python3 generate_posts.py')
        
        # Crear reporte
        migrator.create_migration_report()
        
        print("\n✨ Migración completada exitosamente!")
        print("🌐 El nuevo sistema está listo para usar")
        print("⚙️  Panel admin: admin/index.html")
        
    else:
        print("\n❌ Error durante la migración")

if __name__ == "__main__":
    main()