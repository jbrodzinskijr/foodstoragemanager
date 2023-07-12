<?php
    
    require 'includes/food.dbh.inc.php';
    
    // Loads category options for dropdown
    $allOutput = [];
    $catOutput = [];
    $subOutput = [];
    $unitOutput = [];

    class Category {
            
        public $id;
        public $full;
        
      }


    // Categories
    $catSQL = "SELECT * from categories ORDER BY category";
    $catResult = mysqli_query($conn, $catSQL);
    while ($catRow = mysqli_fetch_assoc($catResult)) {
        
        $cat = new Category;
        $cat->full = $catRow['category']." - ".$catRow['full_category'];
        $cat->id = $catRow['category'];
        $cat->units = $catRow['units'];

        $catOutput[] = $cat;
        
    }
    $allOutput["cat"] = $catOutput;


    // Units
    $unitSQL = "SELECT * from units ORDER BY unit";
    $unitResult = mysqli_query($conn, $unitSQL);
    while ($unitRow = mysqli_fetch_assoc($unitResult)) {
        $unitOutput[] = $unitRow['unit'];
    }
    $allOutput["unit"] = $unitOutput;



    echo json_encode($allOutput);

?>

