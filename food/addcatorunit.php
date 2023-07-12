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
                document.getElementById('header_page_title').innerText = "Add Values";
                }); 
            });
            })();
        </script>
    </div>

    <div class="align-center">
        <p><a href="index.html" style="text-decoration:none"><button name="food-storage" class="general-button blue" style="width:50%">Food Storage Home</button></a></p>
        <p><a href="addvalues.html" style="text-decoration:none"><button name="add-values" class="general-button blue" style="width:50%">Add Another Category or Unit</button></a></p>
    </div>
    
    <div class="general-container align-center">
        <?php
            
            require 'includes/food.dbh.inc.php';
            
            if (isset($_POST['category'])) {
                $category = $_POST['category'];
                $fullCategory = $_POST['full_category'];
                $cat_units = $_POST['cat_units'];

                $insertSQL = "INSERT INTO categories (category, full_category, units) VALUES (?, ?, ?)";
                $stmt = mysqli_stmt_init($conn);
                

                if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                        header("SQL Error");
                        echo "Prep error<br>";
                        exit();
                }
                else {
                    mysqli_stmt_bind_param($stmt, "sss", $category, $fullCategory, $cat_units);
                    mysqli_stmt_execute($stmt);
                    echo "
                        <h1>Category added:</h1>
                        <h2>".$category."</h2>
                    ";
                }
            }

            if (isset($_POST['unit'])) {
                $unit = $_POST['unit'];

                $insertSQL = "INSERT INTO units (unit) VALUES (?)";
                $stmt = mysqli_stmt_init($conn);
                

                if (!mysqli_stmt_prepare($stmt, $insertSQL)) {
                        header("SQL Error");
                        echo "Prep error<br>";
                        exit();
                }
                else {
                    mysqli_stmt_bind_param($stmt, "s", $unit);
                    mysqli_stmt_execute($stmt);
                    echo "
                        <h1>Unit added:</h1>
                        <h2>".$unit."</h2>
                    ";
                }
            }
        ?>
    </div>

</body>
</html>

