
// A. ESTRUCTURA DE DADES (PARELLES REALS)
// Array d'objectes que defineix les parelles correctes.
const PAREJAS_FAMILIA = [
  { padre: '1.jpg', hijo: '2.jpg' },
  { padre: '3.jpg', hijo: '4.jpg' },
  { padre: '5.jpg', hijo: '6.jpg' },
  { padre: '7.jpg', hijo: '8.jpg' },
  { padre: '9.jpg', hijo: '10.jpg' },
  { padre: '11.jpg', hijo: '12.jpg' },
  { padre: '13.jpg', hijo: '14.jpg' },
  { padre: '15.jpg', hijo: '16.jpg' },
  { padre: '17.jpg', hijo: '18.jpg' },
  { padre: '19.jpg', hijo: '20.jpg' },
  { padre: '21.jpg', hijo: '22.jpg' },
  { padre: '23.jpg', hijo: '24.jpg' },
  { padre: '25.jpg', hijo: '26.jpg' },
  { padre: '27.jpg', hijo: '28.jpg' },
  { padre: '29.jpg', hijo: '30.jpg' },
  { padre: '31.jpg', hijo: '32.jpg' },
  { padre: '33.jpg', hijo: '34.jpg' },
  { padre: '35.jpg', hijo: '36.jpg' },
  { padre: '37.jpg', hijo: '38.jpg' },
  { padre: '39.jpg', hijo: '40.jpg' },
  { padre: '41.jpg', hijo: '42.jpg' },
  { padre: '43.jpg', hijo: '44.jpg' },
  { padre: '45.jpg', hijo: '46.jpg' },
  { padre: '47.jpg', hijo: '48.jpg' },
  { padre: '49.jpg', hijo: '50.jpg' },
  { padre: '51.jpg', hijo: '52.jpg' },
  { padre: '53.jpg', hijo: '54.jpg' },
  { padre: '55.jpg', hijo: '56.jpg' },
  { padre: '57.jpg', hijo: '58.jpg' },
  { padre: '59.jpg', hijo: '60.jpg' },
  { padre: '61.jpg', hijo: '62.jpg' },
  // AFEGEIX TANTES PARELLES COM NECESSITES
];

// B. VARIABLES D'ESTAT
let puntuacion = 0;
let parejasPendientes = [...PAREJAS_FAMILIA]; // Còpia de les parelles per gestionar les rondes
let rondaActual; // Guarda l'objecte parella de la ronda actual
let hijoSeleccionado = null;

// C. REFERÈNCIES DEL DOM
const fotoPadreEl = document.getElementById('foto-padre');
const cuadriculaOpcionesEl = document.getElementById('cuadricula-opciones');
const puntuacionEl = document.getElementById('puntuacion');
const btnComprobarEl = document.getElementById('btn-comprobar');

// D. FUNCIONS PRINCIPALS
// Inicialitza la següent ronda
function iniciarRonda() {
  if (parejasPendientes.length === 0) {
    mostrarResultadoFinal();
    return;
  }
  // 1. Reinicia l'estat
  hijoSeleccionado = null;
  cuadriculaOpcionesEl.innerHTML = '';
  btnComprobarEl.disabled = true;

  // 2. Tria una parella aleatòria per a la ronda
  const indiceAleatorio = Math.floor(Math.random() * parejasPendientes.length);
  rondaActual = parejasPendientes[indiceAleatorio];

  // 3. Crea el conjunt d'opcions (fills)
  const hijoCorrecto = rondaActual.hijo;
  // Aconsegueix tres fills "distractors" a l'atzar
  const todosLosHijos = PAREJAS_FAMILIA.map(p => p.hijo);
  const distractores = todosLosHijos.filter(h => h !== hijoCorrecto);
  // Barregem i n'agafem 3 (o els que vullgues)
  shuffleArray(distractores);
  const opciones = [hijoCorrecto, ...distractores.slice(0, 3)]; // 4 opcions en total (1 correcte + 3 distractors)

  // 4. Barreja les opcions abans de mostrar-les
  shuffleArray(opciones);

  // 5. Mostra la foto del pare
  fotoPadreEl.src = `images/${rondaActual.padre}`;

  // 6. Mostra les opcions de fills
  opciones.forEach(hijoFileName => {
    const img = document.createElement('img');
    img.src = `images/${hijoFileName}`;
    img.alt = 'Opció de fill/a';
    img.className = 'opcion-foto';
    img.dataset.hijoId = hijoFileName; // Guardem el nom del fitxer com a ID
    img.addEventListener('click', manejarSeleccion);
    cuadriculaOpcionesEl.appendChild(img);
  });
}

// Gestiona el clic en una foto de fill
function manejarSeleccion(event) {
  // 1. Neteja seleccions prèvies (lleva la vora blava de totes)
  document.querySelectorAll('.opcion-foto').forEach(img => {
    img.classList.remove('seleccionada');
  });
  // 2. Marca la foto clicada
  event.target.classList.add('seleccionada');
  hijoSeleccionado = event.target.dataset.hijoId;
  // 3. Habilita el botó de comprovació
  btnComprobarEl.disabled = false;
}

// S'executa en prémer "Comprovar Parella"
function comprobarRespuesta() {
  if (!hijoSeleccionado) return; // No fer res si no s'ha seleccionat res
  const esCorrecto = hijoSeleccionado === rondaActual.hijo;
  const mensajeEl = document.createElement('p');
  mensajeEl.style.textAlign = 'center';

  if (esCorrecto) {
    puntuacion++;
    puntuacionEl.textContent = puntuacion;
    mensajeEl.textContent = 'Correcte! ✅';
    mensajeEl.style.color = 'green';
  } else {
    mensajeEl.textContent = `Incorrecte. ❌ El pare de la foto és de ${rondaActual.hijo.replace('.jpg', '')}.`;
    mensajeEl.style.color = 'red';
  }

  // Lleva la parella ja jugada de l'array pendent
  parejasPendientes = parejasPendientes.filter(p => p.padre !== rondaActual.padre);

  // Mostra el resultat breument
  cuadriculaOpcionesEl.innerHTML = '';
  cuadriculaOpcionesEl.appendChild(mensajeEl);

  // Deshabilita el botó i prepara la següent ronda després d'un moment
  btnComprobarEl.disabled = true;
  btnComprobarEl.textContent = 'Següent Parella...';
  setTimeout(() => {
    btnComprobarEl.textContent = 'Comprovar Parella';
    iniciarRonda();
  }, 2000); // 2 segons abans de passar a la següent ronda
}

// Mostra el resultat final del joc
function mostrarResultadoFinal() {
  cuadriculaOpcionesEl.innerHTML = `
    <div style="text-align: center; padding: 50px;">
      <h2>Joc Terminat! 🥳</h2>
      <p>Has aconseguit un total de <strong>${puntuacion} encerts</strong>.</p>
      <button onclick="window.location.reload()">Tornar a Jugar</button>
    </div>
  `;
  fotoPadreEl.style.display = 'none';
  btnComprobarEl.style.display = 'none';
}

// E. UTILITAT (Barreja d'arrays - Algoritme de Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// F. ESDEVENIMENTS
btnComprobarEl.addEventListener('click', comprobarRespuesta);

// G. INICI DEL JOC
document.addEventListener('DOMContentLoaded', iniciarRonda);
