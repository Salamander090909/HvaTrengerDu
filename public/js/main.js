document.querySelectorAll('.kommenterBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const post = btn.closest('.post');
        const section = post.querySelector('.commentSection');
        const erApen = section.style.display === 'block';

        section.style.display = erApen ? 'none' : 'block';
        post.classList.toggle('aapen', !erApen);
    });
});