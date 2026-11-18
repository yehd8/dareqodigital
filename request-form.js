// Public browser configuration: this publishable key is not a server secret.
(() => {
  const form = document.querySelector('#requestForm');
  const msg = document.querySelector('#requestMsg');
  const submit = document.querySelector('#requestSubmit');
  if (!(form instanceof HTMLFormElement) || !(msg instanceof HTMLElement) || !(submit instanceof HTMLButtonElement)) return;
  const endpoint = 'https://fbgphoixzpykcpdbfbhd.supabase.co/rest/v1/rpc/submit_public_request';
  const publicKey = 'sb_publishable_U9E9amYU8RvRz4J1etv7Sw_svCjP-U-';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    const data = new FormData(form);
    /** @param {string} key */
    const value = key => String(data.get(key) || '').trim();
    if (!value('customer_name') || !value('service')) {
      msg.className = 'form-msg err';
      msg.textContent = 'Please enter your name and the service you need.';
      return;
    }
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    msg.className = 'form-msg';
    msg.textContent = 'Sending your request…';
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
      msg.textContent = 'Request sent. Dareqo Digital will review it and contact you.';
    } catch {
      msg.className = 'form-msg err';
      msg.textContent = 'We could not confirm delivery. Your details are still here. Please contact us on WhatsApp before retrying.';
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
