const FORECAST_JSON_PATH = 'forecast.json';
    const HISTORICAL_JSON_PATH = 'historical_weather.json';

    async function loadCurrentForecast() { try { const response = await fetch(FORECAST_JSON_PATH); const forecast = await response.json();

const container = document.getElementById('forecastContainer');
container.innerHTML = '';

const labels = [];
const tempsF = [];
const humidity = [];
const wind = [];
const precip = [];

forecast.hourly.forEach((hour) => {
  labels.push(hour.time);
  tempsF.push(hour.temp);
  humidity.push(hour.humidity);
  wind.push(hour.wind);
  precip.push(hour.precip);

  container.innerHTML += `<div class="weather-card">
    <strong>${hour.time}</strong><br/>
    Temp: ${(hour.temp)}°F / ${hour.temp}°C<br/>
    Humidity: ${hour.humidity}%<br/>
    Wind: ${hour.wind} km/h<br/>
    Precipitation: ${hour.precip} mm
  </div>`;
});

const ctx = document.getElementById('hourlyChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Temperature (°F)',
        data: tempsF,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'yTemp',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Humidity (%)',
        data: humidity,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Wind (km/h)',
        data: wind,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'yWind',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Precipitation (mm)',
        data: precip,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        yAxisID: 'yPrecip',
        fill: false,
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Temperature (°F)') {
              const f = context.raw;
              const c = Math.trunc((f - 32) * 5/9);
              return `Temperature: ${f}°F / ${c}°C`;
            }
            return `${context.dataset.label}: ${context.formattedValue}`;
          }
        }
      }
    },
    scales: {
      yTemp: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Temperature (°F)' }
      },
      yHumidity: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Humidity (%)' },
        grid: { drawOnChartArea: false }
      },
      yWind: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: { display: true, text: 'Wind (km/h)' },
        grid: { drawOnChartArea: false }
      },
      yPrecip: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: { display: true, text: 'Precipitation (mm)' },
        grid: { drawOnChartArea: false }
      }
    }
  }
});
     } catch (error) {
         document.getElementById('forecastContainer').innerText = "Failed to load forecast data."; console.error(error); 
     } 
}


    async function loadWeatherAlerts() {
      document.getElementById('alertsContainer').innerText = "placeholder.";
    }

const useFahrenheit = true; // Global toggle

async function loadHistoricalData() { try { const response = await fetch(HISTORICAL_JSON_PATH); const history = await response.json();

const labels = [];
const chartTemps = [];
const humidity = [];
const indoorhumidity = [];
const wind = [];
const precip = [];
const aqi = [];
const uvi = [];
const airpressure = [];
const grass = [];
const dustdander = [];
const mold = [];
const ragweed = [];
const tree = [];

for (const year in history) {
  for (const month in history[year]) {
    for (const day in history[year][month]) {
      for (const hour in history[year][month][day]) {
        const d = history[year][month][day][hour];
        labels.push(`${year}-${month}-${day} ${hour}:00`);
        const temp = useFahrenheit ? d.temp : Math.trunc((d.temp - 32) * 5/9);
        chartTemps.push(temp);
        humidity.push(d.humidity);
        wind.push(d.wind);
        precip.push(d.precip);
        aqi.push(d.aqi);
        uvi.push(d.uvindex)
        airpressure.push(d.airpressure)
        grass.push(d.grass)
        dustdander.push(d.dustdander)
        mold.push(d.mold)
        ragweed.push(d.ragweed)
        tree.push(d.tree)
      }
    }
  }
}

const ctx = document.getElementById('weatherChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: useFahrenheit ? 'Temperature (°F)' : 'Temperature (°C)',
        data: chartTemps,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'yTemp',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Humidity (%)',
        data: humidity,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Indoor Humidity (%)',
        data: indoorhumidity,
        borderColor: 'rgba(150,150,255, 1)',
        backgroundColor: 'rgba(150,150,255, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Wind (km/h)',
        data: wind,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Precipitation (mm)',
        data: precip,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Air Quality Index (AQI)',
        data: aqi,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'UV Index',
        data: uvi,
        borderColor: 'rgba(255,255,0, 1)',
        backgroundColor: 'rgba(255,255,0, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Air Pressure',
        data: airpressure,
        borderColor: 'rgba(0,0,100, 1)',
        backgroundColor: 'rgba(0,0,100, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Grass Pollen',
        data: grass,
        borderColor: 'rgba(67, 255, 67, 1)',
        backgroundColor: 'rgba(67, 255, 67, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Dust & Dander',
        data: dustdander,
        borderColor: 'rgba(102, 102, 102, 1)',
        backgroundColor: 'rgba(102, 102, 102, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Mold',
        data: mold,
        borderColor: 'rgba(163, 74, 2, 1)',
        backgroundColor: 'rgba(163, 74, 2, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Ragweed Pollen',
        data: ragweed,
        borderColor: 'rgba(250, 209, 2, 1)',
        backgroundColor: 'rgba(250, 209, 2, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Tree',
        data: tree,
        borderColor: 'rgba(15, 102, 0, 1)',
        backgroundColor: 'rgba(15, 102, 0, 0.2)',
        yAxisID: 'yHumidity',
        fill: false,
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label.includes('Temperature')) {
              const val = context.raw;
              const f = useFahrenheit ? val : Math.trunc((f - 32) * 5/9) ;
              const c = useFahrenheit ? Math.trunc((f - 32) * 5/9) : val;
              return `Temperature: ${f}°F / ${c}°C`;
            }
            return `${context.dataset.label}: ${context.formattedValue}`;
          }
        }
      }
    },
    scales: {
      yTemp: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: useFahrenheit ? 'Temperature (°F)' : 'Temperature (°C)'
        }
      },
      yHumidity: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Humidity (%)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yIndoorHumidity: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Indoor Humidity (%)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yWind: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Wind (km/h)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yPrecip: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Precipitation (mm)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      /*yAQI: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Air Quality Index'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yUV: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'UV Index'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yPressure: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Air Pressure'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yGrass: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Grass Pollen'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yDD: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Dust & Dander'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yMold: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Mold'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yRagweed: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Ragweed Pollen'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      yTree: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Tree Pollen'
        },
        grid: {
          drawOnChartArea: false
        }
      }*/
    }
  }
});

} catch (error) { document.getElementById('historicalContainer').innerHTML = 'Failed to load historical data.'; console.error(error); } }


    window.addEventListener('DOMContentLoaded', () => {
      loadCurrentForecast();
      loadWeatherAlerts();
      loadHistoricalData();
    });