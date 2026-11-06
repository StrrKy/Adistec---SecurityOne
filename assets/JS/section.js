/* Category catalog: case-insensitive vendor search + multi-select tag filters. */
(function () {
  'use strict';
  const { $, el, SECTION_META, vendorsFor, loadData, mountGrid, emptyState, setActiveSection } = window.Adistec;
  const typeParam = new URLSearchParams(location.search).get('type') || 'security';
  const type = Object.prototype.hasOwnProperty.call(SECTION_META, typeParam) ? typeParam : 'security';
  const meta = SECTION_META[type];
  let items = [];
  let activeTags = new Set();
  let allTags = [];
  let tagsExpanded = false;
  let tagQuery = '';
  let vendorQuery = '';
  const MAX_TAGS = 18;

  document.title = meta.label + ' | Portfólio Adistec Brasil';
  $('#page-title').textContent = meta.title;
  $('#page-description').textContent = meta.description;
  $('#section-title').textContent = 'Fabricantes de ' + meta.label;
  $('#section-description').textContent = 'Encontre fabricantes, compare especialidades e descubra suas soluções.';
  $('#breadcrumb-section').textContent = meta.label;
  $('#section-number').textContent = meta.number;
  $('#section-watermark').textContent = meta.number;
  setActiveSection(type);

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
  }
  function updateReset() {
    $('#reset-filters').hidden = !vendorQuery && !tagQuery && activeTags.size === 0;
  }
  function filterItems() {
    const result = items.filter(item => {
      const matchesQuery = !vendorQuery || [item.name, item.summary, item.description, item.tagline, ...(Array.isArray(item.tags)?item.tags:[]), ...(Array.isArray(item.products)?item.products.flatMap(p => [p.title, p.description]):[])].some(field => normalize(field).includes(vendorQuery));
      const matchesTag = !activeTags.size || (Array.isArray(item.tags) && item.tags.some(tag => activeTags.has(tag)));
      return matchesQuery && matchesTag;
    });
    const grid = $('#security-grid');
    if (items.length && !result.length) {
      grid.replaceChildren();
      const col=el('div','col-12');
      const state = emptyState('Nenhum fabricante encontrado','Tente outra pesquisa ou remova alguns filtros.');
      const clear=el('button','tag-toggle-btn','Limpar filtros ×'); clear.type='button';clear.style.marginTop='14px';clear.addEventListener('click',clearFilters);
      state.lastElementChild.appendChild(clear);col.appendChild(state);grid.appendChild(col);
    } else mountGrid(grid,result,type,false);
    $('#results-count').textContent = result.length + (result.length===1?' fabricante':' fabricantes');
    updateReset();
  }
  function makeButton(label, active, onClick, extraClass) {
    const button=el('button','tag-chip' + (active?' active':'') + (extraClass?' '+extraClass:''),label);
    button.type='button';button.setAttribute('aria-pressed',String(active));button.addEventListener('click',onClick);return button;
  }
  function renderTags() {
    const container=$('#tag-filters'); container.replaceChildren();
    const shown=allTags.filter(tag=>normalize(tag).includes(tagQuery));
    $('#tag-count').textContent = allTags.length ? allTags.length + ' disponíveis' : '';
    container.appendChild(makeButton('Todas',activeTags.size===0,clearTags));
    const visible=tagsExpanded||tagQuery ? shown:shown.slice(0,MAX_TAGS);
    visible.forEach(tag => container.appendChild(makeButton(tag,activeTags.has(tag),()=>toggleTag(tag))));
    if (!shown.length && tagQuery) container.appendChild(el('p','tag-filter-empty','Nenhuma palavra-chave corresponde à busca.'));
    if (shown.length>MAX_TAGS && !tagQuery) {
      const btn=el('button','tag-toggle-btn',tagsExpanded?'− Ver menos tags':'+ Ver todas as tags ('+shown.length+')');
      btn.type='button';btn.setAttribute('aria-expanded',String(tagsExpanded));
      btn.addEventListener('click',()=>{tagsExpanded=!tagsExpanded;renderTags();});container.appendChild(btn);
    }
    updateReset();
  }
  function toggleTag(tag) {
    if (activeTags.has(tag)) activeTags.delete(tag); else activeTags.add(tag);
    renderTags(); filterItems();
  }
  function clearTags() { activeTags.clear();tagQuery='';tagsExpanded=false;$('#tag-search').value='';renderTags();filterItems(); }
  function clearFilters() {
    activeTags.clear(); tagsExpanded=false;tagQuery='';vendorQuery='';
    $('#vendor-search').value='';$('#tag-search').value='';renderTags();filterItems();
  }
  $('#reset-filters').addEventListener('click',clearFilters);
  $('#vendor-search').addEventListener('input',event=>{vendorQuery=normalize(event.target.value);filterItems();});
  $('#tag-search').addEventListener('input',event=>{tagQuery=normalize(event.target.value);renderTags();});
  async function init() {
    try {
      const data=await loadData();
      items=vendorsFor(data,type);
      allTags=[...new Set(items.flatMap(v=>Array.isArray(v.tags)?v.tags.filter(tag=>typeof tag==='string'&&tag.trim()):[]))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
      const label=items.length+(items.length===1?' fabricante':' fabricantes');
      $('#hero-vendor-count').textContent=label+' no catálogo';
      $('#catalog-total').textContent=label;
      renderTags();filterItems();
    } catch (error) {
      console.error('Erro no catálogo:',error);
      $('#hero-vendor-count').textContent='Catálogo indisponível';
      $('#catalog-total').textContent='Indisponível';
      $('#results-count').textContent='Catálogo indisponível';
      $('#security-grid').replaceChildren();
      const col=el('div','col-12');col.appendChild(emptyState('Erro ao carregar o catálogo','Abra o site através de um servidor HTTP local e tente novamente.'));$('#security-grid').appendChild(col);
    }
  }
  init();
}());
