import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template, request
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler


# Flask Setup
#################################################
app = Flask(__name__)

# Load model
Species_Model = joblib.load('models/model_species.sav')
X_scaler_species = joblib.load('models/model_species_scaler.sav')
Method_Model = joblib.load('models/model_process_method.sav')
X_scaler_method = joblib.load('models/model_method_scaler.sav')
Region_Model = joblib.load('models/model_region.sav')
X_scaler_region = joblib.load('models/model_region_scaler.sav')
# Countries_Model = joblib.load('models/model_countries.sav')
# X_scaler_countries = joblib.load('models/model_countries_scaler.sav')
# Altitude_Model = joblib.load('models/model_altitude.sav')
# X_scaler_altitude = joblib.load('models/model_altitude_scaler.sav')


# Predictions 
@app.route("/api/predict", methods=["GET", "POST"])
def predict():
    if request.method == "GET":
        # return "Here's how you use this API....." 
        return render_template("information.html")
    
    if request.method == "POST":
        
        if not request.json: # if not JSON, then return HTTP 400 - Error 
            return "JSON body not found", 400
            
        # if OK, then perform prediction and return result 
        modelInputs = {
            'aroma': request.json['aroma'],
            'aftertaste': request.json['aftertaste'],
            'acidity': request.json['acidity'],
            'body': request.json['body'],
            'balance': request.json['balance'],
            'uniformity': request.json['uniformity'],
            'cleancup': request.json['cleancup'],
            'sweetness': request.json['sweetness'],
            'moisture': request.json['moisture'],
            'cat1defect': request.json['cat1defect'],
            'cat2defect': request.json['cat2defect']
        }
        X = np.fromiter(modelInputs.values(), dtype=float)
        X_scaled_Species = X_scaler_species.transform([X])
        Species = Species_Model.predict(X_scaled_Species)[0]

        if (Species == "Arabica"):
            modelInputs['species'] = 0
        else:
            modelInputs['species'] = 1

        X_new = np.fromiter(modelInputs.values(), dtype=float)
        X_scaled_Method = X_scaler_method.transform([X_new])
        Method = Method_Model.predict(X_scaled_Method)[0]

        X_scaled_Region = X_scaler_region.transform([X_new])
        Region = Region_Model.predict(X_scaled_Region)[0]

        # X_scaled_Country = X_scaler_countries.transform([X_new])
        # Country = Countries_Model.predict(X_scaled_Country)[0]

        # X_scaled_Altitude = X_scaler_altitude.transform([X_new])
        # Altitude = Altitude_Model.predict(X_scaled_Altitude)[0]
        

        out = { 'prediction_Species': Species,
                'prediction_Method': Method,
                'prediction_Region': Region  #,
                # 'prediction_Country': Country,
                # 'prediction_Altitude': Altitude
              }
        return jsonify(out), 200 # return success 



# Database Setup
#################################################
# https://coffee-analysis.herokuapp.com/
engine = create_engine(
'sqlite:///coffee.sqlite',
connect_args={'check_same_thread': False}
)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)



# Flask Routes
#################################################
# JSON API pages
@app.route("/api/pct")
def PCT():
    # Sets an object to utilize the default declarative base in SQL Alchemy
    Base = declarative_base()

    # Creates Classes which will serve as the anchor points for our Tables
    class CoffeePCT(Base):
        __tablename__ = 'pct'
        index = Column(Integer, primary_key=True)
        Country_Code = Column(String(3))
        Country_Name = Column(String(30))
        Market_Year = Column(Integer)
        Attribute_Description = Column(String(30))
        Value = Column(Float)

    # Create a session to the DB, Query the class and end Session
    session = Session(engine)
    data = session.query(CoffeePCT)
    session.close()

    # Create a list of dictionaries to convert data into JSON format
    list = []
    for result in data:
        row = {}
        row["Country_Code"] = result.Country_Code
        row["Country_Name"] = result.Country_Name
        row["Year"] = result.Market_Year
        row["Attribute"] = result.Attribute_Description
        row["Value"] = result.Value
        list.append(row)
 
    return jsonify(list)



# html pages
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/information")
def information():
    return render_template('information.html') 



if __name__ == "__main__":
    app.run(debug=True)