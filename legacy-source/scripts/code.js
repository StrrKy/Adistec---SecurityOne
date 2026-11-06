document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     COPIAR E-MAIL
  ================================ */
  document.querySelectorAll('.email-copia').forEach(el => {
    el.addEventListener('click', () => {
      const email = el.dataset.email;

      navigator.clipboard.writeText(email).then(() => {
        el.classList.add('copied');

        setTimeout(() => {
          el.classList.remove('copied');
        }, 1500);
      });
    });
  });

  /* ===============================
     ESTEIRA INFINITA
  ================================ */
  const track = document.querySelector('.esteira-track');

  if (!track) return;

  // DUPLICA OS ITENS
  const items = [...track.children];
  items.forEach(item => {
    track.appendChild(item.cloneNode(true));
  });

  let position = 0;
  const speed = 0.5; // quanto menor, mais suave

  function animate() {
    position -= speed;

    const resetPoint = track.scrollWidth / 2;

    if (Math.abs(position) >= resetPoint) {
      position = 0;
    }

    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }

  animate();

  /* ===============================
      MENU DE IDIOMAS
  ================================ */
  const btn = document.querySelector('.idioma-butt');
  const menu = document.querySelector('.idioma-menu');

  btn.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.idioma')) {
      menu.classList.remove('active');
    }
  });
});