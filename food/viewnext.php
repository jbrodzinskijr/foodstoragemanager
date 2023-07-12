<?php
    
    require 'includes/food.dbh.inc.php';
    
    // Loads category options for dropdown
    $allOutput = [];
    
    // Categories
    // Select the oldest (by acquired date) record (limit 1) for each subcategory
    // where the start date is null
    $currentSQL =   "   SELECT * 
                        FROM inventory i
                        WHERE i.index = (
                            SELECT i1.index 
                            FROM inventory i1 
                            WHERE i1.category = i.category and i1.subcategory = i.subcategory and i1.start is null 
                            order by i1.date, i1.index limit 1
                        )
                        ORDER BY category, subcategory
                    ";

    $currentResult = mysqli_query($conn, $currentSQL);
    while ($currentRow = mysqli_fetch_assoc($currentResult)) {
        
        array_push($allOutput, $currentRow);
        
    }
    
    echo json_encode($allOutput);

?>


