<?php

// Código PHP para generar el contenido del ticket en el PDF
$data = json_decode(file_get_contents('php://input'), true); // Obtener los datos del carrito enviados desde JavaScript
$carrito = $data['carrito']; // Obtener el carrito del arreglo de datos recibidos

require_once('../TCPDF/tcpdf.php');

$pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8');
$pdf->SetCreator("Flipper");
$pdf->SetAuthor("xoxo");
$pdf->SetTitle("xoxo");
$pdf->SetMargins(10, 10, 10); // Márgenes izquierdo, derecho y superior en milímetros
$pdf->SetAutoPageBreak(true, 10); // Habilitar el salto de página automático
$pdf->AddPage(); // Agregar una nueva página al PDF

// Aquí puedes establecer la posición y el estilo de los elementos en el ticket PDF utilizando los métodos proporcionados por TCPDF
// Por ejemplo:
$x = 10; // Posición X inicial
$y = 10; // Posición Y inicial

$pdf->SetXY($x, $y);
$pdf->Cell(50, 10, "id", 1, 0, 'C');
$pdf->Cell(80, 10, "pez", 1, 0, 'C');
$pdf->Cell(30, 10, "cantidad", 1, 0, 'C');
$pdf->Cell(40, 10, "precio unitario", 1, 0, 'C');
$y += 10;

$total = 0;

foreach ($carrito as $producto) {
    // Generar contenido del ticket con los datos de cada producto
    $id = $producto['id'];
    $title = $producto['title'];
    $cantidad = $producto['cantidad'];
    $precio = $producto['precio'];
    
    // Agregar los datos al PDF utilizando los métodos de TCPDF
    $pdf->SetXY($x, $y);
    $pdf->Cell(50, 10, $id, 1, 0, 'L');
    $pdf->Cell(80, 10, $title, 1, 0, 'L');
    $pdf->Cell(30, 10, $cantidad, 1, 0, 'L');
    $pdf->Cell(40, 10, $precio, 1, 0, 'R');
    
    $total = $total + $cantidad * $precio;

    // Actualizar la posición Y para el siguiente producto
    $y += 10;
}

$pdf->SetXY($x, $y);
$pdf->Cell(160, 10, "Total: ", 1, 0, 'R');
$pdf->Cell(40, 10, $total, 1, 0, 'C');
$y += 10;


// Finalizar la generación del PDF
$pdf->Output('compra.pdf', 'D');

?>