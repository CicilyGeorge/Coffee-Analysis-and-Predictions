import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_restful import Api
from predictSpecies import Predict


# Flask Setup
#################################################
app = Flask(__name__)
API = Api(app)


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



# Predictions
# Add predict to route predict
API.add_resource(Predict, '/predict')



# html pages
@app.route("/")
def index():
    return render_template('quality.html')

@app.route("/quality")
def quality():
    return render_template('quality.html')    

@app.route('/api')
def api():
    return render_template('api.html')     



if __name__ == "__main__":
    app.run(debug=True)