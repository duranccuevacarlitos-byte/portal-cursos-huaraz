/* Controlador único del catálogo: conserva categoría, precio y prerrequisitos. */
'use strict';
(function initCourseCatalog() {
  const search = document.getElementById('course-search-input');
  if (!search) return;
  const cards = Array.from(document.querySelectorAll('.courses-page article[data-cat]'));
  const filters = Array.from(document.querySelectorAll('.filter-btn'));
  const price = document.getElementById('price-filter');
  const prereq = document.getElementById('prereq-filter');
  const clear = document.getElementById('search-clear-btn');
  const count = document.getElementById('counter-text');
  const empty = document.getElementById('no-results-msg');
  const emptyQuery = document.getElementById('no-results-query');
  let category = 'all';

  const tokenize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().match(/[a-z0-9]+/g) || [];
  const relatedTerms = {
    web: 'computación informática programar programación desarrollador frontend front end backend back end fullstack full stack páginas sitios web html css javascript código crear básico básica básicos básicas',
    ia: 'ia inteligencia artificial machine learning deep learning chatgpt modelos datos prompts automatización automatizar python redes neuronales',
    diseno: 'diseño diseñar gráfico gráfica gráficos creatividad ilustración dibujar dibujo imágenes fotografía fotos photoshop illustrator canva afiches logos logotipos colores tipografía',
    marketing: 'marketing mercadeo publicidad ventas vender negocios emprendimiento redes sociales facebook instagram tiktok campañas contenidos audiencia seo posicionamiento',
    ofimatica: 'computación informática computadora computadoras ordenadores office ofimática excel word powerpoint power point microsoft google workspace documentos textos hojas cálculo tablas fórmulas presentaciones oficina productividad básico básica básicos básicas',
    redes: 'computación informática computadoras ordenadores redes internet wifi wi fi router routers ethernet cableado conectividad ip servidores hardware soporte técnico mantenimiento seguridad ciberseguridad básico básica básicos básicas',
  };
  const ignored = new Set(tokenize('a al algo algún alguna algunos algunas como con curso cursos de del el en es la las lo los me mi mis o para por que qué quiero necesito aprender sobre un una unos unas y hacer usar uso'));
  const indexed = cards.map(card => ({
    card,
    terms: Array.from(new Set(tokenize(`${card.textContent} ${relatedTerms[card.dataset.cat] || ''}`))),
    price: Number(card.dataset.price),
  }));

  function applyFilters() {
    const words = tokenize(search.value).filter(word => !ignored.has(word));
    let visible = 0;
    indexed.forEach(item => {
      const matchesQuery = words.every(word => item.terms.some(term => term === word || (word.length >= 3 && term.startsWith(word))));
      const matchesCategory = category === 'all' || item.card.dataset.cat === category;
      const matchesPrereq = prereq.value === 'all' || item.card.dataset.prereq === prereq.value;
      const matchesPrice = price.value === 'all'
        || (price.value === 'free' && item.price === 0)
        || (price.value === 'low' && item.price > 0 && item.price <= 50)
        || (price.value === 'medium' && item.price > 50 && item.price <= 100)
        || (price.value === 'high' && item.price > 100);
      const matches = matchesQuery && matchesCategory && matchesPrereq && matchesPrice;
      item.card.hidden = !matches;
      if (matches) visible++;
    });
    filters.forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    clear.hidden = search.value.length === 0;
    count.textContent = visible === 1 ? '[ 1 curso encontrado ]' : `[ ${visible} cursos encontrados ]`;
    empty.hidden = visible !== 0;
    emptyQuery.textContent = search.value.trim() ? `«${search.value.trim()}» y los filtros seleccionados` : 'los filtros seleccionados';
  }

  function resetFilters() {
    search.value = '';
    category = 'all';
    price.value = 'all';
    prereq.value = 'all';
    applyFilters();
    search.focus();
  }
  search.addEventListener('input', applyFilters);
  clear.addEventListener('click', () => { search.value = ''; applyFilters(); search.focus(); });
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; applyFilters(); }));
  price.addEventListener('change', applyFilters);
  prereq.addEventListener('change', applyFilters);
  document.querySelectorAll('.search-tag-chip').forEach(chip => chip.addEventListener('click', () => {
    // Un acceso rápido empieza una consulta nueva sobre los seis cursos.
    category = 'all'; price.value = 'all'; prereq.value = 'all';
    search.value = chip.dataset.query;
    applyFilters(); search.focus();
  }));
  document.getElementById('reset-all-filters-btn').addEventListener('click', resetFilters);
  document.querySelectorAll('[data-catalog-control]').forEach(control => { control.hidden = false; });
  applyFilters();
}());
