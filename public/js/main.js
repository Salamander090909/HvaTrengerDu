document.querySelectorAll('.kommenterBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const post = btn.closest('.post');
    const section = post.querySelector('.commentSection');

    section.hidden = !section.hidden;
    post.classList.toggle('aapen', !section.hidden);
  });
});