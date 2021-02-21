  // Coffee Production 2020 Map
  /////////////////////////////////////////////////////////
  let pctURL = "/api/pct";
  // Load in geojson data for marking Countries
  let geoDataURL = "/static/js/countries.geojson";
  
  
  
    // Grab Countries geo data with d3 from countries geojson
    d3.json(geoDataURL).then(function(data) {
  
      // reading Api json to merge data with geojson
      d3.json(pctURL).then(function(prodData){

        let productionData = prodData.filter(production => production.Attribute == "Production");
        productionData = productionData.filter(country => country.Value != 0);
        productionData = productionData.filter(country => country.Year == 2021);



        // Adding Population data into the geojson data
        data.features.forEach(val => {
          for( let i=0; i<productionData.length; i++){
            if(val.id == productionData[i]["Country_Code"]){
              let { properties } = val;
              let newProps = { "Value": productionData[i]["Value"]
                             };
              val.properties = { ...properties, ...newProps };    
            }  
          }
        });
  
       
      // Define variables for our tile layers
      var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 6,
        minZoom: 2,
        id: "light-v10",
        accessToken: "API_KEY"
      });
  
      // Only one base layer can be shown at a time
      var baseMaps = {
        Light: light
      };
  
      // to clear container of map before initializing if already exists
      var container = L.DomUtil.get('prodMap');
      if(container != null){
          container._leaflet_id = null;
      }
  
        // Creating map object
      var gMap = L.map("prodMap", {
        center: [34.0522, 10.2437],
        zoom: 2,
        layers: [light]
      });
  
    
  
      function getColor(d) {
        return d > 1020 ? '#014636' :
               d > 1010  ? '#016260' :
               d > 1005  ? '#02818a' :
               d > 1000  ? '#41b6c4' :
               d > 999   ? '#7fcdbb' :
               d > 995  ? '#a8ddb5' :
               d > 990   ? '#ccece6' :
                          '#e5f5f9';
      }
      function style(feature) {
        return {
            fillColor: getColor(feature.properties["Value"] * 1000),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
      }
      // control that shows state info on hover
      var info = L.control();
      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
      };
      info.update = function (props) {
        this._div.innerHTML = '<h4>2020 Coffee Production by Major Countries</h4>' +  (props ?
                '<b> Country: ' + props.name + '<br>Production: ' + props.Value + '<br>'
                : 'Hover over a Country');
      };
      // '%</b><br>Population: ' + formatNumber(props["2020"]) + 
      // '<br>Density: ' + props.Density + ' /km²<br>Total Population Rank: ' + props.rank +
      function highlightFeature(e) {
            var layer = e.target;
            layer.setStyle({
                weight: 5,
                color: '#616161',
                dashArray: '',
                fillOpacity: 0.7
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            info.update(layer.feature.properties);
      }
  
      var geojsonGrowth;
  
      function resetHighlight(e) {
            geojsonGrowth.resetStyle(e.target);
            info.update();
      }
      function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
      }
      function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
      }
      geojsonGrowth = L.geoJson(data, {style: style, onEachFeature: onEachFeature}).addTo(gMap);
      info.addTo(gMap);
  
        var  show = ["< 0.98","0.99 +", "0.995 +", "0.999 +", "1 +","1.005 +","1.01 +","1.02 +"];
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (gMap) {
            var div = L.DomUtil.create('div', 'info legend'),
                popul = [0, 990, 995, 999, 1000, 1005, 1010, 1020],
                labels = [],
                from, to;
            for (var i = 0; i < popul.length; i++) {
                from = popul[i];
  
                to = popul[i + 1];
                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                    show[i] ); 
            }
            div.innerHTML = labels.join('<br>');
            return div;
        };
        legend.addTo(gMap);  
        
    });
  
  });
