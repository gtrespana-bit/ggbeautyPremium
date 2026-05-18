document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('./data/servicios.json');
    if (!res.ok) throw new Error('No se pudieron cargar los servicios');
    const data = await res.json();
    
    const container = document.getElementById('services-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Obtener idioma activo (es, en, de)
    const lang = localStorage.getItem('gg_lang') || 'es';

    // Función auxiliar para obtener texto traducido o fallback
    const getTrans = (field, fallback = '') => {
      if (typeof field === 'object' && field !== null) {
        return field[lang] || field.es || field['en'] || field['de'] || fallback;
      }
      return field || fallback;
    };

    data.categorias.forEach(cat => {
      const catTitle = document.createElement('h3');
      catTitle.className = 'category-title';
      catTitle.textContent = getTrans(cat.titulo, 'Categoría');
      container.appendChild(catTitle);

      const grid = document.createElement('div');
      grid.className = 'services-grid';

      cat.servicios.forEach(s => {
        const card = document.createElement('div');
        card.className = 'service-card';
        
        const nombre = getTrans(s.nombre, 'Servicio');
        const descripcion = getTrans(s.descripcion, '');
        const duracion = s.duracion || '';
        const precio = s.precio ? `${s.precio}€` : 'Consultar';
        
        card.innerHTML = `
          <div class="service-header">
            <h4 class="service-name">${nombre}</h4>
            <div class="service-price">${precio}<small>/${duracion}</small></div>
          </div>
          <p class="service-desc">${descripcion}</p>
          <a href="#contacto" class="service-link">Reservar →</a>
        `;
        grid.appendChild(card);
      });
      container.appendChild(grid);
    });

    // Re-inicializar animaciones de scroll para contenido dinámico
    if (window.revealObserver) {
      setTimeout(() => {
        document.querySelectorAll('.service-card').forEach(el => window.revealObserver.observe(el));
      }, 100);
    }
  } catch (error) {
    console.error('Error cargando servicios:', error);
  }
});
