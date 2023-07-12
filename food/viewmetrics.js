const asyncGetCall = async () => {
  try {
    const response = await fetch('viewmetrics.php');
    const data = await response.json();
    // console.log(data);


    // Main table
    var tableInnerText =  '<table class="general-table-all"><tr><td>Jump to Category:</td>' +
                          '<td><select id="dropdown" name="dropdown" class="general-input"></select></td></tr>' + 
                          '<tr><td id="catCell" colspan="2"></td></tr></table>';
    document.getElementById('metrics').innerHTML = tableInnerText;
    

    // Metric codes from php and their corresponding display texts     
    dataCodes = [
      "catTotalInventory", "subTotalInventory", "catAverageRate", "subAverageRate",
      "subAveragePrice", "subMinPrice", "catSupply", "subSupply", "catDeficit", "catFull", "catUnits"
    ];

    dataText = [
      "Inventory", "Inventory", "Average Rate", "Average Rate (units/week)",
      "Average Price Per Unit", "Minimum Price Per Unit", "Supply", "Supply", "Surplus/Deficit"
    ];

    // Build master data object
    var allObjs = [];
    for (var j = 0; j < dataCodes.length; j++) {
      
      var currentCode = dataCodes[j];

      for (var k = 0; k < data[currentCode].length; k++) {
        var currentCat = data[currentCode][k]["category"];
        var currentSub = null;
        if (data[currentCode][k]["subcategory"]) {
          currentSub = data[currentCode][k]["subcategory"];
        }
        var currentValue = data[currentCode][k][currentCode];

        // cat Check
        var catCheck = 0;
        for (var l = 0; l < allObjs.length; l++) {
          if (Object.values(allObjs[l]).includes(currentCat)) {
            catCheck = 1;
            break;
          }
        }

        // Push new category into master array
        if (catCheck == 0) {
          allObjs.push( {"category" : currentCat, "subcategories" : []} );
        }

        // Add data
        for (var m = 0; m < allObjs.length; m++) {
          if (Object.values(allObjs[m]).includes(currentCat)) {

            // sub Check
            if (currentSub) {
              var subCheck = 0;
              for (var l = 0; l < allObjs[m]["subcategories"].length; l++) {
                if (Object.values(allObjs[m]["subcategories"][l]).includes(currentSub)) {
                  subCheck = 1;
                  break;
                }
              }

              // Push new subcategory into category object
              if (subCheck == 0) {
                allObjs[m]["subcategories"].push( {"subcategory" : currentSub} );
              }

              // Add subcategory attribute
              for (var s = 0; s < allObjs[m]["subcategories"].length; s++) {
                if (Object.values(allObjs[m]["subcategories"][s]).includes(currentSub)) {
                  allObjs[m]["subcategories"][s][currentCode] = currentValue;  
                }
              }

            } else {

              // Add category attribute
              allObjs[m][currentCode] = currentValue;
            }
          }   
        }
      } 
    }
    
    var catCellInnerText = '';
    for (var l = 0; l < allObjs.length; l++) {

      // Conditionally filter out null and undefined values and set display text (category level)
      var noData = '<p class="jb-nodata">No Data Yet</p>';
      var array0, array2, array6, array8;
      if (allObjs[l][dataCodes[0]] == null) {
        array0 = '0 ' + allObjs[l][dataCodes[10]] + 's';
      } else {
        array0 = allObjs[l][dataCodes[0]] + ' ' + allObjs[l][dataCodes[10]] + 's';
      }

      if (allObjs[l][dataCodes[2]] == null) {
        array2 = noData;
      } else {
        array2 = allObjs[l][dataCodes[2]] + ' ' + allObjs[l][dataCodes[10]] + 's/week';
      }

      if (allObjs[l][dataCodes[6]] == null) {
        array6 = noData;
      } else {
        array6 = allObjs[l][dataCodes[6]] + ' weeks';
      }

      if (allObjs[l][dataCodes[8]] == null) {
        array8 = noData;
      } else {
        array8 = allObjs[l][dataCodes[8]] + ' ' + allObjs[l][dataCodes[10]] + 's';
      }

      // Build category table
      catCellInnerText += '<br><table class="jb-table-all" id="' + allObjs[l].category + '">' +
                          '<tr><td class="metrics-cat-column"><b>Category:</b></td><td class="metrics-cat-column"><b>' + allObjs[l].category + '</b><i> (' + allObjs[l][dataCodes[9]] + ')</i></td></tr>' +
                          '<tr><td>' + dataText[0] + '</td><td>' + array0 + '</td></tr>' +
                          '<tr><td>' + dataText[2] + '</td><td>' + array2 + '</td></tr>' +
                          '<tr><td>' + dataText[6] + '</td><td>' + array6 + '</td></tr>' +
                          '<tr><td>' + dataText[8] + '</td><td>' + array8 + '</td></tr>';

      // Build subcategory tables
      var subText = '<tr><td colspan="2">';
      for (var m = 0; m < allObjs[l]["subcategories"].length; m++) {

        // Conditionally filter out null and undefined values and set display text (category level)
        var array1, array3, array4, array5, array7;
        
        if (allObjs[l]["subcategories"][m][dataCodes[1]] == null) {
          array1 = '0 ' + allObjs[l][dataCodes[10]] + 's';
        } else {
          array1 = allObjs[l]["subcategories"][m][dataCodes[1]] + ' ' + allObjs[l][dataCodes[10]] + 's';
        }

        if (allObjs[l]["subcategories"][m][dataCodes[3]] == null) {
          array3 = noData;
        } else {
          array3 = allObjs[l]["subcategories"][m][dataCodes[3]] + ' ' + allObjs[l][dataCodes[10]] + 's/week';
        }

        if (allObjs[l]["subcategories"][m][dataCodes[4]] == null) {
          array4 = noData;
        } else {
          array4 = '$' + allObjs[l]["subcategories"][m][dataCodes[4]];
        }

        if (allObjs[l]["subcategories"][m][dataCodes[5]] == null) {
          array5 = noData;
        } else {
          array5 = '$' + allObjs[l]["subcategories"][m][dataCodes[5]];
        }

        if (allObjs[l]["subcategories"][m][dataCodes[7]] == null) {
          array7 = noData;
        } else {
          array7 = allObjs[l]["subcategories"][m][dataCodes[7]] + ' weeks';
        }


        // Build subcategory table
        subText +=  '<br><table class="jb-table2-all">' + 
                    '<tr><td class="metrics-sub-column"><b>Subcategory:</b></td><td class="metrics-sub-column"><b>' + allObjs[l]["subcategories"][m].subcategory + '</b></td></tr>' +
                    '<tr><td>' + dataText[1] + '</td><td>' + array1 + '</td></tr>' +
                    '<tr><td>' + dataText[3] + '</td><td>' + array3 + '</td></tr>' +
                    '<tr><td>' + dataText[4] + '</td><td>' + array4 + '</td></tr>' +
                    '<tr><td>' + dataText[5] + '</td><td>' + array5 + '</td></tr>' +
                    '<tr><td>' + dataText[7] + '</td><td>' + array7 + '</td></tr>' +
                    '</table>';
      }

      catCellInnerText += subText;
      catCellInnerText += '</td></tr><tr><td colspan="2" class="metrics-back"><a href="#header"><i>Back to Top</i></a></td></tr></table>';
    } 
    
    // Load display tables into html element
    document.getElementById('catCell').innerHTML = catCellInnerText;

    
    // Build jump-to dropdown
    var dropdownText = '';
    for (var j = 0; j < allObjs.length; j++) {
        dropdownText += "<option value='#" + allObjs[j].category + "'>" + allObjs[j].category + "</option>";
    }      
    document.getElementById('dropdown').innerHTML = dropdownText;

    var dropdownEl = document.getElementById("dropdown");
    dropdownEl.onchange = function() {
      window.location.href = dropdownEl.value;
    };
      
  } catch(error) {
    console.log(error)
  } 
}
asyncGetCall();  


// Set header
(function () {
  $(function(){
    $("#header").load("header.html",{},() => {
      document.getElementById('header_page_title').innerText = "View Metrics";
    }); 
  });
})();
