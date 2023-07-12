// Set header
(function () {
    $(function(){
      $("#header").load("header.html",{},() => {
        document.getElementById('header_page_title').innerText = "Info";
      }); 
    });
  })();