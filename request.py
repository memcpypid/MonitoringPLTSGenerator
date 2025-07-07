import requests
import random
import time

BASE_URL = "http://localhost:3000/api"

def generate_dummy_data():
    return {
        "voltage": round(random.uniform(200, 220), 3),
        "current": round(random.uniform(1, 10), 3),
        "frequency": round(random.uniform(49.5, 55.5), 3),
        "temperature": round(random.uniform(25, 40), 3),
        "humidity": round(random.uniform(30, 70), 3)
    }

def post_to_endpoint(endpoint):
    url = f"{BASE_URL}/{endpoint}"
    data = generate_dummy_data()
    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            print(f"Success POST to /{endpoint}: {response.json()}")
        else:
            print(f"Failed POST to /{endpoint}: {response.status_code}, {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error POST to /{endpoint}: {e}")

if __name__ == "__main__":
    while True:
        post_to_endpoint("generator")
        post_to_endpoint("plts")
        time.sleep(10)  # delay 5 detik antar pengiriman
