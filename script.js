const activityLocations = {
    "Hiking": [
        "Banff, Canada", 
        "Aspen, USA", 
        "Chamonix, France",
        "Torres del Paine, Chile",
        "Grand Canyon, USA",
        "Mount Fuji, Japan",
        "Cinque Terre, Italy",
        "Lake District, UK"
    ],
    "Camping": [
        "Yellowstone, USA", 
        "Yosemite, USA", 
        "Algonquin, Canada",
        "Big Sur, USA",
        "Joshua Tree National Park, USA",
        "Banff National Park, Canada",
        "Glacier National Park, USA",
        "Kruger National Park, South Africa"
    ],
    "Mountain Biking": [
        "Whistler, Canada", 
        "Kir Moab, Jordan", 
        "Queenstown, New Zealand",
        "Breckinridge, USA",
        "Sedona, USA",
        "Canmore, Canada",
        "St. George, USA",
        "Rotorua, New Zealand"
    ],
    "Rock Climbing": [
        "Yosemite, USA", 
        "Red River Gorge, USA", 
        "Kalymnos, Greece",
        "Joshua Tree, USA",
        "Squamish, Canada",
        "Cannon Cliff, USA",
        "The Dolomites, Italy",
        "Fontainebleau, France"
    ],
    "Kayaking": [
        "Halong Bay, Vietnam", 
        "Milford Sound, New Zealand", 
        "Lake Tahoe, USA",
        "Bay of Islands, New Zealand",
        "Canoe Lake, Canada",
        "Kauai, Hawaii",
        "Georgian Bay, Canada",
        "The Amazon River, Brazil"
    ],
    "Bungee Jumping": [
        "Queenstown, New Zealand", 
        "Victoria Falls, Zambia", 
        "Macau Tower, China",
        "Bloukrans Bridge, South Africa",
        "Verzasca Dam, Switzerland",
        "Kawarau Bridge, New Zealand",
        "Rio de Janeiro, Brazil",
        "The Last Resort, Nepal"
    ],
    "Snowboarding": [
        "Whistler Blackcomb, Canada", 
        "Niseko, Japan", 
        "Aspen, USA",
        "Chamonix, France",
        "Vail, USA",
        "Zermatt, Switzerland",
        "Grace Park, Philippines",
        "St. Anton, Austria"
    ],
    "Beach Volleyball": [
        "Copacabana, Brazil", 
        "Bondi Beach, Australia", 
        "Myrtle Beach, USA",
        "Waikiki Beach, Hawaii",
        "Kuta Beach, Indonesia",
        "Malibu Beach, USA",
        "Miami Beach, USA",
        "Tulum, Mexico"
    ],
    "Trail Running": [
        "Appalachian Trail, USA", 
        "Torres del Paine, Chile", 
        "Dolomites, Italy",
        "Grand Canyon Rim Trail, USA",
        "Mount Rainier, USA",
        "Black Forest, Germany",
        "Lake Tahoe, USA",
        "The West Highland Way, Scotland"
    ],
    "Ziplining": [ 
        "Treetop Adventure Park, Thailand", 
        "Sky Trek, Costa Rica",
        "Zip World, Wales",
        "The Big Island, Hawaii",
        "Whistler, Canada",
        "Jungle Zipline, Belize",
        "Glenwood Canyon, USA",
        "The Rainforest, Puerto Rico"
    ],
    "Archery": [
        "Nottingham, UK", 
        "Rancho Obi-Wan, USA", 
        "Sherwood Forest, UK",
        "The National Archery Center, USA",
        "The Archery Academy, USA",
        "Canada Park, Palestine",
        "The Archery Club, Australia",
        "The Archery Range, New Zealand"
    ],
    "Paragliding": [
        "Interlaken, Switzerland", 
        "Bir Billing, India", 
        "Lake Tahoe, USA",
        "Dahab, Egypt",
        "Bled, Slovenia",
        "Rio de Janeiro, Brazil",
        "Chamonix, France",
        "Mount Srd, Croatia"
    ]
};

// Fetch selected activity from URL
const urlParams = new URLSearchParams(window.location.search);
const selectedActivity = urlParams.get("activity");

// Display location suggestions based on activity
document.addEventListener("DOMContentLoaded", () => {
    if (selectedActivity) {
        const activityTitle = document.getElementById("activityTitle");
        activityTitle.textContent = `Suggested Locations for ${selectedActivity}`;
    }
    const locationContainer = document.getElementById("locationSuggestions");
    if (activityLocations[selectedActivity]) {
        activityLocations[selectedActivity].forEach(location => {
            const button = document.createElement("button");
            button.textContent = location;
            button.onclick = () => getWeather(location);
            locationContainer.appendChild(button);
        });
    } else {
        locationContainer.innerHTML = "<p>No locations available for this activity.</p>";
    }
});

// Fetch and display weather for the selected location
async function getWeather(location) {
    const apiKey = 'd9d76984221d429d9c204822241410';
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=4`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            document.getElementById('weatherInfo').innerText = "Location not found. Please try another.";
            return;
        }

        let weatherInfo = `
            <div class="location"><h2>${data.location.name}, ${data.location.region}, ${data.location.country}</h2></div><br>
            <p class="local-time">Local Time: ${data.location.localtime}</p>
            <p class="feels-like">Feels Like: ${data.current.feelslike_c}°C</p>
            <p class="uv-index">Current UV Index: ${data.current.uv}</p><br>
            <div class="forecast-container">
        `;

        // Loop through each of the 3 days of forecast data
        data.forecast.forecastday.forEach(day => {
            weatherInfo += `
                <div class="forecast-day">
                    <p>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    <div class="temp">${day.day.avgtemp_c}°C</div>
                    <div class="weather-icon">
                        <img src="https:${day.day.condition.icon}" alt="Weather Icon">
                    </div>
                    <p class="condition">${day.day.condition.text}</p>
                    <p class="wind">Wind: ${day.day.maxwind_kph} kph</p>
                    <p class="rain-chance">Rain: ${day.day.daily_chance_of_rain}%</p>
                    <p class="snow-chance">Snow: ${day.day.daily_chance_of_snow}%</p>
                    <p class="uv-index">UV Index: ${day.day.uv}</p>
                </div>
            `;
        });

        weatherInfo += `</div>`;
        document.getElementById('weatherInfo').innerHTML = weatherInfo;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById('weatherInfo').innerText = "Error loading data. Please try again.";
    }
}
