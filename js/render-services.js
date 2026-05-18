document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('./data/servicios.json');
    if (!res.ok) throw new Error('No se pudieron cargar los servicios');
    const data = await res.json();
    
    const container = document.getElementById('services-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    data.categorias.forEach(cat => {
      // Category title
      const catTitle = document.createElement('h3');
      catTitle.className = 'category-title reveal';
      catTitle.textContent = cat.titulo;
      container.appendChild(catTitle);

      // Services grid
      const grid = document.createElement('div');
      grid.className = 'services-grid';

      cat.servicios.forEach(s => {
        const card = document.createElement('div');
        card.className = 'service-card reveal';
        
        const priceDisplay = s.precio ? `${s.precio}€` : 'Consultar';
        
        card.innerHTML = `
          <div class="service-header">
            <h4 class="service-name">${s.nombre}</h4>
            <div class="service-price">${priceDisplay}<small>/${s.duracion}</small></div>
          </div>
          <p class="service-desc">${s.descripcion}</p>
          <a href="#contacto" class="service-link">Reservar →</a>
        `;
        grid.appendChild(card);
      });
      container.appendChild(grid);
    });

    // Re-initialize scroll animations for dynamic content
    if (window.revealObserver) {
      document.querySelectorAll('.service-card').forEach(el => window.revealObserver.observe(el));
    }
  } catch (error) {
    console.error('Error cargando servicios:', error);
    const container = document.getElementById('services-container');
    if (container) {
      container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--kaizen-gold);">⚠️ Error cargando servicios. Recarga la página.</p>';
    }
  }
});