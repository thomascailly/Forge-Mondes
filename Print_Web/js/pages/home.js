/* ============================================================
   FORGEBORN — HOME.JS
   ============================================================ */

/* ── PRODUCT CART ADD ────────────────────────────────────── */
document.querySelectorAll('.product-card-add').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.product-card');
    const name = card.querySelector('.product-card-name')?.textContent || 'Figurine';

    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b0b0d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    btn.style.background = 'linear-gradient(135deg, #6ab87e, #3d9957)';

    setTimeout(() => {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b0b0d" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      btn.style.background = '';
    }, 2000);

    if (window.showToast) showToast(`${name} ajouté à la sélection`);
  });
});

/* ── WISHLIST TOGGLE ─────────────────────────────────────── */
document.querySelectorAll('.product-card-wish').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isWished = btn.classList.toggle('wished');
    btn.innerHTML = isWished
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#c9a86a" stroke="#c9a86a" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  });
});
