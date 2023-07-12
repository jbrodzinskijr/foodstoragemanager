<?php
    
    require 'includes/food.dbh.inc.php';
    
    $currentMonth = date('m');
    $currentYear = date('Y');
    
    $sql = "SELECT * FROM inventory";
    
    $result = mysqli_query($conn, $sql);
    
    class JSONdata {
        public $soon_items;
        public $exp_items;
    }

    $json = new JSONdata;
    $soon = array();
    $expired = array();

    while($row = mysqli_fetch_assoc($result)) {
        
        $expDate = $row['expiration'];

        $expMonth = substr($expDate, 0, 2);

        $expMonth = (int) $expMonth;
        $expYear = substr($expDate, -4);
        $expYear = (int) $expYear;

        $gap = ($expYear - $currentYear) * 12 + ($expMonth - $currentMonth);

        if (!isset($row['end'])) {
            if ($gap > 3) {
            } elseif ($gap >= 0) {
                array_push($soon, $row);
            } else {
                array_push($expired, $row);
            }
        }
    }

    $json->soon_items = $soon;
    $json->exp_items = $expired;

    echo json_encode($json);

?>
