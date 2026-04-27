function switchLang(lang) {
  var form = document.createElement('form');
  form.method = 'POST';
  form.action = '/i18n/setlang/';
  form.style.display = 'none';

  var csrf = document.createElement('input');
  csrf.type = 'hidden';
  csrf.name = 'csrfmiddlewaretoken';
  csrf.value = (document.cookie.match(/csrftoken=([^;]+)/) || ['',''])[1];

  var langInput = document.createElement('input');
  langInput.type = 'hidden';
  langInput.name = 'language';
  langInput.value = lang;

  var next = document.createElement('input');
  next.type = 'hidden';
  next.name = 'next';
  next.value = window.location.pathname + window.location.search;

  form.appendChild(csrf);
  form.appendChild(langInput);
  form.appendChild(next);
  document.body.appendChild(form);
  form.submit();
}