const countrySelect = document.getElementById("country-select");
const regionSelect = document.getElementById("region-select");
const citySelect = document.getElementById("city-select");

const holidayList = document.getElementById("holiday-list");
const holidaySelect = document.getElementById("holiday-select");

const publicHolidays = document.getElementById("publicHolidays");
const weather = document.getElementById("weather");
const accommodation = document.getElementById("accommodation")

const holidayButton = document.getElementById("holiday-button")
const weatherButton = document.getElementById("weather-button")
const rentalButton = document.getElementById("rental-button")

const rentalList = document.getElementById('rental-list')

/* Area APIs */

/* Request all the countries in the world */
function fetchCountries() {
    const url = 'https://countriesnow.space/api/v0.1/countries'
    console.log('request', url)
    return fetch(url)
        .then(response => response.json())
        .then(data => data.data);
}

/* Request all the states/provinces in a country */
function fetchStates(countryCode) {
    url = 'https://countriesnow.space/api/v0.1/countries/states'
    console.log('request:', url)
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            country: countryCode
        })
    })
        .then(response => response.json())
        .then(data => data.data.states);
}

/* Request all the cities in a state/province */
function fetchCities(countryCode, stateCode) {
    url = 'https://countriesnow.space/api/v0.1/countries/state/cities'
    console.log(url)
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "country": countryCode,
            "state": stateCode
        })
    })
        .then(response => response.json())
        .then(data =>
            data.data
        );

}

/* Holiday API */
function fetchHolidays(countryCode) {
    const apiKey = "a44d701b-ef9b-4a35-9efa-a45b77d1ab36";
    const year = 2022;
    const url = `https://holidayapi.com/v1/holidays?key=${apiKey}&country=${countryCode}&year=${year}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => data.holidays)
}

/* Weather API */
function fetchWeather(lat, lon, date) {
    const apiKey = "13e180b671ca7d59eba84cf7d5e1075a";
    const dt = Date.parse(date) / 1000;
    const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${apiKey}`;
    return fetch(url)
        .then((response) => response.json())
}


/* Data Adapter to convert YYYY-MM-DD to Unix time*/
async function geocodingAdapter(city) {
    const apiKey = '1b24e77717ee3b8eaadaa898f2211524';
    const limit = 1;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
    return await fetch(url)
        .then(response => response.json())
}


/* Format the unixTime */
function formatTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return formattedTime;
}

/* Get a list of countries when open the ass2_code */
fetchCountries()
    .then(countries => {
        countrySelect.insertAdjacentHTML('beforeend', '<option value="" selected disabled>Select a country</option>');
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.iso2;
            option.text = country.country;
            countrySelect.appendChild(option);
        });
    });


/* Get a list of public holidays and provinces/states when selecting a country */
countrySelect.addEventListener("change", event => {
    const countryCode = event.target.value;
    const index = countrySelect.selectedIndex;
    const country = countrySelect.options[index].text;

    fetchHolidays(countryCode)
        .then(holidays => {
            console.log(holidays)

            holidayList.innerHTML = "";
            holidaySelect.innerHTML = "";

            holidaySelect.insertAdjacentHTML('beforeend', '<option value="" selected disabled>Select a holiday</option>');

            holidays.forEach(holiday => {
                const li = document.createElement("li");
                li.textContent = holiday.name + ' ' + holiday.date;
                holidayList.appendChild(li);

                const option = document.createElement("option");
                option.value = holiday.name;
                option.text = holiday.name;
                option.id = holiday.date
                // date.style.display = 'none'
                holidaySelect.appendChild(option);
            });
        });

    fetchStates(country)
        .then(states => {
            regionSelect.innerHTML = "";
            regionSelect.insertAdjacentHTML('beforeend', '<option value="" selected disabled>Select a province/state</option>');


            const option = document.createElement("option");
            option.value = 'None';
            option.text = '.';
            option.disabled = 'disabled'
            regionSelect.appendChild(option);

            console.log(states)
            states.forEach(state => {
                const option = document.createElement("option");
                option.value = state.name;
                option.text = state.name;
                regionSelect.appendChild(option);
            });
        })

});


/* Gets a list of cities when province/state is selected */
regionSelect.addEventListener("change", event => {
    const stateCode = event.target.value;
    const index = countrySelect.selectedIndex;
    const country = countrySelect.options[index].text;
    fetchCities(country, stateCode)
        .then(cities => {
            citySelect.innerHTML = "";
            citySelect.insertAdjacentHTML('beforeend', '<option value="" selected disabled>Select a city</option>');
            console.log(cities)
            cities.forEach(city => {
                const option = document.createElement("option");
                option.value = city;
                option.text = city;
                citySelect.appendChild(option);
            });
        })
});


/* Display the holidays when click the holiday button */
holidayButton.addEventListener("click", function () {
    publicHolidays.style.display = "block";
    weather.style.display = "none";
    accommodation.style.display = 'none'
});

/* Display the weather information when click the holiday button */
weatherButton.addEventListener("click", function () {
    publicHolidays.style.display = "none";
    weather.style.display = "block";
    accommodation.style.display = 'none'
    //
    weather.innerHTML = ""
    const indexCountry = countrySelect.selectedIndex;
    const country = countrySelect.options[indexCountry].text;

    const indexRegion = regionSelect.selectedIndex;
    const region = regionSelect.options[indexRegion].text;

    const indexCity = citySelect.selectedIndex;
    let city = citySelect.options[indexCity].text;

    const indexholiday = holidaySelect.selectedIndex;
    const holiday = holidaySelect.options[indexholiday].value;
    const date = holidaySelect.options[indexholiday].id;

    let lat;
    let lon;

    let area;
    if (indexCity === 0) {
        area = region;
        city = 'none'
    } else {
        area = city
    }
    geocodingAdapter(area).then(data => {
        lat = data[0].lat;
        lon = data[0].lon;
        console.log(data)
        fetchWeather(lat, lon, date).then(weatherData => {
            console.log(weatherData)
            const sunrise = formatTime(weatherData.data[0].sunrise)
            const sunset = formatTime(weatherData.data[0].sunset)
            // Display the weather data
            weather.innerHTML = `
        <h3>Weather on ${country}/${region}/${city} (${date}) (${holiday}):</h3>
        <p>Temperature: ${weatherData.data[0].temp} °C</p>
        <p>Humidity: ${weatherData.data[0].humidity}%</p>
        <p>Description: ${weatherData.data[0].weather[0].description}</p>
        <p>Clouds: ${weatherData.data[0].clouds}</p>
        <p>Pressure: ${weatherData.data[0].pressure}</p>
        <p>Sunrise: ${sunrise}</p>
        <p>Sunset: ${sunset}</p>
      `;
        }).catch(error => {
            alert('An error occurred: ' + error.message + '\n' + ' Please make sure select the holiday and city');
        });
    }).catch(error => {
        alert('An error occurred: ' + error.message + '\n' + ' Please make sure select the city');
    });
})

/* Format the time*/
function formatDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    return `${year}-${month}-${day}`;
}

/* get the accommodation API */
async function getHotels(lat, lon, checkinDate) {

    const url = `https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates?units=metric&room_number=1&longitude=${lon}&latitude=${lat}&filter_by_currency=AED&order_by=popularity&locale=en-gb&checkout_date=2023-9-28&adults_number=2&checkin_date=2023-9-27`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'da1c007904msh13e13509e4d5ba6p115ca1jsnf321abd72c59',
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        // console.log(result);
        return (result)
    } catch (error) {
        console.error(error);
    }
}


/* Display the accommodation rental information when click the accommodation button */
rentalButton.addEventListener("click", function () {
    publicHolidays.style.display = "none";
    weather.style.display = "none";
    accommodation.style.display = 'block';

    const indexCity = citySelect.selectedIndex;
    let city = citySelect.options[indexCity].text;

    const indexholiday = holidaySelect.selectedIndex;
    const date = holidaySelect.options[indexholiday].id;

    let lat2;
    let lon2;

    geocodingAdapter(city).then(data => {
        lat2 = data[0].lat;
        lon2 = data[0].lon;
        console.log(data)


        const result = getHotels(lat2, lon2, date);

        // console.log(result)
        // const hotels = result
        // console.log(hotels)

        rentalList.innerHTML = '';
        result.then(result => {
            const hotels = result.result
            console.log(hotels)
            hotels.forEach((hotel) => {
                const hotelItem = document.createElement('li');
                hotelItem.textContent = hotel.hotel_name;
                rentalList.appendChild(hotelItem);
            })

        }).catch(error => {
            alert('An error occurred: ' + error.message + '\n' + ' Please make sure select the holiday and the city');
        });
    })

})
