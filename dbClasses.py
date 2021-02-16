def create_Classes():

    class CoffeePCT(Base):
        __tablename__ = 'pct'
        id = Column(Integer, primary_key=True)
        Country_Code = Column(String(3))
        Country_Name = Column(String(30))
        Market_Year = Column(Integer)
        Attribute_Description = Column(String(30))
        Value = Column(Float)
    return CoffeePCT