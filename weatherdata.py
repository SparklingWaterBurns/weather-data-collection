import requests
import json
import datetime
import os
from dateutil.parser import parse

# === CONFIGURATION ===
API_KEY = 'YOUR API KEY HERE! NOT PROVIDING ONE'
LOCATION_KEY = 'ACCUWEATHER LOCATION KEY HERE.'
FORECAST_FILE = '/storage/emulated/0/weatherdata/forecast.json'
HISTORICAL_FILE = '/storage/emulated/0/weatherdata/historical_weather.json'
CURRENT_FILE = '/storage/emulated/0/HOMELAB/current.json'

# === API URLs ===
FORECAST_URL = f'https://api.accuweather.com/forecasts/v1/hourly/12hour/{LOCATION_KEY}?apikey={API_KEY}&details=true'
CURRENT_CONDITIONS_URL = f'https://api.accuweather.com/currentconditions/v1/{LOCATION_KEY}.json?apikey={API_KEY}&details=true'

GRASS_POLLEN_INDEX = f'https://api.accuweather.com/indices/v1/daily/1day/{LOCATION_KEY}/-11?apikey={API_KEY}&details=true'
DUST_DANDER_INDEX = f'https://api.accuweather.com/indices/v1/daily/1day/{LOCATION_KEY}/18?apikey={API_KEY}&details=true'
MOLD_POLLEN_INDEX = f'https://api.accuweather.com/indices/v1/daily/1day/{LOCATION_KEY}/-12?apikey={API_KEY}&details=true'
RAGWEED_POLLEN_INDEX = f'https://api.accuweather.com/indices/v1/daily/1day/{LOCATION_KEY}/-13?apikey={API_KEY}&details=true'
TREE_POLLEN_INDEX = f'https://api.accuweather.com/indices/v1/daily/1day/{LOCATION_KEY}/-14?apikey={API_KEY}&details=true'
AQI = f'https://api.accuweather.com/indices/v1/daily/1day/{LOCATION_KEY}/-10?apikey={API_KEY}&details=true'

# fetch and save forecast
def fetch_forecast():
    response = requests.get(FORECAST_URL)
    response.raise_for_status()
    data = response.json()
   
    # Extract needed data

    hourly_data = []
    for entry in data:
        dt = parse(entry['DateTime'])
        hour_label = dt.strftime('%-I %p')
        hourly_data.append({
          'time': hour_label,
          'temp': round(entry['Temperature']['Value']),  # °F
          'humidity': entry['RelativeHumidity'],
          'wind': entry['Wind']['Speed']['Value'],
          'precip': entry['PrecipitationProbability']
      })

    with open(FORECAST_FILE, 'w') as f:
        json.dump({'hourly': hourly_data}, f, indent=2)
    print(f"Forecast saved to {FORECAST_FILE}")

# fetch and append historical
def update_historical():
    response = requests.get(CURRENT_CONDITIONS_URL)
    response.raise_for_status()
    data = response.json()[0]

    response = requests.get(GRASS_POLLEN_INDEX)
    response.raise_for_status()
    grass = response.json()

    response = requests.get(DUST_DANDER_INDEX)
    response.raise_for_status()
    dustdander = response.json()

    response = requests.get(MOLD_POLLEN_INDEX)
    response.raise_for_status()
    mold = response.json()

    response = requests.get(RAGWEED_POLLEN_INDEX)
    response.raise_for_status()
    ragweed = response.json()
    
    response = requests.get(TREE_POLLEN_INDEX)
    response.raise_for_status()
    tree = response.json()

    response = requests.get(AQI)
    response.raise_for_status()
    aq = response.json()

    now = datetime.datetime.now()
    year = str(now.year)
    month = str(now.month).zfill(2)
    day = str(now.day).zfill(2)
    hour = str(now.hour).zfill(2)
   
    lastsnowdate = None
    
    if "light snow" not in data['WeatherText'].lower() and data.get('PrecipitationType') is not None and "Snow" in data.get('PrecipitationType'):
         lastsnowdate = day + "," + hour
    else:
         lastsnowdate = "no"
    
    entry = {
        'weathertext': data['WeatherText'], # find a way to represent this
        'isdaytime': data['IsDayTime'], # represent this with 20 = false, 70 = true. Don't show the numbers
        'temp': data['Temperature']['Imperial']['Value'],
        'webulbtemperature': data['WetBulbTemperature']['Imperial']['Value'], # F
        'webulbglobetemperature': data['WetBulbGlobeTemperature']['Imperial']['Value'], # F
        'humidity': data['RelativeHumidity'],
        'indoorhumidity': data['IndoorRelativeHumidity'],
        'wind': data['Wind']['Speed']['Imperial']['Value'], #mp/h
        'precip': data.get('Precip1hr', {}).get('Metric', {}).get('Value', 0),
        'hasprecip': data['HasPrecipitation'],
        'preciptype': data['PrecipitationType'],
        'cloudcover': data['CloudCover'],
        'visibilityobstructions': data['ObstructionsToVisibility'],
        'visibility': data['Visibility']['Imperial']['Value'], #miles
        'uvindex': data['UVIndexFloat'],
        'airpressure': data['Pressure']['Imperial']['Value'], # inHg
        'aqi': aq[0]['Value'],
        'grass': grass[0]['Value'],
        'dustdander': dustdander[0]['Value'],
        'mold': mold[0]['Value'],
        'ragweed': ragweed[0]['Value'],
        'tree': tree[0]['Value'],
        ('lastsnowed' if lastsnowdate != "no" else 'didntsnowtwin'): (lastsnowdate if lastsnowdate != "no" else None)
    }

    if os.path.exists(HISTORICAL_FILE):
        with open(HISTORICAL_FILE, 'r') as f:
            history = json.load(f)
    else:
        history = {}

    history.setdefault(year, {}).setdefault(month, {}).setdefault(day, {})[hour] = entry

    with open(HISTORICAL_FILE, 'w') as f:
        json.dump(history, f, indent=2)

    print(f"Current condition appended to {HISTORICAL_FILE}")

    with open(CURRENT_FILE, 'r+') as f:
           json.dump(entry, f, indent=2)
         # if 'lastsnowed' in entry:
             # json.dump(entry, f, indent=2)
        # else:
              # current1 = json.load(f)
              # entry['lastsnowed'] = lastsnowdate
             # json.dump(entry, f, indent=2)

    print(f"{CURRENT_FILE} overwritten and updated")

# === MAIN ===
#if __name__ == '__main__':
    #fetch_forecast()
    #update_historical()