// Case tracker logic

// On initial site load, fetch data
fetch('https://pomber.github.io/covid19/timeseries.json')
    .then(response => response.json())
    .then(data => {
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
const countryAddButton = document.querySelector('#country-add-btn');
countryAddButton.addEventListener('click', () => {
    const countryChoice = document.querySelector('#country-input').value;
    console.log('Chose ' + countryChoice);
});
