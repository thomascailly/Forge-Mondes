/* ============================================================
   FORGEBORN — CUSTOM.JS
   Upload zone, finish selector, form validation
   ============================================================ */

(function() {
  /* ── Upload Zone ──────────────────────────────────────── */
  const uploadZone   = document.querySelector('.upload-zone');
  const fileInput    = document.querySelector('#file-upload');
  const preview      = document.querySelector('.upload-preview');
  const previewName  = document.querySelector('.upload-preview-name');
  const previewSize  = document.querySelector('.upload-preview-size');
  const removeBtn    = document.querySelector('.upload-preview-remove');

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function showFile(file) {
    if (!file) return;
    if (previewName) previewName.textContent = file.name;
    if (previewSize) previewSize.textContent = formatBytes(file.size);
    if (preview) preview.classList.add('visible');
    if (uploadZone) uploadZone.style.borderColor = 'var(--accent-gold)';
  }

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      showFile(fileInput.files[0]);
    });
  }

  if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && fileInput) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        showFile(file);
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (fileInput) fileInput.value = '';
      if (preview) preview.classList.remove('visible');
      if (uploadZone) uploadZone.style.borderColor = '';
    });
  }

  /* ── Finish Options ──────────────────────────────────── */
  document.querySelectorAll('.finish-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.finish-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  /* ── Form Validation ─────────────────────────────────── */
  const form = document.querySelector('.devis-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e05252';
          field.style.boxShadow = '0 0 0 3px rgba(224,82,82,0.1)';
          valid = false;
          field.addEventListener('input', () => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
          }, { once: true });
        }
      });

      if (!valid) {
        if (window.showToast) showToast(getLangText('Please fill in all required fields.', 'Veuillez remplir tous les champs obligatoires.'), 'error');
        return;
      }

      // Success state
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = getLangText('Sending...', 'Envoi en cours...');
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }

      setTimeout(() => {
        if (btn) {
          btn.textContent = getLangText('Request sent ✓', 'Demande envoyée ✓');
          btn.style.background = 'linear-gradient(135deg, #6ab87e, #3d9957)';
          btn.style.opacity = '1';
        }
        form.reset();
        if (window.showToast) showToast(getLangText('Your quote request has been sent successfully!', 'Votre demande de devis a été envoyée avec succès !'));
      }, 1400);
    });
  }
})();
