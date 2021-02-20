import requests 

url = "http://127.0.0.1:5000/api/predict"
body = {
    'aroma': 8,
    'aftertaste': 9,
    'acidity': 5,
    'body': 8,
    'balance': 8,
    'uniformity': 8,
    'cleancup': 8,
    'sweetness': 8,
    'moisture': 0.1,
    'cat1defect': 10,
    'cat2defect': 10
}

response = requests.post(url, json=body)
print(response.text)