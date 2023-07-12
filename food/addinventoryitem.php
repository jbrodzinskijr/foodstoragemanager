<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Food Storage</title>
    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/x-icon" href="images/tomatoicon.png">
</head>
<body>
    <div class="general-container" id="header">
        <script>
            (function () {
            $(function(){
                $("#header").load("header.html",{},() => {
                document.getElementById('header_page_title').innerText = "Add Item";
                }); 
            });
            })();
        </script>
    </div>

    <div class="align-center">
        <p><a href="index.html" style="text-decoration:none"><button name="food-storage" class="general-button blue" style="width:50%">Food Storage Home</button></a></p>
        <p><a href="additem.html" style="text-decoration:none"><button name="add-item" class="general-button blue" style="width:50%">Add Another Item</button></a></p>
    </div>
    
    <div class="general-container align-center">
        <?php
            
            require 'includes/food.dbh.inc.php';
            
            // Remove the if statements and consolidate - if one is set, they're all set, per validation
            if (isset($_POST['date'])) {
                $date = $_POST['date'];
                $category = $_POST['category'];
                $subcategory = $_POST['subcategory'];
                $source = $_POST['source'];
                $description = $_POST['description'];
                $amount = $_POST['amount'];
                $unit = $_POST['unit'];
                $quantity = $_POST['quantity'];
                $expiration = $_POST['expiration'];
            }

            $currentYear = substr($date, 2, 2);
            $search = $currentYear.$category;
            $pullSQL = "SELECT * from inventory WHERE code LIKE '$search%'";
            $pullResult = mysqli_query($conn, $pullSQL);
            $catCount = mysqli_num_rows($pullResult);
            $catCount++;

            $sub = $catCount;
            $catCount = str_pad($catCount, 2, '0', STR_PAD_LEFT);
            $code = $search.'-'.$catCount;
            $total = $amount * $quantity;

            if (($_POST['price']) != null) {
                $price = $_POST['price'];
                $pricePerUnit = $price / $total;
                $insertSQL = "INSERT INTO inventory (date, category, subcategory, sub, code, source, description, amount, unit, quantity, total, expiration, price, pricePerUnit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            } else {
                $insertSQL = "INSERT INTO inventory (date, category, subcategory, sub, code, source, description, amount, unit, quantity, total, expiration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            }

            $stmt = mysqli_stmt_init($conn);
            

            if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                    header("SQL Error");
                    echo "Prep error<br>";
                    exit();
            }
            else {
                
                if ($_POST['price'] != null) {
                    mysqli_stmt_bind_param($stmt, "ssssssssssssss", $date, $category, $subcategory, $sub, $code, $source, $description, $amount, $unit, $quantity, $total, $expiration, $price, $pricePerUnit);
                
                } else {
                    mysqli_stmt_bind_param($stmt, "ssssssssssss", $date, $category, $subcategory, $sub, $code, $source, $description, $amount, $unit, $quantity, $total, $expiration);
                
                }
                mysqli_stmt_execute($stmt);
                echo "
                    <h1>Item added to inventory:</h1>
                    <h2>".$code."</h2>
                ";

                // Log to Activity table
                $activityDate = time();
                $description = "Item Added to Inventory: ".$code;
                $activityType = "Added";
                $activitySQL = "INSERT INTO activity (activityDate, activityType, description, affectedItem) VALUES ('$activityDate', '$activityType', '$description', '$code')";
                mysqli_stmt_prepare($stmt, $activitySQL);
                mysqli_stmt_execute($stmt);
                
            }
        ?>
    </div>

</body>
</html>

