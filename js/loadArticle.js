window.addEventListener("load",function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4 && xhr.status==200){
			document.getElementById("article").innerHTML = marked(xhr.responseText);
        }
    }
    xhr.open("GET", "index.md", true);
    xhr.send();
},false);