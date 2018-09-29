<?php
function usuario_autenticado(){
 if (!revisar_usuario()) {
   //si no esta el usuario se redirecciona
   header('Location:login.php');
   exit;
 }
}
function revisar_usuario(){
   return isset($_SESSION['nombre']);
}
session_start();
usuario_autenticado();
