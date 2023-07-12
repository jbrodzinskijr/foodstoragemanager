const asyncGetCall = async () => {
    try {
      const response = await fetch('viewcurrent.php');
      const data = await response.json();
      
      var tableInnerText =  '<table class="general-table-all"><tr><td class="column-header">Category</td>' + 
                            '<td class="column-header">Subcategory</td><td class="column-header">' + 
                            'Code / Description</td><td class="column-header">Start</td></tr>';
      var k;

      for (k = 0; k < data.length; k++) {
        var currentCode = data[k]["code"];
        var functionText = 'viewItem("' + currentCode + '")';
          tableInnerText += "<tr><td>" + data[k]['category'] + "</td><td>" + data[k]['subcategory'] + 
                            "</td><td class='item-link' onclick='" + functionText + "'>" + currentCode + 
                            ", " + data[k]['description'] + "</td><td>" + data[k]['start'] + "</td></tr>";
      }   
      
      tableInnerText += '</table>';
      document.getElementById('current').innerHTML = tableInnerText;
  
    } catch(error) {
      console.log(error)
    } 
  }
  asyncGetCall()  


function viewItem(currentCode) {
  localStorage.setItem("code",currentCode);
  window.location = 'viewitem.html';
}


// Set header
(function () {
  $(function(){
    $("#header").load("header.html",{},() => {
      document.getElementById('header_page_title').innerText = "View Current";
    }); 
  });
})();