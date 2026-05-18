document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('./data/servicios.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    
    const data = await res.json();
    const container = document.getElementById('services-container');
    
    if (!container) {
      console.error('No se encontró el contenedor #services-container');
      return;
    }
    
    container.innerHTML = '';
    
    if (!data.categorias || data.categorias.length === 0) {
      container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--kaizen-gold);">No hay servicios disponibles.</p>';
      return;
    }
    
    data.categorias.forEach((cat, index) => {
      // 1. Crear título de categoría
      const catTitle = document.createElement('h3');
      catTitle.className = 'category-title';
      catTitle.textContent = cat.titulo || `Categoría ${index + 1}`;
      container.appendChild(catTitle);

      // 2. Crear grid de servicios
      const grid = document.createElement('div');
      grid.className = 'services-grid';

      if (cat.servicios && cat.servicios.length > 0) {
        cat.servicios.forEach(s => {
          const card = document.createElement('div');
          card.className = 'service-card';
          
          const priceDisplay = s.precio && s.precio.trim() !== '' ? `${s.precio}€` : 'Consultar';
          const duracion = s.duracion || '';
          
          card.innerHTML = `
            <div class="service-header">
              <h4 class="service-name">${s.nombre || 'Servicio'}</h4>
              <div class="service-price">${priceDisplay}<small>/${duracion}</small></div>
            </div>
            <p class="service-desc">${s.descripcion || ''}</p>
            <a href="#contacto" class="service-link">Reservar →</a>
          `;
          grid.appendChild(card);
        });
      } else {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--kaizen-gold);">No hay servicios en esta categoría.</p>';
      }
      
      container.appendChild(grid);
    });

    // Re-inicializar animaciones de scroll para contenido dinámico
    setTimeout(() => {
      if (window.revealObserver) {
        document.querySelectorAll('.service-card, .category-title').forEach(el => {
          window.revealObserver.observe(el);
        });
      }
    }, 100);
    
  } catch (error) {
    console.error('Error cargando servicios:', error);
    const container = document.getElementById('services-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem;background:rgba(201,169,110,0.1);border-radius:8px;margin:2rem 0;">
          <p style="font-size:1.2rem;color:var(--kaizen-gold);margin-bottom:1rem;">⚠️ Error al cargar los servicios</p>
          <p style="color:rgba(255,255,255,0.6);font-size:0.9rem;">${error.message}</p>
          <p style="color:rgba(255,255,255,0.4);font-size:0.8rem;margin-top:1rem;">Verifica que el archivo data/servicios.json exista y sea válido JSON.</p>
        </div>
      `;
    }
  }
});