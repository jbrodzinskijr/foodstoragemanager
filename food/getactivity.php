<?php
    
    require 'includes/food.dbh.inc.php';
    
    $list = array();

    if (isset($_GET['need'])) {
        if ($_GET['need'] == "recent") {
            $sql = "SELECT * FROM activity ORDER BY activityDate DESC LIMIT 5";
        }
    } else {
        $sql = "SELECT * FROM activity ORDER BY activityDate DESC";
    }

    
    $result = mysqli_query($conn, $sql);

    while($row = mysqli_fetch_assoc($result)) {
        
        $activity['activityDate'] = date("Y-m-d", $row['activityDate']);
        $activity['activityType'] = $row['activityType'];
        $activity['description'] = $row['description'];
        $activity['affectedItem'] = $row['affectedItem'];

        array_push($list, $activity);
        
    }

    echo json_encode($list);


?>
