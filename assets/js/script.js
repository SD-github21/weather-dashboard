

var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-search");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityDataEl = document.querySelector("#five-day");
var cityCardTopEl = document.querySelector("#card-top");
var cityFiveDayTitle = document.querySelector(".five-day-title");

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
    
    cityCardTopEl.textContent ="";
    cityDataEl.textContent="";
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

            cityCardTopEl.classList.add("border", "border-dark");          

            var cityname = data.name;
            var currentDay = moment().format("MM/DD/YYYY");

            var cityHeaderEl = document.createElement("h3");
            cityHeaderEl.setAttribute("id", "city-name");
            cityHeaderEl.textContent = cityname + "  (" + currentDay + ")";
            cityCardTopEl.appendChild(cityHeaderEl);

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
  



  cityButtonsEl.addEventListener('click', buttonClickHandler);
  cityFormEl.addEventListener('submit', searchCityHandler);