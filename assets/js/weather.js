// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector('.weatherIcon');
const tempElement = document.querySelector('.weatherValue p');
const descElement = document.querySelector('.weatherDescription p');

const weather = {};
weather.temperature = {
	unit: 'celsius',
};

var tempUnit = CONFIG.weatherUnit;

const KELVIN = 273.15;
const key = `${CONFIG.weatherKey}`;
setPosition();

function setPosition(position) {
	if (!CONFIG.trackLocation || !navigator.geolocation) {
		if (CONFIG.trackLocation) {
			console.error('Geolocation not available');
		}
		getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		return;
	}
	navigator.geolocation.getCurrentPosition(
		pos => {
			getWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3));
		},
		err => {
			console.error(err);
			getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		}
	);
}

function getWeather(latitude, longitude) {
	let api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode`;
	fetch(api)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			let celsius = data.current_weather.temperature;
			weather.temperature.value = tempUnit == 'C' ? celsius : (celsius * 9) / 5 + 32;
            const weatherCode = data.current_weather.weathercode;
            const weatherMap = {
                0: { description: "Clear sky", icon: "01d" },
                1: { description: "Mainly clear", icon: "02d" },
                2: { description: "Partly cloudy", icon: "03d" },
                3: { description: "Overcast", icon: "04d" },
                45: { description: "Foggy", icon: "50d" },
                48: { description: "Depositing rime fog", icon: "50d" },
                51: { description: "Light drizzle", icon: "09d" },
                53: { description: "Moderate drizzle", icon: "09d" },
                55: { description: "Dense drizzle", icon: "09d" },
                61: { description: "Slight rain", icon: "10d" },
                63: { description: "Moderate rain", icon: "10d" },
                65: { description: "Heavy rain", icon: "10d" },
                71: { description: "Slight snow fall", icon: "13d" },
                73: { description: "Moderate snow fall", icon: "13d" },
                75: { description: "Heavy snow fall", icon: "13d" },
                77: { description: "Snow grains", icon: "13d" },
                80: { description: "Slight rain showers", icon: "09d" },
                81: { description: "Moderate rain showers", icon: "09d" },
                82: { description: "Violent rain showers", icon: "09d" },
                85: { description: "Slight snow showers", icon: "13d" },
                86: { description: "Heavy snow showers", icon: "13d" },
                95: { description: "Thunderstorm", icon: "11d" },
                96: { description: "Thunderstorm with slight hail", icon: "11d" },
                99: { description: "Thunderstorm with heavy hail", icon: "11d" }
            };
            weather.description = weatherMap[weatherCode]?.description || "Unknown";
            weather.iconId = weatherMap[weatherCode]?.icon || "unknown";
		})
		.then(function() {
			displayWeather();
		});
}

function displayWeather() {
	iconElement.innerHTML = `<img src="assets/icons/${CONFIG.weatherIcons}/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
	descElement.innerHTML = weather.description;
}
