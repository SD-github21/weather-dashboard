// Create variables to select elements from HTML that will be used in functions
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-search");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityDataEl = document.querySelector("#five-day");
var cityCardTopEl = document.querySelector("#card-top");
var cityFiveDayTitle = document.querySelector(".five-day-title");

// Create an array of cities to store user's searched cities in localStorage
var cities = [];

// Create searchCityHandler() for user to enter a city into search form
var searchCityHandler = function(event) {
    // Prevent page from refreshing
    event.preventDefault();
       
    // Get city name value from input element
    let cityname = cityInputEl.value.trim();
      
    // Feed user's entered city name into functions that will make Open Weather API call and generate buttons

    if (cityname) {
      getCityData(cityname);
      buttonGenerator(cityname);
      // Push city name into cities array and store in localStorage
      cities.push(cityname);
      localStorage.setItem("cities", JSON.stringify(cities));
      // Clear input form element 
      cityInputEl.value = "";  
    
     // Alert user to enter a city if the input element is blank 
    } else {
      alert('Please enter a city');
    }
  };

  // Create and feed city name into buttonGenerator() to generate buttons based on user's searched cities  
  var buttonGenerator = function(cityname) {

    var cityButtonEl = document.createElement("button");
    cityButtonEl.setAttribute("data-city", cityname);
    cityButtonEl.classList = "btn mx-3 my-1"
    cityButtonEl.innerHTML = cityname;

    cityButtonsEl.appendChild(cityButtonEl);

    // Clear data from any previous searches
    cityCardTopEl.textContent ="";
    cityDataEl.textContent="";

    if  (cityButtonEl.innerHTML = cityname) {
      
    }

  };

  // Create buttonClickHandler() to allow user to click on city buttons to re-generate city weather data  
  var buttonClickHandler = function(event){
    
    var city = event.target.getAttribute("data-city");
      
    if (city) {
      getCityData(city); 
    cityCardTopEl.textContent ="";
    cityDataEl.textContent="";       
      
    }
  };
  
  // Create getCityData() that feeds in user's city name and places a call to the 
  // Open Weather City Name API URL
  var getCityData = function(city) {

    // Format the Open Weather API URL to accept a city name
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=06c51d7ff0a1bea11c97cc27ed41affd';
  
    // Fetch city data from the API URL
    fetch(apiUrl)
      .then(function(response) {
        // If request is successful, convert city data from the URL into JSON and feed it into the function 
        if (response.ok) {
          response.json().then(function(data) {

            // Create elements for city name and date to display in Current Weather section of webpage
            cityCardTopEl.classList.add("border", "border-dark");          

            var cityname = data.name;
            var currentDay = moment().format("MM/DD/YYYY");

            var cityHeaderEl = document.createElement("h3");
            cityHeaderEl.setAttribute("id", "city-name");
            cityHeaderEl.textContent = cityname + "  (" + currentDay + ")";
            cityCardTopEl.appendChild(cityHeaderEl);

            // Extract the lat and lon from the JSON city data and feed these into the getLonLatWeather()
            lat = data.coord.lat;
            lon = data.coord.lon;
            getLonLatWeather(lat, lon);
          });

        // Create alerts for any errors that might come up regarding the API call
        } else {
          cityCardTopEl.innerHTML = "";
          cityFiveDayTitle.innerHTML = "";
          alert('Error: ' + response.statusText);

          buttonDelete(city);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to Open Weather Map');
      });
  };
  
  var buttonDelete = function(city){
    console.log(city);

      cities = cities.filter(function(item) {
        return item !== city
    })    

    console.log(cities);
    localStorage.setItem("cities", JSON.stringify(cities));
    loadButtons();

};

  // Create getLonLatWeather() that feeds in lat/lon data and calls Open Weather Lat Lon API URL
  var getLonLatWeather = function(lat, lon) {
    // Format the Open Weather API URL to accept lat and lon and obtain 7 day forecast 
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&exclude=minutely,hourly,alerts&units=imperial&appid=06c51d7ff0a1bea11c97cc27ed41affd';

    // Fetch the city data from the APU URL
    fetch(apiUrl)
      .then(function(response) {
        // If request is successful, convert data into JSON and feed it into the function
        if (response.ok) {
          response.json().then(function(data) {

            // Feed data into displayCurrentDay() and displayFiveDays() functions
            displayCurrentDay(data);
            displayFiveDays(data);
          });
        
          // Create alerts for any errors that might come up regarding the API call  
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to Open Weather Map');
      });
  };
  
  // Create displayCurrentDay() to print city's current weather data on webpage
  var displayCurrentDay = function(data) {

  // Extract current day weather data from JSON data, save in variables, generate elements, and append for display
  var icon = data.current.weather[0].icon;
  var temp = data.current.temp + ' ℉';
  var windspeed = data.current.wind_speed + ' MPH';
  var humidity = data.current.humidity + ' %';
  var uvi = data.current.uvi;
  
  // Obtain city weather icon image from Open Weather Map URL and save into element  
  var cityIconEl = document.createElement("img");
  cityIconEl.setAttribute("src", "http://openweathermap.org/img/wn/"+ icon +".png")

  var cityTempEl = document.createElement("p");
  cityTempEl.textContent = "Temp: " + temp;
  
  var cityWindSpeedEl = document.createElement("p");
  cityWindSpeedEl.textContent = "Wind: " + windspeed;
  
  var cityHumidityEl = document.createElement("p");
  cityHumidityEl.textContent = "Humidity: " + humidity;

  var cityUviEl = document.createElement("p");
  cityUviEl.textContent = "UVI:  ";

  var cityUviValueEl = document.createElement("span");
  cityUviValueEl.textContent = uvi;
  cityUviEl.appendChild(cityUviValueEl);

  // Create conditionals to set background color of UV Index according to favorable, moderate, or severe conditions
  if (uvi > 5) {
    cityUviValueEl.classList.add("uvired")
  } else if (uvi <=2) {
    cityUviValueEl.classList.add("uvigreen")
  } else {
    cityUviValueEl.classList.add("uviyellow")
  };
  
  cityCardTopEl.appendChild(cityIconEl);
  cityCardTopEl.appendChild(cityTempEl);
  cityCardTopEl.appendChild(cityWindSpeedEl);
  cityCardTopEl.appendChild(cityHumidityEl);
  cityCardTopEl.appendChild(cityUviEl);
  
  };

  // Create displayFiveDays() to print city's 5 Day Forecast
  var displayFiveDays = function(data) {

    // Add title for 5-Day Forecast
    cityFiveDayTitle.textContent = "5-Day Forecast:"

    // Place 7 day forecast data into a variable
    var days = data.daily;

    // Create a for loop to select the 5 day forecast starting with index 1 (index 0 is current day data)
    for (var i = 1; i < 6; i++) {

      // Extract the dates and convert them into desired date format using Moment.js library
      var dates = days[i].dt;
      var cityDateEl = document.createElement("h4");
      cityDateEl.innerHTML = moment(dates*1000).format("MM/DD/YYYY");

      // Extract all weather data for each date, save to variables, generate elements, and append for display
      var icons = days[i].weather[0].icon;
      var cityDayIconEl = document.createElement("img");
      cityDayIconEl.setAttribute("src", "http://openweathermap.org/img/wn/"+ icons +".png");
      
      var temps = days[i].temp.day + ' ℉';  
      var cityTempEl = document.createElement("p");
      cityTempEl.textContent = "Temp:  " + temps;
          
      var windspeeds = days[i].wind_speed + ' MPH';
      var cityWindspeedEl = document.createElement("p"); 
      cityWindspeedEl.textContent = "Wind:  " + windspeeds;
      
      var humidity = days[1].humidity + ' %'
      var cityHumidityEl = document.createElement("p");
      cityHumidityEl.textContent = "Humidity:  " + humidity;

      var cityDayDataEl = document.createElement("div")
      cityDayDataEl.classList.add("col", "card-bottom", "border", "border-dark", "mx-3");
          
      cityDayDataEl.appendChild(cityDateEl);
      cityDayDataEl.appendChild(cityDayIconEl);
      cityDayDataEl.appendChild(cityTempEl);
      cityDayDataEl.appendChild(cityWindspeedEl);
      cityDayDataEl.appendChild(cityHumidityEl);

      cityDataEl.appendChild(cityDayDataEl);    

    }
  };
  
  // Create loadButtons() for saved cities search to persist on webpage upon refresh or reopening browser
  var loadButtons = function() {

    cityButtonsEl.innerHTML ="";
    // Obtain cities array from localStorage
    var savedCities = localStorage.getItem("cities");
    
    // If there are no cities, set cities to an empty array and return out of the function
    if (savedCities == "" || savedCities == null) {
      return;
    // else, load savedCities and set them to the cities array
    } else {
    savedCities = JSON.parse(savedCities);
    cities = savedCities;
    
    // Create a for loop to loop through each city and generate a button for each one that will display on page
    for (i = 0; i < savedCities.length; i++) {

      var cityButtonEl = document.createElement("button");
      cityButtonEl.setAttribute("data-city", savedCities[i]);
      cityButtonEl.classList = "btn mx-3 my-1"
      cityButtonEl.innerHTML = savedCities[i];
    
      cityButtonsEl.appendChild(cityButtonEl);
  
      }
  }
 
};
  

  // Call loadButtons() and add event listeners to handle search city inputs and button clicks
  loadButtons();
  cityButtonsEl.addEventListener('click', buttonClickHandler);
  cityFormEl.addEventListener('submit', searchCityHandler);