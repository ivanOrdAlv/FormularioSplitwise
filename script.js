//Creo la clase Usuario
class Usuario {
  constructor(nombre, pathImg) {
    this.nombre = nombre;
    this.gastos = [];
    this.pathImg = pathImg;
    this.balance = 0;
  }

  addGasto(gasto) {
    this.gastos.push(gasto);
    this.balance += gasto.monto;
  }

  getBalance() {
    return this.balance;
  }
}

//Creo la clase Gasto
class Gasto {
  constructor(titulo, monto, fecha) {
    this.titulo = titulo;
    this.monto = monto;
    this.fecha = fecha;
  }
}

//Creo los usuarios
const usuarios = [
  new Usuario('Juan', 'img/usuarios/avatar_a.jpg'),
  new Usuario('Pablo', 'img/usuarios/avatar_b.jpg'),
  new Usuario('Maria', 'img/usuarios/avatar_c.jpg')
];

// Valido el formulario
document.getElementById('usuario').addEventListener('blur', validarCampoUsuario);
document.getElementById('titulo').addEventListener('blur', validarCampoTitulo);
document.getElementById('importe').addEventListener('blur', validarCampoImporte);
document.getElementById('fecha').addEventListener('blur', validarCampoFecha);

//Función para validar el campo "usuario"
function validarCampoUsuario() {
  const usuario = document.getElementById('usuario');
  if (usuario.value === "") {
    usuario.classList.add('invalid');
    usuario.classList.remove('valid');
  } else {
    usuario.classList.remove('invalid');
    usuario.classList.add('valid');
  }
}

//Función para validar el campo "título"
function validarCampoTitulo() {
  const titulo = document.getElementById('titulo');
  const tituloRegex = /^[A-Za-z0-9\s]{1,20}$/; 
  if (!tituloRegex.test(titulo.value)) {
    titulo.classList.add('invalid');
    titulo.classList.remove('valid');
  } else {
    titulo.classList.remove('invalid');
    titulo.classList.add('valid');
  }
}

//Función para validar el campo "importe"
function validarCampoImporte() {
  const importe = document.getElementById('importe');
  const importeRegex = /^\d+(\.\d{1,2})?$/;
  const valor = parseFloat(importe.value);

  if (!importeRegex.test(importe.value) || valor < 0 || valor > 1000) {
    importe.classList.add('invalid');
    importe.classList.remove('valid');
  } else {
    importe.classList.remove('invalid');
    importe.classList.add('valid');
  }
}

//Función para validar el campo "fecha"
function validarCampoFecha() {
  const fecha = document.getElementById('fecha');
  const fechaRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!fechaRegex.test(fecha.value)) {
    fecha.classList.add('invalid');
    fecha.classList.remove('valid');
  } else {
    fecha.classList.remove('invalid');
    fecha.classList.add('valid');
  }
}

//Valido todo el formulario
function validarFormulario() {
  validarCampoUsuario();
  validarCampoTitulo();
  validarCampoImporte();
  validarCampoFecha();

  const esValido = document.querySelectorAll('.invalid').length === 0;
  return esValido;
}

//Actualizo la pestaña resumen
function actualizarResumen(usuario, gasto) {
  const resumen = document.getElementById('resumenGastos');
  const nuevoDiv = document.createElement('div');
  nuevoDiv.className = 'card mb-3';

  nuevoDiv.innerHTML = `
    <div class="row g-0">
      <div class="col-md-2">
        <img src="${usuario.pathImg}" class="img-fluid rounded-start">
      </div>
      <div class="col-md-10">
        <div class="card-body">
          <h5 class="card-title">${usuario.nombre}</h5>
          <p class="card-text">Pagó ${gasto.monto}€ el ${gasto.fecha} con motivo "${gasto.titulo}".</p>
        </div>
      </div>
    </div>
  `;

  resumen.appendChild(nuevoDiv);
}

//Hago una función para hacer las cuentas entre los usuarios
function calcularCuentas() {
  const pagador = document.getElementById('usuario').value; //El usuario que ha pagado
  const importe = parseFloat(document.getElementById('importe').value); //El monto pagado

  // Me aseguro de que el importe es válido
  if (isNaN(importe) || importe <= 0) {
    alert("Por favor, introduce un importe válido.");
    return;
  }
  const numUsuarios = usuarios.length;

  //Cada usuario debe pagar una cantidad igual
  const cantidadPorPersona = importe / numUsuarios;

  //Limpio el anterior listado de cuentas
  const cuentas = document.getElementById('cuentas');
  cuentas.innerHTML = '';

  //Actualizo el balance de cada usuario
  usuarios.forEach(function(usuario) {
    if (usuario.nombre !== pagador) {
      //Lo que cada usuario tiene que darle al pagador
      const debePagar = cantidadPorPersona - usuario.getBalance();
      usuario.balance -= debePagar; 

      //Imprimo por consola cuánto debe pagar cada usuario al pagador, o cuánto ha pagado el pagador en sí
      console.log(`El usuario ${usuario.nombre} debe pagar ${debePagar.toFixed(2)}€ al usuario ${pagador} .`);
    } else {
      
      console.log(`El usuario ${usuario.nombre} ya ha pagado su parte.`);
    }
  });
}

//Hago una función para actualizar las cuentas de cada usuario
function actualizarCuentas() {
  const cuentas = document.getElementById('cuentas');
  cuentas.innerHTML = ''; //Limpio las cuentas anteriores

  usuarios.forEach(usuario => {
    const balanceDiv = document.createElement('div');
    balanceDiv.className = 'card mb-3';
    
    let balanceTexto;

    //Muestro el balance de cada usuario
    if (usuario.getBalance() > 0) {
      balanceTexto = `Ha pagado: ${usuario.getBalance().toFixed(2)}€`;
    } else if (usuario.getBalance() < 0) {
      balanceTexto = `Tiene que pagar: ${Math.abs(usuario.getBalance()).toFixed(2)}€`;//Hago que el número no se vea negativo
    } else {
      balanceTexto = 'Balance: 0€';
    }

    balanceDiv.innerHTML = `
      <div class="row g-0">
        <div class="col-md-2">
          <img src="${usuario.pathImg}" class="img-fluid rounded-start">
        </div>
        <div class="col-md-10">
          <div class="card-body">
            <h5 class="card-title">${usuario.nombre}</h5>
            <p class="card-text">${balanceTexto}</p>
          </div>
        </div>
      </div>
    `;

    cuentas.appendChild(balanceDiv);
  });
}

//Envío el formulario
document.getElementById('gastoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const usuarioSeleccionado = document.getElementById('usuario').value;

  if (validarFormulario()) {
    const titulo = document.getElementById('titulo').value;
    const importe = parseFloat(document.getElementById('importe').value);
    const fecha = document.getElementById('fecha').value;

    const usuario = usuarios.find(user => user.nombre === usuarioSeleccionado);
    const nuevoGasto = new Gasto(titulo, importe, fecha);
    usuario.addGasto(nuevoGasto);

    actualizarResumen(usuario, nuevoGasto);
    calcularCuentas();  //Calculo las cuentas entre usuarios
    actualizarCuentas(); //Actualizo el balance de cada usuario

    //Limpio el formulario
    this.reset();
    document.querySelectorAll('.valid').forEach(input => input.classList.remove('valid'));
  }
});
