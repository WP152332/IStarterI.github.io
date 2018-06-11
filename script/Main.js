let i = 0;
const introUrl = ['어서오세요! 당신을 기다렸습니다.', '이 곳은 한 고등학생의 이야기가 담긴 장소입니다.', '빈틈도 부족한 점도 많지만', '그만큼 성장 될 것이라 예상되는', '바로 저의 이야기들이 담겨있습니다.', '사진들을 클릭하여 제 이야기들을 살펴보세요.']
const imgUrl = ['Me', 'School', 'Me', 'School', 'Me', 'School'];
const hrefUrl = ['Me', 'One', 'Two', 'Three', 'Game', 'School'];

document.getElementById("Prev").onclick = function() {
  if(i > 0) i -= 1;
  else i = introUrl.length - 1;
  document.getElementById("Intro").innerHTML = introUrl[i];
  document.getElementById("View").src = "./img/" + imgUrl[i] + ".jpg";
  document.getElementById("ViewLink").href = "./" + hrefUrl[i] + ".html";
}

document.getElementById("Next").onclick = function() {
  if(i < introUrl.length - 1) i += 1;
  else i = 0;
  document.getElementById("Intro").innerHTML = introUrl[i];
  document.getElementById("View").src = "./img/" + imgUrl[i] + ".jpg";
  document.getElementById("ViewLink").href = "./" + imgUrl[i] + ".html";
}
