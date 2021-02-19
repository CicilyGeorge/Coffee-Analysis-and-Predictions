// Function to plot line graph of country's population over time
function displayLineGraph_Production(Data, countryName) {

    // Filter production Data to return only data for matching country name
    let productionData = Data.filter(production => production.Attribute == "Production");
    let countryProduction = productionData.filter(country => country.Country_Name == countryName);

    // console.log(countryProduction);

    // // Extract years and production values from data 
    let years = Object.values(countryProduction['Year']);
    let productionValues = Object.values(countryProduction['Values']);

    console.log(years)
    console.log(productionValues)
    // // Select the first 10 years of data for the actual population graph
    // // Convert year string to number
    // // Plot with both lines and markers for each data point
    // let lineData_actual = {
    //     x: populationYears.slice(0,10).map(i => Number(i)),
    //     y: populationAmounts.slice(0,10),
    //     name: "Actual",
    //     type: "scatter",
    //     mode: "lines+markers"
    // };
      
    // // Select the last three years of data for the predicted population graph
    // // Need to select the last data point of the actual population so graphs
    // // are continuous
    // // Make colour orange and with dotted line to visually differentiate between data sets
    // // Plot with both lines and markers for each data point
    // let lineData_predicted = {
    //     x: populationYears.slice(9,12).map(i => Number(i)),
    //     y: populationAmounts.slice(9,12),
    //     color: "orange",
    //     line: { dash: "dot", width: 4 },
    //     name: "Predicted",
    //     type: "scatter",
    //     mode: "lines+markers"
    // };

    // // Place both data sets together in array
    // let lineData = [lineData_actual, lineData_predicted];

    // // Set title for line graph and x and y axes
    // let lineLayout = {
    //      title: countryName + " - Population Actual and Predicted 1970 to 2050",
    //      xaxis: { title: "Years" },
    //      yaxis: { title: "Population (thousands(k)/ millions(M)/ billions(B))" }
    // };
    
    // // Use plotly to display line graph at div ID "line2" with lineData and lineLayout
    // Plotly.newPlot('line1', lineData, lineLayout);
}


// Initialisation function
function init() {

    // Name and path to JSON file with dataset 
    let pctURL = "/api/pct";

    // Read in JSON from URL
    d3.json(pctURL).then(function(data) {
        // Assign the population data for all countries to variable countryPopulations
        // countryPopulations = data[0].data;

        // Display first country's to console for checking
        // Countries are in ranked order of population
        // console.log(countryPopulations[0]);

        // Display line graph of actual and predicted population for Australia
        displayLineGraph_Production(data, "India");

    });
}

// Call initialisation function
init();