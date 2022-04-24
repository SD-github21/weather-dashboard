

var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-search");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityDataEl = document.querySelector("#weather-data");
var cityCardTopEl = document.querySelector("#card-top");
var cityFiveDayTitle = document.querySelector(".five-day-title");
var cityDay1Data = document.querySelector("#day1");
var cityDay2Data = document.querySelector("#day2");
var cityDay3Data = document.querySelector("#day3");
var cityDay4Data = document.querySelector("#day4");
var cityDay5Data = document.querySelector("#day5");



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
  cityUviEl.textContent = "UVI:  " + uvi;
  
  cityCardTopEl.appendChild(cityIconEl);
  cityCardTopEl.appendChild(cityTempEl);
  cityCardTopEl.appendChild(cityWindSpeedEl);
  cityCardTopEl.appendChild(cityHumidityEl);
  cityCardTopEl.appendChild(cityUviEl);
  
  };


  var displayFiveDays = function(data) {
    // Add title for 5-Day Forecast
    cityFiveDayTitle.textContent = "5-Day Forecast:"

    // Set data from Open Weather API into variable 
    var days = data.daily;

    // Create Day 1 Data Card
    // Day 1 Date
    var dayOneDateEl = document.createElement("h4");
    dayOneDateEl.innerHTML = moment().add(1, 'days').format("MM/DD/YYYY");

    // Day 1 Icon
    var icon1 = days[1].weather[0].icon;
    var day1IconEl = document.createElement("img");
    day1IconEl.setAttribute("src", "http://openweathermap.org/img/wn/"+ icon1 +".png");

    // Day 1 Temp
    var temp1 = days[1].temp.day + ' ℉';  
    var temp1El = document.createElement("p");
    temp1El.textContent = "Temp:  " + temp1;
    
    // Day 1 Wind Speed
    var windspeed1 = days[1].wind_speed + ' MPH';
    var windspeedEl = document.createElement("p"); 
    windspeedEl.textContent = "Wind:  " + windspeed1;

    // Day 1 Humidity
    var humidity1 = days[1].humidity + ' %'
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity:  " + humidity1;
    
    cityDay1Data.appendChild(dayOneDateEl);
    cityDay1Data.appendChild(day1IconEl);
    cityDay1Data.appendChild(temp1El);
    cityDay1Data.appendChild(windspeedEl);
    cityDay1Data.appendChild(humidityEl);
    


    // for (var i = 1; i < 5; i++) {
    //   // format repo name

    //   var icons = days[i].weather[0].icon;
    //   console.log(icons);
    //   var temps = days[i].temp.day + ' ℉';
    //   console.log(temps);
    //   var windspeed = days[i].wind_speed + ' MPH'
    //   console.log(windspeed);
    //   var humidity = days[i].humidity + ' %'
    //   console.log(humidity);


    


    // document.getElementById("day2").innerHTML = moment().add(2, 'days').format("MM/DD/YYYY");
    // document.getElementById("day3").innerHTML = moment().add(3, 'days').format("MM/DD/YYYY");
    // document.getElementById("day4").innerHTML = moment().add(4, 'days').format("MM/DD/YYYY");
    // document.getElementById("day5").innerHTML = moment().add(5, 'days').format("MM/DD/YYYY");
    




      // loop over days

    // var days = data.daily;
    
    // console.log(days);
    // for (var i = 0; i < 5; i++) {
    //   // format repo name
    //   var icons = days[i].weather[0].icon;
    //   console.log(icons);
    //   var temps = days[i].temp.day + ' ℉';
    //   console.log(temps);
    //   var windspeed = days[i].wind_speed + ' MPH'
    //   console.log(windspeed);
    //   var humidity = days[i].humidity + ' %'
    //   console.log(humidity);



      };
  



  cityButtonsEl.addEventListener('click', buttonClickHandler);
  cityFormEl.addEventListener('submit', searchCityHandler);