document.getElementById("validationMsg").style.display = "none";
var setUnitsEl = document.getElementById("setUnits");
var categoryEl = document.getElementById("category");
var unitEl = document.getElementById("unit");
var data;

const displayUnits = () => {
  var index = data.cat.filter( obj => {
    return obj.id === categoryEl.value;
  })
  setUnitsEl.innerText = index[0].units;
  unitEl.value = index[0].units;
}
categoryEl.addEventListener("change", displayUnits);

const asyncGetCall = async () => {
  try {
    const response = await fetch('additem.php');
    data = await response.json();
    
    var catInnerText = '<option style="display:none">';
    var j;
    for (j = 0; j < data.cat.length; j++) {
        catInnerText += "<option value='" + data.cat[j]['id'] + "'>" + data.cat[j]['full'] + "</option>";
    }      
    categoryEl.innerHTML = catInnerText;

  } catch(error) {
    console.log(error)
  } 
}
asyncGetCall()


function validateForm() {
  let a = document.forms["mainForm"]["date"].value;
  let b = document.forms["mainForm"]["category"].value;
  let c = document.forms["mainForm"]["source"].value;
  let d = document.forms["mainForm"]["description"].value;
  let e = document.forms["mainForm"]["amount"].value;
  let g = document.forms["mainForm"]["quantity"].value;
  let h = document.forms["mainForm"]["expiration"].value;
  let i = document.forms['mainForm']["subcategory"].value;

  if (  a == "" ||
        b == "" ||
        c == "" ||
        d == "" ||
        e == "" ||
        g == "" ||
        h == "" ||
        i == "") {
          showLoginError();
          return false;
        }
  else {
    document.getElementById("validationMsg").style.display = "none";
    return true;
  }
}


// Show text after form validation error
function showLoginError() {
  document.getElementById("validationMsg").style.display = "block";
}


// "Subcategory" autocomplete
$(function() {
  $( "#subcategory" ).autocomplete({
      source: function( request, response ) {
          $.ajax({
              url: "autocomplete.php",
              // type: 'GET',
              dataType: "json",
              data: {
                  "subcategory": request.term
              },
              success: function( data ) {
                  var resdata = response( data );
              }
          });
      },
  });
});     

// "Source" autocomplete
$(function() {
  $( "#source" ).autocomplete({
      source: function( request, response ) {
          $.ajax({
              url: "autocomplete.php",
              // type: 'GET',
              dataType: "json",
              data: {
                  "source": request.term
              },
              success: function( data ) {
                  var resdata = response( data );
              }
          });
      },
  });
});     

// "Description" autocomplete
$(function() {
  $( "#description" ).autocomplete({
      source: function( request, response ) {
          $.ajax({
              url: "autocomplete.php",
              // type: 'GET',
              dataType: "json",
              data: {
                  "description": request.term
              },
              success: function( data ) {
                  var resdata = response( data );
              }
          });
      },
  });
});     

// Set header
(function () {
  $(function(){
    $("#header").load("header.html",{},() => {
      document.getElementById('header_page_title').innerText = "Add Item";
    }); 
  });
})();
