function getCountries_Production(Data){
    let productionData = Data.filter(production => production.Attribute == "Production");
    productionData = productionData.filter(country => country.Value != 0);
    productionData = productionData.filter(country => country.Year >= 1990);

    let country_list = []
    for (let i=0; i<productionData.length; i++) {
        country_list.push(productionData[i].Country_Name)
    }
    // Unique values from list
    country_set = [...new Set(country_list)];

    jSuites.dropdown(document.getElementById('dropdownPro'), {
        data: country_set,
        placeholder: "Country",
        autocomplete: true,
        lazyLoading: true,
        multiple: false,
        width: '200px',
    });
}

// Initialisation function
function init() {

    // Name and path to JSON file with dataset 
    let pctURL = "/api/pct";

    // Read in JSON from URL
    d3.json(pctURL).then(function(data) {

        getCountries_Production(data);

    });
}

// Call initialisation function
init();