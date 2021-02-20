from flask_restful import Api, Resource, reqparse
import numpy as np
import joblib

# Load prebuilt model
Species_Model = joblib.load('model_species.sav')

# Create predict method
class Predict(Resource):
    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser.add_argument('aroma')
        parser.add_argument('aftertaste')
        parser.add_argument('acidity')
        parser.add_argument('body')
        parser.add_argument('balance')
        parser.add_argument('uniformity')
        parser.add_argument('cleancup')
        parser.add_argument('sweetness')
        parser.add_argument('moisture')
        parser.add_argument('cat1defect')
        parser.add_argument('cat2defect') 

        # Use parser to create dictionary of data input
        args = parser.parse_args() 
        # Convert input data to array
        X_new = np.fromiter(args.values(), dtype=float) 
        # Generate prediction for a single value
        out = {'Prediction': Species_Model.predict([X_new])[0]}
        return out, 200