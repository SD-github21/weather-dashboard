// Retrieve Open Weather API call for city name
// {city name}cnt=5

var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-search');
var btnsContainerEl = document.querySelector('#btns');
var cityCardEl = document.querySelector('.card-top')

// Add current day and 5 day dates using Moment.js
document.getElementById("currentDay").innerHTML = moment().format("MM/DD/YYYY");
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
      
      // set city name value to city card
      var cityNameEl = document.createElement("h3");
      cityNameEl.setAttribute("id", "city-name");
      cityNameEl.textContent = cityname;  
      cityCardEl.appendChild(cityNameEl);



      // clear old content
    //   btnsContainerEl.textContent = '';
      cityInputEl.value = '';


    } else {
      alert('Please enter a city');
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
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to Open Weather Map');
      });
  };
  






  cityFormEl.addEventListener('submit', searchCityHandler);