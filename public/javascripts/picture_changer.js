const imgEl = document.getElementById('house-picture-img');
let i = 0;

// Add event listeners, if elements exist.
if(document.getElementById('nav-picture-prev')) document.getElementById('nav-picture-prev').addEventListener('click', prevPicture);
if(document.getElementById('nav-picture-next')) document.getElementById('nav-picture-next').addEventListener('click', nextPicture);

function nextPicture() {
  i++;
  if(i >= pictureList.length) i = 0;  // Wrap past end of list, back to beginning.
  imgEl.src = pictureList[i];
}

function prevPicture() {
  i--;
  if(i < 0) i = pictureList.length - 1;  // Wrap past beginning of list, back to end.
  imgEl.src = pictureList[i];
}
