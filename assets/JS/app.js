/* Home: portfolio overview and featured vendors. */
(async function () {
  'use strict';
  const { $, loadData, vendorsFor, mountGrid, el, emptyState } = window.Adistec;
  const sections = ['security', 'datacenter'];
  try {
    const data = await loadData();
    let totalVendors = 0;
    const allTags = new Set();
    sections.forEach(type => {
      const items = vendorsFor(data, type);
      totalVendors += items.length;
      items.forEach(vendor => (vendor.tags || []).forEach(tag => { if (typeof tag === 'string' && tag.trim()) allTags.add(tag.trim().toLocaleLowerCase('pt-BR')); }));
      const countElement = $('#category-count-' + type);
      if (countElement) countElement.textContent = items.length ? items.length + (items.length === 1 ? ' fabricante cadastrado' : ' fabricantes cadastrados') : 'Portfólio em atualização';
      if (type === 'security') {
        mountGrid($('#security-grid'), items.slice(0,3), type, items.length > 0);
      } else {
        mountGrid($('#' + type + '-grid'), items.slice(0,3), type, false);
      }
    });
    $('#metric-vendors').textContent = String(totalVendors).padStart(2,'0');
    $('#metric-tags').textContent = String(allTags.size).padStart(2,'0');
  } catch (error) {
    console.error('Erro ao carregar portfólio:', error);
    sections.forEach(type => {
      const grid = $('#' + type + '-grid');
      if (!grid) return;
      grid.replaceChildren();
      const col = el('div', 'col-12');
      col.appendChild(emptyState('Não foi possível carregar os dados','Confira sua conexão e abra o site por um servidor HTTP.'));
      grid.appendChild(col);
    });
    $('#metric-vendors').textContent = '—';
    $('#metric-tags').textContent = '—';
  }
}());
