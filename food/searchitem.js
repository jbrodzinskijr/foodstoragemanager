// Autocomplete
$(function() {
  $( "#search" ).autocomplete({
    classes: {
        "ui-autocomplete" : "jb-autocomplete"
    },
        minLength: 3, 
        source: function( request, response ) {
            $.ajax({
                url: "searchitem.php",
                // type: 'GET',
                dataType: "json",
                data: {
                    "search": request.term
                },
                success: function( data ) {
                    var resdata = response( data );
                }
            });
        },
  });
});     

// Hidden at load
document.getElementById("validationMsg").style.display = "none";

// Show text after form validation error
function showLoginError() {
    document.getElementById("validationMsg").style.display = "block";
}

function submitSearch() {
    var a = document.getElementById("search").value;
    if (a === "") {
        showLoginError();
    } else {
        displayRecord();
    }
}

function displayRecord() {
    var code = document.getElementById("search").value.slice(0, 8);
    localStorage.setItem("code",code);
    window.location = 'viewitem.html';
}

// Set header
(function () {
    $(function(){
      $("#header").load("header.html",{},() => {
        document.getElementById('header_page_title').innerText = "Search Item";
      }); 
    });
  })();