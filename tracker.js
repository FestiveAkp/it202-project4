// Case tracker logic

// App globals
let countriesToTrack = [];
let countryData = {};


// Function that creates a new MCW country list item
const createCountryListItem = countryName => {
    // Create parent li
    const listItem = document.createElement('li');
    listItem.classList.add('mdc-list-item');

    // Create text
    const countryText = document.createElement('span');
    countryText.classList.add('mdc-list-item__text');
    countryText.textContent = countryName;

    // Create delete button inside list graphic area
    const graphic = document.createElement('span');
    graphic.classList.add('mdc-list-item__graphic');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('mdc-icon-button', 'material-icons');
    deleteButton.textContent = 'delete';
    graphic.appendChild(deleteButton);

    // Add event listener for deleting country list item
    deleteButton.addEventListener('click', (e) => {
        // Get country text
        const countryToDelete = e.target.parentNode.parentNode.childNodes[0].textContent;

        // Filter out country from global array and remove DOM node
        countriesToTrack = countriesToTrack.filter(country => country !== countryToDelete);
        e.target.parentNode.parentNode.remove();
        console.log('Untracking ' + countryToDelete);
    });

    // Append text and meta to parent list item
    listItem.appendChild(graphic);
    listItem.appendChild(countryText);

    // Return newly created DOM node
    return listItem;
}


// On initial site load, fetch data
fetch('https://pomber.github.io/covid19/timeseries.json')
    .then(response => response.json())
    .then(data => {
        // Store API response
        countryData = data;

        // Populate country input datalist with country items
        const countries = Object.keys(data);
        const countryDatalist = document.querySelector('#countries');
        countries.forEach(country => {
            const countryOption = document.createElement('option');
            countryOption.setAttribute('value', country);
            countryDatalist.appendChild(countryOption);
        });
    });


// Get the value from the country input whenever add button is pressed
const countryAddButton = document.querySelector('button#add-country');
countryAddButton.addEventListener('click', () => {
    // Get the value inside the country input
    const countryChoice = document.querySelector('#country-input').value;

    // If it's valid, push it to the tracking list and add to the DOM
    const isActualCountry = Object.keys(countryData).includes(countryChoice);
    const isNotAlreadyTracked = !countriesToTrack.includes(countryChoice);
    const isNotEmpty = countryChoice !== '';

    if (isActualCountry && isNotAlreadyTracked && isNotEmpty) {
        countriesToTrack.push(countryChoice);
        const newCountryListItem = createCountryListItem(countryChoice);
        document.querySelector('ul.country-tracking-list').appendChild(newCountryListItem);
        console.log('Now tracking ' + countryChoice);
    }
    else {
        console.log('Invalid choice, ignoring...');
    }

    // Reset country input field
    document.querySelector('#country-input').value = '';
});
