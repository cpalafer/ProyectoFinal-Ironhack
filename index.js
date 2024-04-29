//VARIABLES GLOBALES 
// Obtener el tablero y los elementos de la interfaz de usuario
const tablero = document.getElementById('tablero');
const mensajebarcos = document.getElementById('mensajebarcos');
const reiniciarBtn = document.getElementById('reiniciar-btn');

// Dimensiones del tablero
const boardSize = 10;

// Matriz para representar el tablero del jugador
let playerBoard = [];

//
// Función para alternar la visibilidad del texto, de las instrucciones
//

function toggleTexto() {
    var elemento = document.getElementById("instrucciones");
    if (elemento.style.display === "none") {
        elemento.style.display = "block"; // Mostrar el texto
    } else {
        elemento.style.display = "none"; // Ocultar el texto
    }
}

// GESTIÓN DEL TEMPORIZADOR

//Definimos una variable para el tiempo restante
let tiempoRestante = 180; // Tiempo en segundos que va a quedar

//Inicializamos y ejecutamos el temporizador
// Inicializar el temporizador
actualizarTemporizador(); // Actualiza el temporizador inicialmente
let temporizador = setInterval(actualizarTemporizador, 1000); // Actualiza cada segundo. función asíncrona en segundo plano

// Event listener para reiniciar el juego al hacer clic en el botón
reiniciarBtn.addEventListener('click', reiniciarJuego);

// Inicializar el juego al cargar la página
window.onload = reiniciarJuego;

//Creamos una función para actualizar el temporizador 
function actualizarTemporizador() {
  const tiempoMostrado = document.getElementById('tiempo-restante');
  tiempoMostrado.textContent = `Tiempo restante: ${tiempoRestante} segundos`;

  if (tiempoRestante === 0) {
    tiempoAgotado(); // Llama a la función para manejar el tiempo agotado y que se escriba el mensaje de tiempo agotado
    clearInterval(temporizador); // Detiene el temporizador
  } else {
    tiempoRestante--; // Reduce el tiempo restante en 1 segundo
  }
}




// Lógica del juego (incluyendo inicialización, disparos, verificaciónBarcosDestruidos, tiempoAgotado y actualizarTemporizador)

// Función para inicializar el tablero del jugador con agua en todas las celdas
function inicializarTablero() {
  playerBoard = [];
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(0); // 0 representa agua
    }
    playerBoard.push(row);
  }
}

// Función para colocar los barcos en el tablero de forma aleatoria
function colocarBarcos() {
  // Barcos disponibles con sus tamaños respectivos
  const ships = [
    { size: 4, count: 1 },
    { size: 3, count: 2 },
    { size: 2, count: 3 },
    { size: 1, count: 4 }
  ];

  // Iterar sobre los barcos
  for (let ship of ships) {
    for (let i = 0; i < ship.count; i++) {
      let placed = false;
      while (!placed) {
        // Generar posición y dirección aleatoria para el barco
        let row = Math.floor(Math.random() * boardSize);
        let col = Math.floor(Math.random() * boardSize);
        let direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        // Verificar si el barco puede ser colocado en esa posición
        if (puedeColocarBarco(row, col, direction, ship.size)) {
          colocarBarco(row, col, direction, ship.size);
          placed = true;
        }
      }
    }
  }
}

// Función para verificar si un barco puede ser colocado en una posición específica
function puedeColocarBarco(row, col, direction, size) {
  if (direction === 'horizontal' && col + size > boardSize) {
    return false;
  }
  if (direction === 'vertical' && row + size > boardSize) {
    return false;
  }
  for (let i = 0; i < size; i++) {
    if (direction === 'horizontal' && playerBoard[row][col + i] !== 0) {
      return false;
    }
    if (direction === 'vertical' && playerBoard[row + i][col] !== 0) {
      return false;
    }
  }
  return true;
}

// Función para colocar un barco en una posición específica
function colocarBarco(row, col, direction, size) {
  if (direction === 'horizontal') {
    for (let i = 0; i < size; i++) {
      playerBoard[row][col + i] = 1; // 1 representa un barco
    }
  } else {
    for (let i = 0; i < size; i++) {
      playerBoard[row + i][col] = 1; // 1 representa un barco
    }
  }
}

// Función para inicializar el tablero con barcos y agua
function inicializarTableroConBarcos() {
  inicializarTablero();
  colocarBarcos();
}

// Función para manejar el clic en una celda
function disparar(event) {
  const row = parseInt(event.target.dataset.row); // devuelve la fila clickada 
  const col = parseInt(event.target.dataset.col); // devuelve la columna clickada
 console.log(verificarBarcosDestruidos()); // linea de depuración
  if (playerBoard[row][col] === 1) {
    event.target.classList.add('ship');
    mensajebarcos.innerText = '¡Has golpeado un barco!';
    playerBoard[row][col] = 0;
    console.log(verificarBarcosDestruidos()); // linea de depuración
    console.log(playerBoard[row][col]); // linea de depuración
    if (verificarBarcosDestruidos()) {
      mostrarMensajeFinalizacion();
      clearInterval(temporizador);
    }
  } else {
    event.target.classList.add('miss');
    mensajebarcos.innerText = 'Agua... No has golpeado ningún barco.';
  }
  // Desactivar el evento de clic para evitar disparos repetidos en la misma celda
  event.target.onclick = null;
}

function reiniciarJuego() {
  tablero.innerHTML = ''; // Limpiar el tablero
  mensajebarcos.innerText = ''; // Limpiar mensajebarcos
  mensajetiempo.innerText = ''; // Limpiar mensajebarcos
  mensajefelicitacion.innerText = ''; // Limpiar mensaje
  inicializarTableroConBarcos(); // Iniciar nuevo juego
  // Generar celdas del tablero
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const celula = document.createElement('div');
      celula.className = 'grid-item';
      celula.dataset.row = i;
      celula.dataset.col = j;
      celula.onclick = disparar;
      tablero.appendChild(celula);
    }
  }
  // Reiniciar el temporizador
  clearInterval(temporizador);
  tiempoRestante = 180;
  actualizarTemporizador(); // Actualiza el temporizador inicialmente
  temporizador = setInterval(actualizarTemporizador, 1000); // Reinicia el temporizador
}


function verificarBarcosDestruidos() { 
  let barcosDestruidos = true;
  //console.log("estoy en verificarBarcosDestruidos");
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (playerBoard[i][j] === 1) {
        //console.log("he encontrado un barco no destruido")
        barcosDestruidos = false;
        break;
      }
    }
    if (!barcosDestruidos) {
      break;
    }
  }
  return barcosDestruidos; // devuelve true si todos hundidos y false si quedan barcos 
}

// Función para mostrar mensaje de felicitación y detener el temporizador
function mostrarMensajeFinalizacion() {
  clearInterval(temporizador); // Detener el temporizador
  const tiempoFinalizacion = 180 - tiempoRestante; // Calcular el tiempo de finalización
  const mensajefelicitacion = `¡Enhorabuena! Has destruido todos los barcos enemigos en ${tiempoFinalizacion} segundos.`;
  document.getElementById('mensajefelicitacion').textContent = mensajefelicitacion;
}

// Función para manejar el tiempo agotado (y la posible victoria)
function tiempoAgotado() {
  clearInterval(temporizador); // Detener el temporizador
  if (!verificarBarcosDestruidos()) {
    // Si no se han destruido todos los barcos, mostrar mensaje de tiempo agotado
    document.getElementById('mensajetiempo').textContent = '¡Tiempo agotado! No lograste encontrar todos los barcos a tiempo.';
  }
}

