document.querySelectorAll('.kommenterBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const post = btn.closest('.post');
    const section = post.querySelector('.commentSection');

    section.hidden = !section.hidden;
    post.classList.toggle('aapen', !section.hidden);
  });
});

document.querySelectorAll('.likeBtn').forEach(btn => {
  let liked = false;
  let count = 0;

  btn.addEventListener('click', () => {
    const countEl = btn.querySelector('.likeCount');
    const icon = btn.querySelector('i');

    liked = !liked;
    count += liked ? 1: -1;
    countEl.innerText = count; 

    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid')
  });
});