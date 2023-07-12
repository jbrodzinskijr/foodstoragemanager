<?php
                
    require 'includes/food.dbh.inc.php';

    ini_set("display_errors", "1");
    
    $json = json_decode(file_get_contents('php://input'));
    $currentCode = $json->code;


    function logActivity($attribute, $value, $currentCode, $stmt) {
        
        $activityDate = time();
        $description = $attribute." updated to ".$value;
        $activityType = "Updated";
        $activitySQL = "INSERT INTO activity VALUES ('$activityDate', '$activityType', '$description', '$currentCode')";
        mysqli_stmt_prepare($stmt, $activitySQL);
        mysqli_stmt_execute($stmt);
    }

    if (property_exists($json, 'date')) {

        $date = $json->date;
        $attribute = "Date";
        $insertSQL = "UPDATE inventory SET date=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);
        $attribute = "Date";
        $value = $date;

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 's', $date);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $date, $currentCode, $stmt);
        }
    }

    if (property_exists($json, 'subcategory')) {

        $subcategory = $json->subcategory;
        $attribute = "Subcategory";
        $insertSQL = "UPDATE inventory SET subcategory=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 's', $subcategory);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $subcategory, $currentCode, $stmt);
        }
    }

    if (property_exists($json, 'source')) {

        $source = $json->source;
        $attribute = "Source";
        $insertSQL = "UPDATE inventory SET source=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 's', $source);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $source, $currentCode, $stmt);
        }
    }

    if (property_exists($json, 'description')) {

        $description = $json->description;
        $attribute = "Description";
        $insertSQL = "UPDATE inventory SET description=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 's', $description);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $description, $currentCode, $stmt);
        }
    }

    if (property_exists($json, 'amount')) {

        $amount = $json->amount;
        
        if (property_exists($json, 'quantity')) {
            $quantity = $json->quantity;
            $total = $amount * $quantity;
            $attribute = "Amount, Quantity, and Total";
            $values = $amount.", ".$quantity." and ".$total;
            $insertSQL = "UPDATE inventory SET amount=?, quantity=?, total=? WHERE code='$currentCode'";
            $exCode = "a";
        } else {
            $quantity = $json->oldQuantity;
            $total = $amount * $quantity;
            $attribute = "Amount and Total";
            $values = $amount." and ".$total;
            $insertSQL = "UPDATE inventory SET amount=?, total=? WHERE code='$currentCode'";
            $exCode = "b";
        }
        
        
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            if ($exCode == "a") {
                mysqli_stmt_bind_param($stmt, 'sss', $amount, $quantity, $total);
                mysqli_stmt_execute($stmt);
                
            } else {
                mysqli_stmt_bind_param($stmt, 'ss', $amount, $total);
                mysqli_stmt_execute($stmt);
                
            }
            logActivity($attribute, $values, $currentCode, $stmt);
            
        }
    }

    if (property_exists($json, 'quantity') && !property_exists($json, 'amount')) {

        $quantity = $json->quantity;
        $amount = $json->oldAmount;
        $total = $amount * $quantity;
        $attribute = "Quantity and Total";
        $values = $quantity." and ".$total;
        $insertSQL = "UPDATE inventory SET quantity=?, total=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 'ss', $quantity, $total);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $values, $currentCode, $stmt);
        }
    }

    if (property_exists($json, 'expiration')) {

        $expiration = $json->expiration;
        $attribute = "Expiration";
        $insertSQL = "UPDATE inventory SET expiration=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 's', $expiration);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $expiration, $currentCode, $stmt);

        }
    }

    if (property_exists($json, 'start')) {

        $start = $json->start;
        $attribute = "Start";
        $insertSQL = "UPDATE inventory SET start=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 's', $start);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $start, $currentCode, $stmt);
        }
    }

    if (property_exists($json, 'end')) {

        $end = $json->end;
        $inUse = $json->inUse;
        $rate = $json->rate;
        $attribute = "End, In Use, and Rate";
        $values = $end.", ".$inUse.", and ".$rate;
        $insertSQL = "UPDATE inventory SET end=?, inUse=?, rate=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 'sis', $end, $inUse, $rate);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $values, $currentCode, $stmt);
        }
    }

    if (property_exists($json, 'price')) {

        $price = $json->price;
        $pricePerUnit = $json->pricePerUnit;
        $attribute = "Price and Price Per Unit";
        $values = $price." and ".$pricePerUnit;
        $insertSQL = "UPDATE inventory SET price=?, pricePerUnit=? WHERE code='$currentCode'";
        $stmt = mysqli_stmt_init($conn);

        if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                header("SQL Error");
                exit();
        }

        else {
            mysqli_stmt_bind_param($stmt, 'ss', $price, $pricePerUnit);
            mysqli_stmt_execute($stmt);
            logActivity($attribute, $values, $currentCode, $stmt);
        }
    }

?>

