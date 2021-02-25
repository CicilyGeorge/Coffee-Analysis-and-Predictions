// when the submit button is clicked
d3.selectAll("#btn").on("click", predict);

function predict() {
      
    d3.selectAll("#predictions").classed("view", true)
                                .classed("hide", false);

    
    d3.json('/api/predict', {
        method:"POST",
        body: JSON.stringify({
            'aroma': d3.selectAll("#inputAroma").property("value"),
            'aftertaste': d3.selectAll("#inputAftertaste").property("value"),
            'acidity': d3.selectAll("#inputAcidity").property("value"),
            'body': d3.selectAll("#inputBody").property("value"),
            'balance': d3.selectAll("#inputBalance").property("value"),
            'uniformity': d3.selectAll("#inputUniformity").property("value"),
            'cleancup': d3.selectAll("#inputCleanCup").property("value"),
            'sweetness': d3.selectAll("#inputSweetness").property("value"),
            'moisture': d3.selectAll("#inputMoisture").property("value"),
            'cat1defect': d3.selectAll("#inputC1Defect").property("value"),
            'cat2defect': d3.selectAll("#inputC2Defect").property("value")
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(json => {
        d3.selectAll("#predicted_species").html(json["prediction_Species"]);  
        d3.selectAll("#predicted_method").html(json["prediction_Method"]);   
        d3.selectAll("#predicted_region").html(json["prediction_Region"]); 
        // d3.selectAll("#predicted_country").html(json["prediction_Country"]); 
        // d3.selectAll("#predicted_altitude").html(json["prediction_Altitude"]);                                      
    })
}