/* Shared helpers — no dependencies; all catalog text is treated as data. */
(function () {
  'use strict';
  const SECTION_META = Object.freeze({
    security: { label: 'Segurança', title: 'Segurança digital.', description: 'Tecnologias para proteção de dados, identidades, aplicações, infraestrutura e resiliência cibernética.', number: '01' },
    datacenter: { label: 'Data Center', title: 'Infraestrutura que evolui.', description: 'Servidores, armazenamento, infraestrutura corporativa e soluções de alta disponibilidade.', number: '02' }
  });
  const $ = (selector, root = document) => root.querySelector(selector);
  const text = (value) => String(value == null ? '' : value);
  const escapeHtml = (value) => text(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  const usable = (item) => item && typeof item.name === 'string' && item.name.trim().length > 0;
  function vendorsFor(data, type) { return Array.isArray(data && data[type]) ? data[type].filter(usable) : []; }
  async function loadData() {
    const response = await fetch('./assets/JSON/vendors.json', { cache:'no-cache' });
    if (!response.ok) throw new Error('Não foi possível carregar o catálogo (HTTP ' + response.status + ').');
    const data = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Formato inesperado do catálogo.');
    return data;
  }
  function el(tag, className, textValue) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textValue !== undefined) element.textContent = text(textValue);
    return element;
  }
  function isLocalAsset(path) {
    return typeof path === 'string' && /^(?:(?:\.\/)?assets\/IMG\/[\w./-]+|(?:\.\/)?pages\/vendors\/[a-z0-9_-]+\/[\w.-]+)\.(?:png|webp|jpe?g|svg|ico|avif)$/i.test(path) && !path.includes('..');
  }
  function addImage(parent, source, alt) {
    if (!isLocalAsset(source)) return null;
    const img = el('img'); img.src = source; img.alt = text(alt); img.loading = 'lazy'; img.decoding = 'async';
    img.addEventListener('error', () => { img.hidden = true; });
    parent.appendChild(img); return img;
  }
  function vendorHref(item, type) {
    // Stable slugs preserve existing links (1trust, pure, sentinel, object1).
    // Ignore arbitrary URLs in the JSON to keep navigation on this site.
    const identifier = /^[a-z0-9_-]+$/i.test(text(item.slug)) ? item.slug : text(item.name).trim().toLocaleLowerCase('pt-BR');
    return './vendor.html?type=' + encodeURIComponent(type) + '&name=' + encodeURIComponent(identifier);
  }

  function emptyState(title, subtitle, withLink = false) {
    const wrapper = el('div', 'empty-state');
    wrapper.innerHTML = '<span class="empty-icon" aria-hidden="true">✧</span>';
    const content = el('div');
    content.append(el('strong', '', title), el('p', '', subtitle));
    if (withLink) { const a = el('a', '', 'Explorar Segurança ↗'); a.href = './section.html?type=security'; content.appendChild(a); }
    wrapper.appendChild(content); return wrapper;
  }
  function buildVendorCard(item, type) {
    const col = el('div', 'col-xl-4 col-md-6');
    const a = el('a', 'vendor-link'); a.href = vendorHref(item, type);
    a.setAttribute('aria-label', 'Ver detalhes de ' + item.name);
    const card = el('article', 'vendor-card');
    const top = el('div', 'vendor-card-top');
    const logo = el('div', 'vendor-card-logo');
    const img = addImage(logo, item.logo, 'Logo ' + item.name);
    if (!img) logo.appendChild(el('strong', '', item.name));
    img?.addEventListener('error', () => logo.appendChild(el('strong', '', item.name)));
    top.append(logo, el('span', 'vendor-card-mark', '↗'));
    const title = el('h3', 'vendor-card-name', item.name);
    const desc = el('p', 'vendor-card-description', item.summary || item.description || 'Conheça as soluções deste fabricante.');
    const footer = el('div', 'vendor-card-footer');
    const tags = el('div', 'vendor-tags');
    (Array.isArray(item.tags) ? item.tags.filter(Boolean).slice(0, 2) : []).forEach(tag => tags.appendChild(el('span', 'vendor-tag', tag)));
    footer.append(tags, el('span', 'vendor-card-more', 'Conhecer ↗'));
    card.append(top,title,desc,footer); a.appendChild(card); col.appendChild(a);return col;
  }
  function buildCta(type) {
    const col = el('div','col-xl-4 col-md-6');
    const a = el('a','vendor-cta'); a.href = './section.html?type=' + encodeURIComponent(type);
    const meta = SECTION_META[type];
    a.innerHTML = '<span class="vendor-cta-label">CONTINUE EXPLORANDO</span><span class="vendor-cta-icon" aria-hidden="true">↗</span><div><h3>Há muito mais para descobrir.</h3><p>Explore o catálogo completo de ' + escapeHtml(meta.label) + '.</p></div><div class="vendor-cta-bottom"><span>Ver todos os fabricantes</span><span aria-hidden="true">→</span></div>';
    col.appendChild(a);return col;
  }
  function mountGrid(container, items, type, cta = false) {
    if (!container) return;
    container.replaceChildren();
    if (!items.length) {
      const col=el('div','col-12'); col.appendChild(emptyState('Portfólio em atualização','Ainda não há fabricantes cadastrados nesta área. Volte em breve.')); container.appendChild(col); return;
    }
    const fragment = document.createDocumentFragment();
    items.forEach(item => fragment.appendChild(buildVendorCard(item,type)));
    if (cta) fragment.appendChild(buildCta(type));
    container.appendChild(fragment);
  }
  function setActiveSection(type) {
    document.querySelectorAll('[data-section-link]').forEach(a => {
      const active = a.dataset.sectionLink === type;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
  }
  document.querySelectorAll('[data-current-year]').forEach(element => element.textContent = new Date().getFullYear());
  window.Adistec = {SECTION_META, $, text, escapeHtml, usable, vendorsFor, loadData, el, addImage, vendorHref, emptyState, buildVendorCard, buildCta, mountGrid, setActiveSection};
}());
