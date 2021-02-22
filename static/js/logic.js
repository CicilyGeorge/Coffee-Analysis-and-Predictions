var apiData;


// Function to plot line graph of country's production over time
function displayLineGraph_Production(Data, countryName) {

    // Filter production Data to return only data for matching country name
    let productionData = Data.filter(production => production.Attribute == "Production");
    let countryProduction = productionData.filter(country => country.Country_Name == countryName);
    countryProduction = countryProduction.filter(country => country.Year >= 1990);

    // Filter Arabica Data to return only data for matching country name
    let ArabicaData = Data.filter(production => production.Attribute == "Arabica Production");
    let ArabicaProduction = ArabicaData.filter(country => country.Country_Name == countryName);
    ArabicaProduction = ArabicaProduction.filter(country => country.Year >= 1990);

    // Filter Robusta Data to return only data for matching country name
    let RobustaData = Data.filter(production => production.Attribute == "Robusta Production");
    let RobustaProduction = RobustaData.filter(country => country.Country_Name == countryName);
    RobustaProduction = RobustaProduction.filter(country => country.Year >= 1990);




    let yearsP = [];
    let productionValues = [];

    for (let i=0; i < countryProduction.length; i++) {
    // Extract years and production values from data 
        yearsP.push(countryProduction[i].Year);
        productionValues.push(countryProduction[i].Value);
    }

    let yearsA = [];
    let ArabicaValues = [];

    for (let i=0; i < ArabicaProduction.length; i++) {
    // Extract years and production values from data 
        yearsA.push(ArabicaProduction[i].Year);
        ArabicaValues.push(ArabicaProduction[i].Value);
    }

    let yearsR = [];
    let RobustaValues = [];

    for (let i=0; i < RobustaProduction.length; i++) {
    // Extract years and production values from data 
        yearsR.push(RobustaProduction[i].Year);
        RobustaValues.push(RobustaProduction[i].Value);
    }




    // Plot Production data points
    let lineData_prod = {
        x: yearsP,
        y: productionValues,
        name: "Total Production",
        type: "scatter",
        mode: "lines+markers"
    };
      

    // Plot Arabica Production points
    let lineData_arabica = {
        x: yearsA,
        y: ArabicaValues,
        color: "orange",
        name: "Arabica Production",
        type: "line"
    };

    // Plot Robusta Production points
    let lineData_robusta = {
        x: yearsR,
        y: RobustaValues,
        color: "green",
        name: "Robusta Production",
        type: "line"
    };


    // // Place both data sets together in array
    let lineData = [lineData_prod, lineData_arabica, lineData_robusta];  // , lineData_predicted

    // Set title for line graph and x and y axes
    let lineLayout = {
         title: countryName + " - Coffee Production Total, Arabica and Robusta Separate  1990 to 2020",
         xaxis: { title: "Years" },
         yaxis: { title: "Production (1000 * 60 Kg Bags)" }
    };
    
    // Use plotly to display line graph at div ID "line2" with lineData and lineLayout
    Plotly.newPlot('prodLine', lineData, lineLayout);
}



// Function to plot line graph of country's Domestic Consumption over time
function displayLineGraph_DomConsumption(Data, countryName) {

    // Filter Consumption Data to return only data for matching country name
    let consumptionData = Data.filter(consumption => consumption.Attribute == "Domestic Consumption");
    let countryConsumption = consumptionData.filter(country => country.Country_Name == countryName);
    countryConsumption = countryConsumption.filter(country => country.Year >= 1990);

    // Filter Roast,Ground Consumption to return only data for matching country name
    let roastData = Data.filter(consumption => consumption.Attribute == "Rst,Ground Dom. Consum");
    let roastConsumption = roastData.filter(country => country.Country_Name == countryName);
    roastConsumption = roastConsumption.filter(country => country.Year >= 1990);

    // Filter Soluble Consumption Data to return only data for matching country name
    let solubleData = Data.filter(consumption => consumption.Attribute == "Soluble Dom. Cons.");
    let solubleConsumption = solubleData.filter(country => country.Country_Name == countryName);
    solubleConsumption = solubleConsumption.filter(country => country.Year >= 1990);


    let yearsC = [];
    let consumptionValues = [];

    for (let i=0; i < countryConsumption.length; i++) {
        yearsC.push(countryConsumption[i].Year);
        consumptionValues.push(countryConsumption[i].Value);
    }

    let yearsRG = [];
    let roastValues = [];

    for (let i=0; i < roastConsumption.length; i++) {
        yearsRG.push(roastConsumption[i].Year);
        roastValues.push(roastConsumption[i].Value);
    }

    let yearsS = [];
    let solubleValues = [];

    for (let i=0; i < solubleConsumption.length; i++) {
        yearsS.push(solubleConsumption[i].Year);
        solubleValues.push(solubleConsumption[i].Value);
    }




    // Plot Consumption data points
    let lineData_cons = {
        x: yearsC,
        y: consumptionValues,
        line: { color: "gray"},
        name: "Total",
        type: "scatter",
        mode: "lines+markers"
    };
      

    // Plot Roast Consumption points
    let lineData_roast = {
        x: yearsRG,
        y: roastValues,
        line: { color: "brown"},
        name: "Roast, Ground",
        type: "line"
    };

    // Plot Soluble Consumption points
    let lineData_soluble = {
        x: yearsS,
        y: solubleValues,
        line: { color: "black"},
        name: "Soluble",
        type: "line"
    };


    // // Place both data sets together in array
    let lineData2 = [lineData_cons, lineData_roast, lineData_soluble]; 

    // Set title for line graph and x and y axes
    let lineLayout2 = {
         title: countryName + " - Coffee Domestic Consumption Total, Roast-Ground and Soluble Separate  1990 to 2020",
         xaxis: { title: "Years" },
         yaxis: { title: "Domestic Consumption (1000 * 60 Kg Bags)" }
    };
    
    // Use plotly to display line graph at div with lineData and lineLayout
    Plotly.newPlot('consLine', lineData2, lineLayout2);
}






// when the dropdown menu selection is changed
d3.selectAll("dropdownPro").on("change", optionChangedProduction);

// Function to display plots from a country from dropdown menu selection
function optionChangedProduction() {

    // Assign dropdown menu to variable using D3 and ID for menu given in HTML
    let dropdownMenu = d3.select("#dropdownPro");

    // Assign the value of the country dropdown menu option to a variable
    let country = dropdownMenu.property("value");
    
    // Clear the already displayed country
    d3.select("#country").html("");

    // Display the selected country in the countries page using header tag h3
    d3.select("#country").insert("h3").text(country);


    // Display the graphs for the desired country
    displayLineGraph_Production(apiData, country);
    displayLineGraph_DomConsumption(apiData, country);

}


// Initialisation function
function init() {

    // Name and path to JSON file with dataset 
    let pctURL = "/api/pct";

    // Read in JSON from URL
    d3.json(pctURL).then(function(data) {
        apiData = data;
        // Display line graphs for India
        displayLineGraph_Production(apiData, "India");
        displayLineGraph_DomConsumption(apiData, "India");

    });
}

// Call initialisation function
init();