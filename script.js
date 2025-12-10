// A. ESTRUCTURA DE DATOS (PAREJAS REALES)
// El array de objetos que define las parejas correctas.
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
    // AÑADE TANTAS PAREJAS COMO NECESITES
];

// B. VARIABLES DE ESTADO
let puntuacion = 0;
let parejasPendientes = [...PAREJAS_FAMILIA]; // Copia de las parejas para gestionar las rondas
let rondaActual; // Almacena el objeto pareja de la ronda actual
let hijoSeleccionado = null;

// C. REFERENCIAS DEL DOM
const fotoPadreEl = document.getElementById('foto-padre');
const cuadriculaOpcionesEl = document.getElementById('cuadricula-opciones');
const puntuacionEl = document.getElementById('puntuacion');
const btnComprobarEl = document.getElementById('btn-comprobar');

// D. FUNCIONES PRINCIPALES

// Función para inicializar la siguiente ronda
function iniciarRonda() {
    if (parejasPendientes.length === 0) {
        mostrarResultadoFinal();
        return;
    }

    // 1. Resetear el estado
    hijoSeleccionado = null;
    cuadriculaOpcionesEl.innerHTML = '';
    btnComprobarEl.disabled = true;

    // 2. Elegir una pareja aleatoria para la ronda
    const indiceAleatorio = Math.floor(Math.random() * parejasPendientes.length);
    rondaActual = parejasPendientes[indiceAleatorio];

    // 3. Crear el set de opciones (Hijos)
    const hijoCorrecto = rondaActual.hijo;
    
    // Conseguir tres hijos 'distractores' al azar
    const todosLosHijos = PAREJAS_FAMILIA.map(p => p.hijo);
    const distractores = todosLosHijos.filter(h => h !== hijoCorrecto);
    
    // Mezclamos y cogemos 3 (o los que quieras)
    shuffleArray(distractores); 
    const opciones = [hijoCorrecto, ...distractores.slice(0, 3)]; // 4 opciones en total (1 correcto + 3 distractores)

    // 4. Barajar las opciones antes de mostrarlas
    shuffleArray(opciones);

    // 5. Mostrar la foto del padre
    fotoPadreEl.src = `images/${rondaActual.padre}`;

    // 6. Mostrar las opciones de hijos
    opciones.forEach(hijoFileName => {
        const img = document.createElement('img');
        img.src = `images/${hijoFileName}`;
        img.alt = 'Opción de hijo/a';
        img.className = 'opcion-foto';
        img.dataset.hijoId = hijoFileName; // Guardamos el nombre del archivo como ID
        img.addEventListener('click', manejarSeleccion);
        cuadriculaOpcionesEl.appendChild(img);
    });
}

// Maneja el clic en una foto de hijo
function manejarSeleccion(event) {
    // 1. Limpiar selecciones previas (quita el borde azul de todas)
    document.querySelectorAll('.opcion-foto').forEach(img => {
        img.classList.remove('seleccionada');
    });

    // 2. Marcar la foto clickeada
    event.target.classList.add('seleccionada');
    hijoSeleccionado = event.target.dataset.hijoId;

    // 3. Habilitar el botón de comprobación
    btnComprobarEl.disabled = false;
}

// Función que se ejecuta al pulsar 'Comprobar Pareja'
function comprobarRespuesta() {
    if (!hijoSeleccionado) return; // No hacer nada si no se ha seleccionado nada

    const esCorrecto = hijoSeleccionado === rondaActual.hijo;
    const mensajeEl = document.createElement('p');
    mensajeEl.style.textAlign = 'center';

    if (esCorrecto) {
        puntuacion++;
        puntuacionEl.textContent = puntuacion;
        mensajeEl.textContent = '¡Correcto! ✅';
        mensajeEl.style.color = 'green';
    } else {
        mensajeEl.textContent = `Incorrecto. ❌ El padre de la foto es de ${rondaActual.hijo.replace('.jpg', '')}.`;
        mensajeEl.style.color = 'red';
    }

    // Quitar la pareja ya jugada del array pendiente
    parejasPendientes = parejasPendientes.filter(p => p.padre !== rondaActual.padre);
    
    // Mostrar el resultado brevemente
    cuadriculaOpcionesEl.innerHTML = '';
    cuadriculaOpcionesEl.appendChild(mensajeEl);
    
    // Deshabilitar botón y preparar la siguiente ronda después de un momento
    btnComprobarEl.disabled = true;
    btnComprobarEl.textContent = 'Siguiente Pareja...';
    setTimeout(() => {
        btnComprobarEl.textContent = 'Comprobar Pareja';
        iniciarRonda();
    }, 2000); // 2 segundos antes de pasar a la siguiente ronda
}

// Muestra el resultado final del juego
function mostrarResultadoFinal() {
    cuadriculaOpcionesEl.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <h2>¡Juego Terminado! 🥳</h2>
            <p>Has conseguido un total de <strong>${puntuacion} aciertos</strong>.</p>
            <button onclick="window.location.reload()">Volver a Jugar</button>
        </div>
    `;
    fotoPadreEl.style.display = 'none';
    btnComprobarEl.style.display = 'none';
}

// E. UTILIDAD (Función para mezclar arrays - Algoritmo de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// F. EVENT LISTENERS
btnComprobarEl.addEventListener('click', comprobarRespuesta);

// G. INICIO DEL JUEGO
document.addEventListener('DOMContentLoaded', iniciarRonda);