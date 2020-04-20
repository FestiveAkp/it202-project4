// Case tracker logic

// App globals
let countriesToTrack = [];
let chosenStatistic = '';
let countryData = {};
let googleChartArray = [];


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
    deleteButton.addEventListener('click', e => {
        // Get country text
        const countryToDelete = e.target.parentNode.parentNode.childNodes[1].textContent;

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

const createChartButton = document.querySelector('#create-chart');
createChartButton.addEventListener('click', () => {
    const table = document.querySelector('table');

    // Reset table if it already exists
    if (!!document.querySelector('thead')) {
        table.removeChild(document.querySelector('thead'));
        table.removeChild(document.querySelector('tbody'));
    }

    // Break out if nothing's been inputted
    if (countriesToTrack.length === 0 || chosenStatistic === '') return;

    // Reset chart array
    googleChartArray = [];

    // Create table head
    const tableHead = document.createElement('thead');
    const tableHeadRow = document.createElement('tr');
    tableHeadRow.classList.add('mdc-data-table__header-row');
    tableHead.appendChild(tableHeadRow);
    table.appendChild(tableHead);

    // Create date header
    const dateHeader = document.createElement('th');
    dateHeader.classList.add('mdc-data-table__header-cell');
    dateHeader.setAttribute('role', 'columnheader');
    dateHeader.setAttribute('scope', 'col');
    dateHeader.textContent = 'Date';
    tableHeadRow.appendChild(dateHeader);
    googleChartArray.push(['Date']);

    // Create headers for each country
    countriesToTrack.forEach(country => {
        const newColumn = document.createElement('th');
        newColumn.classList.add('mdc-data-table__header-cell');
        newColumn.setAttribute('role', 'columnheader');
        newColumn.setAttribute('scope', 'col');
        newColumn.textContent = country;

        tableHeadRow.appendChild(newColumn);
        googleChartArray[0].push(country);
    });

    // Create table body
    const tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    // Populate table with data
    const datapoints = countryData[countriesToTrack[0]].length;

    for (let i = 0; i < datapoints; i++) {
        // Create table row
        const row = document.createElement('tr');
        row.classList.add('mdc-data-table__row');

        // Add date
        const date = document.createElement('td');
        date.classList.add('mdc-data-table__cell');
        date.textContent = countryData.Afghanistan[i].date;
        row.appendChild(date);
        googleChartArray.push([date.textContent]);

        // Create data nodes for each country
        countriesToTrack.forEach(country => {
            // Chosen statistic
            const stat = document.createElement('td');
            stat.classList.add('mdc-data-table__cell');
            
            stat.textContent = countryData[country][i][chosenStatistic];

            row.append(stat);
            tableBody.appendChild(row);
            googleChartArray[i+1].push(parseInt(stat.textContent));
        });
    }
    
    // Set table view header according to chosen statistic
    let tableViewHeader = 'Chart of ';
    switch (chosenStatistic) {
        case 'confirmed':
            tableViewHeader += 'confirmed cases';
            break;
        case 'deaths':
            tableViewHeader += 'deaths';
            break;
        case 'recovered':
            tableViewHeader += 'recovered cases';
            break;
    }
    tableViewHeader += ' over time';
    document.querySelector('h1#chart-header').textContent = tableViewHeader;

    // Navigate to table screen
    document.querySelector('a[href="#table"]').click();                 

    // Delete placeholder text inside chart view
    document.querySelector('h1#chart-placeholder').remove();

    // Create chart
    google.charts.load('current', {'packages':['corechart', 'line']});
    const drawChart = () => {
        const data = google.visualization.arrayToDataTable(googleChartArray);

        const options = {
            title: 'Cases over time',
            curveType: '',
            legend: { position: 'bottom' },
            width: 1200,
            height: 800,
            hAxis: {
                title: 'Time',
                showTextEvery: 12
            },
            vAxis: {
                title: '# of cases'
            }
        };

        const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        chart.draw(data, options);
    }
    google.charts.setOnLoadCallback(drawChart);
});

// Enter the chart view whenever 'Show Chart' button is clicked
document.querySelector('button#show-chart').addEventListener('click', () => {
    document.querySelector('a[href="#chart"]').click();
});
