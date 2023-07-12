
<?php

require 'includes/food.dbh.inc.php';

// Fetches all category codes and names from categories table
$catOutput = [];
$catSQL = "SELECT * from categories ORDER BY category";
$catResult = mysqli_query($conn, $catSQL);

while ($row = mysqli_fetch_assoc($catResult)) {
    $catCurrentRow = $row['category']." - ".$row['full_category'];
    array_push($catOutput, $catCurrentRow);
}

$allOutput['cats'] = $catOutput;

// Fetches all units from units table
$unitsOutput = [];
$unitsSQL = "SELECT * from units ORDER BY unit";
$unitsResult = mysqli_query($conn, $unitsSQL);

while ($row = mysqli_fetch_assoc($unitsResult)) {
    array_push($unitsOutput, $row['unit']);
}

$allOutput["units"] = $unitsOutput;

echo json_encode($allOutput);
?>
