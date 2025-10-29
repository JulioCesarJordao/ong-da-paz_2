/* assets/js/site.js - nav toggle, dropdowns, form validation, toasts, modal */
(function(){
  // NAV TOGGLE (mobile)
  const navToggle = document.querySelector('.nav__toggle');
  const mobileNav = document.getElementById('mobileNav');
  navToggle && navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mobileNav.classList.toggle('open');
    mobileNav.setAttribute('aria-hidden', String(expanded));
  });

  // DROPDOWN: toggle aria-expanded on parent nav__item
  document.querySelectorAll('.nav__item > button[aria-haspopup]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const parent = btn.parentElement;
      const isOpen = parent.getAttribute('aria-expanded') === 'true';
      parent.setAttribute('aria-expanded', String(!isOpen));
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    // close on escape
    btn.addEventListener('keydown', (ev)=>{
      if(ev.key === 'Escape'){
        const parent = btn.parentElement;
        parent.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  });

  // SIMPLE TOAST helper
  function showToast(message, timeout=4000){
    const toasts = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role','status');
    el.textContent = message;
    toasts.appendChild(el);
    setTimeout(()=>{
      el.style.opacity = '0';
      setTimeout(()=> el.remove(), 300);
    }, timeout);
  }

  // MODAL helper
  const modalTpl = document.getElementById('modalTemplate');
  function openModal(){
    const node = modalTpl.content.cloneNode(true);
    document.body.appendChild(node);
    const backdrop = document.querySelector('.modal-backdrop');
    // trap focus lightly
    const closeBtn = backdrop.querySelector('[data-action="close"]');
    closeBtn && closeBtn.focus();
    backdrop.addEventListener('click', (ev)=>{
      if(ev.target === backdrop) closeModal();
    });
    document.addEventListener('keydown', escHandler);
    function escHandler(e){ if(e.key === 'Escape') closeModal(); }
    function closeModal(){ backdrop.remove(); document.removeEventListener('keydown', escHandler); }
    closeBtn && closeBtn.addEventListener('click', closeModal);
  }

  // Form validation (visual only)
  const form = document.getElementById('contactForm');
  const resetBtn = document.getElementById('resetForm');
  form && form.addEventListener('submit', function(e){
    e.preventDefault();
    const requireds = Array.from(form.querySelectorAll('[required]'));
    let valid = true;
    requireds.forEach(field=>{
      const error = field.parentElement.querySelector('.form-error');
      if(!field.value.trim()){
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        if(error){ error.classList.remove('sr-only'); }
        valid = false;
      } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        if(error){ error.classList.add('sr-only'); }
      }
    });

    if(valid){
      showToast('Mensagem enviada com sucesso!');
      openModal();
      form.reset();
      form.querySelectorAll('input,textarea').forEach(i=> i.classList.remove('is-valid'));
    } else {
      showToast('Corrija os campos sinalizados.');
    }
  });

  resetBtn && resetBtn.addEventListener('click', ()=>{
    form.reset();
    form.querySelectorAll('input,textarea').forEach(i=> i.classList.remove('is-valid','is-invalid'));
    showToast('Formulário limpo');
  });

  // Example buttons triggering toasts / modal
  document.getElementById('learnMoreBtn')?.addEventListener('click', ()=>{
    showToast('Redirecionando para Projetos...');
  });
  document.getElementById('donateBtn')?.addEventListener('click', ()=>{
    openModal();
  });

  // Expose for debugging if needed
  window._ONG = { showToast, openModal };
})();