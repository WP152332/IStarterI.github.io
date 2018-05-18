var i = 0;
var introUrl = ['어서오세요! 당신을 기다렸습니다.', '이 곳은 저의 이야기가 담긴 장소입니다.', '빈틈이 많은 만큼 더욱 친숙하고', '부족한 점이 많은 만큼 성장이 가능한', '저의 성장 이야기가 담겨있는 장소 입니다.', '사진들을 클릭하시면 더욱 자세한 정보를 보실 수 있습니다.']
var imgUrl = ['Me', 'School', 'Me', 'School', 'Me', 'School'];

document.getElementById("Prev").onclick = function() {
  if(i > 0) i -= 1;
  else i = introUrl.length - 1;
  document.getElementById("Intro").innerHTML = introUrl[i];
  document.getElementById("View").src = "./img/" + imgUrl[i] + ".jpg";
  document.getElementById("ViewLink").href = "./" + imgUrl[i] + ".html";
}

document.getElementById("Next").onclick = function() {
  if(i < introUrl.length - 1) i += 1;
  else i = 0;
  document.getElementById("Intro").innerHTML = introUrl[i];
  document.getElementById("View").src = "./img/" + imgUrl[i] + ".jpg";
  document.getElementById("ViewLink").href = "./" + imgUrl[i] + ".html";
}
