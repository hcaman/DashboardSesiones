<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion === 'crear') {
  //codigo para crear administradores
  //hashear password
        $opciones = array (
          'cost' => 12
        );
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
//abrir la conexion poner conexion solo donde la necesites
        include '../funciones/conexion.php';

        try {
          //realizar consulta a base de datos
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
            $stmt->bind_param('ss', $usuario, $hash_password);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
              $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
              );
            } else {
              $respuesta = array(
                'respuesta' => 'error'
              );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
          //en caso de error tomar la excepcion
            $respuesta = array('pass' => $e->getMessage() );
        }

echo json_encode($respuesta);


}

if ($accion === 'login') {
  // codigo q loguee a los admins
  include '../funciones/conexion.php';
try {
  //seleccionar administrador de la base de datos.
  $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
  $stmt->bind_param('s', $usuario);
  $stmt->execute();
  //loguear el usuario
  $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario );
  $stmt->fetch();
  if ($nombre_usuario) {
    //el usuario existe, verificar el password.
    if (password_verify($password, $pass_usuario)) {
      //iniciar la session_start
      session_start();
      $_SESSION['nombre'] = $usuario;
      $_SESSION['id'] = $id_usuario;
      $_SESSION['login'] = true;
      // login correcto
      $respuesta = array (
        'respuesta' => 'correcto',
        'nombre' => $nombre_usuario,
        'tipo' => $accion
          );
    } else {
      // login incorrecto, enviar error
      $respuesta = array('resultado' => 'Password incorrecto' );
    }

  } else {
    $respuesta = array (
      'error' => 'Usuario no existe'
    );
  }
$stmt->close();
$conn->close();
} catch (Exception $e) {
  //en caso de error tomar la excepcion
    $respuesta = array('error' => $e->getMessage() );
}

echo json_encode($respuesta);

}




//die(json_encode($_POST));
