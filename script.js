//Open weather api key 17c280793daafa3260db5fc3c6e289a0
//main API https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

//geocode to get lat lon: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=17c280793daafa3260db5fc3c6e289a0

const apiKey = '17c280793daafa3260db5fc3c6e289a0'

$(document).ready(function() {
    let searchHistory = [];

    $("#search-form").on("submit", function(event) {
        event.preventDefault();
        const city = $("#search-input").val();
        $("#search-input").val("");
        getWeather(city);
    });

    function getWeather(city) {
        const queryUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        $.get(queryUrl).done(function(response) {
            $("#current-weather").html(`
                <h2>${response.name} (${new Date().toLocaleDateString()})</h2>
                <p>Temperature: ${response.main.temp}°F</p>
                <p>Humidity: ${response.main.humidity}%</p>
                <p>Wind Speed: ${response.wind.speed} MPH</p>
            `);
            getForecast(city);
            if (!searchHistory.includes(city)) {
                searchHistory.push(city);
                $("#search-history").prepend(`<button>${city}</button>`);
            }
        });
    }

    function getForecast(city) {
        const queryUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
        $.get(queryUrl).done(function(response) {
            $("#forecast").html("<h2>5-Day Forecast:</h2>");
            for (let i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                    $("#forecast").append(`
                        <div class="card text-center inline-flex mx-1" style="width: 12rem;">
                            <h3>${new Date(response.list[i].dt_txt).toLocaleDateString()}</h3>
                            <p>Temp: ${response.list[i].main.temp}°F</p>
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
});