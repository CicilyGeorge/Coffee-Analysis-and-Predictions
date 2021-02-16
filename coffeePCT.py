import pandas as pd

# Reading data from csv file
df_coffee = pd.read_csv("data/psd_coffee.csv")

# Removing unnecessary data(columns and rows)
df_coffee = df_coffee[['Country_Name', 'Market_Year',
                       'Attribute_Description','Value']]
attr_rmlist = ['Beginning Stocks', 'Ending Stocks', 'Other Production', 'Rst,Ground Dom. Consum', 'Soluble Dom. Cons.', 'Total Distribution', 'Total Supply']
df_coffee = df_coffee[~df_coffee['Attribute_Description'].isin(attr_rmlist)]


# Getting Country Code format, ISO Alpha-3 which other data sources follow
# url to scrape for ISO 3166 country codes Alpha-2 and Alpha-3 from www.iban.com
country_code_url ="https://www.iban.com/country-codes"
# Use panda's `read_html` to parse the url
df_countryCode = pd.read_html(country_code_url, header=0)[0]
# eliminating unnessasary data
df_countryCode = df_countryCode.iloc[:,[0,2]]
# rename the columns
df_countryCode.rename(columns={'Country':'Country_Name',
                               'Alpha-3 code':'Country_Code'
                              },inplace=True)

# Replacing names in the countryCode dataframe to match with df_coffee
df_countryCode.loc[(df_countryCode.Country_Name == 'Bolivia (Plurinational State of)'),'Country_Name']='Bolivia'
df_countryCode.loc[(df_countryCode.Country_Name == 'Central African Republic (the)'),'Country_Name']='Central African Republic'
df_countryCode.loc[(df_countryCode.Country_Name == 'Congo (the)'),'Country_Name']='Congo (Brazzaville)'
df_countryCode.loc[(df_countryCode.Country_Name == 'Congo (the Democratic Republic of the)'),'Country_Name']='Congo (Kinshasa)'
df_countryCode.loc[(df_countryCode.Country_Name == "Côte d'Ivoire"),'Country_Name']="Cote d'Ivoire"
df_countryCode.loc[(df_countryCode.Country_Name == 'Dominican Republic (the)'),'Country_Name']='Dominican Republic'
df_countryCode.loc[(df_countryCode.Country_Name == 'Iran (Islamic Republic of)'),'Country_Name']='Iran'
df_countryCode.loc[(df_countryCode.Country_Name == 'Korea (the Republic of)'),'Country_Name']='Korea, South'
df_countryCode.loc[(df_countryCode.Country_Name == "Lao People's Democratic Republic (the)"),'Country_Name']='Laos'
df_countryCode.loc[(df_countryCode.Country_Name == 'Philippines (the)'),'Country_Name']='Philippines'
df_countryCode.loc[(df_countryCode.Country_Name == 'Russian Federation (the)'),'Country_Name']='Russia'
df_countryCode.loc[(df_countryCode.Country_Name == 'Taiwan (Province of China)'),'Country_Name']='Taiwan'
df_countryCode.loc[(df_countryCode.Country_Name == 'Tanzania, United Republic of'),'Country_Name']='Tanzania'
df_countryCode.loc[(df_countryCode.Country_Name == 'United States of America (the)'),'Country_Name']='United States'
df_countryCode.loc[(df_countryCode.Country_Name == 'Venezuela (Bolivarian Republic of)'),'Country_Name']='Venezuela'
df_countryCode.loc[(df_countryCode.Country_Name == 'Viet Nam'),'Country_Name']='Vietnam'


# merging df_population with df_countryCode
df_coffee_merged = df_countryCode.merge(df_coffee, on="Country_Name", how="inner")

# Concatenating European Union rows into the final dataframe
df_coffee_merged = pd.concat([df_coffee_merged, df_coffee[df_coffee['Country_Name']=="European Union"]])
df_coffee_merged.loc[(df_coffee_merged.Country_Name == 'European Union'),'Country_Code']='EUR'


# Imports the method used for connecting to DBs
from sqlalchemy import create_engine
# Imports the methods needed to abstract classes into tables
from sqlalchemy.ext.declarative import declarative_base
# Allow us to declare column types
from sqlalchemy import Column, Integer, String, Float


# Sets an object to utilize the default declarative base in SQL Alchemy
Base = declarative_base()

class CoffeePCT(Base):
    __tablename__ = 'pct'
    id = Column(Integer, primary_key=True)
    Country_Code = Column(String(3))
    Country_Name = Column(String(30))
    Market_Year = Column(Integer)
    Attribute_Description = Column(String(30))
    Value = Column(Float)

# Create a connection to a SQLite database
engine = create_engine('sqlite:///coffee.sqlite', echo=True)
conn = engine.connect()

# Use this to clear out the db
Base.metadata.drop_all(engine)

sqlite_table = "pct"
df_coffee_merged.to_sql(sqlite_table, conn, if_exists='fail')

# Create a "Metadata" Layer That Abstracts our SQL Database
Base.metadata.create_all(engine)