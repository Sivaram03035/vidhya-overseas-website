document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#enquiryForm");
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "";
    delete status.dataset.state;
    if (!form.reportValidity()) return;
    const mobile = form.elements.mobile.value.trim().replace(/[\s()-]/g, "");
    if (!/^(?:(?:\+?91|0)?[6-9]\d{9})$/.test(mobile)) {
      status.dataset.state = "error";
      status.textContent = "Enter a valid Indian mobile number, e.g. +91 98765 43210.";
      form.elements.mobile.focus();
      return;
    }
    if (form.elements.website.value.trim()) return;
    const endpoint = window.VIDHYA_CONFIG?.appsScriptUrl || "";
    if (!endpoint.startsWith("https://script.google.com/macros/s/")) {
      status.dataset.state = "error";
      status.textContent = "The enquiry form is not configured yet. Please contact the website administrator.";
      return;
    }
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.consent = form.elements.consent.checked ? "Yes" : "No";
    payload.pageUrl = location.href;
    button.disabled = true;
    button.textContent = "Submitting…";
    status.textContent = "Sending your enquiry…";
    try {
      /*
       * Apps Script's cross-origin response is not readable via no-cors.
       * This confirms only that the browser dispatched the request, not that
       * Sheets saved it. See README for a production confirmation approach.
       */
      await fetch(endpoint, {method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
      status.dataset.state = "success";
      status.textContent = "Your enquiry request was sent. We cannot verify the spreadsheet save from this browser; please contact us if you do not hear back.";
      form.reset();
    } catch (err) {
      status.dataset.state = "error";
      status.textContent = "Unable to send your enquiry. Please try again or contact us directly.";
    } finally {
      button.disabled = false;
      button.textContent = "Submit enquiry";
    }
  });
});
