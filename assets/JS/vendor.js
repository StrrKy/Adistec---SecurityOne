/* Manufacturer details. All user-facing catalog values use textContent. */
(async function () {
  'use strict';
  const { $, el, SECTION_META, vendorsFor, loadData, addImage, vendorHref, setActiveSection } = window.Adistec;
  const search = new URLSearchParams(location.search);
  const typeParam = search.get('type') || 'security';
  const type = Object.prototype.hasOwnProperty.call(SECTION_META,typeParam) ? typeParam : 'security';
  const requestedName = (search.get('name') || '').trim().toLocaleLowerCase('pt-BR');
  const backHref = './section.html?type=' + encodeURIComponent(type);
  $('#vendor-back-link').href = backHref;
  $('#header-back-link').href = backHref;
  $('#vendor-breadcrumb-link').href = backHref;
  $('#vendor-breadcrumb-link').textContent = SECTION_META[type].label;
  setActiveSection(type);
  let toastTimer;

  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  async function copyEmail(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        // Local HTTP and older browsers may not expose the Clipboard API.
        const temp=el('textarea');temp.value=value;temp.style.position='fixed';temp.style.opacity='0';
        document.body.appendChild(temp);temp.select();
        const succeeded=document.execCommand('copy');temp.remove();
        if (!succeeded) throw new Error('Copy unavailable');
      }
      notify('E-mail copiado: ' + value);
    } catch (error) {
      console.warn('Não foi possível copiar o e-mail:',error);
      notify('Não foi possível copiar. Selecione o endereço para copiá-lo.');
    }
  }
  function renderRelated(items,vendor) {
    const track=$('.esteira-track');track.replaceChildren();
    const related=items.filter(item => item.name.toLocaleLowerCase('pt-BR') !== vendor.name.toLocaleLowerCase('pt-BR'));
    if (!related.length) {track.appendChild(el('span','related-empty','Outros fabricantes serão exibidos aqui quando cadastrados.'));return;}
    // The previous page used a rotating selection; keep a randomized subset.
    const shuffled=[...related];
    for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    shuffled.slice(0,5).forEach(item => {
      const link=el('a','logo-card');link.href=vendorHref(item,type);link.title='Conhecer '+item.name;
      const img=addImage(link,item.logo,'Logo '+item.name);
      if (!img) link.appendChild(el('strong','',item.name));
      img?.addEventListener('error',()=>link.appendChild(el('strong','',item.name)));
      track.appendChild(link);
    });
  }
  function renderProducts(vendor) {
    const products=vendor.products;
    const context=$('#product-context');context.replaceChildren();context.hidden=true;
    if(vendor.productSectionNote) context.appendChild(el('p','product-section-note',vendor.productSectionNote));
    if(vendor.productMedia) {
      const frame=el('div','product-media-frame');
      const image=addImage(frame,vendor.productMedia,'Solução '+vendor.name);
      if(image){image.addEventListener('error',()=>{frame.hidden=true;});context.appendChild(frame);}
    }
    if(vendor.productSectionSubtitle) context.appendChild(el('h3','product-section-subtitle',vendor.productSectionSubtitle));
    context.hidden=!context.children.length;
    const container=$('.products-grid');container.replaceChildren();
    const valid=Array.isArray(products)?products.filter(product=>product && typeof product.title==='string' && product.title.trim()):[];
    if (!valid.length) {container.appendChild(el('p','vendor-description','Nenhum produto cadastrado ainda.'));return;}
    valid.forEach((product,index) => {
      const card=el('article','product-card');
      card.appendChild(el('span','product-number','SOLUÇÃO '+String(index+1).padStart(2,'0')));
      if(product.logo){
        const frame=el('div','product-icon');
        const img=addImage(frame,product.logo,'Ícone '+product.title);
        if(img){img.addEventListener('error',()=>{frame.hidden=true;});card.appendChild(frame);}
      }
      card.append(el('h3','',product.title),el('p','',product.description || 'Descrição em atualização.'),el('span','product-bar'));
      container.appendChild(card);
    });
  }
  function renderTags(tags) {
    const container=$('.tag-list');container.replaceChildren();
    const list=Array.isArray(tags)?tags.filter(tag=>typeof tag==='string'&&tag.trim()):[];
    if (!list.length){container.appendChild(el('p','vendor-description','Nenhuma palavra-chave cadastrada.'));return;}
    list.forEach(tag=>container.appendChild(el('span','tag',tag)));
  }
  function renderCompetitors(competitors) {
    const container=$('.inline-list');container.replaceChildren();
    const list=Array.isArray(competitors)?competitors.filter(value=>typeof value==='string'&&value.trim()):[];
    if (!list.length){container.appendChild(el('li','','Ainda não informado.'));return;}
    list.forEach(value=>container.appendChild(el('li','',value)));
  }
  function renderProfiles(profile) {
    const container=$('.profile-grid');container.replaceChildren();
    const fields=[['segments','Segmentos'],['sizes','Porte das empresas'],['roles','Perfis profissionais']];
    fields.forEach(([key,label])=>{
      const group=el('div','profile-group');group.appendChild(el('h3','',label));
      const list=el('ul');const values=Array.isArray(profile&&profile[key])?profile[key].filter(v=>typeof v==='string'&&v.trim()):[];
      (values.length?values:['Não informado']).forEach(value=>list.appendChild(el('li','',value)));
      group.appendChild(list);container.appendChild(group);
    });
  }
  function renderContacts(contacts) {
    const container=$('#contact-list');container.replaceChildren();
    const list=Array.isArray(contacts)?contacts.filter(contact=>contact && (String(contact.name||'').trim() || String(contact.email||'').trim())):[];
    if (!list.length){container.appendChild(el('p','vendor-description','Contatos ainda não cadastrados.'));return;}
    list.forEach(contact=>{
      const person=el('div','contact-person');
      person.appendChild(el('h3','',contact.name||'Contato Adistec'));
      if (contact.role) person.appendChild(el('p','',contact.role));
      if (contact.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        const button=el('button','email-copia');button.type='button';button.title='Copiar '+contact.email;
        button.append(el('span','',contact.email),el('span','copy-icon','⧉'));
        button.addEventListener('click',()=>copyEmail(contact.email));
        person.appendChild(button);
      }
      container.appendChild(person);
    });
  }
  function renderVendor(vendor,items) {
    document.title=vendor.name+' | Adistec Brasil';
    $('#page-title').textContent=vendor.name;
    $('#page-description').textContent=vendor.heroSubtitle||vendor.summary||vendor.description||'Conheça as tecnologias e soluções deste fabricante.';
    const tagline=$('#vendor-tagline'); tagline.textContent=vendor.tagline||'';tagline.hidden=!vendor.tagline;
    $('#products-heading').textContent=vendor.productSectionTitle||'Principais produtos';
    $('#breadcrumb-vendor').textContent=vendor.name;
    $('#vendor-description').textContent=vendor.description||'Descrição em atualização.';
    const logo=$('#vendor-logo');
    const fallback=$('#vendor-logo-fallback');
    if (vendor.logo && /^(?:\.\/)?assets\/IMG\/[\w./-]+\.(?:png|webp|jpe?g|svg)$/i.test(vendor.logo) && !vendor.logo.includes('..')) {
      logo.src=vendor.logo;logo.alt='Logo '+vendor.name;logo.hidden=false;fallback.hidden=true;
      logo.addEventListener('error',()=>{logo.hidden=true;fallback.hidden=false;fallback.textContent=vendor.name;},{once:true});
    } else {logo.hidden=true;fallback.hidden=false;fallback.textContent=vendor.name;}
    renderRelated(items,vendor);
    renderProducts(vendor);
    renderTags(vendor.tags);
    renderCompetitors(vendor.competitors);
    renderProfiles(vendor.profile);
    renderContacts(vendor.contacts);
  }
  function displayError(message) {
    console.error(message);
    document.title='Fabricante não encontrado | Adistec Brasil';
    $('#page-title').textContent='Fabricante não encontrado';$('#vendor-tagline').hidden=true;
    $('#page-description').textContent='Não foi possível exibir este perfil.';
    $('#vendor-description').replaceChildren(el('span','',message+' '));
    const link=el('a','text-link','Voltar ao portfólio ↗');link.href=backHref;$('#vendor-description').appendChild(link);
    $('#breadcrumb-vendor').textContent='Não encontrado';
    $('.esteira-track').replaceChildren(el('span','related-empty','Nenhuma sugestão disponível.'));
    $('#product-context').replaceChildren();$('#product-context').hidden=true;$('.products-grid').replaceChildren();$('.tag-list').replaceChildren();$('.inline-list').replaceChildren();$('.profile-grid').replaceChildren();
    $('#contact-list').replaceChildren(el('p','vendor-description','Informações indisponíveis.'));
  }
  try {
    const data=await loadData();const items=vendorsFor(data,type);
    const vendor=requestedName?items.find(v=>v.slug?.toLocaleLowerCase('pt-BR')===requestedName || v.name.trim().toLocaleLowerCase('pt-BR')===requestedName):items[0];
    if (!vendor) {displayError('Verifique o link ou selecione outro fabricante.');return;}
    renderVendor(vendor,items);
  } catch(error) {
    console.error('Erro ao carregar dados do fabricante:',error);
    displayError('O catálogo não pôde ser carregado. Abra o site através de um servidor HTTP.');
  }
}());
