(function() {
  let servicesData = null;

  // 1. Cargar datos UNA sola vez
  async function fetchServices() {
    try {
      const res = await fetch('./data/servicios.json');
      if (!res.ok) throw new Error('Error al cargar servicios');
      servicesData = await res.json();
      return servicesData;
    } catch (error) {
      console.error('Error cargando servicios:', error);
      return null;
    }
  }

  // 2. Función global para renderizar (llamable desde main.js)
  window.renderServices = function(lang = 'es') {
    if (!servicesData) return;
    const container = document.getElementById('services-container');
    if (!container) return;

    container.innerHTML = '';

    const getTrans = (field, fallback = '') => {
      if (typeof field === 'object' && field !== null) {
        return field[lang] || field.es || fallback;
      }
      return field || fallback;
    };

    servicesData.categorias.forEach(cat => {
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

    // Re-activar animaciones de scroll para los nuevos elementos
    if (window.revealObserver) {
      setTimeout(() => {
        document.querySelectorAll('.service-card, .category-title').forEach(el => {
          el.classList.add('active');
          window.revealObserver.observe(el);
        });
      }, 50);
    }
  };

  // 3. Ejecutar al cargar la página
  document.addEventListener('DOMContentLoaded', async () => {
    await fetchServices();
    const lang = localStorage.getItem('gg_lang') || 'es';
    window.renderServices(lang);
  });
})();
