const searchBox = document.querySelector('.search-box');
const searchIcon = document.querySelector('.search-icon');
const galleryItems = document.querySelectorAll('.gallery-item');
const images = document.querySelectorAll('.zoom-img');
const popup = document.querySelector('#popup');
const popupImg = document.querySelector('#popup-img');
const closeBtn = document.querySelector('#close');

searchIcon.addEventListener('click', () => {
    searchIcon.classList.toggle('active');
    searchBox.focus();
});
searchBox.addEventListener('input', () => {
    const query = searchBox.value.toLowerCase();
    galleryItems.forEach(item => {
        const text = item.querySelector('p')?.textContent.toLowerCase() || '';
        item.style.display = text.includes(query) ? '' : 'none';
    });
});

images.forEach(img => {
    img.addEventListener('click', () => {
        popup.style.display = "flex";
        popupImg.src = img.src;
    });
});

closeBtn.addEventListener('click', () => {
    popup.style.display = "none";
});

popup.addEventListener('click', e => {
    if (e.target === popup) popup.style.display = "none";
});
