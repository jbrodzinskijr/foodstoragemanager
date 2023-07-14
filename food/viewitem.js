// Hidden at load
document.getElementById("submitButton").style.display = "none";
var validationMsgEl = document.getElementById("validationMsg");
validationMsgEl.style.display = "none";

// Fetching record
function displayRecord() {
  var record = localStorage.getItem("code");
  
  if (record == "") {
          showLoginError();
          return false;
        }
  else {
    
    const fetchRecord = async () => {
      try {
        var cat = record.slice(0, 5);
        var sub = record.slice(6, 8);
        var url = 'searchitem.php?cat=' + cat + '&sub=' + sub;
        const response = await fetch(url);
        const data = await response.json();
        localStorage.setItem("data", JSON.stringify(data));
        
        document.getElementById("record").style.display = "block";

        document.getElementById("date_value").innerText = data[0].date;
        document.getElementById("code_value").innerText = data[0].code;
        document.getElementById("subcategory_value").innerText = data[0].subcategory;
        document.getElementById("source_value").innerText = data[0].source;
        document.getElementById("description_value").innerText = data[0].description;
        document.getElementById("amount_value").innerText = data[0].amount;
        document.getElementById("unit_value").innerText = data[0].unit;
        document.getElementById("quantity_value").innerText = data[0].quantity;
        document.getElementById("total_value").innerText = data[0].total;
        document.getElementById("expiration_value").innerText = data[0].expiration;
        document.getElementById("start_value").innerText = data[0].start;
        document.getElementById("end_value").innerText = data[0].end;
        document.getElementById("inUse_value").innerText = data[0].inUse;
        document.getElementById("rate_value").innerText = data[0].rate;
        if (data[0].price) {
          document.getElementById("price_value").innerText = "$" + data[0].price;
        }
        if (data[0].pricePerUnit) {
          document.getElementById("pricePerUnit_value").innerText = "$" + data[0].pricePerUnit;
        }
        return true;
        
      } catch(error) {
        console.log(error)
      } 
    }
    fetchRecord();
  }

}
displayRecord();

function editValue(id) {

  document.getElementById("submitButton").style.display = "block";
  var elementID = id + "_value";
  var tag = "change_" + id;
  const element = document.getElementById(elementID);
  var current = element.innerText;
  element.setAttribute("onclick", "");
  var type;

  switch (id) {
    case "date":
    case "start": 
    case "end":
    case "expiration":
      type = "date";
      break;
    case "amount":
    case "quantity":
      type = "number";
      break;
    default:
      type = "text";
  }

  document.getElementById(elementID).innerHTML = 
    '<input type="' + type + '" id="' + tag + '" name="' + tag 
    + '" class="general-input" placeholder="' + current + '"></input>';
}


function submitUpdate() {
  var data = {};

  data.code = document.getElementById("code_value").innerText;

  if (document.getElementById("change_date")) {
    var date = document.getElementById("change_date").value;
    data.date = date;
  }

  if (document.getElementById("change_subcategory")) {
    var subcategory = document.getElementById("change_subcategory").value;
    data.subcategory = subcategory;
  }

  if (document.getElementById("change_source")) {
    var source = document.getElementById("change_source").value;
    data.source = source;
  }

  if (document.getElementById("change_description")) {
    var description = document.getElementById("change_description").value;
    data.description = description;
  }

  if (document.getElementById("change_amount")) {
    var amount = document.getElementById("change_amount").value;
    var quantity = document.getElementById("quantity_value").innerText;
    data.amount = amount;
    data.oldQuantity = quantity;
  }

  if (document.getElementById("change_unit")) {
    var unit = document.getElementById("change_unit").value;
    data.unit = unit;
  }

  if (document.getElementById("change_quantity")) {
    var quantity = document.getElementById("change_quantity").value;
    var amount = document.getElementById("amount_value").innerText;
    data.quantity = quantity;
    data.oldAmount = amount;
  }

  if (document.getElementById("change_expiration")) {
    var expiration = document.getElementById("change_expiration").value;
    data.expiration = expiration;
  }


  var newStart, oldStart, newEnd, oldEnd;
  var storageData = JSON.parse(localStorage.getItem("data"));
  var oldStartValue = storageData[0].start;
  var oldEndValue = storageData[0].end;
  if (document.getElementById("change_start")) {
    // Start is changed
    newStart = document.getElementById("change_start").value;
    if (newStart == 0) {
      // start changed to null, set start, end, inUse, and rate to null
      data.start = null;
      data.end = null;
      data.inUse = null;
      data.rate = null;
    } else if (newStart != 0) {
      if (!document.getElementById("change_end")) {
        if (document.getElementById("end_value").innerText != 0) {
          // set start and calculate inUse and rate 
          console.log("Code: 2");
          oldEnd = document.getElementById("end_value").innerText;
          const code2Result = calculateSEIR(newStart, oldEnd);
          data.start = newStart;
          data.end = code2Result[0];
          data.inUse = code2Result[1];
          data.rate = code2Result[2];
        } else {
          // set start 
          data.start = newStart;
        }
      } else {
        if (document.getElementById("change_end").value == 0) {
          // set start, set end, inUse, and rate to null
          data.start = newStart;
          data.end = null;
          data.inUse = null;
          data.rate = null;
        } else {
          // set start, end, inUse, and rate
          newEnd = document.getElementById("change_end").value;
          const code11Result = calculateSEIR(newStart, newEnd);
          data.start = newStart;
          data.end = code11Result[0];
          data.inUse = code11Result[1];
          data.rate = code11Result[2];
        }
      }
    } 
  } else if (document.getElementById("start_value").innerText == 0) {
    // start is not changed, and does not have a value
    if (document.getElementById("change_end")) {
      if (document.getElementById("change_end").value == 0) {
        // end is changed to 0, but start was not set; no action
      } else {
        validationMsgEl.innerHTML = "You can't set an End date without a Start date.<br>" + 
                                    "That's like... well it's like something.";
        validationMsgEl.style.display = "block";
      }
    } 
  } else if (document.getElementById("start_value").innerText != 0) {
    // start is not changed, but has a value
    if (document.getElementById("change_end")) {
      if (document.getElementById("change_end").value == 0) {
        if (oldEndValue === null) {
          // end is not changed; no action
        } else {
          // end set to 0
          data.end = null;
          data.inUse = null;
          data.rate = null;
        }
      } else {
        // end changed; calculate end, inUse, and rate
        oldStart = document.getElementById("start_value").innerText;
        newEnd = document.getElementById("change_end").value;
        const code9Result = calculateSEIR(oldStart, newEnd);
        data.end = code9Result[0];
        data.inUse = code9Result[1];
        data.rate = code9Result[2];
      }
    } else {
      // neither start nor end are being updated; no action
    }
  }


  function calculateSEIR(start, end) {
    
    end = end.replace(/-/g,'/');
    start = start.replace(/-/g,'/');

    var startDate = new Date(start);
    var endDate = new Date(end);
    var difference = endDate.getTime() - startDate.getTime();

    inUse = Math.floor(difference / (1000 * 60 * 60 * 24)); 
    rate = document.getElementById("total_value").innerText / inUse * 7;
    rate = rate.toFixed(2);

    return [end, inUse, rate];
  }


  if (document.getElementById("change_price")) {
    var price = document.getElementById("change_price").value;
    var totalValue = document.getElementById("total_value").innerText;
    var pricePerUnit = (price / totalValue);
    pricePerUnit = pricePerUnit.toFixed(4);

    data.price = price;
    data.pricePerUnit = pricePerUnit;
  }


  const updateRecord = async () => {
    try {
      var url = 'updateitem.php';
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      window.location = 'index.html';

    } catch(error) {
      console.log(error)
    } 
  }
  updateRecord();
  
}

function deletePrompt() {
  if (confirm('Are you sure you want to delete this item?')) {
    deleteItem();
  } else {
  }
}



function deleteItem() {

  var data = {};
  data.code = document.getElementById("code_value").innerText;
  
  const runDeleteScript = async () => {
    try {
      var url = 'deleteitem.php';
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      window.location = 'index.html';

    } catch(error) {
      console.log(error)
    } 
  }
  runDeleteScript();
}


// Set header
(function () {
  $(function(){
    $("#header").load("header.html",{},() => {
      document.getElementById('header_page_title').innerText = "View Item";
    }); 
  });
})();
