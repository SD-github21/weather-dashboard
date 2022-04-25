// Create variables to select elements from HTML that will be used in functions
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-search");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityDataEl = document.querySelector("#five-day");
var cityCardTopEl = document.querySelector("#card-top");
var cityFiveDayTitle = document.querySelector(".five-day-title");

// Create an array of cities to store user's searched cities in localStorage
var cities = [];

// Create a searchCityHandler function for user to enter a city into search form
var searchCityHandler = function(event) {
    // Prevent page from refreshing
    event.preventDefault();
       
    // Get city name value from input element
    let cityname = cityInputEl.value.trim();
      
    // Feed user's entered city name into functions that will make Open Weather API call and generate buttons
    // Push city name into cities array and store in localStorage
    // Clear input form element 
    if (cityname) {
      getCityData(cityname);
      buttonGenerator(cityname);
      cities.push(cityname);
      localStorage.setItem("cities", JSON.stringify(cities));
      cityInputEl.value = "";  
    
     // Alert user to enter a city if the input element is blank 
    } else {
      alert('Please enter a city');
    }
  };

  // Create and feed city name into buttonGenerator function to generate buttons based on user's searched cities  
  // Clear data from any previous searches
  var buttonGenerator = function(cityname) {

    var cityButtonEl = document.createElement("button");
    cityButtonEl.setAttribute("data-city", cityname);
    cityButtonEl.classList = "btn mx-3 my-1"
    cityButtonEl.innerHTML = cityname;

    cityButtonsEl.appendChild(cityButtonEl);

    cityCardTopEl.textContent ="";
    cityDataEl.textContent="";

  };

  // Create buttonClickHandler function to allow user to click on city buttons to re-generate city weather data  
  var buttonClickHandler = function(event){
    
    var city = event.target.getAttribute("data-city");
      
    if (city) {
      getCityData(city); 
    cityCardTopEl.textContent ="";
    cityDataEl.textContent="";       
      
    }
  };
  
  // Create getCityData function that feeds in user's city name and places a call to the 
  // Open Weather City Name API URL
  var getCityData = function(city) {

    // Format the Open Weather API URL to accept a city name
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=06c51d7ff0a1bea11c97cc27ed41affd';
  
    // Fetch the desired city data from the API URL
    fetch(apiUrl)
      .then(function(response) {
        // If request is successful, convert city data from the URL into JSON and feed it into the function 
        // Create elements for city name and date to display in Current Weather section of webpage
        if (response.ok) {
          response.json().then(function(data) {

            cityCardTopEl.classList.add("border", "border-dark");          

            var cityname = data.name;
            var currentDay = moment().format("MM/DD/YYYY");

            var cityHeaderEl = document.createElement("h3");
            cityHeaderEl.setAttribute("id", "city-name");
            cityHeaderEl.textContent = cityname + "  (" + currentDay + ")";
            cityCardTopEl.appendChild(cityHeaderEl);

            // Extract the lat and lon from the JSON city data and feed these into the getLonLatWeather function
            // Create alerts for any errors that might come up regarding the API call
            lat = data.coord.lat;
            lon = data.coord.lon;
            getLonLatWeather(lat, lon);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to Open Weather Map');
      });
  };
  
  // Create getLonLatWeather function that feeds in the lat and lon coordinates associated with user's city name
  // and places a call to the Open Weather Lat Lon API URL
  var getLonLatWeather = function(lat, lon) {
    // Format the Open Weather API URL to accept latitude and longitude so that the 7 day forecast can be 
    // acccessed and the 5 day forecast can be extracted from these data
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&exclude=minutely,hourly,alerts&units=imperial&appid=06c51d7ff0a1bea11c97cc27ed41affd';

    // Fetch the desired city data from the APU URL
    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(data) {
            console.log(data);
            displayCurrentDay(data);
            displayFiveDays(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to Open Weather Map');
      });
  };
  

  var displayCurrentDay = function(data) {


  var icon = data.current.weather[0].icon;
  var temp = data.current.temp + ' ℉';
  var windspeed = data.current.wind_speed + ' MPH';
  var humidity = data.current.humidity + ' %';
  var uvi = data.current.uvi;

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


  var displayFiveDays = function(data) {
    // Add title for 5-Day Forecast
    cityFiveDayTitle.textContent = "5-Day Forecast:"

    var days = data.daily;

    for (var i = 1; i < 6; i++) {

      var dates = days[i].dt;
      var cityDateEl = document.createElement("h4");
      cityDateEl.innerHTML = moment(dates*1000).format("MM/DD/YYYY");

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
  
  var loadButtons = function() {
    var savedCities = localStorage.getItem("cities");
    // if there are no cities, set cities to an empty array and return out of the function
    if (savedCities == "" || savedCities == null) {
      return;
    // else, load up saved cities
    } else {
    // parse into array of objects
    savedCities = JSON.parse(savedCities);
    console.log(savedCities);
    cities = savedCities;
    for (i = 0; i < savedCities.length; i++) {

      var cityButtonEl = document.createElement("button");
      cityButtonEl.setAttribute("data-city", savedCities[i]);
      cityButtonEl.classList = "btn mx-3 my-1"
      cityButtonEl.innerHTML = savedCities[i];
    
      cityButtonsEl.appendChild(cityButtonEl);
  
      }
  }
 
};
  


  loadButtons();
  cityButtonsEl.addEventListener('click', buttonClickHandler);
  cityFormEl.addEventListener('submit', searchCityHandler);