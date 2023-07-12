<?php
    
    require 'includes/food.dbh.inc.php';
   
    $q = '';


    if (isset($_GET['search'])) {
        
        $q = $_GET['search']; 
    
        $sql = "SELECT * 
                FROM inventory 
                WHERE code LIKE '%$q%' OR 
                description LIKE '%$q%' 
                ORDER BY code
                LIMIT 10";

        
        $result = mysqli_query($conn, $sql);

        $json = array();

        while($row = mysqli_fetch_assoc($result)) {
            $r = $row['code'].", ".$row['description'];
            array_push($json, $r);
        }

        echo json_encode($json);

    }

    if (isset($_GET['cat'])) {
        
        $q = $_GET['cat']; 
        $s = $_GET['sub'];
        $t = $q."-".$s;
        
        $sql = "SELECT * FROM inventory WHERE code = '$t' LIMIT 10";

        
        $result = mysqli_query($conn, $sql);
        
        $json = array();
        while($row = mysqli_fetch_assoc($result)) {
            array_push($json, $row);
        }
       
        echo json_encode($json);

    }

    if (isset($_GET['current'])) {
        
        $q = $_GET['current']; 
    
        $sql = "SELECT * 
                FROM inventory 
                WHERE code LIKE '%$q%' OR 
                subcategory LIKE '%$q%' 
                ORDER BY code
                LIMIT 10";

        $result = mysqli_query($conn, $sql);

        $json = array();

        while($row = mysqli_fetch_assoc($result)) {
            $r = $row['code'].", ".$row['description'];
            array_push($json, $r);
        }

        echo json_encode($json);

    }

?>
