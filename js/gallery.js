
searchIcon.addEventListener('click', () => {
    searchIcon.classList.toggle('active');
    searchBox.focus();
});

searchBox.addEventListener('input', () => {
    const query = searchBox.value.toLowerCase();
    galleryItems.forEach(item => {
        const text = item.querySelector('p')?.textContent.toLowerCase() || '';
        item.style.display = text.inc                                                           nludes(query) ? '' : 'none';
    });
});
// Select input and icon
const searchBox = document.querySelector('.search-box');
const searchIcon = document.querySelector('.search-icon');

// Toggle active class on icon when clicked
searchIcon.addEventListener('click', () => {
    searchIcon.classList.toggle('active');
    searchBox.focus(); // focus the input automatically
});

// Gallery search (live filter)
const galleryItems = document.querySelectorAll('.gallery-item');
searchBox.addEventListener('input', () => {
    const query = searchBox.value.toLowerCase();
    galleryItems.forEach(item => {
        const text = item.querySelector('p')?.textContent.toLowerCase() || '';
        item.style.display = text.includes(query) ? '' : 'none';
    });
});
