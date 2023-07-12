<?php
    
    require 'includes/food.dbh.inc.php';
     
    // Grabs all category full names and units
    $catDetailsSQL = "SELECT  category, 
                        full_category AS catFull, 
                        units AS catUnits
                        from categories
                        ORDER BY category DESC";

    $catDetailsResults = mysqli_query($conn, $catDetailsSQL);
    $catDetailsData = [];
    while ($currentRow = mysqli_fetch_assoc($catDetailsResults)) {
        array_push($catDetailsData, $currentRow);
    }
    $allOutput['catFull'] = $catDetailsData;
    $allOutput['catUnits'] = $catDetailsData;
    
    // Totals all inventory by category
    $catInventorySQL = "SELECT  category, SUM(total) AS catTotalInventory 
                        from inventory 
                        WHERE end is null 
                        GROUP BY category";

    $catInventoryResults = mysqli_query($conn, $catInventorySQL);
    $catInventoryData = [];
    while ($currentRow = mysqli_fetch_assoc($catInventoryResults)) {
        array_push($catInventoryData, $currentRow);
    }
    $allOutput['catTotalInventory'] = $catInventoryData;
    
    // Totals all inventory by subcategory
    $subInventorySQL = "SELECT  category, subcategory, 
                        SUM(total) AS subTotalInventory 
                        from inventory 
                        WHERE end is null 
                        GROUP BY category,
                                 subcategory";

    $subInventoryResults = mysqli_query($conn, $subInventorySQL);
    $subInventoryData = [];
    while ($currentRow = mysqli_fetch_assoc($subInventoryResults)) {
        array_push($subInventoryData, $currentRow);
    }
    $allOutput['subTotalInventory'] = $subInventoryData;

    // Averages the rate of use by category
    $catAverageRateSQL = "  SELECT  category,
                            CAST(
                                SUM(CASE WHEN end is not null THEN total ELSE 0 END) 
                                / ( SUM(CASE WHEN inUse is not null THEN inUse ELSE 0 END)
                                / 7 ) AS DECIMAL (11,2)
                            ) AS catAverageRate 
                            from inventory 
                            GROUP BY category";

    $catAverageRateResults = mysqli_query($conn, $catAverageRateSQL);
    $catAverageRateData = [];
    while ($currentRow = mysqli_fetch_assoc($catAverageRateResults)) {
        array_push($catAverageRateData, $currentRow);
    }
    $allOutput['catAverageRate'] = $catAverageRateData;

    // Averages the rate of use by subcategory
    $subAverageRateSQL = "  SELECT  category, subcategory,
                            CAST(
                                SUM(CASE WHEN end is not null THEN total ELSE 0 END) 
                                / ( SUM(CASE WHEN inUse is not null THEN inUse ELSE 0 END) 
                                / 7 ) AS DECIMAL (11,2)
                            ) AS subAverageRate 
                            from inventory 
                            GROUP BY category,
                                     subcategory";

    $subAverageRateResults = mysqli_query($conn, $subAverageRateSQL);
    $subAverageRateData = [];
    while ($currentRow = mysqli_fetch_assoc($subAverageRateResults)) {
        array_push($subAverageRateData, $currentRow);
    }
    $allOutput['subAverageRate'] = $subAverageRateData;

    // Averages the price per unit by subcategory
    $subAveragePriceSQL = " SELECT  category, subcategory,
                            CAST(AVG(pricePerUnit) AS DECIMAL (11,4)) AS subAveragePrice
                            from inventory 
                            GROUP BY category,
                                     subcategory";

    $subAveragePriceResults = mysqli_query($conn, $subAveragePriceSQL);
    $subAveragePriceData = [];
    while ($currentRow = mysqli_fetch_assoc($subAveragePriceResults)) {
        array_push($subAveragePriceData, $currentRow);
    }
    $allOutput['subAveragePrice'] = $subAveragePriceData;

    // Pulls the lowest price per subcategory
    // Also need to provide source and link(s) to lowest price 
    $subMinPriceSQL = " SELECT  category, subcategory,
                        CAST(MIN(pricePerUnit) AS DECIMAL (11,4)) AS subMinPrice 
                        from inventory 
                        GROUP BY category,
                                 subcategory";

    $subMinPriceResults = mysqli_query($conn, $subMinPriceSQL);
    $subMinPriceData = [];
    while ($currentRow = mysqli_fetch_assoc($subMinPriceResults)) {
        array_push($subMinPriceData, $currentRow);
    }
    $allOutput['subMinPrice'] = $subMinPriceData;

    // Calculates current inventory in time (as "supply") by category based on average rate of use
    $catSupplySQL = "   SELECT  category, 
                        CAST( SUM(CASE WHEN end is null THEN total ELSE 0 END) 
                        / ( SUM(CASE WHEN end is not null THEN total ELSE 0 END) 
                        / ( SUM(CASE WHEN inUse is not null THEN inUse ELSE 0 END) / 7 ) ) 
                        AS DECIMAL (11,1) ) AS catSupply
                        from inventory 
                        GROUP BY category";

    $catSupplyResults = mysqli_query($conn, $catSupplySQL);
    $catSupplyData = [];
    while ($currentRow = mysqli_fetch_assoc($catSupplyResults)) {
        array_push($catSupplyData, $currentRow);
    }
    $allOutput['catSupply'] = $catSupplyData;

    // Calculates current inventory in time (as "supply") by subcategory based on average rate of use
    $subSupplySQL = "   SELECT  category, subcategory,
                        CAST( SUM(CASE WHEN end is null THEN total ELSE 0 END) 
                        / ( SUM(CASE WHEN end is not null THEN total ELSE 0 END) 
                        / ( SUM(CASE WHEN inUse is not null THEN inUse ELSE 0 END) / 7 ) ) 
                        AS DECIMAL (11,1) ) AS subSupply
                        from inventory 
                        GROUP BY category,
                                 subcategory";

    $subSupplyResults = mysqli_query($conn, $subSupplySQL);
    $subSupplyData = [];
    while ($currentRow = mysqli_fetch_assoc($subSupplyResults)) {
        array_push($subSupplyData, $currentRow);
    }
    $allOutput['subSupply'] = $subSupplyData;

    // Calculates deficit in terms of units below target supply
    // The "target supply", until changed, is currently considered 26 weeks (6 months)
    $catDeficitSQL = "  SELECT  category, 
                        CAST(   SUM(CASE WHEN end is null THEN total ELSE 0 END) -
                                SUM(CASE WHEN end is not null THEN total ELSE 0 END) 
                                / ( SUM(CASE WHEN inUse is not null THEN inUse ELSE 0 END) / 7 )
                                *26
                        AS DECIMAL (11,1) ) AS catDeficit
                        from inventory 
                        GROUP BY category";

    $catDeficitResults = mysqli_query($conn, $catDeficitSQL);
    $catDeficitData = [];
    while ($currentRow = mysqli_fetch_assoc($catDeficitResults)) {
        array_push($catDeficitData, $currentRow);
    }
    $allOutput['catDeficit'] = $catDeficitData;
    
    echo json_encode($allOutput);

?>


