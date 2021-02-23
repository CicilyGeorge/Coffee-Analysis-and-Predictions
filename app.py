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
Species_Model = joblib.load('model_species.sav')


# Predictions 
# https://coffee-analysis.herokuapp.com/api/predict/<
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
        X_new = np.fromiter(modelInputs.values(), dtype=float)
        # # Create a StandardScater model and fit it to the training data
        # X_scaler = StandardScaler()
        # # Transform the training and testing data using the X_scaler
        # X_new_scaled = X_scaler.fit_transform(X_new)
        # X=[]
        # for i in range(11):
        #     print(X_new_scaled[i][0])
        #     X = X.append(X_new_scaled[i][0])
        #     print(X)
        out = {'prediction': Species_Model.predict([X_new])[0]}
        return jsonify(out), 200 # return success 



# Database Setup
#################################################
# https://coffee-analysis.herokuapp.com/
engine = create_engine("sqlite:///coffee.sqlite")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)


# Print all of the classes mapped to the Base
# print(f"keys: {Base.classes.keys()}")
# Assign the CoffeePCT class to a variable
# CoffeePCT = Base.classes.CoffeePCT




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