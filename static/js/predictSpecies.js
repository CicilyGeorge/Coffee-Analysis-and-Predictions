// when the submit button is clicked
d3.selectAll("#btn").on("click", optionChanged);

function optionChanged() {
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
        d3.selectAll("#predicted_species").html(json["prediction"]);
    })
}