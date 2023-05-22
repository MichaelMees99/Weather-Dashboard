const apiKey = '17c280793daafa3260db5fc3c6e289a0'

$(document).ready(function() {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    searchHistory.forEach(city => {
        $("#search-history").prepend(`<button class="my-1 btn btn-secondary">${city}</button>`);
    });

    $("#search-form").on("submit", function(event) {
        event.preventDefault();
        const city = $("#search-input").val();
        $("#search-input").val("");
        getWeather(city);
    });

    function getWeatherCondition(weather) {
        let weatherCondition;
        if (weather == 'Clear') {
            weatherCondition = '☀️';
        } else if (weather == 'Clouds') {
            weatherCondition = '☁️';
        } else if (weather == 'Rain' || weather == 'Drizzle') {
            weatherCondition = '🌧️';
        } else if (weather == 'Thunderstorm') {
            weatherCondition = '⛈️';
        } else {
            weatherCondition = '🌤️';
        }
        return weatherCondition;
    }

    function getWeather(city) {
        const queryUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        $.get(queryUrl).done(function(response) {
            const tempF = ((response.main.temp * 9/5) - 459.67).toFixed(0);
            const weatherCondition = getWeatherCondition(response.weather[0].main);
            $("#current-weather").html(`
                <h2>${response.name} (${new Date().toLocaleDateString()}) ${weatherCondition}</h2>
                <p>Temperature: ${tempF}°F</p>
                <p>Humidity: ${response.main.humidity}%</p>
                <p>Wind Speed: ${response.wind.speed} MPH</p>
            `);
            getForecast(city);
            if (!searchHistory.includes(city)) {
                searchHistory.unshift(city);
                $("#search-history").prepend(`<button class="btn btn-primary my-2">${city}</button>`);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            }
        });
    }
    
    function getForecast(city) {
        const queryUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
        $.get(queryUrl).done(function(response) {
            $("#forecast").empty();
            for (let i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                    const tempF = ((response.list[i].main.temp * 9/5) - 459.67).toFixed(0);
                    const weatherCondition = getWeatherCondition(response.list[i].weather[0].main);
                    $("#forecast").append(`
                        <div class="card text-center inline-flex mx-1" style="width: 12rem;">
                            <h3>${new Date(response.list[i].dt_txt).toLocaleDateString()} ${weatherCondition}</h3>
                            <p>Temp: ${tempF}°F</p>
                            <p>Humidity: ${response.list[i].main.humidity}%</p>
                            <p>Wind Speed: ${response.list[i].wind.speed} MPH</p>
                        </div>
                    `);
                }
            }
        });
    }

    $("#search-history").on("click", "button", function() {
        getWeather($(this).text());
    });
    getWeather("Atlanta");
});