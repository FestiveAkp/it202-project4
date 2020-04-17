// Function that hides any views that are currently displayed
const hideViews = () => {
    const views = document.querySelectorAll('div.view');
    views.forEach(view => view.style.display = 'none');
}

// On initial site load, show correct view based on URL hash,
// so that if you visit /index.html#chart, it will show the chart view
const urlHash = window.location.hash;
const pages = ['#search', '#table', '#chart'];

const pageToShow = pages.includes(urlHash) ? urlHash : '#search';
document.querySelector(pageToShow).style.display = 'block';

// Add navigation between pages using app bar buttons
const topAppBarButtons = document.querySelectorAll('a.mdc-top-app-bar__action-item--unbounded');
topAppBarButtons.forEach(button => {
    button.addEventListener('click', () => {
        hideViews();
        const destination = button.getAttribute('href');
        document.querySelector(destination).style.display = 'block';
        
        console.log('going to: ' + destination);
    });
});
