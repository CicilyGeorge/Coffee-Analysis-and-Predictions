// when the submit button is clicked
d3.selectAll("#btn").on("click", predict);

function predict() {
    
    // var test = JSON.stringify({
    //     'aroma': d3.selectAll("#inputAroma").property("value"),
    //     'aftertaste': d3.selectAll("#inputAftertaste").property("value"),
    //     'acidity': d3.selectAll("#inputAcidity").property("value"),
    //     'body': d3.selectAll("#inputBody").property("value"),
    //     'balance': d3.selectAll("#inputBalance").property("value"),
    //     'uniformity': d3.selectAll("#inputUniformity").property("value"),
    //     'cleancup': d3.selectAll("#inputCleanCup").property("value"),
    //     'sweetness': d3.selectAll("#inputSweetness").property("value"),
    //     'moisture': d3.selectAll("#inputMoisture").property("value"),
    //     'cat1defect': d3.selectAll("#inputC1Defect").property("value"),
    //     'cat2defect': d3.selectAll("#inputC2Defect").property("value")
    // });
    // console.log(test); 
    // {"aroma":"7.58","aftertaste":"7.42","acidity":"7.83","body":"7.42","balance":"7.5","uniformity":"10","cleancup":"10","sweetness":"7.42","moisture":"0","cat1defect":"0","cat2defect":"0"}
    
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
        d3.selectAll("#predicted_species").html(json["prediction"]);                                         
    })
}