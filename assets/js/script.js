

var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-search');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityCardEl = document.querySelector('.card-top')

// Add current day and 5 day dates using Moment.js
// document.getElementById("currentDay").innerHTML = moment().format("MM/DD/YYYY");
document.getElementById("day1").innerHTML = moment().add(1, 'days').format("MM/DD/YYYY");
document.getElementById("day2").innerHTML = moment().add(2, 'days').format("MM/DD/YYYY");
document.getElementById("day3").innerHTML = moment().add(3, 'days').format("MM/DD/YYYY");
document.getElementById("day4").innerHTML = moment().add(4, 'days').format("MM/DD/YYYY");
document.getElementById("day5").innerHTML = moment().add(5, 'days').format("MM/DD/YYYY");


var searchCityHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
          
   
    // get value from input element
    let cityname = cityInputEl.value.trim();
 
    if (cityname) {
      getCityData(cityname);
      buttonGenerator(cityname);
      
    } else {
      alert('Please enter a city');
    }
  };


  var buttonGenerator = function(cityname) {
    var cityButtonEl = document.createElement("button");
    cityButtonEl.setAttribute("data-city", cityname);
    cityButtonEl.classList = "btn mx-3 my-1"
    cityButtonEl.innerHTML = cityname;

    cityButtonsEl.appendChild(cityButtonEl);
  };


  var buttonClickHandler = function(event){
    
    var city = event.target.getAttribute("data-city");
    console.log(city);
  
    if (city) {
      getCityData(city); 
      
    }
  };
  
  
  var getCityData = function(city) {
    // format the open weather api url to accept a city name
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=06c51d7ff0a1bea11c97cc27ed41affd';
  
    // make a get request to url
    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            
            var cityname = data.name;
            var currentDay = moment().format("MM/DD/YYYY")

            var cityHeaderEl = document.createElement("h3");
            cityHeaderEl.setAttribute("id", "city-name");
            cityHeaderEl.textContent = cityname + "  (" + currentDay + ")";
            cityCardEl.appendChild(cityHeaderEl);

            // displayCurrentDay(data);
            console.log(data);
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
  
  var getLonLatWeather = function(lat, lon) {
    // format the open weather api url to accept latitude and longitude so that a 7 day forecast can be acccessed
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&exclude=minutely,hourly,alerts&units=imperial&appid=06c51d7ff0a1bea11c97cc27ed41affd';

    // make a get request to url
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
  cityUviEl.textContent = "UVI:  " + uvi;
  
  cityCardEl.appendChild(cityIconEl);
  cityCardEl.appendChild(cityTempEl);
  cityCardEl.appendChild(cityWindSpeedEl);
  cityCardEl.appendChild(cityHumidityEl);
  cityCardEl.appendChild(cityUviEl);
  
  };


  var displayFiveDays = function(data) {

      // loop over days

    var days = data.daily;
    console.log(days);
    for (var i = 0; i < 5; i++) {
      // format repo name
      var icons = days[i].weather[0].icon;
      console.log(icons);
      var temps = days[i].temp.day + ' ℉';
      console.log(temps);
      var windspeed = days[i].wind_speed + ' MPH'
      console.log(windspeed);
      var humidity = days[i].humidity + ' %'
      console.log(humidity);


      }
  }



  cityButtonsEl.addEventListener('click', buttonClickHandler);
  cityFormEl.addEventListener('submit', searchCityHandler);