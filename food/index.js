document.getElementById('exp_table').style.display = "none";
document.getElementById('soon_table').style.display = "none";

let alertData;
let activityData;
var soonPreviewText = '';
var expPreviewText = '';
      
const expiryCheck = async () => {
    try {
      const response = await fetch('expcheck.php');
      alertData = await response.json();
            
      var j = '';
      j = alertData.soon_items.length;
      if (j == 1) {
        soonPreviewText = 'There is ' + j + ' item expiring soon.';
      } else if (j > 1) {
        soonPreviewText = 'There are ' + j + ' items expiring soon.';
      }
      document.getElementById('soon_data').innerHTML = soonPreviewText;
      if (j > 0) {
        document.getElementById('soon_table').style.display = "block";
      }

      var k;
      k = alertData.exp_items.length;
      if (k == 1) {
        expPreviewText = 'There is ' + k + ' item that has expired.';
      } else if (k > 1) {
        expPreviewText = 'There are ' + k + ' items that have expired.';
      }
      document.getElementById('exp_data').innerHTML = expPreviewText;
      if (k > 0) {
        document.getElementById('exp_table').style.display = "block";
      }
  
      soonInnerText = soonTableInnerText();
      expInnerText = expTableInnerText();

    } catch(error) {
      console.log(error)
    } 
  }
  expiryCheck()


const getActivity = async () => {
  try {
    const response = await fetch('getactivity.php?need=recent');
    activityData = await response.json();
             
    var activityInnerText = '';
 
    var j = '';
    for (j = 0; j < activityData.length; j++) {

      var code = activityData[j]['affectedItem'];
      var functionText = 'viewItem("' + code + '")';

        activityInnerText += "<tr><td>" + activityData[j]['activityDate'] + 
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


// Expiring soon table setup
var soonInnerText = '';
function soonTableInnerText() {
  var soonInnerText = '<table>';
  var j = '';
  for (j = 0; j < alertData.soon_items.length; j++) {
      soonInnerText += "<tr><td>" + alertData.soon_items[j]["code"] + ", " + alertData.soon_items[j]["description"] + "</td></tr>";
  }   
  soonInnerText += "</table>";   
  return soonInnerText;
}

var soonTableStatus = 0;
function toggleSoonTable() {
  if (soonTableStatus == 0) {
    document.getElementById('soon_data').innerHTML = soonInnerText;
    soonTableStatus = 1;
  } else if (soonTableStatus == 1) {
    document.getElementById('soon_data').innerHTML = soonPreviewText;
    soonTableStatus = 0;
  }
}

// Expired table setup
var expInnerText = '';
function expTableInnerText() {
  var expInnerText = '<table>';
  var j = '';
  for (j = 0; j < alertData.exp_items.length; j++) {
      expInnerText += "<tr><td>" + alertData.exp_items[j]["code"] + ", " + alertData.exp_items[j]["description"] + "</td></tr>";
  }   
  expInnerText += "</table>";   
  return expInnerText;
}

var expTableStatus = 0;
function toggleExpTable() {
  if (expTableStatus == 0) {
    document.getElementById('exp_data').innerHTML = expInnerText;
    expTableStatus = 1;
  } else if (expTableStatus == 1) {
    document.getElementById('exp_data').innerHTML = expPreviewText;
    expTableStatus = 0;
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
      document.getElementById('header_page_title').innerText = "Food Storage Manager Home";
    }); 
  });
})();
