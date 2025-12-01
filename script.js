// --- Configuration ---
const API_KEY = "8925f25a0eebda0b513dac33093d504a";

// --- DOM Elements ---
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherDataEl = document.getElementById('weather-data');

// --- Event Listener ---
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        displayError("Please enter a city name.");
    }
});

// Allows searching by pressing Enter key
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// --- Core API Fetch Function ---
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    // Clear previous results nd show loading messages
    weatherDataEl.innerHTML = '<p>Loading weather data...</p>';

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // Check for specific error status codes (e.g., 404 for city not found)
            if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please check the spelling.`);
            } else {
                throw new Error(`API Error: Failed to fetch weather data (Status: ${response.status})`);
            }
        }
        
        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        displayError(error.message);
    }
}

// --- Display Functions ---
function displayWeather(data) {
    // Extract key data points
    const city = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    // Construct the HTML to inject into the weather-data container
    weatherDataEl.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}" class="weather-icon">
        <h2>${city}, ${country}</h2>
        <p class="temp">${temp}°C</p>
        <p class="description">${description}</p>
        <div class="details">
            <p>💧 Humidity: ${humidity}%</p>
            <p>💨 Wind: ${windSpeed} m/s</p>
        </div>
    `;
}

function displayError(message) {
    weatherDataEl.innerHTML = `<p class="error">Error: ${message}</p>`;
}