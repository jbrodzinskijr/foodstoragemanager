<?php
    
    require 'includes/food.dbh.inc.php';

    ini_set("display_errors", "1");
    
    $json = json_decode(file_get_contents('php://input'));
    $currentCode = $json->code;


    $deleteSQL = "DELETE FROM inventory WHERE code='$currentCode'";
    $stmt = mysqli_stmt_init($conn);

    if (!mysqli_stmt_prepare($stmt, $deleteSQL)) {
            header("SQL Error");
            exit();
    }

    else {
        mysqli_stmt_execute($stmt);
        
        $activityDate = time();
        $description = "Item Deleted.  Bye Felicia.";
        $activityType = "Deleted";
        $activitySQL = "INSERT INTO activity VALUES ('$activityDate', '$activityType', '$description', '$currentCode')";
        mysqli_stmt_prepare($stmt, $activitySQL);
        mysqli_stmt_execute($stmt);
    }
    
?>
