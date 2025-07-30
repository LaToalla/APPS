const firebaseConfig = {
  // 🔧 AÑADE TUS CREDENCIALES DE FIREBASE AQUÍ
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const nombres = [
  "Raquel", "Andrea", "Vanesa", "Amaia", "Arantza", "Beatriz",
  "Irantzu", "Saray", "Iranzu", "Uxue", "Txini", "Edurne"
];

const listaDiv = document.getElementById("lista");
const fechaLabel = document.getElementById("fechaLabel");
let dias = ["2024-07-24", "2024-07-25", "2024-07-26", "2024-07-27", "2024-07-28", "2024-07-29"];
let indiceDia = 0;
let fechaActual = dias[indiceDia];

function cambiarDia(direccion) {
  indiceDia += direccion;
  if (indiceDia < 0) indiceDia = 0;
  if (indiceDia >= dias.length) indiceDia = dias.length - 1;
  fechaActual = dias[indiceDia];
  fechaLabel.textContent = fechaActual.slice(8) + "/7 Evento";
  cargarDatos();
}

function irAInicio() {
  indiceDia = 0;
  fechaActual = dias[0];
  fechaLabel.textContent = fechaActual.slice(8) + "/7 Evento";
  cargarDatos();
}

function crearFila(nombre) {
  const fila = document.createElement("div");
  fila.className = "fila";

  const nombreDiv = document.createElement("div");
  nombreDiv.className = "nombre";
  nombreDiv.textContent = nombre;

  const controles = document.createElement("div");
  controles.className = "controles";

  ["adulto", "nino"].forEach(tipo => {
    const grupo = document.createElement("div");
    grupo.className = "grupo";

    const menos = document.createElement("button");
    menos.textContent = "−";

    const contador = document.createElement("span");
    contador.className = "contador " + tipo;
    contador.textContent = "0";

    const mas = document.createElement("button");
    mas.textContent = "+";

    menos.onclick = () => {
      let val = parseInt(contador.textContent);
      if (val > 0) {
        val--;
        contador.textContent = val;
        guardarEnFirebase(nombre, tipo, val);
      }
    };

    mas.onclick = () => {
      let val = parseInt(contador.textContent);
      val++;
      contador.textContent = val;
      guardarEnFirebase(nombre, tipo, val);
    };

    grupo.appendChild(menos);
    grupo.appendChild(contador);
    grupo.appendChild(mas);
    controles.appendChild(grupo);
  });

  fila.appendChild(nombreDiv);
  fila.appendChild(controles);
  listaDiv.appendChild(fila);
}

function guardarEnFirebase(nombre, tipo, valor) {
  db.ref(`asistentes/${fechaActual}/${nombre}/${tipo}`).set(valor);
}

function cargarDatos() {
  listaDiv.innerHTML = "";
  nombres.forEach(crearFila);

  db.ref("asistentes/" + fechaActual).on("value", snapshot => {
    const datos = snapshot.val();
    if (!datos) return;

    document.querySelectorAll(".fila").forEach(fila => {
      const nombre = fila.querySelector(".nombre").textContent;
      const adultoSpan = fila.querySelector(".contador.adulto");
      const ninoSpan = fila.querySelector(".contador.nino");

      const persona = datos[nombre];
      adultoSpan.textContent = persona?.adulto ?? "0";
      ninoSpan.textContent = persona?.nino ?? "0";
    });

    actualizarTotales();
  });
}

function actualizarTotales() {
  let totalAdultos = 0, totalNinos = 0;
  document.querySelectorAll(".contador.adulto").forEach(el => totalAdultos += parseInt(el.textContent));
  document.querySelectorAll(".contador.nino").forEach(el => totalNinos += parseInt(el.textContent));
  document.getElementById("totalAdultos").textContent = totalAdultos;
  document.getElementById("totalNinos").textContent = totalNinos;
}

fechaLabel.textContent = fechaActual.slice(8) + "/7 Evento";
nombres.forEach(crearFila);
cargarDatos();