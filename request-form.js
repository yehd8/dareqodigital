// Public browser configuration: this publishable key is not a server secret.
(() => {
  const form = document.querySelector('#requestForm');
  const msg = document.querySelector('#requestMsg');
  const submit = document.querySelector('#requestSubmit');
  if (!(form instanceof HTMLFormElement) || !(msg instanceof HTMLElement) || !(submit instanceof HTMLButtonElement)) return;
  const feedback = {
    en: { invalid: 'Please enter your name and the service you need.', sending: 'Sending your request…', success: 'Request sent. Dareqo Digital will review it and contact you.', error: 'We could not confirm delivery. Your details are still here. Please contact us on WhatsApp before retrying.' },
    ar: { invalid: 'يرجى إدخال اسمك والخدمة التي تحتاجها.', sending: 'جارٍ إرسال طلبك…', success: 'تم إرسال الطلب. سنراجعه ونتواصل معك.', error: 'لم نتمكن من تأكيد وصول الطلب. ما زالت بياناتك محفوظة في النموذج. تواصل معنا عبر واتساب قبل إعادة المحاولة.' },
    az: { invalid: '7ott esmak w l service li baddak yeha.', sending: '3am neb3at request…', success: 'Nba3at l request. Dareqo Digital byeraje3o w byetwasal ma3ak.', error: 'Ma fena n2akked enno wesel. Detailsak ba3da hon. Tewasal ma3na 3a WhatsApp abel ma t3id.' }
  };
  /** @param {'invalid'|'sending'|'success'|'error'} key */
  const message = key => {
    const language = document.querySelector('#lang');
    const selected = language && 'value' in language ? String(language.value) : 'en';
    return (feedback[selected] || feedback.en)[key];
  };
  const endpoint = 'https://fbgphoixzpykcpdbfbhd.supabase.co/rest/v1/rpc/submit_public_request';
  const publicKey = 'sb_publishable_U9E9amYU8RvRz4J1etv7Sw_svCjP-U-';
  submit.disabled = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    const data = new FormData(form);
    /** @param {string} key */
    const value = key => String(data.get(key) || '').trim();
    if (!value('customer_name') || !value('service')) {
      msg.className = 'form-msg err';
      msg.textContent = message('invalid');
      return;
    }
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    msg.className = 'form-msg';
    msg.textContent = message('sending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: publicKey },
        signal: controller.signal,
        body: JSON.stringify({
          p_customer_name: value('customer_name'), p_phone: value('phone'),
          p_email: value('email') || null, p_request_type: value('request_type') || 'quote',
          p_service: value('service'), p_preferred_date: value('preferred_date') || null,
          p_preferred_time: value('preferred_time') || null, p_notes: value('notes') || null
        })
      });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      msg.className = 'form-msg ok';
      msg.textContent = message('success');
    } catch {
      msg.className = 'form-msg err';
      msg.textContent = message('error');
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
