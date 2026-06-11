/* ============================================================
   FORGEBORN — COLLECTION.JS
   Filtering, sorting, sidebar toggle
   ============================================================ */

(function() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const countEl     = document.querySelector('.collection-count strong');
  const sortSelect  = document.querySelector('.sort-select');
  const activeArea  = document.querySelector('.active-filters');
  const rangeSlider = document.querySelector('.range-slider');
  const priceMaxEl  = document.querySelector('#price-max');

  let activeFilter = 'all';

  function updateCount(visible) {
    if (countEl) countEl.textContent = visible;
  }

  function filterCards() {
    let visible = 0;
    productCards.forEach(card => {
      const universe = card.dataset.universe || 'all';
      const show = activeFilter === 'all' || universe === activeFilter;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    updateCount(visible);
    renderActiveTags();
  }

  function renderActiveTags() {
    if (!activeArea) return;
    activeArea.innerHTML = '';
    if (activeFilter !== 'all') {
      const activeBtn = document.querySelector(`.filter-btn[data-filter="${activeFilter}"]`);
      const label = activeBtn ? (getLangText(activeBtn.dataset.en, activeBtn.dataset.fr) || activeFilter) : activeFilter;
      
      const tag = document.createElement('span');
      tag.className = 'filter-tag';
      tag.innerHTML = `${label} <span class="filter-tag-x">×</span>`;
      tag.addEventListener('click', () => {
        activeFilter = 'all';
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
        filterCards();
      });
      activeArea.appendChild(tag);
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter || 'all';
      filterCards();
    });
  });

  // Sort
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const grid = document.querySelector('.collection-grid');
      if (!grid) return;
      const cards = [...grid.querySelectorAll('.product-card')];
      cards.sort((a, b) => {
        const pa = parseFloat(a.dataset.price || 0);
        const pb = parseFloat(b.dataset.price || 0);
        if (sortSelect.value === 'price-asc') return pa - pb;
        if (sortSelect.value === 'price-desc') return pb - pa;
        return 0;
      });
      cards.forEach(c => grid.appendChild(c));
    });
  }

  // Price range
  if (rangeSlider) {
    rangeSlider.addEventListener('input', () => {
      const max = rangeSlider.value;
      if (priceMaxEl) priceMaxEl.value = max;
      rangeSlider.style.background = `linear-gradient(to right, var(--accent-gold) 0%, var(--accent-gold) ${(max/300)*100}%, var(--surface-3) ${(max/300)*100}%)`;
      productCards.forEach(card => {
        const price = parseFloat(card.dataset.price || 0);
        card.style.display = price <= max ? '' : 'none';
      });
    });
  }

  updateCount(productCards.length);
})();
