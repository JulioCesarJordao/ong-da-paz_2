document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('contactFullForm');
  if(!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[0-9\s\-\+\(\)\.]{8,20}$/;

  function setInvalid(field, message){
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    const err = field.parentElement.querySelector('.form-error');
    if(err){ err.textContent = message; err.classList.remove('sr-only'); }
  }
  function setValid(field){
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    const err = field.parentElement.querySelector('.form-error');
    if(err){ err.classList.add('sr-only'); }
  }

  function validateField(field){
    const val = (field.value || '').trim();
    if(field.hasAttribute('required') && !val){
      setInvalid(field, 'Campo obrigatório');
      return false;
    }

    if(field.type === 'email'){
      if(val && !emailRe.test(val)){
        setInvalid(field, 'Formato de email inválido');
        return false;
      }
    }

    if(field.type === 'tel'){
      if(val && !phoneRe.test(val)){
        setInvalid(field, 'Telefone inválido');
        return false;
      }
    }

    if(val) setValid(field);
    else {
      field.classList.remove('is-valid','is-invalid');
      const err = field.parentElement.querySelector('.form-error');
      if(err) err.classList.add('sr-only');
    }
    return true;
  }

  form.querySelectorAll('input,textarea,select').forEach(field=>{
    field.addEventListener('input', ()=> validateField(field));
    field.addEventListener('blur', ()=> validateField(field));
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const fields = Array.from(form.querySelectorAll('input,textarea,select'));
    let valid = true;
    fields.forEach(f=>{ if(!validateField(f)) valid = false; });

    if(valid){
      if(window._ONG && typeof window._ONG.showToast === 'function') window._ONG.showToast('Mensagem enviada com sucesso!');
      if(window._ONG && typeof window._ONG.openModal === 'function') window._ONG.openModal();
      form.reset();
      setTimeout(()=>{
        form.querySelectorAll('input,textarea,select').forEach(f=> f.classList.remove('is-valid'));
      }, 200);
    } else {
      if(window._ONG && typeof window._ONG.showToast === 'function') window._ONG.showToast('Corrija os campos sinalizados.');
      const firstInvalid = form.querySelector('.is-invalid');
      firstInvalid && firstInvalid.focus();
    }
  });

  form.addEventListener('reset', ()=>{
    setTimeout(()=>{
      form.querySelectorAll('input,textarea,select').forEach(f=>{
        f.classList.remove('is-valid','is-invalid');
        const err = f.parentElement.querySelector('.form-error');
        if(err) err.classList.add('sr-only');
      });
      if(window._ONG && typeof window._ONG.showToast === 'function') window._ONG.showToast('Formulário limpo');
    }, 20);
  });
});
