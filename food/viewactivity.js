const getActivity = async () => {
  try {
    const response = await fetch('getactivity.php');
    activityData = await response.json();
          
    var activityInnerText = '<table class="general-table-all"><tr><td class="column-header">Date</td>' + 
                            '<td class="column-header">Action</td><td class="column-header">Description</td>' + 
                            '<td class="column-header">Item</td></tr>';
    
    var j = '';
    for (j = 0; j < activityData.length; j++) {

      var code = activityData[j]['affectedItem'];
      var functionText = 'viewItem("' + code + '")';

        activityInnerText += "<tr><td class='minCol'>" + activityData[j]['activityDate'] + 
          "</td><td>" + activityData[j]['activityType'] +
          "</td><td>" + activityData[j]['description'] + 
          "</td><td class='item-link' onclick='" + functionText + "'>" + activityData[j]['affectedItem'] + "</td></tr>";
    }   
    document.getElementById('activity').innerHTML = activityInnerText;

  } catch(error) {
    console.log(error)
  } 
}
getActivity()


function viewItem(code) {
  localStorage.setItem("code",code);
  window.location = 'viewitem.html';
}


// Set header
(function () {
  $(function(){
    $("#header").load("header.html",{},() => {
      document.getElementById('header_page_title').innerText = "View Activity";
    }); 
  });
})();