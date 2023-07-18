<?php
    
    include("conexion.php");
    
    $name = $_POST["usuario"];
    $pass = $_POST["pass"];

    //login
    if(isset($_POST["btningresar"])){
        $query = mysqli_query($conn,"SELECT * FROM login WHERE usuario = '$name' AND pass = '$pass'");
        $nr = mysqli_num_rows($query);

        if($nr == 1){
            echo "<script> alert('Bienvenido $name'); window.location='../html/usuario.html' </script>";
        }else{
            echo "<script> alert('Usuario no existe'); window.location='../html/login.html' </script>";
        }
    }

    //registro
    if(isset($_POST["btnregistrar"])){

        $sqlgrabar = "INSERT INTO login(usuario,pass) values ('$name','$pass')";

        if(mysqli_query($conn,$sqlgrabar)){
            echo "<script> alert('Usuario registrado con exito: $name'); window.location='../html/usuario.html' </script>";
        }else{
            echo "Error: ".$sql."<br>".mysql_error($conn);
        }
    }
?>