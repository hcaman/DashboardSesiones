eventListeners();
function eventListeners(){
  document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}
function validarRegistro(e){
  e.preventDefault();
  var usuario = document.querySelector('#usuario').value,
      password = document.querySelector('#password').value,
      tipo = document.querySelector('#tipo').value;
      if (usuario === '' || password === '') {
// la validacion fallo
        swal({
          type: 'error',
          title: 'Error!',
          text: 'Ambos campos son obligatorios'
});
} else {
// ambos campos osn Correctos, mandar ejecutar ajax.
// datos que se envian al servidos
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

//crear el llamado a ajax

        var xhr = new XMLHttpRequest();
        //abrrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);
        // retorno de datos
        xhr.onload = function(){
          if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            // console.log(respuesta);
            //si la respuesta es correcta
            if (respuesta.respuesta === 'correcto') {
              // si es nuevo usuarios
              if (respuesta.tipo  === 'crear') {
                swal({
                  type: 'success',
                  title: 'Usuario creado',
                  text: 'El usuario se creo correctamente'
                });
              } else if (respuesta.tipo  === 'login') {
                swal({
                  type: 'success',
                  title: 'Ingresaste',
                  text: 'Ingresaste a tu cuenta correctamente, presiona OK'
                })
                .then(resultado => {
                  if (resultado.value) {
                    window.location.href = 'index.php';                    
                  }
                });
              }
            } else {
              //hubo un error
              swal({
                type: 'error',
                title: 'Error!',
                text: 'Hubo un error en la creacion de tu usuario'
      });
            }

          }
        }
//enviar la peticion
        xhr.send(datos);


}
}


/*
swal({
  type: 'success',
  title: 'Correcto',
  text: 'Ingresando a tu cuenta'
});
*/
