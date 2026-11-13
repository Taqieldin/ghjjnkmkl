(function () {
  'use strict';
  const STORAGE_KEY = 'platform-store-cart-v1';
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    cart = Array.isArray(saved) ? saved.filter(x => x && typeof x.id === 'string' && typeof x.name === 'string') : [];
  } catch (e) { cart = []; }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
    render();
  }
  function quantity() { return cart.reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0); }
  function money(value) {
    const n = Number(value);
    return Number.isFinite(n) ? new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(n) : '';
  }
  function render() {
    const badge = document.getElementById('topbar-cart-count');
    const button = document.getElementById('topbar-cart-toggle');
    const count = quantity();
    if (badge) { badge.textContent = count > 99 ? '99+' : String(count); badge.hidden = count === 0; }
    if (button) button.setAttribute('aria-label', 'سلة المتجر، ' + count + ' منتجات');
    const host = document.getElementById('store-cart-items');
    const footer = document.getElementById('store-cart-footer');
    if (!host) return;
    if (!cart.length) {
      host.innerHTML = '<div class="store-cart-empty"><span class="ui-icon" data-icon="shopping-cart"></span><strong>سلتك فارغة حالياً</strong><p>عندما تضيف منتجاً من المتجر، ستجده هنا.</p><button type="button" data-cart-browse>استكشف المتجر</button></div>';
      if (footer) footer.innerHTML = '<p>المتجر قيد التجهيز. لن يتم تنفيذ طلب أو خصم أي مبلغ من هذه المعاينة.</p><button type="button" data-cart-browse>متابعة التسوق</button>';
    } else {
      host.innerHTML = cart.map((item, index) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const priceText = Number.isFinite(Number(item.price)) && item.price !== '' ? '<small>' + money(item.price) + (item.currency ? ' ' + escapeText(item.currency) : '') + '</small>' : '';
        return '<article class="store-cart-line"><div class="store-cart-line-art"><span class="ui-icon" data-icon="package"></span></div><div class="store-cart-line-info"><strong>' + escapeText(item.name) + '</strong>' + priceText + '<div class="store-cart-qty"><button type="button" data-cart-qty="-1" data-cart-index="' + index + '" aria-label="تقليل الكمية">−</button><span>' + qty + '</span><button type="button" data-cart-qty="1" data-cart-index="' + index + '" aria-label="زيادة الكمية">+</button></div></div><button class="store-cart-remove" data-cart-remove="' + index + '" type="button" aria-label="إزالة المنتج">×</button></article>';
      }).join('');
      if (footer) footer.innerHTML = '<p>هذه معاينة للسلة فقط. لا يتم إرسال طلب أو تنفيذ دفع قبل تفعيل المتجر.</p><button type="button" data-cart-browse>العودة إلى المتجر</button>';
    }
    if (window.renderUiIcons) window.renderUiIcons(host);
  }
  function escapeText(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function open() {
    const overlay = document.getElementById('store-cart-overlay');
    if (!overlay) return;
    render(); overlay.hidden = false; overlay.setAttribute('aria-hidden', 'false'); document.body.classList.add('store-cart-open');
    const close = overlay.querySelector('.store-cart-header button'); if (close) close.focus();
  }
  function close() {
    const overlay = document.getElementById('store-cart-overlay');
    if (overlay) { overlay.hidden = true; overlay.setAttribute('aria-hidden', 'true'); }
    document.body.classList.remove('store-cart-open');
    document.getElementById('topbar-cart-toggle')?.focus({ preventScroll: true });
  }
  function add(item) {
    if (!item || !item.name) return false;
    const id = String(item.id || item.name).trim();
    const found = cart.find(x => x.id === id);
    if (found) found.quantity = Math.max(1, Number(found.quantity) || 1) + Math.max(1, Number(item.quantity) || 1);
    else cart.push({ id, name: String(item.name), quantity: Math.max(1, Number(item.quantity) || 1), price: item.price == null ? '' : item.price, currency: item.currency || '' });
    save();
    if (window.v13Toast) window.v13Toast('تمت إضافة المنتج إلى سلة المتجر.');
    return true;
  }
  function remove(index) { cart.splice(Number(index), 1); save(); }
  function change(index, delta) {
    const item = cart[Number(index)]; if (!item) return;
    item.quantity = Math.max(1, (Number(item.quantity) || 1) + Number(delta)); save();
  }
  document.addEventListener('click', event => {
    const addButton = event.target.closest('[data-cart-add]');
    if (addButton) {
      add({ id: addButton.dataset.productId || addButton.dataset.cartAdd, name: addButton.dataset.productName || addButton.getAttribute('data-cart-name') || addButton.textContent.trim(), price: addButton.dataset.productPrice, currency: addButton.dataset.productCurrency, quantity: 1 });
      return;
    }
    if (event.target.closest('[data-cart-browse]')) { close(); window.navigateToPage?.('store'); return; }
    const removeButton = event.target.closest('[data-cart-remove]'); if (removeButton) { remove(removeButton.dataset.cartRemove); return; }
    const qtyButton = event.target.closest('[data-cart-qty]'); if (qtyButton) { change(qtyButton.dataset.cartIndex, qtyButton.dataset.cartQty); return; }
    if (event.target.id === 'store-cart-overlay') close();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && document.getElementById('store-cart-overlay')?.hidden === false) close(); });
  window.openStoreCart = open;
  window.closeStoreCart = close;
  window.addToStoreCart = add;
  window.removeFromStoreCart = remove;
  window.getStoreCart = () => cart.map(item => ({ ...item }));
  window.clearStoreCart = () => { cart = []; save(); };
  render();
})();
