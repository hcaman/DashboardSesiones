eventListeners();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners(){
  //boton para crear proyecto
  document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
  //boton para una nueva tarea
  document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
  //botones para acciones de las tareas
  document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e){
  e.preventDefault();
  console.log('presionaste');
  //crea un imput para el nombre del nuevo proyecto
  var nuevoProyecto = document.createElement('li');
  nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
  listaProyectos.appendChild(nuevoProyecto);
  //seleccionar el ID con el nuevoProyecto
  var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
  //al presionar enter crea el proyecto
  inputNuevoProyecto.addEventListener('keypress', function(e){
    var tecla =  e.which || e.keyCode;
    if (tecla === 13) {
      guardarProyectoDB(inputNuevoProyecto.value);
      listaProyectos.removeChild(nuevoProyecto);
    }
  });
}

function guardarProyectoDB(nombreProyecto){
  //crear llamado AJAX
  var xhr = new XMLHttpRequest();
  //enviar datos por formdata
  var datos = new FormData();
  datos.append('proyecto', nombreProyecto);
  datos.append('accion', 'crear');
  //abrir la conexion
  xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
  //en la carga
  xhr.onload = function() {
    if (this.status === 200) {
      // obtener datos de la $respuesta
      var respuesta = JSON.parse(xhr.responseText);
      var proyecto = respuesta.nombre_proyecto;
      var id_proyecto = respuesta.id_insertado;
      var tipo = respuesta.tipo;
      var resultado = respuesta.respuesta;
      //comprobar insercion
      if(resultado === 'correcto'){
        //fue exitoso
        if (tipo === 'crear') {
          // se creo nuevo proyecto
          //inyectar en el HTML
          var nuevoProyecto = document.createElement('li');
          nuevoProyecto.innnerHTML = `
              <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                ${proyecto}
              </a>
          `;
          // agregar al HTLM
          listaProyectos.appendChild(nuevoProyecto);
          //enviar alerta
          swal({
            type: 'success',
            title: 'Proyecto nuevo',
            text: 'El proyecto: ' + proyecto + ' se creo correctamente.'
          })
          //redireccionar a la nueva URL del proyecto
          .then(resultado => {
            if (resultado.value) {
              window.location.href = 'index.php?id_proyecto=' + id_proyecto;
            }
});
        } else {
            //se actualizo o se elimino
            console.log('Modificacion o eliminado con exito.');
          }
        } else {
          //hubo un error
          swal({
            type: 'error',
            title: 'Error!',
            text: 'Hubo un error en la creacion'
  });
        }
      }
    }
    xhr.send(datos);
  }
  //enviar el request

//agregar nueva tarea a proyecto actual
function agregarTarea(e){
  e.preventDefault();
  var nombreTarea = document.querySelector('.nombre-tarea').value;
  //validar que el campo tenga algo escrito
  if (nombreTarea === '') {
    swal({
      type: 'error',
      title: 'Error!',
      text: 'Nombre de tarea no puede estar vacia'  });
  } else {
    //la terea tiene algo escrito, insertar php

    // crear llamado a AJAX
    var xhr = new XMLHttpRequest();
    //crear FormData que envia informacion y almacena
    var datos = new FormData();
    datos.append('tarea', nombreTarea);
    datos.append('accion', 'crear');
    datos.append('id_proyecto', document.querySelector('#id_proyecto').value);
    //abrrir la conexion
    xhr.open('POST', 'inc/modelos/modelos-tareas.php', true);
    //ejecutarlo y respuesta
    xhr.onload = function(){
      if (this.status === 200) {
        //todo correcto
        var respuesta = JSON.parse(xhr.responseText);
        //asignar valores
        var resultado = respuesta.respuesta,
          tarea = respuesta.tarea,
          id_insertado = respuesta.id_insertado,
          tipo = respuesta.tipo;


        if (resultado === 'correcto') {
          // se agrego correctamente
          if (tipo === 'crear') {
            // lanzar alerta
            swal({
              type: 'success',
              title: 'Tarea creada',
              text: 'La tarea: ' + tarea + ' se creo correctamente.'
            });
            //seleccionar el parrafo con la lista vacia
            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
            if (parrafoListaVacia.length > 0) {
              document.querySelector('.lista-vacia').remove();
            }
            //construir el templeta
            var nuevaTarea = document.createElement('li');
            // agregar el ID
            nuevaTarea.id = 'tarea:'+id_insertado;
            //agregar clase tareas
            nuevaTarea.classList.add('tarea');
            nuevaTarea.innerHTML = `
            <p>${tarea}</p>
            <div class="acciones">
              <i class="far fa-check-circle"></i>
              <i class="fas fa-trash"></i>
            </div>
            `;
            //agregarlo al HTML
            var listado = document.querySelector('.listado-pendientes ul');
            listado.appendChild(nuevaTarea);
            //limpiar formulario
            document.querySelector('.agregar-tarea').reset;
          }
        } else {
          // hubo un error
          swal({
            type: 'error',
            title: 'Error!',
            text: 'Hubo un error'  });
        }
      }
    }
    // enviar la consulta
    xhr.send(datos);
  }
}

//cambia el estado de las tareas o las eliminado
function accionesTareas(e){
  e.preventDefault();

  if (e.target.classList.contains('fa-check-circle')){
    if (e.target.classList.contains('completo')) {
      e.target.classList.remove('completo');
      cambiarEstadoTarea(e.target, 0);
    } else {
      e.target.classList.add('completo');
      cambiarEstadoTarea(e.target, 1);
    }
  }

  if (e.target.classList.contains('fa-trash')){
    swal({
      title: 'Seguro?',
      text: "Esta accion no se puede deshacer",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        var tareaEliminar = e.target.parentElement.parentElement;
        //borrar de base de datos
        eliminarTareaBD(tareaEliminar);

        // borrar de HTML
        tareaEliminar.remove();

        swal(
          'Eliminado!',
          'Su tarea ha sido borrada correctamente.',
          'success'
        )
      }
    });
  }
}
//completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado){
var idTarea = tarea.parentElement.parentElement.id.split(':');
//crear llamado ajax
var xhr = new XMLHttpRequest();
//informacion
var datos = new FormData();
datos.append('id', idTarea[1]);
datos.append('accion', 'actualizar');
datos.append('estado', estado);
//abrir la conexion
xhr.open('POST', 'inc/modelos/modelos-tareas.php', true);
//onload
xhr.onload = function(){
  if (this.status === 200){
  //console.log(JSON.parse(xhr.responseText));
  }
}
xhr.send(datos);
}
// elimina las tareas de la Base de datos

function eliminarTareaBD(tarea){

  var idTarea = tarea.id.split(':');
  //crear llamado ajax
  var xhr = new XMLHttpRequest();
  //informacion
  var datos = new FormData();
  datos.append('id', idTarea[1]);
  datos.append('accion', 'eliminar');
  //abrir la conexion
  xhr.open('POST', 'inc/modelos/modelos-tareas.php', true);
  //onload
  xhr.onload = function(){
    if (this.status === 200){
    console.log(JSON.parse(xhr.responseText));
    //comprobar q haya tareas restantes
    var listaTareasRestantes = document.querySelectorAll('li.tarea');
    if (listaTareasRestantes.length === 0) {
      document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto.</p>"
    }
    }
  }
  xhr.send(datos);
}


  /***********
  // inyectar HTLM
  var nuevoProyecto = document.createElement('li');
  nuevoProyecto.innerHTML = `
  <a href="#">
      ${nombreProyecto}
  </a>
  `;
  listaProyectos.appendChild(nuevoProyecto)

*/
