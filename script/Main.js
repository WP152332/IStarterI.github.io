var i = 0;
var imgUrl = ['Me', 'School'];

document.getElementById("Prev").onclick = function() {
  if(i > 0) {
    i -= 1;
    document.getElementById("View").src = "./img/" + imgUrl[i] + ".jpg";
    document.getElementById("ViewLink").href = "./" + imgUrl[i] + ".html";
  }
}

document.getElementById("Next").onclick = function() {
  if(i < imgUrl.length - 1) {
    i += 1;
    document.getElementById("View").src = "./img/" + imgUrl[i] + ".jpg";
    document.getElementById("ViewLink").href = "./" + imgUrl[i] + ".html";
  }
}
