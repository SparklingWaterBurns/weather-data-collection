import schedule
import time
import os
from weatherdata import fetch_forecast, update_historical

# Define a job
def job():
    print("Fetching new weather data...")
    fetch_forecast()
    update_historical()

# Schedule it to run every hour
schedule.every().hour.at(":15").do(job)

# Run once immediately on startup
job()

print("Scheduler started. Running every hour.")
while True:
    schedule.run_pending()
    time.sleep(30)
    os.system('ping -i 0.3 -s 16 -c 2 -w 1 -W 1 192.168.1.1')