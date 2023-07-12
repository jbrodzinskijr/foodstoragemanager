<?php

    require 'includes/food.dbh.inc.php';

    $allOutput = [];

    if (isset($_GET['getall'])) {
        $inventorySQL = "   SELECT date, subcategory, code, description, start, end 
                            FROM inventory 
                            ORDER BY date DESC";
    } else {

        if (isset($_GET['status'])) {
            $status = $_GET['status'];
            switch ($status) {
                case 0: 
                    $statusSql = "start is null";
                    break;
                case 1:
                    $statusSql = "start is not null AND end is null";
                    break;
                case 2:
                    $statusSql = "start is not null AND end is not null";
                    break;
            }
        } else {
            $statusSql = "";
        }
    
        if (isset($_GET['cat'])) {
            $cat = $_GET['cat'];

            if ($statusSql) {$statusSql = "AND " . $statusSql;}

            $inventorySQL = "   SELECT date, category, subcategory, code, description, start, end 
                                FROM inventory 
                                WHERE   category = '$cat'
                                $statusSql
                                ORDER BY date DESC";
            
        } else {
            $inventorySQL = "   SELECT date, category, subcategory, code, description, start, end 
                                    FROM inventory 
                                    WHERE   $statusSql
                                    ORDER BY date DESC";
        }
    }


    $inventoryResult = mysqli_query($conn, $inventorySQL);
    while ($inventoryRow = mysqli_fetch_assoc($inventoryResult)) {
        if ($inventoryRow['start'] == null) {
            $status = "Stock";
            $statusCode = "inventory-stock";
        } else {
            if ($inventoryRow['end'] == null) {
                $status = "In Use";
                $statusCode = "inventory-in-use";
            } else {
                $status = "Done";
                $statusCode = "inventory-done";
            }
        }

        $inventoryRow['status'] = $status;
        $inventoryRow['statusCode'] = $statusCode;
        array_push($allOutput, $inventoryRow);
        
    }

    $catOutput = [];
    $catSQL = "SELECT * from categories ORDER BY category";
    $catResult = mysqli_query($conn, $catSQL);

    while ($row = mysqli_fetch_assoc($catResult)) {
        $catCurrentRow = $row['category']." - ".$row['full_category'];
        array_push($catOutput, $catCurrentRow);
    }

    $data['cats'] = $catOutput;
    $data["data"] = $allOutput;
    echo json_encode($data);

?>


