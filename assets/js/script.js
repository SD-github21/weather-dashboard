// Retrieve Open Weather API call for city name
// https://api.openweathermap.org/data/2.5/weather?q={city name}cnt=5&units=imperial&appid=

document.getElementById("currentDay").innerHTML = moment().format("MM/DD/YYYY");
document.getElementById("day1").innerHTML = moment().add(1, 'days').format("MM/DD/YYYY");
document.getElementById("day2").innerHTML = moment().add(2, 'days').format("MM/DD/YYYY");
document.getElementById("day3").innerHTML = moment().add(3, 'days').format("MM/DD/YYYY");
document.getElementById("day4").innerHTML = moment().add(4, 'days').format("MM/DD/YYYY");
document.getElementById("day5").innerHTML = moment().add(5, 'days').format("MM/DD/YYYY");

