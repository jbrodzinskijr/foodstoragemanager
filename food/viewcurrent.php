<?php
    
    require 'includes/food.dbh.inc.php';
    
    // Loads category options for dropdown
    $allOutput = [];
    
    // Categories
    $currentSQL = " SELECT * from inventory 
                    WHERE   start > 0
                            and end is null 
                    ORDER BY category ";

    $currentResult = mysqli_query($conn, $currentSQL);
    while ($currentRow = mysqli_fetch_assoc($currentResult)) {
        
        array_push($allOutput, $currentRow);
        
    }
    
    echo json_encode($allOutput);

?>


