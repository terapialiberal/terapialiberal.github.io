        document.addEventListener('DOMContentLoaded', function() {
    const featuredContainer = document.getElementById('featured-analysis-container');
    const grid = document.getElementById('grid-analisis');

    if (!grid || !featuredContainer) return;

    fetch('data/articles.json')
        .then(response => response.json())
        .then(baseDeDatosAnalisis => {
            // --- Ordenar análisis por fecha (el más nuevo primero) ---
            baseDeDatosAnalisis.sort((a, b) => {
                const dateA = new Date(a.fecha.split(' ')[0].split('/').reverse().join('-'));
                const dateB = new Date(b.fecha.split(' ')[0].split('/').reverse().join('-'));
                return dateB - dateA;
            });

            // --- Lógica para el Análisis Destacado ---
            if (baseDeDatosAnalisis.length > 0) {
                const featuredAnalysis = baseDeDatosAnalisis.shift(); // Saca el primer elemento
                
                let featuredVideoLink = '';
                let featuredOnClick = '';
                let playButton = '';

                if (featuredAnalysis.video_id) {
                    const urlVideo = `https://youtu.be/${featuredAnalysis.video_id}`;
                    featuredVideoLink = `<a href="${urlVideo}" target="_blank" class="btn-gradient">Ver Video</a>`;
                    featuredOnClick = `window.open('${urlVideo}', '_blank')`;
                    playButton = `<div class="play-button-featured"><i class="fas fa-play"></i></div>`;
                }

                const featuredHtml = `
                <div class="flex flex-col lg:flex-row gap-8">
                    <div class="lg:w-1/2">
                        <div class="video-thumbnail-featured" ${featuredOnClick ? `onclick="${featuredOnClick}"` : ''}>
                            <img src="${featuredAnalysis.image_url}" alt="${featuredAnalysis.titulo}">
                            ${playButton}
                        </div>
                    </div>
                    <div class="lg:w-1/2 flex flex-col">
                        <div class="date-badge mb-4">${featuredAnalysis.fecha}</div>
                        <h4 class="text-2xl font-bold mb-4 gold-text">${featuredAnalysis.titulo}</h4>
                        <p class="text-gray-300 mb-6 flex-grow">${featuredAnalysis.descripcion}</p>
                        <div class="flex gap-4 mt-auto">
                            <a href="${featuredAnalysis.url_html}" class="btn-gradient">Ver Análisis Completo</a>
                            ${featuredVideoLink}
                        </div>
                    </div>
                </div>`;
                featuredContainer.innerHTML = featuredHtml;
            }

            // --- Lógica para la Grilla de Análisis Anteriores ---
            const tarjetasHTML = baseDeDatosAnalisis.map(analisis => {
                let mediaHtml = '';
                let videoLink = '';
                if (analisis.image_url) {
                    mediaHtml = `
                    <div class="image-container mb-4">
                        <img src="${analisis.image_url}" alt="${analisis.titulo}" class="w-full h-auto rounded-lg">
                    </div>`;
                } else if (analisis.video_id) {
                    const urlVideo = `https://youtu.be/${analisis.video_id}`;
                    mediaHtml = `
                    <div class="video-thumbnail mb-4" onclick="window.open('${urlVideo}', '_blank')">
                        <img src="https://img.youtube.com/vi/${analisis.video_id}/maxresdefault.jpg" alt="${analisis.titulo}">
                        <div class="play-button"><i class="fas fa-play"></i></div>
                    </div>`;
                    videoLink = `<a href="${urlVideo}" target="_blank" class="btn-gradient text-sm">Ver Video</a>`;
                }

                return `
                <div class="section-bg rounded-2xl p-6 flex flex-col h-full">
                    ${mediaHtml}
                    <div class="flex-grow flex flex-col">
                        <div class="date-badge mb-3">${analisis.fecha}</div>
                        <h4 class="text-xl font-bold mb-3 gold-text">${analisis.titulo}</h4>
                        <p class="text-gray-300 mb-4 flex-grow">${analisis.descripcion}</p>
                        <div class="flex gap-3 mt-auto">
                            <a href="${analisis.url_html}" class="btn-gradient text-sm">Ver Análisis</a>
                            ${videoLink}
                        </div>
                    </div>
                </div>`;
            }).join('');
            grid.innerHTML = tarjetasHTML;
        })
        .catch(error => console.error('Error al cargar los análisis:', error));
});
