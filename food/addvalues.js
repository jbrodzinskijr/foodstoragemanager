// Run addvalues.php to grab list info from database
const getValues = async () => {
    try {
      const response = await fetch('addvalues.php');
      valuesData = await response.json();
            
      var catSelectInnerText = '';
      for (var i = 0; i < valuesData["cats"].length; i++) {
        catSelectInnerText += '<a href="#">' + valuesData["cats"][i] + '</a>';
      }
      document.getElementById('categoriesDropdown').innerHTML = catSelectInnerText;
      
      var unitsSelectInnerText = '';
      var catUnitsSelect = '';
      for (var i = 0; i < valuesData["units"].length; i++) {
        unitsSelectInnerText += '<a href="#">' + valuesData["units"][i] + '</a>';
        catUnitsSelect += '<option>' + valuesData["units"][i] + '</option>';
      }
      document.getElementById('unitsDropdown').innerHTML = unitsSelectInnerText;
      document.getElementById('cat_units_select').innerHTML = catUnitsSelect;

    } catch(error) {
      console.log(error)
    } 
  }
  getValues()



function catDropdown() {
    document.getElementById("categoriesDropdown").classList.toggle("show");
}

function unitDropdown() {
    document.getElementById("unitsDropdown").classList.toggle("show");
}
    
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
        }
    }
    }
}


// Validation
document.getElementById("validationMsg").style.display = "none";

function validateCatForm() {
  let a = document.forms["catForm"]["category"].value;
  let b = document.forms["catForm"]["full_category"].value;

  if ( a == "" || b == "") {
          showFormError();
          return false;
        }
  else {
    document.getElementById("validationMsg").style.display = "none";
    return true;
  }
}

function validateUnitForm() {
  let a = document.forms["unitForm"]["unit"].value;

  if ( a == "" ) {
          showFormError();
          return false;
        }
  else {
    document.getElementById("validationMsg").style.display = "none";
    return true;
  }
}

function showFormError() {
  document.getElementById("validationMsg").style.display = "block";
}

// Set header
(function () {
  $(function(){
    $("#header").load("header.html",{},() => {
      document.getElementById('header_page_title').innerText = "Add Values";
    }); 
  });
})();