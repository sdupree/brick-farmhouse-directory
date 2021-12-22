const imgEl = document.getElementById('house-picture-img');
let i = 0;

if(document.getElementById('nav-picture-prev')) document.getElementById('nav-picture-prev').addEventListener('click', prevPicture);
if(document.getElementById('nav-picture-next')) document.getElementById('nav-picture-next').addEventListener('click', nextPicture);

function nextPicture() {
  i++;
  if(i >= pictureList.length) i = 0;
  imgEl.src = pictureList[i];
}

function prevPicture() {
  i--;
  if(i < 0) i = pictureList.length - 1;
  imgEl.src = pictureList[i];
}
