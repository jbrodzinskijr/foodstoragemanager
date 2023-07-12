<?php
    

    require 'includes/food.dbh.inc.php';
   
    $q = '';
    if (isset($_GET['source'])) {
      $q = "source"; 
    }
    if (isset($_GET['subcategory'])) {
      $q = "subcategory"; 
    }
    if (isset($_GET['description'])) {
      $q = "description"; 
    }
    $value = $_GET[$q];
    
    $sql = "SELECT DISTINCT $q FROM inventory WHERE $q LIKE '%$value%' LIMIT 10";

    $result = mysqli_query($conn, $sql);

    $json = array();

    while($row = mysqli_fetch_assoc($result)) {
      array_push($json, $row[$q]);
    }

    echo json_encode($json);

?>
