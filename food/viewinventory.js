var filterCat, filterSub, filterStatus;


const asyncGetCall = async (fCat, fStatus) => {
  try {

    // Build request
    var request = '';
    request = 'viewinventory.php?getall=true';
    if (fStatus !== undefined) {
      if (fCat !== undefined) {
        request = 'viewinventory.php?status=' + fStatus + '&cat=' + fCat;
      } else {
        request = 'viewinventory.php?status=' + fStatus;
      }
    } else {
      if (fCat !== undefined) {
        request = 'viewinventory.php?cat=' +fCat;
      }
    }

    // Make request
    const response = await fetch(request);
    const json = await response.json();
    const data = json.data;

    // Build table structure
    var tableInnerText =  '<table class="general-table-all"><tr><td>' + 
                          '<img id="filterIcon" src="images/filter.png" height="20" width="20"></td>' + 
                          '<td colspan="3"><div class="flexRowCenter paddings innerWidth" id="filterDropdowns">' + 
                          '<span><select id="statusFilter" name="statusFilter" class="general-input"></select></span>' + 
                          '<span><select id="catFilter" name="catFilter" class="general-input"></select></span>' + 
                          '<button id="applyButton" name="applyButton">Apply</button></div></td></tr>' +
                          '<tr><td class="column-header">Code</td><td class="column-header">Subcategory</td>' + 
                          '<td class="column-header">Description</td><td class="column-header">Status</td></tr>';

    for (var k = 0; k < data.length; k++) {
      var code = data[k]["code"];
      var functionText = "viewItem('" + code + "')";  
      tableInnerText += '<tr><td class="item-link" onclick="' + functionText + '">' + data[k]["code"] + 
                        '</td><td>' + data[k]["subcategory"] + '</td><td>' + data[k]["description"] + 
                        '</td><td class="' + data[k]["statusCode"] + '"> ' + data[k]["status"] + '</td></tr>';
    }   
    
    tableInnerText += '</table>';
    document.getElementById('inventory').innerHTML = tableInnerText;

    // Build statusFilter dropdown
    var statusDropdownText = '<option disabled selected value> -- Status -- </option>';
    var statusValues = ["Stock", "In Use", "Done"];

    for (var j = 0; j < statusValues.length; j++) {
        statusDropdownText += "<option value='" + j + "'>" + statusValues[j] + "</option>";
    }      
    var statusDropdownEl = document.getElementById("statusFilter");
    statusDropdownEl.innerHTML = statusDropdownText;
    
    // Build catFilter dropdown 
    var catDropdownText = '<option disabled selected value> -- Category -- </option>';
    var cats = json.cats;
    for (var j = 0; j < cats.length; j++) {
        var value = cats[j].slice(0, 3);
        catDropdownText += "<option value='" + value + "'>" + cats[j] + "</option>";
    }      
    var catDropdownEl = document.getElementById("catFilter");
    catDropdownEl.innerHTML = catDropdownText;


    // Apply button
    var applyButton = document.getElementById("applyButton");
    applyButton.addEventListener("click", applyFilters);


    // Filter icon toggle
    document.getElementById("filterIcon").addEventListener("click", toggleDropdowns);
    document.getElementById("filterDropdowns").style.display = "none";
    
  } catch(error) {
    console.log(error)
  } 
}
asyncGetCall();  

const applyFilters = () => {
  var filterStatus, filterCat;

  if (!document.getElementById("statusFilter").value) {
    filterStatus = undefined;
  } else {
    filterStatus = document.getElementById("statusFilter").value;
  }

  if (!document.getElementById("catFilter").value) {
    filterCat = undefined;
  } else {
    filterCat = document.getElementById("catFilter").value;
  }
  
  asyncGetCall(filterCat, filterStatus);
  
}

const toggleDropdowns = () => {
  const filterDropdowns = document.getElementById("filterDropdowns");
  if (filterDropdowns.style.display === "none") {
    filterDropdowns.style.display = "block";
  } else {
    filterDropdowns.style.display = "none";
  }
}


function viewItem(code) {
    localStorage.setItem("code",code);
    window.location = 'viewitem.html';
}


// Set header
(function () {
  $(function(){
    $("#header").load("header.html",{},() => {
      document.getElementById('header_page_title').innerText = "View Inventory";
    }); 
  });
})();