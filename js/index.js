        document.addEventListener('DOMContentLoaded', function() {
            const grid = document.getElementById('grid-analisis');
            if (!grid) return;

            fetch('data/articles.json')
                .then(response => response.json())
                .then(baseDeDatosAnalisis => {
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
