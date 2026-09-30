(() => {
  'use strict';

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const conMovimiento = () => !movimientoReducido.matches;
  const dinero = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 });
  const DONATIVO_MINIMO = 1000;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const normalizar = texto => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));
  const azar = (a, b) => {
    const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };

  function crear(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }

  const ICONO_CORAZON = 'M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z';
  const ICONO_VOLTEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 11a7.5 7.5 0 0 1 13-4.6L19.5 8.5M19.5 4v4.5H15M19.5 13a7.5 7.5 0 0 1-13 4.6L4.5 15.5M4.5 20v-4.5H9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const FORMAS_HUELLA = '<ellipse cx="0" cy="3.6" rx="5" ry="4.3"/><ellipse cx="-6.4" cy="-2" rx="2.1" ry="2.8" transform="rotate(-18 -6.4 -2)"/><ellipse cx="-2.4" cy="-5.6" rx="2.1" ry="2.9"/><ellipse cx="2.4" cy="-5.6" rx="2.1" ry="2.9"/><ellipse cx="6.4" cy="-2" rx="2.1" ry="2.8" transform="rotate(18 6.4 -2)"/>';
  const SVG_HUELLA = `<svg viewBox="-12 -12 24 24" aria-hidden="true"><g fill="currentColor">${FORMAS_HUELLA}</g></svg>`;

  const raiz = document.documentElement;
  const cabecera = $('.cabecera');
  const menuBoton = $('#menuBoton');
  const menu = $('#menu');

  const medirCabecera = () => raiz.style.setProperty('--alto-cabecera', `${cabecera.offsetHeight}px`);

  function cerrarMenu() {
    menu.classList.remove('abierto');
    menuBoton.setAttribute('aria-expanded', 'false');
    menuBoton.setAttribute('aria-label', 'Abrir menú');
  }

  menuBoton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    menuBoton.setAttribute('aria-expanded', String(abierto));
    menuBoton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });

  menu.addEventListener('click', evento => {
    if (evento.target.closest('a')) cerrarMenu();
  });

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && menu.classList.contains('abierto')) {
      cerrarMenu();
      menuBoton.focus();
    }
  });

  window.addEventListener('resize', medirCabecera);
  medirCabecera();

  const enlacesNav = $$('.nav__lista a[href^="#"]');
  const observadorNav = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) enlacesNav.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === `#${entrada.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  enlacesNav.forEach(a => {
    const seccion = document.querySelector(a.getAttribute('href'));
    if (seccion) observadorNav.observe(seccion);
  });

  const MASCOTAS = [
    { id: 'canela', nombre: 'Canela', especie: 'perro', sexo: 'hembra', meses: 36, tamano: 'mediano', ingreso: '2026-01-12', ninos: 'todos', perros: true, gatos: false, energia: 'media', patio: false, alt: 'Canela, perrita mestiza color caramelo con paliacate verde', rasgos: ['Tranquila', 'Sabe sentarse', 'Camina bien con correa'], historia: 'La encontraron amarrada a un poste en la colonia El Álamo. En casa es tranquila, duerme donde haya sol y le encanta que le rasquen detrás de las orejas.' },
    { id: 'rocco', nombre: 'Rocco', especie: 'perro', sexo: 'macho', meses: 60, tamano: 'grande', ingreso: '2025-11-03', ninos: 'grandes', perros: false, gatos: false, energia: 'alta', patio: true, alt: 'Rocco, perro grande negro con cejas y hocico cafés', rasgos: ['Leal', 'Protector', 'Necesita ejercicio'], historia: 'Cuidaba un terreno baldío hasta que lo abandonaron. Es muy leal con su gente y prefiere ser el único perro de la casa. Necesita patio y dos paseos largos al día.' },
    { id: 'luna', nombre: 'Luna', especie: 'perro', sexo: 'hembra', meses: 4, tamano: 'mediano', ingreso: '2026-08-20', ninos: 'todos', perros: true, gatos: true, energia: 'alta', patio: false, alt: 'Luna, cachorra blanca con un parche café en el ojo', rasgos: ['Cachorra', 'Juguetona', 'Aprende rápido'], historia: 'Llegó con sus cuatro hermanos en una caja de cartón. Ya todos encontraron casa menos ella. Aprende rápido y convive con todo el mundo.' },
    { id: 'tito', nombre: 'Tito', especie: 'perro', sexo: 'macho', meses: 132, tamano: 'chico', ingreso: '2025-06-15', ninos: 'grandes', perros: true, gatos: true, energia: 'baja', patio: false, alt: 'Tito, perrito senior de orejas grandes y hocico canoso', rasgos: ['Senior', 'Duerme mucho', 'Ideal para departamento'], historia: 'Su familia se mudó y lo dejó atrás a los diez años. Es el más paciente del refugio: busca una casa tranquila para pasar sus mejores años en un cojín.' },
    { id: 'nube', nombre: 'Nube', especie: 'perro', sexo: 'hembra', meses: 24, tamano: 'grande', ingreso: '2026-05-02', ninos: 'todos', perros: true, gatos: false, energia: 'media', patio: true, alt: 'Nube, perra grande blanca y esponjada', rasgos: ['Cariñosa', 'Le encanta el agua', 'Pelo largo'], historia: 'La rescatamos de una azotea. Es enorme y suavecita, se lleva de maravilla con niños y necesita cepillado dos veces por semana.' },
    { id: 'frijol', nombre: 'Frijol', especie: 'perro', sexo: 'macho', meses: 14, tamano: 'chico', ingreso: '2026-07-28', ninos: 'todos', perros: true, gatos: true, energia: 'alta', patio: false, alt: 'Frijol, perrito negro con franja blanca en la cara', rasgos: ['Sociable', 'Travieso', 'Cabe en cualquier lado'], historia: 'Apareció en el mercado de Tlaquepaque pidiendo tortillas. Es pequeño, sociable y tiene energía para jugar todo el día.' },
    { id: 'bruma', nombre: 'Bruma', especie: 'perro', sexo: 'hembra', meses: 48, tamano: 'grande', ingreso: '2026-07-09', ninos: 'grandes', perros: true, gatos: false, energia: 'baja', patio: false, alt: 'Bruma, perra gris azulado con pecho blanco y gran sonrisa', rasgos: ['Dulce', 'En recuperación', 'Adopción con apoyo médico'], historia: 'La atropellaron en julio. Camina, pero necesita una cirugía de cadera que ya estamos juntando. Quien la adopte recibe el tratamiento pagado.' },
    { id: 'mango', nombre: 'Mango', especie: 'perro', sexo: 'macho', meses: 26, tamano: 'mediano', ingreso: '2026-03-18', ninos: 'todos', perros: true, gatos: true, energia: 'alta', patio: false, alt: 'Mango, perro naranja con una oreja parada y otra caída', rasgos: ['Corredor', 'Aprende trucos', 'Una oreja parada'], historia: 'Corría detrás de las bicicletas en la ciclovía. Es ideal para alguien que salga a correr y quiera compañía constante.' },
    { id: 'pimienta', nombre: 'Pimienta', especie: 'gato', sexo: 'hembra', meses: 24, tamano: 'chico', ingreso: '2026-04-10', ninos: 'todos', perros: true, gatos: true, energia: 'media', patio: false, alt: 'Pimienta, gata gris atigrada de ojos verdes', rasgos: ['Curiosa', 'Usa arenero', 'Ronronea fuerte'], historia: 'La encontramos en el motor de un coche en pleno invierno. Es curiosa, sociable con perros tranquilos y ronronea como tractor.' },
    { id: 'mora', nombre: 'Mora', especie: 'gato', sexo: 'hembra', meses: 72, tamano: 'chico', ingreso: '2025-09-22', ninos: 'grandes', perros: false, gatos: true, energia: 'baja', patio: false, alt: 'Mora, gata negra de ojos amarillos', rasgos: ['Tranquila', 'Ideal para departamento', 'Le gustan las ventanas'], historia: 'Lleva más de un año esperando porque la gente prefiere gatitos. Es tranquila, limpia y pasa horas mirando por la ventana.' },
    { id: 'tostada', nombre: 'Tostada', especie: 'gato', sexo: 'hembra', meses: 36, tamano: 'chico', ingreso: '2026-02-14', ninos: 'grandes', perros: false, gatos: true, energia: 'media', patio: false, alt: 'Tostada, gata calicó blanca, naranja y negra', rasgos: ['Independiente', 'Calicó', 'Cazadora de juguetes'], historia: 'Vivía en una bodega de cerámica en Tonalá. Es independiente pero pide cariño a su manera, casi siempre a la hora de la cena.' },
    { id: 'merlin', nombre: 'Merlín', especie: 'gato', sexo: 'macho', meses: 108, tamano: 'chico', ingreso: '2025-12-01', ninos: 'todos', perros: true, gatos: true, energia: 'baja', patio: false, alt: 'Merlín, gato senior blanco y negro de ojos verdes', rasgos: ['Senior', 'Convive con perros', 'Muy paciente'], historia: 'Su dueña falleció y nadie de la familia pudo quedárselo. Es tranquilo, convive con perros y se acomoda en cualquier regazo disponible.' },
    { id: 'chispa', nombre: 'Chispa', especie: 'gato', sexo: 'macho', meses: 3, tamano: 'chico', ingreso: '2026-09-05', ninos: 'todos', perros: true, gatos: true, energia: 'alta', patio: false, alt: 'Chispa, gatito naranja atigrado', rasgos: ['Gatito', 'Juguetón', 'Mejor con otro gato'], historia: 'Lo encontraron solo en una alcantarilla. Es puro juego: le recomendamos una casa donde ya haya otro gato para que aprenda a convivir.' },
    { id: 'algodon', nombre: 'Algodón', especie: 'gato', sexo: 'macho', meses: 12, tamano: 'chico', ingreso: '2026-06-01', ninos: 'grandes', perros: false, gatos: true, energia: 'media', patio: false, alt: 'Algodón, gato blanco de ojos azules', rasgos: ['Sordo', 'Aprende señas', 'Muy tranquilo'], historia: 'Es sordo de nacimiento, algo común en gatos blancos de ojos azules. Responde a señas con la mano y a vibraciones en el piso.' }
  ];

  const diasEsperando = m => Math.max(0, Math.round((hoy - new Date(`${m.ingreso}T00:00:00`)) / 86400000));
  const etapa = m => (m.meses < 12 ? 'cachorro' : m.meses > 84 ? 'senior' : 'adulto');
  const edadTexto = m => {
    if (m.meses < 12) return `${m.meses} ${m.meses === 1 ? 'mes' : 'meses'}`;
    const anios = Math.floor(m.meses / 12);
    return `${anios} ${anios === 1 ? 'año' : 'años'}`;
  };
  const genero = (m, masculino, femenino) => (m.sexo === 'hembra' ? femenino : masculino);
  const tamanoTexto = m => genero(m, m.tamano, m.tamano.replace(/o$/, 'a'));
  const cuota = m => (etapa(m) === 'senior' ? 0 : etapa(m) === 'cachorro' ? 23000 : 17500);
  const convivencia = m => [
    m.ninos === 'todos' ? 'Convive con niños' : m.ninos === 'grandes' ? 'Solo niños mayores de 6 años' : 'Mejor sin niños',
    m.perros ? 'Convive con perros' : 'Sin otros perros',
    m.gatos ? 'Convive con gatos' : 'Sin gatos',
    ...(m.patio ? ['Necesita patio'] : [])
  ];

  const perrosTotal = MASCOTAS.filter(m => m.especie === 'perro').length;
  $('#resumenHoy').textContent = `Hoy esperan familia ${MASCOTAS.length} rescatados: ${perrosTotal} perros y ${MASCOTAS.length - perrosTotal} gatos.`;

  const portada = $('#portada');
  const miradas = $('#miradas');
  const IDS_PORTADA = ['bruma', 'mora', 'tito'];
  const figuras = $$('.mirada', miradas).map((figura, i) => {
    const ojos = $$('.ojo__mirada', figura).map(el => {
      const base = el.querySelector('circle, ellipse');
      const gato = Boolean(el.parentNode.querySelector(':scope > path'));
      return { el, cx: base.cx.baseVal.value, cy: base.cy.baseVal.value, limX: gato ? 11 : 7, limY: gato ? 2.5 : 6 };
    });
    const m = MASCOTAS.find(x => x.id === IDS_PORTADA[i]);
    if (m) {
      const boton = crear('button', 'mirada__boton');
      boton.type = 'button';
      boton.dataset.ficha = m.id;
      boton.setAttribute('aria-label', `Conocer a ${m.nombre}`);
      figura.append(boton);
    }
    return { figura, ojos, parpados: $$('.ojo', figura), temporizador: 0 };
  });

  const vista = { portada: false, adopta: false, camino: false };
  const puntero = { x: 0, y: 0, ultimo: 0, cuadro: 0 };

  function mirarHacia(figura, px, py) {
    figura.ojos.forEach(ojo => {
      const matriz = ojo.el.parentNode.getScreenCTM();
      if (!matriz) return;
      const sx = matriz.a * ojo.cx + matriz.c * ojo.cy + matriz.e;
      const sy = matriz.b * ojo.cx + matriz.d * ojo.cy + matriz.f;
      const dx = px - sx;
      const dy = py - sy;
      const distancia = Math.hypot(dx, dy) || 1;
      const fuerza = Math.min(1, distancia / 220);
      ojo.el.style.transform = `translate(${((dx / distancia) * fuerza * ojo.limX).toFixed(2)}px, ${((dy / distancia) * fuerza * ojo.limY).toFixed(2)}px)`;
    });
  }

  function seguirPuntero(evento) {
    if (!vista.portada || !conMovimiento()) return;
    puntero.x = evento.clientX;
    puntero.y = evento.clientY;
    puntero.ultimo = performance.now();
    if (puntero.cuadro) return;
    puntero.cuadro = requestAnimationFrame(() => {
      puntero.cuadro = 0;
      figuras.forEach(f => mirarHacia(f, puntero.x, puntero.y));
    });
  }

  window.addEventListener('pointermove', seguirPuntero, { passive: true });
  window.addEventListener('pointerdown', seguirPuntero, { passive: true });

  setInterval(() => {
    if (!vista.portada || !conMovimiento() || performance.now() - puntero.ultimo < 3000) return;
    figuras.forEach(f => {
      const caja = f.figura.getBoundingClientRect();
      const angulo = Math.random() * Math.PI * 2;
      const lejos = Math.random() < 0.25 ? 0 : 320;
      mirarHacia(f, caja.left + caja.width / 2 + Math.cos(angulo) * lejos, caja.top + caja.height / 2 + Math.sin(angulo) * lejos);
    });
  }, 2200);

  function programarParpadeo(figura) {
    clearTimeout(figura.temporizador);
    figura.temporizador = setTimeout(() => {
      if (vista.portada && conMovimiento()) {
        figura.parpados.forEach(ojo => ojo.classList.add('parpadeo'));
        if (Math.random() < 0.2) setTimeout(() => figura.parpados.forEach(ojo => ojo.classList.add('parpadeo')), 320);
      }
      programarParpadeo(figura);
    }, 2400 + Math.random() * 4200);
  }

  figuras.forEach(f => {
    f.parpados.forEach(ojo => ojo.addEventListener('animationend', () => ojo.classList.remove('parpadeo')));
    programarParpadeo(f);
  });

  const rastro = $('#rastro');
  let ultimaHuella = null;
  let ladoHuella = 1;

  portada.addEventListener('pointermove', evento => {
    if (!conMovimiento() || evento.pointerType !== 'mouse') return;
    const caja = portada.getBoundingClientRect();
    const x = evento.clientX - caja.left;
    const y = evento.clientY - caja.top;
    if (!ultimaHuella) {
      ultimaHuella = { x, y };
      return;
    }
    const dx = x - ultimaHuella.x;
    const dy = y - ultimaHuella.y;
    if (Math.hypot(dx, dy) < 48) return;
    const angulo = Math.atan2(dy, dx);
    ladoHuella *= -1;
    const huella = crear('span', 'huella-rastro');
    huella.innerHTML = SVG_HUELLA;
    huella.style.left = `${(x - Math.sin(angulo) * 10 * ladoHuella).toFixed(1)}px`;
    huella.style.top = `${(y + Math.cos(angulo) * 10 * ladoHuella).toFixed(1)}px`;
    huella.style.transform = `rotate(${(angulo + Math.PI / 2).toFixed(3)}rad)`;
    huella.addEventListener('animationend', () => huella.remove());
    rastro.append(huella);
    if (rastro.childElementCount > 26) rastro.firstElementChild.remove();
    ultimaHuella = { x, y };
  });

  portada.addEventListener('pointerleave', () => {
    ultimaHuella = null;
  });

  const CLAVE_FAVORITOS = 'querencia-favoritos';
  let favoritos = new Set();
  try {
    favoritos = new Set(JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || []);
  } catch {
    favoritos = new Set();
  }

  function guardarFavoritos() {
    try {
      localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify([...favoritos]));
    } catch {
    }
    $('#conteoFavoritos').textContent = favoritos.size;
  }

  function crearCorazon(m) {
    const boton = crear('button', 'corazon');
    boton.type = 'button';
    boton.dataset.favorito = m.id;
    boton.setAttribute('aria-pressed', String(favoritos.has(m.id)));
    boton.setAttribute('aria-label', `Guardar a ${m.nombre} en favoritos`);
    boton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONO_CORAZON}"/></svg>`;
    return boton;
  }

  function crearVoltear(etiqueta) {
    const boton = crear('button', 'voltear');
    boton.type = 'button';
    boton.setAttribute('aria-label', etiqueta);
    boton.title = etiqueta;
    boton.innerHTML = ICONO_VOLTEAR;
    return boton;
  }

  function crearLista(clase, textos) {
    const lista = crear('ul', clase);
    textos.forEach(t => lista.append(crear('li', '', t)));
    return lista;
  }

  function crearBotonFicha(m, clase) {
    const boton = crear('button', clase, `Conocer a ${m.nombre}`);
    boton.type = 'button';
    boton.dataset.ficha = m.id;
    return boton;
  }

  function crearTarjeta(m, i, entrar) {
    const tarjeta = crear('article', `mascota${entrar ? ' entrando' : ''}`);
    tarjeta.style.setProperty('--i', i);
    tarjeta.style.viewTransitionName = `mascota-${m.id}`;
    tarjeta.dataset.id = m.id;

    const giro = crear('div', 'mascota__giro');
    const frente = crear('div', 'mascota__cara mascota__frente');
    const cajaImg = crear('div', 'mascota__img-caja');
    const img = crear('img', 'mascota__img');
    img.src = `../img/${m.id}.svg`;
    img.alt = m.alt;
    img.width = 600;
    img.height = 600;
    img.loading = 'lazy';
    cajaImg.append(img);

    const dias = diasEsperando(m);
    const cuerpo = crear('div', 'mascota__cuerpo');
    const acciones = crear('div', 'mascota__acciones');
    acciones.append(crearBotonFicha(m, 'boton boton--primario'), crearVoltear(`Leer la historia de ${m.nombre}`));
    cuerpo.append(
      crear('h3', 'mascota__nombre', m.nombre),
      crear('p', 'mascota__datos', `${genero(m, 'Macho', 'Hembra')}, ${edadTexto(m)}, ${tamanoTexto(m)}`),
      crearLista('rasgos', m.rasgos),
      crear('p', `mascota__espera${dias > 180 ? ' mascota__espera--larga' : ''}`, dias > 180 ? `Lleva ${dias} días esperando` : `En el refugio desde hace ${dias} días`),
      acciones
    );
    frente.append(crearCorazon(m), cajaImg, cuerpo);

    const reverso = crear('div', 'mascota__cara mascota__reverso');
    reverso.inert = true;
    const accionesReverso = crear('div', 'mascota__acciones');
    accionesReverso.append(crearBotonFicha(m, 'boton boton--primario'), crearVoltear(`Ver la foto de ${m.nombre}`));
    reverso.append(
      crear('p', 'mascota__nombre', m.nombre),
      crear('p', 'mascota__historia', m.historia),
      crearLista('rasgos', convivencia(m)),
      crear('p', 'mascota__salud', `Se entrega ${genero(m, 'vacunado', 'vacunada')}, ${genero(m, 'esterilizado', 'esterilizada')} y con microchip. ${cuota(m) ? `Cuota de recuperación: ${dinero.format(cuota(m))}.` : 'Sin cuota por ser senior.'}`),
      accionesReverso
    );

    giro.append(frente, reverso);
    tarjeta.append(giro);
    return tarjeta;
  }

  function voltearTarjeta(tarjeta) {
    const volteada = tarjeta.classList.toggle('volteada');
    const frente = $('.mascota__frente', tarjeta);
    const reverso = $('.mascota__reverso', tarjeta);
    frente.inert = volteada;
    reverso.inert = !volteada;
    reverso.scrollTop = 0;
    $('.voltear', volteada ? reverso : frente).focus({ preventScroll: true });
  }

  const contenedor = $('#mascotas');
  const filtros = {
    especie: 'todos',
    nombre: $('#filtroNombre'),
    tamano: $('#filtroTamano'),
    edad: $('#filtroEdad'),
    orden: $('#filtroOrden'),
    ninos: $('#filtroNinos'),
    perros: $('#filtroPerros'),
    gatos: $('#filtroGatos'),
    favoritos: $('#filtroFavoritos')
  };
  let primeraVez = true;

  function aplicarFiltros(conTransicion = true) {
    const texto = normalizar(filtros.nombre.value);
    const orden = filtros.orden.value;
    const lista = MASCOTAS.filter(m => {
      if (filtros.especie !== 'todos' && m.especie !== filtros.especie) return false;
      if (texto && !normalizar(m.nombre).includes(texto)) return false;
      if (filtros.tamano.value && m.tamano !== filtros.tamano.value) return false;
      if (filtros.edad.value && etapa(m) !== filtros.edad.value) return false;
      if (filtros.ninos.checked && m.ninos === 'no') return false;
      if (filtros.perros.checked && !m.perros) return false;
      if (filtros.gatos.checked && !m.gatos) return false;
      if (filtros.favoritos.checked && !favoritos.has(m.id)) return false;
      return true;
    }).sort((a, b) => {
      if (orden === 'jovenes') return a.meses - b.meses;
      if (orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es');
      return diasEsperando(b) - diasEsperando(a);
    });

    const transicion = conTransicion && !primeraVez && conMovimiento() && typeof document.startViewTransition === 'function';
    const entrar = !primeraVez && !transicion && conMovimiento();
    const pintar = () => {
      contenedor.replaceChildren(...lista.map((m, i) => crearTarjeta(m, Math.min(i, 10), entrar)));
      $('#vacio').hidden = lista.length > 0;
      $('#conteo').textContent = lista.length === MASCOTAS.length ? `Mostrando a los ${MASCOTAS.length}` : `Mostrando ${lista.length} de ${MASCOTAS.length}`;
    };
    primeraVez = false;
    if (transicion) document.startViewTransition(pintar).ready.catch(() => {});
    else pintar();
  }

  $$('#filtroEspecie button').forEach(boton => {
    boton.addEventListener('click', () => {
      $$('#filtroEspecie button').forEach(b => b.setAttribute('aria-checked', String(b === boton)));
      filtros.especie = boton.dataset.especie;
      aplicarFiltros();
    });
  });

  $('#filtroEspecie').addEventListener('keydown', evento => {
    const botones = $$('#filtroEspecie button');
    const actual = botones.indexOf(document.activeElement);
    const paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[evento.key];
    if (actual < 0 || !paso) return;
    evento.preventDefault();
    const siguiente = botones[(actual + paso + botones.length) % botones.length];
    siguiente.focus();
    siguiente.click();
  });

  $('#filtros').addEventListener('input', evento => aplicarFiltros(evento.target !== filtros.nombre));
  $('#filtros').addEventListener('submit', evento => evento.preventDefault());

  $('#quitarFiltros').addEventListener('click', () => {
    $('#filtros').reset();
    filtros.especie = 'todos';
    $$('#filtroEspecie button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.especie === 'todos')));
    aplicarFiltros();
  });

  function alternarFavorito(id, boton) {
    if (favoritos.has(id)) favoritos.delete(id);
    else favoritos.add(id);
    guardarFavoritos();
    $$(`[data-favorito="${id}"]`).forEach(b => {
      b.setAttribute('aria-pressed', String(favoritos.has(id)));
      if (b === boton) {
        b.classList.remove('latiendo');
        void b.offsetWidth;
        b.classList.add('latiendo');
      }
    });
    if (fichaActual && fichaActual.id === id) pintarBotonFavoritoFicha();
    if (filtros.favoritos.checked) aplicarFiltros();
  }

  document.addEventListener('click', evento => {
    const corazon = evento.target.closest('[data-favorito]');
    if (corazon) {
      alternarFavorito(corazon.dataset.favorito, corazon);
      return;
    }
    const voltear = evento.target.closest('.voltear');
    if (voltear) {
      voltearTarjeta(voltear.closest('.mascota'));
      return;
    }
    const botonFicha = evento.target.closest('[data-ficha]');
    if (botonFicha) abrirFicha(botonFicha.dataset.ficha, botonFicha);
  });

  const ficha = $('#ficha');
  const fichaImg = $('#fichaImg');
  let fichaActual = null;
  let origenFicha = null;
  let imagenOrigen = null;
  const transicionesVista = () => conMovimiento() && typeof document.startViewTransition === 'function';

  function pintarBotonFavoritoFicha() {
    const boton = $('#fichaFavorito');
    const guardado = favoritos.has(fichaActual.id);
    boton.setAttribute('aria-pressed', String(guardado));
    boton.textContent = guardado ? 'Quitar de favoritos' : 'Guardar en favoritos';
  }

  async function abrirFicha(id, origen) {
    const m = MASCOTAS.find(x => x.id === id);
    if (!m || ficha.open) return;
    fichaActual = m;
    origenFicha = origen || null;
    fichaImg.src = `../img/${m.id}.svg`;
    fichaImg.alt = m.alt;
    $('#fichaNombre').textContent = m.nombre;
    $('#fichaDatos').textContent = `${genero(m, 'Macho', 'Hembra')}, ${edadTexto(m)}, ${tamanoTexto(m)}. ${m.especie === 'perro' ? genero(m, 'Perro', 'Perra') : genero(m, 'Gato', 'Gata')} de energía ${m.energia}.`;
    $('#fichaHistoria').textContent = m.historia;
    const rasgos = $('#fichaRasgos');
    rasgos.className = 'ficha__rasgos rasgos';
    rasgos.replaceChildren(...[...m.rasgos, ...convivencia(m)].map(t => crear('li', '', t)));
    $('#fichaSalud').replaceChildren(...['Vacunas al día', genero(m, 'Esterilizado', 'Esterilizada'), 'Microchip', genero(m, 'Desparasitado', 'Desparasitada')].map(t => crear('li', '', t)));
    const c = cuota(m);
    $('#fichaEspera').textContent = `${diasEsperando(m)} días en el refugio. Cuota de recuperación: ${c ? dinero.format(c) : 'sin cuota por ser senior'}.`;
    $('#fichaAdoptar').textContent = `Quiero adoptar a ${m.nombre}`;
    pintarBotonFavoritoFicha();

    const tarjeta = origen && origen.closest('.mascota, .match-tarjeta, .mirada');
    imagenOrigen = tarjeta && !tarjeta.classList.contains('volteada') ? tarjeta.querySelector('.mascota__img, .match-tarjeta__img, .mirada-svg') : null;

    const mostrar = () => {
      ficha.showModal();
      ficha.scrollTop = 0;
    };
    if (!imagenOrigen || !transicionesVista()) {
      mostrar();
      return;
    }
    try {
      await fichaImg.decode();
    } catch {
    }
    imagenOrigen.style.viewTransitionName = 'ficha-foto';
    const transicion = document.startViewTransition(() => {
      imagenOrigen.style.viewTransitionName = '';
      fichaImg.style.viewTransitionName = 'ficha-foto';
      mostrar();
    });
    transicion.ready.catch(() => {});
    transicion.finished.finally(() => {
      fichaImg.style.viewTransitionName = '';
    });
  }

  function cerrarFicha() {
    if (!ficha.open) return;
    const destino = imagenOrigen && document.contains(imagenOrigen) ? imagenOrigen : null;
    if (!destino || !transicionesVista()) {
      ficha.close();
      return;
    }
    fichaImg.style.viewTransitionName = 'ficha-foto';
    const transicion = document.startViewTransition(() => {
      fichaImg.style.viewTransitionName = '';
      destino.style.viewTransitionName = 'ficha-foto';
      ficha.close();
    });
    transicion.ready.catch(() => {});
    transicion.finished.finally(() => {
      destino.style.viewTransitionName = '';
    });
  }

  $('#fichaCerrar').addEventListener('click', cerrarFicha);
  ficha.addEventListener('click', evento => {
    if (evento.target === ficha) cerrarFicha();
  });
  ficha.addEventListener('cancel', evento => {
    evento.preventDefault();
    cerrarFicha();
  });
  ficha.addEventListener('close', () => {
    if (origenFicha && document.contains(origenFicha)) origenFicha.focus({ preventScroll: true });
  });
  $('#fichaFavorito').addEventListener('click', () => {
    if (fichaActual) alternarFavorito(fichaActual.id, null);
  });
  $('#fichaAdoptar').addEventListener('click', () => {
    if (!fichaActual) return;
    const id = fichaActual.id;
    origenFicha = null;
    imagenOrigen = null;
    ficha.close();
    elegirParaSolicitud(id);
  });

  guardarFavoritos();
  aplicarFiltros(false);

  const lienzo = $('#fondoHuellas');
  const ctx = lienzo.getContext('2d');
  const seccionAdopta = $('#adopta');
  const fondo = { w: 0, h: 0, puntero: null, cuadro: 0, rastro: -1, sep: 104, desfase: 0 };

  function colores() {
    const estilos = getComputedStyle(document.body);
    const hex = v => {
      const n = parseInt(estilos.getPropertyValue(v).trim().replace('#', ''), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    return { c1: hex('--color-1'), c2: hex('--color-2'), c3: hex('--color-3') };
  }

  const rgba = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
  const mezcla = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

  function huella(x, y, tam, angulo, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angulo);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, tam * 0.28, tam * 0.36, tam * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    [[-0.42, -0.1, -0.35], [-0.16, -0.36, -0.1], [0.16, -0.36, 0.1], [0.42, -0.1, 0.35]].forEach(([dx, dy, giro]) => {
      ctx.beginPath();
      ctx.ellipse(dx * tam, dy * tam, tam * 0.14, tam * 0.19, giro, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function medirFondo() {
    const w = seccionAdopta.clientWidth;
    const h = seccionAdopta.clientHeight;
    if (w === fondo.w && h === fondo.h) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    lienzo.width = Math.round(w * dpr);
    lienzo.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fondo.w = w;
    fondo.h = h;
    fondo.sep = w < 640 ? 78 : 104;
    return true;
  }

  function dibujarFondo() {
    const { w, h, sep, desfase } = fondo;
    if (!w) return;
    const { c1, c2, c3 } = colores();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = rgba(c1, 1);
    ctx.fillRect(0, 0, w, h);
    const base = mezcla(c1, c3, 0.3);
    const tenue = rgba(base, 1);
    const tam = sep * 0.34;
    const altoFila = sep * 0.86;
    const primera = Math.floor((-desfase - sep) / altoFila);
    const ultima = Math.ceil((h - desfase + sep) / altoFila);
    for (let fila = primera; fila <= ultima; fila++) {
      const impar = Math.abs(fila % 2) === 1;
      const y = sep * 0.5 + fila * altoFila + desfase;
      for (let col = -1; ; col++) {
        const x = col * sep - sep / 2 + (impar ? sep / 2 : 0);
        if (x > w + sep) break;
        const giro = (impar ? 0.35 : -0.35) + (azar(fila, col) - 0.5) * 0.24;
        const resaltada = azar(col + 31, fila) < 0.11;
        let escala = 1;
        let color = resaltada ? rgba(c2, 0.55) : tenue;
        if (fondo.puntero) {
          const d = Math.hypot(x - fondo.puntero.x, y - fondo.puntero.y);
          if (d < 160) {
            const t = 1 - d / 160;
            escala = 1 + t * 0.35;
            if (!resaltada) color = rgba(mezcla(base, c2, t * 0.8), 1);
          }
        }
        huella(x, y, tam * escala, giro, color);
      }
    }
    if (fondo.rastro >= 0) {
      const pasos = 16;
      for (let i = 0; i < pasos; i++) {
        const edad = fondo.rastro - i / pasos;
        if (edad < 0) continue;
        const alfa = Math.max(0, 1 - edad * 1.4);
        if (alfa <= 0) continue;
        const t = i / (pasos - 1);
        const x = w * (0.04 + t * 0.92);
        const y = h * (0.92 - t * 0.84) + (i % 2 ? -sep * 0.22 : sep * 0.22);
        huella(x, y, tam * 1.15, Math.atan2(-h * 0.84, w * 0.92) + Math.PI / 2, rgba(c2, alfa * 0.95));
      }
    }
  }

  function pedirDibujo() {
    if (fondo.cuadro) return;
    fondo.cuadro = requestAnimationFrame(() => {
      fondo.cuadro = 0;
      dibujarFondo();
    });
  }

  function animarRastro() {
    const inicio = performance.now();
    const duracion = 3600;
    const paso = ahora => {
      fondo.rastro = ((ahora - inicio) / duracion) * 1.7;
      dibujarFondo();
      if (ahora - inicio < duracion) {
        requestAnimationFrame(paso);
      } else {
        fondo.rastro = -1;
        dibujarFondo();
      }
    };
    requestAnimationFrame(paso);
  }

  function moverFondo() {
    if (!conMovimiento()) return;
    const desfase = -seccionAdopta.getBoundingClientRect().top * 0.14;
    if (Math.abs(desfase - fondo.desfase) < 0.5) return;
    fondo.desfase = desfase;
    if (fondo.rastro < 0) pedirDibujo();
  }

  new ResizeObserver(() => {
    if (medirFondo()) dibujarFondo();
  }).observe(seccionAdopta);
  medirFondo();
  moverFondo();
  dibujarFondo();

  const observadorRastro = new IntersectionObserver(entradas => {
    if (entradas.some(e => e.isIntersecting)) {
      observadorRastro.disconnect();
      if (conMovimiento()) animarRastro();
    }
  }, { threshold: 0.25 });
  observadorRastro.observe(seccionAdopta);

  seccionAdopta.addEventListener('pointermove', evento => {
    if (!conMovimiento() || evento.pointerType !== 'mouse' || fondo.rastro >= 0) return;
    const caja = seccionAdopta.getBoundingClientRect();
    fondo.puntero = { x: evento.clientX - caja.left, y: evento.clientY - caja.top };
    pedirDibujo();
  });

  seccionAdopta.addEventListener('pointerleave', () => {
    fondo.puntero = null;
    if (fondo.rastro < 0) dibujarFondo();
  });

  const formMatch = $('#formMatch');
  const PREGUNTAS = ['vivienda', 'horas', 'ninos', 'otros', 'ritmo'];
  const preguntasMatch = $$('.match__pregunta', formMatch);
  const perrito = $('#perrito');
  const botonMatchVer = $('#matchVer');
  const botonMatchAnterior = $('#matchAnterior');
  const errorMatch = $('#errorMatch');
  const resultadosMatch = $('#matchResultados');
  let pasoMatch = 0;
  let avanceMatch = 0;
  let ultimoPuntero = 0;
  let esperaAvance = 0;
  let esperaCamina = 0;

  function puntuar(m, r) {
    let puntos = 54;
    const motivos = [];
    const cuidados = [];
    const grande = m.tamano === 'grande';
    if (r.vivienda === 'depa') {
      if (grande) { puntos -= 26; cuidados.push('Es grande para un departamento'); }
      if (m.patio) { puntos -= 30; cuidados.push('Necesita patio'); }
      if (!grande && m.energia !== 'alta') { puntos += 10; motivos.push('Se adapta bien a departamento'); }
      if (m.especie === 'gato') { puntos += 6; }
    } else if (r.vivienda === 'casa') {
      if (m.patio) { puntos -= 22; cuidados.push('Necesita patio'); }
    } else if (grande || m.patio) {
      puntos += 12;
      motivos.push('Aprovechará tu patio');
    }
    if (r.horas === 'muchas') {
      if (etapa(m) === 'cachorro') { puntos -= 30; cuidados.push('Es muy pequeño para quedarse solo tanto tiempo'); }
      else if (m.especie === 'perro' && m.energia === 'alta') { puntos -= 14; cuidados.push('Se aburre si pasa muchas horas solo'); }
      else if (m.especie === 'gato') { puntos += 6; motivos.push('Tolera bien las horas a solas'); }
    } else if (r.horas === 'pocas') {
      if (etapa(m) === 'cachorro') { puntos += 10; motivos.push('Tendrá la compañía que un cachorro necesita'); }
      if (etapa(m) === 'senior') { puntos += 6; motivos.push('Agradecerá tu compañía'); }
    }
    if (r.ninos === 'chicos') {
      if (m.ninos !== 'todos') { puntos -= 45; cuidados.push('Mejor con niños mayores de 6 años'); }
      else { puntos += 8; motivos.push('Le gustan los niños'); }
    } else if (r.ninos === 'grandes') {
      if (m.ninos === 'no') { puntos -= 45; cuidados.push('Mejor en casa sin niños'); }
      else { puntos += 5; motivos.push('Convive con niños'); }
    }
    if (r.otros === 'perro') {
      if (!m.perros) { puntos -= 45; cuidados.push('Prefiere no convivir con perros'); }
      else { puntos += 6; motivos.push('Se lleva bien con perros'); }
    } else if (r.otros === 'gato') {
      if (!m.gatos) { puntos -= 45; cuidados.push('Prefiere no convivir con gatos'); }
      else { puntos += 6; motivos.push('Se lleva bien con gatos'); }
    }
    const gatoActivo = m.especie === 'gato' && r.ritmo === 'activo';
    const energia = { tranquilo: { baja: 20, media: 4, alta: -24 }, paseos: { baja: 4, media: 18, alta: 6 }, activo: { baja: -14, media: 8, alta: 24 } }[r.ritmo][m.energia];
    puntos += gatoActivo ? 0 : energia;
    if (energia >= 18) motivos.push(r.ritmo === 'tranquilo' ? `${genero(m, 'Tranquilo', 'Tranquila')}, como tú` : r.ritmo === 'activo' ? 'Tiene energía para acompañarte' : 'Disfrutará los paseos diarios');
    if (energia <= -14 && !gatoActivo) cuidados.push(r.ritmo === 'tranquilo' ? 'Necesita más actividad de la que buscas' : 'Prefiere un ritmo más tranquilo');
    if (diasEsperando(m) > 250) { puntos += 3; motivos.push(`Lleva ${diasEsperando(m)} días esperando`); }
    return { m, porcentaje: Math.max(8, Math.min(98, Math.round(puntos))), motivos: motivos.slice(0, 3), cuidados: cuidados.slice(0, 1) };
  }

  function moverPerrito(valor) {
    if (valor === avanceMatch) return;
    perrito.classList.toggle('atras', valor < avanceMatch);
    avanceMatch = valor;
    formMatch.style.setProperty('--avance', valor);
    if (!conMovimiento()) return;
    perrito.classList.add('caminando');
    clearTimeout(esperaCamina);
    esperaCamina = setTimeout(() => perrito.classList.remove('caminando'), 820);
  }

  function mostrarPregunta(n, enfocar) {
    pasoMatch = n;
    preguntasMatch.forEach((fieldset, i) => {
      fieldset.hidden = i !== n;
    });
    $('#matchPaso').textContent = `Pregunta ${n + 1} de ${PREGUNTAS.length}`;
    botonMatchAnterior.hidden = n === 0;
    botonMatchVer.hidden = false;
    botonMatchVer.textContent = n === PREGUNTAS.length - 1 ? 'Ver mis compatibles' : 'Siguiente pregunta';
    errorMatch.textContent = '';
    moverPerrito(n / PREGUNTAS.length);
    if (enfocar) {
      const radios = $$('input', preguntasMatch[n]);
      (radios.find(r => r.checked) || radios[0]).focus({ preventScroll: true });
    }
  }

  function lanzarCorazones() {
    if (!conMovimiento()) return;
    const caja = $('#corazones');
    for (let i = 0; i < 16; i++) {
      const corazon = crear('span', 'corazon-vuela');
      const angulo = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
      const distancia = 90 + Math.random() * 170;
      corazon.style.setProperty('--dx', `${(Math.cos(angulo) * distancia).toFixed(0)}px`);
      corazon.style.setProperty('--dy', `${(Math.sin(angulo) * distancia).toFixed(0)}px`);
      corazon.style.setProperty('--giro', `${((Math.random() - 0.5) * 80).toFixed(0)}deg`);
      corazon.style.animationDelay = `${i * 28}ms`;
      corazon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONO_CORAZON}" fill="currentColor"/></svg>`;
      corazon.addEventListener('animationend', () => corazon.remove());
      caja.append(corazon);
    }
  }

  function pintarResultados(respuestas) {
    const top = MASCOTAS.map(m => puntuar(m, respuestas)).sort((a, b) => b.porcentaje - a.porcentaje || diasEsperando(b.m) - diasEsperando(a.m)).slice(0, 3);
    $('#matchLista').replaceChildren(...top.map((res, i) => {
      const tarjeta = crear('article', 'match-tarjeta');
      tarjeta.style.setProperty('--i', i);
      const img = crear('img', 'match-tarjeta__img');
      img.src = `../img/${res.m.id}.svg`;
      img.alt = res.m.alt;
      img.width = 96;
      img.height = 96;
      const cuerpo = crear('div');
      const cabeza = crear('div', 'match-tarjeta__cabeza');
      const anillo = crear('div', 'anillo');
      anillo.setAttribute('role', 'img');
      anillo.setAttribute('aria-label', `${res.porcentaje} % compatible`);
      anillo.append(crear('span', '', `${res.porcentaje}%`));
      cabeza.append(crear('h4', '', res.m.nombre), anillo);
      const lista = crearLista('', [...res.motivos, ...res.cuidados.map(c => `Ojo: ${c.charAt(0).toLowerCase()}${c.slice(1)}`)]);
      cuerpo.append(cabeza, lista, crearBotonFicha(res.m, 'boton boton--linea'));
      tarjeta.append(img, cuerpo);
      requestAnimationFrame(() => requestAnimationFrame(() => anillo.style.setProperty('--p', res.porcentaje)));
      return tarjeta;
    }));
    resultadosMatch.hidden = false;
    resultadosMatch.focus({ preventScroll: true });
    resultadosMatch.scrollIntoView({ behavior: conMovimiento() ? 'smooth' : 'auto', block: 'nearest' });
    lanzarCorazones();
  }

  formMatch.addEventListener('pointerdown', () => {
    ultimoPuntero = performance.now();
  });

  formMatch.addEventListener('change', evento => {
    errorMatch.textContent = '';
    if (!evento.target.matches('input[type="radio"]') || performance.now() - ultimoPuntero > 900) return;
    clearTimeout(esperaAvance);
    esperaAvance = setTimeout(() => {
      if (pasoMatch < PREGUNTAS.length - 1) mostrarPregunta(pasoMatch + 1, true);
      else formMatch.requestSubmit();
    }, conMovimiento() ? 420 : 0);
  });

  formMatch.addEventListener('submit', evento => {
    evento.preventDefault();
    clearTimeout(esperaAvance);
    if (!formMatch.elements[PREGUNTAS[pasoMatch]].value) {
      errorMatch.textContent = 'Elige una respuesta para seguir.';
      $('input', preguntasMatch[pasoMatch]).focus();
      return;
    }
    if (pasoMatch < PREGUNTAS.length - 1) {
      mostrarPregunta(pasoMatch + 1, true);
      return;
    }
    const faltante = PREGUNTAS.findIndex(p => !formMatch.elements[p].value);
    if (faltante >= 0) {
      mostrarPregunta(faltante, true);
      errorMatch.textContent = 'Falta responder esta pregunta.';
      return;
    }
    const respuestas = Object.fromEntries(PREGUNTAS.map(p => [p, formMatch.elements[p].value]));
    moverPerrito(1);
    $('#matchPaso').textContent = 'Listo, ya llegó a casa';
    const terminar = () => {
      if (conMovimiento()) perrito.classList.add('feliz');
      pintarResultados(respuestas);
    };
    if (conMovimiento()) setTimeout(terminar, 820);
    else terminar();
  });

  perrito.addEventListener('animationend', evento => {
    if (evento.target === perrito) perrito.classList.remove('feliz');
  });

  botonMatchAnterior.addEventListener('click', () => {
    if (pasoMatch > 0) mostrarPregunta(pasoMatch - 1, true);
  });

  $('#matchOtra').addEventListener('click', () => {
    formMatch.reset();
    resultadosMatch.hidden = true;
    mostrarPregunta(0, false);
    formMatch.scrollIntoView({ behavior: conMovimiento() ? 'smooth' : 'auto', block: 'nearest' });
    $('input', preguntasMatch[0]).focus({ preventScroll: true });
  });

  mostrarPregunta(0, false);

  const camino = $('#camino');
  const caminoSvg = $('#caminoSvg');
  const caminoBase = $('#caminoBase');
  const caminoTrazo = $('#caminoTrazo');
  const pasosCamino = $$('.camino__paso', camino);
  const huellasCamino = document.createElementNS(SVG_NS, 'g');
  huellasCamino.setAttribute('class', 'camino__huellas');
  caminoSvg.append(huellasCamino);
  let datosCamino = null;

  function trazarCamino() {
    const caja = camino.getBoundingClientRect();
    if (!caja.width) return;
    caminoSvg.setAttribute('viewBox', `0 0 ${caja.width.toFixed(1)} ${caja.height.toFixed(1)}`);
    const puntos = pasosCamino.map(paso => {
      const r = $('.camino__punto', paso).getBoundingClientRect();
      return { x: r.left + r.width / 2 - caja.left, y: r.top + r.height / 2 - caja.top };
    });
    let d = `M${puntos[0].x.toFixed(1)} ${puntos[0].y.toFixed(1)}`;
    for (let i = 1; i < puntos.length; i++) {
      const a = puntos[i - 1];
      const b = puntos[i];
      const dy = (b.y - a.y) * 0.55;
      d += ` C${a.x.toFixed(1)} ${(a.y + dy).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - dy).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    caminoBase.setAttribute('d', d);
    caminoTrazo.setAttribute('d', d);
    const largo = caminoTrazo.getTotalLength();
    caminoTrazo.style.strokeDasharray = `${largo} ${largo}`;

    const muestras = [];
    for (let i = 0; i <= 160; i++) {
      const l = (largo * i) / 160;
      muestras.push({ l, y: caminoTrazo.getPointAtLength(l).y });
    }

    const huellas = [];
    const fragmento = document.createDocumentFragment();
    let lado = 1;
    for (let l = 30; l < largo - 20; l += 46) {
      const p = caminoTrazo.getPointAtLength(l);
      if (puntos.some(q => Math.hypot(q.x - p.x, q.y - p.y) < 50)) continue;
      const q = caminoTrazo.getPointAtLength(Math.min(largo, l + 2));
      const angulo = Math.atan2(q.y - p.y, q.x - p.x);
      lado *= -1;
      const x = p.x - Math.sin(angulo) * 15 * lado;
      const y = p.y + Math.cos(angulo) * 15 * lado;
      const exterior = document.createElementNS(SVG_NS, 'g');
      exterior.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((angulo * 180) / Math.PI + 90).toFixed(1)})`);
      const interior = document.createElementNS(SVG_NS, 'g');
      interior.setAttribute('class', 'camino__huella');
      interior.innerHTML = FORMAS_HUELLA;
      exterior.append(interior);
      fragmento.append(exterior);
      huellas.push({ l, el: interior });
    }
    huellasCamino.replaceChildren(fragmento);
    datosCamino = { largo, muestras, huellas, puntos };
    avanzarCamino();
  }

  function avanzarCamino() {
    if (!datosCamino) return;
    const { largo, muestras, huellas, puntos } = datosCamino;
    const linea = window.innerHeight * 0.62 - camino.getBoundingClientRect().top;
    let visible = largo;
    if (conMovimiento()) {
      if (linea <= muestras[0].y) {
        visible = 0;
      } else if (linea < muestras[muestras.length - 1].y) {
        let i = 1;
        while (i < muestras.length - 1 && muestras[i].y < linea) i++;
        const a = muestras[i - 1];
        const b = muestras[i];
        visible = a.l + (b.l - a.l) * limitar((linea - a.y) / ((b.y - a.y) || 1), 0, 1);
      }
    }
    caminoTrazo.style.strokeDashoffset = (largo - visible).toFixed(1);
    huellas.forEach(h => h.el.classList.toggle('visible', h.l <= visible));
    pasosCamino.forEach((paso, i) => paso.classList.toggle('alcanzado', !conMovimiento() || puntos[i].y <= linea));
  }

  new ResizeObserver(trazarCamino).observe(camino);

  const croquetasG = $('#croquetas');
  const TONOS_CROQUETA = ['#B5652B', '#9C5424', '#C97B3A', '#8A4A1F'];
  const croquetas = [];
  [[80, 72], [72, 90], [64, 100], [56, 96], [48, 84], [40, 70], [32, 54], [25, 38], [18, 20]].forEach(([y, mitad], fila) => {
    const cuantas = Math.max(1, Math.floor((mitad * 2) / 16));
    const deFila = [];
    for (let j = 0; j < cuantas; j++) {
      const x = 130 - mitad + ((j + 0.5) * mitad * 2) / cuantas + (azar(fila, j) - 0.5) * 6;
      const exterior = document.createElementNS(SVG_NS, 'g');
      exterior.setAttribute('transform', `translate(${x.toFixed(1)} ${(y + (azar(j, fila) - 0.5) * 4).toFixed(1)}) rotate(${((azar(fila + 7, j) - 0.5) * 80).toFixed(0)})`);
      const interior = document.createElementNS(SVG_NS, 'g');
      interior.setAttribute('class', 'croqueta fuera');
      interior.innerHTML = `<ellipse rx="7.4" ry="5.2" fill="${TONOS_CROQUETA[Math.floor(azar(j + 3, fila + 5) * TONOS_CROQUETA.length)]}"/><ellipse cx="-1.6" cy="-1.4" rx="2.6" ry="1.4" fill="#fff" opacity=".22"/><circle cx="1.4" cy="1" r="1.3" fill="#5E2F12" opacity=".6"/>`;
      exterior.append(interior);
      deFila.push({ exterior, interior, orden: azar(j + 11, fila) });
    }
    deFila.sort((a, b) => a.orden - b.orden).forEach(c => {
      croquetasG.append(c.exterior);
      croquetas.push(c.interior);
    });
  });

  let croquetasVisibles = 0;
  let platoListo = false;

  function croquetasPara(monto) {
    if (!monto || monto < DONATIVO_MINIMO) return 0;
    const t = limitar((Math.log(monto) - Math.log(DONATIVO_MINIMO)) / (Math.log(80000) - Math.log(DONATIVO_MINIMO)), 0, 1);
    return Math.round(8 + t * (croquetas.length - 8));
  }

  function llenarPlato() {
    if (!platoListo) return;
    const meta = croquetasPara(donacion.monto);
    croquetas.forEach((c, i) => {
      const dentro = i < meta;
      c.style.transitionDelay = dentro && i >= croquetasVisibles && conMovimiento() ? `${(i - croquetasVisibles) * 16}ms` : '0ms';
      c.classList.toggle('fuera', !dentro);
    });
    croquetasVisibles = meta;
  }

  const IMPACTO = [
    [1000, 'compra una pipeta contra pulgas y garrapatas'],
    [4000, 'desparasita a tres cachorros'],
    [8000, 'paga el esquema completo de vacunas de un cachorro'],
    [16000, 'cubre la esterilización de una gata'],
    [32000, 'alimenta a seis perros adultos durante un mes'],
    [80000, 'paga una semana de hospitalización']
  ];
  const donacion = { monto: 8000, frecuencia: 'mensual' };

  function pintarDonativo() {
    const { monto, frecuencia } = donacion;
    const boton = $('#donarBoton');
    const impacto = $('#impacto');
    llenarPlato();
    if (!monto || monto < DONATIVO_MINIMO) {
      impacto.textContent = `El donativo mínimo en línea es de ${dinero.format(DONATIVO_MINIMO)}.`;
      boton.textContent = 'Elige un monto';
      boton.setAttribute('aria-disabled', 'true');
      boton.removeAttribute('href');
      return;
    }
    const nivel = IMPACTO.filter(([minimo]) => monto >= minimo).pop();
    const mensual = frecuencia === 'mensual';
    impacto.textContent = mensual
      ? `Cada mes, ${dinero.format(monto)} ${nivel[1]}. Al año son ${dinero.format(monto * 12)}.`
      : `${dinero.format(monto)} ${nivel[1]}.`;
    boton.textContent = `Donar ${dinero.format(monto)}${mensual ? ' al mes' : ''}`;
    boton.removeAttribute('aria-disabled');
    boton.href = `mailto:donativos@laquerencia.org.mx?subject=${encodeURIComponent(`Quiero donar ${dinero.format(monto)}${mensual ? ' cada mes' : ''}`)}&body=${encodeURIComponent('Hola, quiero hacer un donativo. ¿Me pueden enviar los datos para transferir y el recibo deducible?')}`;
  }

  $$('#montos button').forEach(boton => {
    boton.addEventListener('click', () => {
      $$('#montos button').forEach(b => b.setAttribute('aria-checked', String(b === boton)));
      $('#montoOtro').value = '';
      donacion.monto = Number(boton.dataset.monto);
      pintarDonativo();
    });
  });

  $$('#frecuencia button').forEach(boton => {
    boton.addEventListener('click', () => {
      $$('#frecuencia button').forEach(b => b.setAttribute('aria-checked', String(b === boton)));
      donacion.frecuencia = boton.dataset.frecuencia;
      pintarDonativo();
    });
  });

  ['#montos', '#frecuencia'].forEach(sel => {
    $(sel).addEventListener('keydown', evento => {
      const botones = $$(`${sel} button`);
      const actual = botones.indexOf(document.activeElement);
      const paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[evento.key];
      if (actual < 0 || !paso) return;
      evento.preventDefault();
      const siguiente = botones[(actual + paso + botones.length) % botones.length];
      siguiente.focus();
      siguiente.click();
    });
  });

  $('#montoOtro').addEventListener('input', evento => {
    const valor = Math.round(Number(evento.target.value));
    $$('#montos button').forEach(b => b.setAttribute('aria-checked', String(Number(b.dataset.monto) === valor)));
    donacion.monto = valor || 0;
    pintarDonativo();
  });

  $('#donarBoton').addEventListener('click', evento => {
    if ($('#donarBoton').getAttribute('aria-disabled') === 'true') {
      evento.preventDefault();
      $('#montoOtro').focus();
    }
  });

  pintarDonativo();

  const cierreCampana = new Date('2026-10-31T00:00:00');
  const diasCampana = Math.ceil((cierreCampana - hoy) / 86400000);
  $('#campanaDias').textContent = diasCampana > 1 ? `Faltan ${diasCampana} días.` : diasCampana === 1 ? 'Queda un día.' : 'La campaña cerró; seguimos recibiendo apoyo para su rehabilitación.';
  const barraCampana = $('#campanaBarra');

  const alAparecer = (elemento, accion, umbral = 0.35) => {
    const observador = new IntersectionObserver(entradas => {
      if (!entradas.some(e => e.isIntersecting)) return;
      observador.disconnect();
      accion();
    }, { threshold: umbral });
    observador.observe(elemento);
  };

  function prepararBarra(barra, ancho, retraso) {
    barra.style.width = ancho;
    return () => {
      if (!conMovimiento() || typeof barra.animate !== 'function') return;
      barra.animate([{ width: '0%' }, { width: ancho }], { duration: 1400, delay: retraso, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
    };
  }

  const porcentajeCampana = (Number(barraCampana.getAttribute('aria-valuenow')) / Number(barraCampana.getAttribute('aria-valuemax'))) * 100;
  alAparecer(barraCampana, prepararBarra($('span', barraCampana), `${porcentajeCampana.toFixed(1)}%`, 0), 0.4);

  const crecerNecesidades = $$('.necesidades__lista li').map((li, i) => prepararBarra($('.necesidades__barra span', li), `${limitar(Number(li.dataset.nivel) || 0, 0, 100)}%`, i * 90));
  alAparecer($('.necesidades__lista'), () => crecerNecesidades.forEach(crecer => crecer()), 0.3);

  alAparecer($('.plato'), () => {
    platoListo = true;
    llenarPlato();
  }, 0.5);

  const carrusel = $('#carrusel');
  const historiaPrev = $('#historiaPrev');
  const historiaSig = $('#historiaSig');
  const historias = $$('.historia', carrusel);

  function posicionesCarrusel() {
    const relleno = parseFloat(getComputedStyle(carrusel).scrollPaddingLeft) || 0;
    const maximo = carrusel.scrollWidth - carrusel.clientWidth;
    return historias.map(h => limitar(h.offsetLeft - carrusel.offsetLeft - relleno, 0, maximo));
  }

  function irAHistoria(direccion) {
    const posiciones = posicionesCarrusel();
    const actual = carrusel.scrollLeft;
    const destino = direccion > 0 ? posiciones.find(p => p > actual + 4) : [...posiciones].reverse().find(p => p < actual - 4);
    if (destino === undefined) return;
    carrusel.scrollTo({ left: destino, behavior: conMovimiento() ? 'smooth' : 'auto' });
  }

  function estadoCarrusel() {
    const maximo = carrusel.scrollWidth - carrusel.clientWidth;
    historiaPrev.disabled = carrusel.scrollLeft <= 4;
    historiaSig.disabled = carrusel.scrollLeft >= maximo - 4;
  }

  historiaPrev.addEventListener('click', () => irAHistoria(-1));
  historiaSig.addEventListener('click', () => irAHistoria(1));

  let cuadroCarrusel = 0;
  carrusel.addEventListener('scroll', () => {
    if (cuadroCarrusel) return;
    cuadroCarrusel = requestAnimationFrame(() => {
      cuadroCarrusel = 0;
      estadoCarrusel();
    });
  }, { passive: true });
  window.addEventListener('resize', estadoCarrusel);
  estadoCarrusel();

  let arrastre = null;
  carrusel.addEventListener('pointerdown', evento => {
    if (evento.pointerType !== 'mouse' || evento.button !== 0) return;
    arrastre = { x: evento.clientX, inicio: carrusel.scrollLeft, movido: false, id: evento.pointerId };
  });

  carrusel.addEventListener('pointermove', evento => {
    if (!arrastre) return;
    const dx = evento.clientX - arrastre.x;
    if (!arrastre.movido && Math.abs(dx) > 5) {
      arrastre.movido = true;
      carrusel.classList.add('arrastrando');
      carrusel.setPointerCapture(arrastre.id);
    }
    if (arrastre.movido) carrusel.scrollLeft = arrastre.inicio - dx;
  });

  const soltarCarrusel = () => {
    if (!arrastre) return;
    const { movido, inicio } = arrastre;
    arrastre = null;
    if (!movido) return;
    const actual = carrusel.scrollLeft;
    const posiciones = posicionesCarrusel();
    let destino = posiciones.reduce((mejor, p) => (Math.abs(p - actual) < Math.abs(mejor - actual) ? p : mejor), posiciones[0]);
    if (destino === inicio && Math.abs(actual - inicio) > 40) {
      destino = actual > inicio ? posiciones.find(p => p > inicio + 4) ?? destino : [...posiciones].reverse().find(p => p < inicio - 4) ?? destino;
    }
    carrusel.scrollTo({ left: destino, behavior: conMovimiento() ? 'smooth' : 'auto' });
    setTimeout(() => carrusel.classList.remove('arrastrando'), conMovimiento() ? 450 : 0);
  };
  carrusel.addEventListener('pointerup', soltarCarrusel);
  carrusel.addEventListener('pointercancel', soltarCarrusel);
  carrusel.addEventListener('lostpointercapture', soltarCarrusel);

  const tiras = $$('#tiras .tira');
  const estadoTira = $('#tiraEstado');
  const TELEFONO = '33 2250 1147';

  async function copiarTexto(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      const area = crear('textarea');
      area.value = texto;
      area.setAttribute('readonly', '');
      area.className = 'visually-hidden';
      document.body.append(area);
      area.select();
      let copiado = false;
      try {
        copiado = document.execCommand('copy');
      } catch {
        copiado = false;
      }
      area.remove();
      return copiado;
    }
  }

  tiras.forEach((tira, i) => {
    tira.setAttribute('aria-label', `Arrancar tira y copiar el WhatsApp ${TELEFONO}`);
    tira.addEventListener('click', async () => {
      if (tira.classList.contains('arrancada')) return;
      const teniaFoco = document.activeElement === tira;
      tira.classList.add('arrancada');
      tira.setAttribute('aria-disabled', 'true');
      const restantes = tiras.filter(t => !t.classList.contains('arrancada'));
      const copiado = await copiarTexto(TELEFONO);
      if (teniaFoco && restantes.length) {
        (restantes.find(t => tiras.indexOf(t) > i) || restantes[restantes.length - 1]).focus();
      }
      estadoTira.textContent = copiado
        ? `Copiado: ${TELEFONO}. Mándanos las fotos por WhatsApp.`
        : `Anota el número: ${TELEFONO}. Mándanos las fotos por WhatsApp.`;
      if (!restantes.length) {
        setTimeout(() => {
          tiras.forEach(t => {
            t.classList.remove('arrancada');
            t.removeAttribute('aria-disabled');
          });
          estadoTira.textContent = 'Se acabaron las tiras y pusimos un cartel nuevo.';
        }, 1800);
      }
    });
  });

  const formSol = $('#formSolicitud');
  const pasos = $$('.solicitud__paso', formSol);
  const etapas = $$('#etapas .etapa');
  const botonAnterior = $('#solAnterior');
  const botonSiguiente = $('#solSiguiente');
  const botonEnviar = $('#solEnviar');
  const selectMascota = $('#solMascota');
  let pasoActual = 0;

  MASCOTAS.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')).forEach(m => {
    const opcion = crear('option', '', `${m.nombre}, ${m.especie === 'perro' ? 'perro' : 'gato'} de ${edadTexto(m)}`);
    opcion.value = m.nombre;
    selectMascota.append(opcion);
  });

  function elegirParaSolicitud(id) {
    const m = MASCOTAS.find(x => x.id === id);
    if (!m) return;
    selectMascota.value = m.nombre;
    $('#solicitud').scrollIntoView({ behavior: conMovimiento() ? 'smooth' : 'auto' });
    $('#solicitud .seccion__cabeza p').textContent = `Solicitud para adoptar a ${m.nombre}. Tres pasos cortos; puedes regresar al paso anterior sin perder lo que escribiste.`;
    setTimeout(() => $('input, select, textarea', pasos[pasoActual]).focus({ preventScroll: true }), 650);
  }

  function mostrarPaso(n) {
    pasoActual = n;
    pasos.forEach((p, i) => {
      p.hidden = i !== n;
    });
    etapas.forEach((e, i) => {
      e.classList.toggle('etapa--activa', i === n);
      e.classList.toggle('etapa--hecha', i < n);
      if (i === n) e.setAttribute('aria-current', 'step');
      else e.removeAttribute('aria-current');
    });
    botonAnterior.hidden = n === 0;
    botonSiguiente.hidden = n === pasos.length - 1;
    botonEnviar.hidden = n !== pasos.length - 1;
  }

  function errorDe(campo) {
    const valor = campo.value.trim();
    if (campo.closest('[hidden]')) return '';
    if (campo.type === 'checkbox') return campo.required && !campo.checked ? 'Marca esta casilla para continuar.' : '';
    if (campo.required && !valor) return campo.tagName === 'SELECT' ? 'Elige una opción.' : 'Este dato es obligatorio.';
    if (!valor) return '';
    if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return 'Revisa el correo: debe verse como nombre@correo.com.';
    if (campo.type === 'tel' && valor.replace(/\D/g, '').length < 10) return 'El WhatsApp debe tener 10 dígitos.';
    if (campo.name === 'edad' && Number(valor) < 18) return 'Para adoptar necesitas ser mayor de edad.';
    if (campo.type === 'number') {
      const n = Number(valor);
      if (Number.isNaN(n) || (campo.min && n < Number(campo.min)) || (campo.max && n > Number(campo.max))) return `Escribe un número entre ${campo.min} y ${campo.max}.`;
    }
    if (campo.minLength > 0 && valor.length < campo.minLength) return campo.name === 'porque' ? `Cuéntanos un poco más: faltan ${campo.minLength - valor.length} caracteres.` : `Escribe al menos ${campo.minLength} caracteres.`;
    return '';
  }

  function pintarError(campo, mensaje) {
    const contenedorCampo = campo.closest('.campo');
    const compromiso = campo.type === 'checkbox' && campo.name.startsWith('c');
    const destino = compromiso ? $('#errorCompromiso') : contenedorCampo && contenedorCampo.querySelector('.campo__error');
    if (!destino) return;
    if (compromiso) {
      const pendientes = $$('input[type="checkbox"][name^="c"]', formSol).filter(c => !c.checked).length;
      destino.textContent = pendientes ? 'Marca los tres compromisos para enviar la solicitud.' : '';
    } else {
      destino.textContent = mensaje;
      if (contenedorCampo) contenedorCampo.classList.toggle('campo--error', Boolean(mensaje));
    }
    campo.setAttribute('aria-invalid', String(Boolean(mensaje)));
  }

  function validarPaso(n) {
    let primero = null;
    $$('input:not(.trampa), select, textarea', pasos[n]).forEach(campo => {
      const mensaje = errorDe(campo);
      pintarError(campo, mensaje);
      if (mensaje && !primero) primero = campo;
    });
    if (primero) primero.focus();
    return !primero;
  }

  formSol.addEventListener('input', evento => {
    const campo = evento.target;
    if (campo.getAttribute('aria-invalid') === 'true') pintarError(campo, errorDe(campo));
    if (campo.id === 'solPorque') $('#solPorqueConteo').textContent = campo.value.length;
  });

  formSol.addEventListener('focusout', evento => {
    const campo = evento.target;
    if (campo.matches && campo.matches('input:not([type="checkbox"]):not(.trampa), select, textarea') && campo.value) pintarError(campo, errorDe(campo));
  });

  $('#solTenencia').addEventListener('change', evento => {
    const renta = evento.target.value === 'Rentada';
    $('#campoPermiso').hidden = !renta;
    $('#solPermiso').required = renta;
  });

  botonSiguiente.addEventListener('click', () => {
    if (!validarPaso(pasoActual)) return;
    mostrarPaso(pasoActual + 1);
    $('input, select, textarea', pasos[pasoActual]).focus();
  });

  botonAnterior.addEventListener('click', () => {
    mostrarPaso(pasoActual - 1);
    $('input, select, textarea', pasos[pasoActual]).focus();
  });

  let ultimaSolicitud = null;

  formSol.addEventListener('submit', evento => {
    evento.preventDefault();
    if (pasoActual !== pasos.length - 1) {
      botonSiguiente.click();
      return;
    }
    if (!validarPaso(pasoActual)) return;
    if (formSol.elements.sitio.value) return;
    const d = new FormData(formSol);
    const fecha = new Date();
    const folio = `LQ-${String(fecha.getFullYear()).slice(2)}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;
    const filas = [
      ['Folio', folio],
      ['Quiere adoptar a', d.get('mascota')],
      ['Nombre', d.get('nombre').trim()],
      ['Edad', `${d.get('edad')} años`],
      ['Municipio', d.get('municipio')],
      ['Correo', d.get('correo').trim()],
      ['WhatsApp', d.get('telefono').trim()],
      ['Vivienda', `${d.get('vivienda')}, ${d.get('tenencia').toLowerCase()}`],
      ['Personas en casa', d.get('personas')],
      ['Horas solo al día', d.get('horas')],
      ['Otros animales', d.get('otros').trim() || 'Ninguno'],
      ['Por qué quiere adoptar', d.get('porque').trim()]
    ];
    ultimaSolicitud = { folio, filas };
    $('#folio').textContent = folio;
    const nombre = d.get('nombre').trim().split(' ')[0];
    $('#confirmacionTexto').textContent = d.get('mascota') === 'Sin decidir'
      ? `${nombre}, envía la solicitud y te llamamos en menos de 48 horas para ayudarte a elegir.`
      : `${nombre}, envía la solicitud y te llamamos en menos de 48 horas para agendar la videollamada. Mientras tanto nadie más podrá apartar a ${d.get('mascota')}.`;
    $('#confirmacionDatos').replaceChildren(...filas.flatMap(([c, v]) => [crear('dt', '', c), crear('dd', '', v)]));
    const cuerpo = filas.map(([c, v]) => `${c}: ${v}`).join('\n');
    $('#confirmacionCorreo').href = `mailto:adopciones@laquerencia.org.mx?subject=${encodeURIComponent(`Solicitud de adopción ${folio}`)}&body=${encodeURIComponent(cuerpo)}`;
    formSol.hidden = true;
    $('#etapas').hidden = true;
    const confirmacion = $('#confirmacion');
    confirmacion.hidden = false;
    confirmacion.focus();
  });

  $('#confirmacionDescarga').addEventListener('click', () => {
    if (!ultimaSolicitud) return;
    const texto = ['La Querencia A.C. | Solicitud de adopción', '', ...ultimaSolicitud.filas.map(([c, v]) => `${c}: ${v}`), '', 'Siguiente paso: te llamamos en menos de 48 horas.', 'adopciones@laquerencia.org.mx | WhatsApp 33 2250 1147'].join('\r\n');
    const enlace = crear('a');
    enlace.href = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
    enlace.download = `solicitud-${ultimaSolicitud.folio}.txt`;
    document.body.append(enlace);
    enlace.click();
    setTimeout(() => {
      URL.revokeObjectURL(enlace.href);
      enlace.remove();
    }, 500);
  });

  $('#confirmacionOtra').addEventListener('click', () => {
    formSol.reset();
    $$('.campo__error', formSol).forEach(p => {
      p.textContent = '';
    });
    $$('.campo--error', formSol).forEach(c => c.classList.remove('campo--error'));
    $$('[aria-invalid]', formSol).forEach(c => c.removeAttribute('aria-invalid'));
    $('#campoPermiso').hidden = true;
    $('#solPorqueConteo').textContent = '0';
    $('#confirmacion').hidden = true;
    formSol.hidden = false;
    $('#etapas').hidden = false;
    mostrarPaso(0);
    $('#solNombre').focus();
  });

  mostrarPaso(0);

  function estadoRefugio() {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const dato = tipo => partes.find(p => p.type === tipo).value;
    const semana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dato('weekday'));
    const minutos = (Number(dato('hour')) % 24) * 60 + Number(dato('minute'));
    const finDeSemana = semana === 0 || semana === 6;
    const abierto = finDeSemana && minutos >= 660 && minutos < 960;
    const pie = $('#pieEstado');
    pie.classList.toggle('abierto', abierto);
    if (abierto) pie.textContent = 'Abierto a visitas ahora';
    else if (semana === 6 && minutos >= 960) pie.textContent = 'Cerrado ahora, abrimos mañana a las 11:00';
    else if (finDeSemana && minutos < 660) pie.textContent = 'Abrimos hoy a las 11:00';
    else pie.textContent = 'Hoy solo con cita de adopción';
  }

  estadoRefugio();
  setInterval(estadoRefugio, 60000);

  const observadorVista = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.target === portada) vista.portada = entrada.isIntersecting;
      if (entrada.target === seccionAdopta) vista.adopta = entrada.isIntersecting;
      if (entrada.target === camino) vista.camino = entrada.isIntersecting;
    });
    alDesplazar();
  }, { rootMargin: '120px 0px' });
  [portada, seccionAdopta, camino].forEach(el => observadorVista.observe(el));

  let cuadroDesplazamiento = 0;
  function alDesplazar() {
    cabecera.classList.toggle('con-sombra', window.scrollY > 8);
    if (vista.adopta) moverFondo();
    if (vista.camino) avanzarCamino();
  }

  window.addEventListener('scroll', () => {
    if (cuadroDesplazamiento) return;
    cuadroDesplazamiento = requestAnimationFrame(() => {
      cuadroDesplazamiento = 0;
      alDesplazar();
    });
  }, { passive: true });

  movimientoReducido.addEventListener('change', () => {
    fondo.desfase = 0;
    dibujarFondo();
    avanzarCamino();
    llenarPlato();
  });
})();
