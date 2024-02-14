async function fetchWeather() {
  //Defining user input
    let searchInput = document.getElementById("search").value;
  //Defining openweather API key
    const apiKey = "";//Add API key
  //Making sure the input isn't empty
    if(searchInput == "") {
        document.getElementById("city").innerHTML = `
        Empty Input!
        `;
        return;
    }

    async function getLonAndLat() {
        const countryCode = 1;
      //Making API call for location coordinates
        geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;
      //Checking for any errors in the API call
        const response = await fetch(geocodeURL);
        if(!response.ok) {
          console.log("Bad response! ", response.status);
          return;
        }
      //Defining API response to a variable
        const data = await response.json();
      //Checking for any errors in the data
        if(data.length == 0) {
            console.log("Something went wrong here.");
            document.getElementById("city").innerHTML = `Error`;
            return;
          } else {
            return data[0];
          }
        
    };

    async function getWeatherData(lon, lat, quality) {
    //Defining function to turn degrees from the API into wind directions
      function getWindDirection(deg){
        deg = deg % 360;

        if (11.25 <= deg && deg < 33.75) {
          return "NNE";
        } else if (33.75 <= deg && deg < 56.25) {
          return "NE";
        } else if (56.25 <= deg && deg < 78.75) {
          return "ENE";
        } else if (78.75 <= deg && deg < 101.25) {
          return "E";
        } else if (101.25 <= deg && deg < 123.75) {
          return "ESE";
        } else if (123.75 <= deg && deg < 146.25) {
          return "SE";
        } else if (146.25 <= deg && deg < 168.75) {
          return "SSE";
        } else if (168.75 <= deg && deg < 191.25) {
          return "S";
        } else if (191.25 <= deg && deg < 213.75) {
          return "SSW";
        } else if (213.75 <= deg && deg < 236.25) {
          return "SW";
        } else if (236.25 <= deg && deg < 258.75) {
          return "WSW";
        } else if (258.75 <= deg && deg < 281.25) {
          return "W";
        } else if (281.25 <= deg && deg < 303.75) {
          return "WNW";
        } else if (303.75 <= deg && deg < 326.25) {
          return "NW";
        } else if (326.25 <= deg && deg < 348.75) {
          return "NNW";
        } else {
          return "N";
        }
      };
    //Making API call for current weather
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const response = await fetch(weatherURL);
    //checking for errors in API response
      if(!response.ok) {
          console.log("Bad response! ", response.status);
          return;
      }
    //Defining API response to a variable
      const data = await response.json() ;
    //Putting the current weather data into the HTML
      document.getElementById('city').innerHTML = `${data.name}`;
      document.getElementById("deg-today").innerHTML = `${Math.round(data.main.temp - 273.15)}°C`;
      document.getElementById('image-today').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />`;
      document.getElementById('des-today').innerHTML = `${data.weather[0].description}`;
    //Defining function to update current weather data on click
      async function update_today (data, quality){
        document.getElementById('widget-1').innerHTML = `
        <h3>Air quality:</h3>
        <p>${quality}</p>
        `;
        document.getElementById('widget-2').innerHTML =`
        <h3>Humidity:</h3>
        <p>${data.main.humidity}%<p>
        `;
        document.getElementById('widget-3').innerHTML = `
        <h3>Feels like:</h3>
        <p>${Math.round(data.main.feels_like - 273.15)}°C<p>
        `;
        document.getElementById('widget-4').innerHTML = `
        <h3>Wind:</h3>
        <p>${await getWindDirection(data.wind.deg)}<p>
        <h4>Beaufort-scale: ${data.wind.speed}<h4>
        `;
        document.getElementById('index-1').style.backgroundColor = 'transparent';
        document.getElementById('index-1').style.left = '-10px';

        document.getElementById('index-2').style.backgroundColor = 'transparent';
        document.getElementById('index-2').style.left = '-10px';

        document.getElementById('index-3').style.backgroundColor = 'transparent';
        document.getElementById('index-3').style.left = '-10px';

        document.getElementById('index-4').style.backgroundColor = 'transparent';
        document.getElementById('index-4').style.left = '-10px';

        document.getElementById('widget-1').style.opacity = '100%';
      };
      update_today(data, quality);
    //Checking for clicks on the wrapper of the current weather data
      document.getElementById('wrapper-today').addEventListener('click', function(){update_today(data, quality)});
    };

    async function getAirData(lon, lat) {
    //Making API call for air quality data
      const airQualityURL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const response = await fetch(airQualityURL);
    //Checking for errors in the API response
      if(!response.ok) {
          console.log("Bad response! ", response.status);
          return;
      }
    //Defining API response to a variable
      const data = await response.json();
    //Converting the air quality index to text
      let quality = 0
      if (data.list[0].main.aqi == 1){
        quality = "Good";
      }else if(data.list[0].main.aqi == 2){
        quality = "Fair";
      }else if(data.list[0].main.aqi == 3){
        quality = "Moderate";
      }else if(data.list[0].main.aqi == 4){
        quality = "Poor";
      }else if(data.list[0].main.aqi == 5){
        quality = "Very Poor";
      }else{
        console.log(`Error: Invalid value`);
      }
      return quality;
    };

    async function getForecastData(lon, lat, ){
    //Defining a function to get the name of a day from a date
      function getDayOfWeek(dateString) {
        let date = new Date(dateString);
        let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return daysOfWeek[date.getDay()];
      };
    //Defining a function to find the current date
      function getCurrentDate() {
        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);
        return formattedDate;
      };
    //Defining a function to index of tomorrow in the list returned by the API
      function getIndex(){
        for (let index = 0; index < 8; index++){
          if (getDayOfWeek(data.list[index].dt_txt.substr(0,10)) != getDayOfWeek(getCurrentDate())){
            let dayTwoIndex = index;
            return dayTwoIndex;
          }
        }
      };
    //Defining a function to find the mode of a list of strings
      function findMode(...strings) {
        const counts = {};
        strings.forEach(str => counts[str] = (counts[str] || 0) + 1);
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      };
    //Defining a function to find the average of 5 values 
      function getAverage(p1, p2, p3, p4, p5){
        let average = Math.round((p1 + p2 + p3 + p4 + p5) / 5);
        return average;
      };
    //Defining a function to convert degrees into wind direction
      function getWindDirection(deg){
        deg = deg % 360;

        if (11.25 <= deg && deg < 33.75) {
          return "NNE";
        } else if (33.75 <= deg && deg < 56.25) {
          return "NE";
        } else if (56.25 <= deg && deg < 78.75) {
          return "ENE";
        } else if (78.75 <= deg && deg < 101.25) {
          return "E";
        } else if (101.25 <= deg && deg < 123.75) {
          return "ESE";
        } else if (123.75 <= deg && deg < 146.25) {
          return "SE";
        } else if (146.25 <= deg && deg < 168.75) {
          return "SSE";
        } else if (168.75 <= deg && deg < 191.25) {
          return "S";
        } else if (191.25 <= deg && deg < 213.75) {
          return "SSW";
        } else if (213.75 <= deg && deg < 236.25) {
          return "SW";
        } else if (236.25 <= deg && deg < 258.75) {
          return "WSW";
        } else if (258.75 <= deg && deg < 281.25) {
          return "W";
        } else if (281.25 <= deg && deg < 303.75) {
          return "WNW";
        } else if (303.75 <= deg && deg < 326.25) {
          return "NW";
        } else if (326.25 <= deg && deg < 348.75) {
          return "NNW";
        } else {
          return "N";
        }
      };
    //Making API call to get the forecast data of the next 4 days
      const forecastURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const response = await fetch(forecastURL);
    //Checking for errors in the API response
      if(!response.ok) {
          console.log("Bad response! ", response.status);
          return;
      }
    //Defining API response to a variable
      const data = await response.json();
    //Adding the day, degrees and description to the screen
      document.getElementById('day-1').innerHTML = `${getDayOfWeek(data.list[getIndex()].dt_txt)}`;
      document.getElementById('day-2').innerHTML = `${getDayOfWeek(data.list[getIndex()+8].dt_txt)}`;
      document.getElementById('day-3').innerHTML = `${getDayOfWeek(data.list[getIndex()+16].dt_txt)}`;
      document.getElementById('day-4').innerHTML = `${getDayOfWeek(data.list[getIndex()+24].dt_txt)}`;
      document.getElementById('deg-1').innerHTML = `${Math.round(getAverage(data.list[getIndex()+3].main.temp, data.list[getIndex()+4].main.temp, data.list[getIndex()+5].main.temp, data.list[getIndex()+6].main.temp, data.list[getIndex()+7].main.temp) - 273.15)}°C`;
      document.getElementById('deg-2').innerHTML = `${Math.round(getAverage(data.list[getIndex()+11].main.temp, data.list[getIndex()+12].main.temp, data.list[getIndex()+13].main.temp, data.list[getIndex()+14].main.temp, data.list[getIndex()+15].main.temp) - 273.15)}°C`;
      document.getElementById('deg-3').innerHTML = `${Math.round(getAverage(data.list[getIndex()+19].main.temp, data.list[getIndex()+20].main.temp, data.list[getIndex()+21].main.temp, data.list[getIndex()+22].main.temp, data.list[getIndex()+23].main.temp) - 273.15)}°C`;
      document.getElementById('deg-4').innerHTML = `${Math.round(getAverage(data.list[getIndex()+27].main.temp, data.list[getIndex()+28].main.temp, data.list[getIndex()+29].main.temp, data.list[getIndex()+30].main.temp, data.list[getIndex()+31].main.temp) - 273.15)}°C`;
      document.getElementById('des-1').innerHTML = `${findMode(data.list[getIndex()+3].weather[0].description, data.list[getIndex()+4].weather[0].description, data.list[getIndex()+5].weather[0].description, data.list[getIndex()+6].weather[0].description, data.list[getIndex()+7].weather[0].description)}`;
      document.getElementById('des-2').innerHTML = `${findMode(data.list[getIndex()+11].weather[0].description, data.list[getIndex()+12].weather[0].description, data.list[getIndex()+13].weather[0].description, data.list[getIndex()+14].weather[0].description, data.list[getIndex()+15].weather[0].description)}`;
      document.getElementById('des-3').innerHTML = `${findMode(data.list[getIndex()+19].weather[0].description, data.list[getIndex()+20].weather[0].description, data.list[getIndex()+21].weather[0].description, data.list[getIndex()+22].weather[0].description, data.list[getIndex()+23].weather[0].description)}`;
      document.getElementById('des-4').innerHTML = `${findMode(data.list[getIndex()+27].weather[0].description, data.list[getIndex()+28].weather[0].description, data.list[getIndex()+29].weather[0].description, data.list[getIndex()+30].weather[0].description, data.list[getIndex()+31].weather[0].description)}`;
    //Creating the onclick functions to edit the information in the widgets based on the day that is clicked
      async function day_1_event(data){
        document.getElementById('widget-2').innerHTML =`
        <h3>Humidity:</h3>
        <p>${ await getAverage(data.list[getIndex()+3].main.humidity, data.list[getIndex()+4].main.humidity, data.list[getIndex()+5].main.humidity, data.list[getIndex()+6].main.humidity, data.list[getIndex()+7].main.humidity)}%<p>
        `;
        document.getElementById('widget-3').innerHTML = `
        <h3>Feels like:</h3>
        <p>${Math.round(getAverage(data.list[getIndex()+3].main.feels_like, data.list[getIndex()+4].main.feels_like, data.list[getIndex()+5].main.feels_like, data.list[getIndex()+6].main.feels_like, data.list[getIndex()+7].main.feels_like) - 273.15)}°C<p>
        `;
        document.getElementById('widget-4').innerHTML = `
        <h3>Wind:</h3>
        <p>${ await getWindDirection(getAverage(data.list[getIndex()+3].wind.deg, data.list[getIndex()+4].wind.deg, data.list[getIndex()+5].wind.deg, data.list[getIndex()+6].wind.deg, data.list[getIndex()+7].wind.deg))}<p>
        <h4>Beaufort-scale: ${getAverage(data.list[getIndex()+3].wind.speed, data.list[getIndex()+4].wind.speed, data.list[getIndex()+5].wind.speed, data.list[getIndex()+6].wind.speed, data.list[getIndex()+7].wind.speed)}<h4>
        `;
        document.getElementById('index-1').style.backgroundColor = '#D9D9D9';
        document.getElementById('index-1').style.left = '10px';

        document.getElementById('index-2').style.backgroundColor = 'transparent';
        document.getElementById('index-2').style.left = '-10px';

        document.getElementById('index-3').style.backgroundColor = 'transparent';
        document.getElementById('index-3').style.left = '-10px';

        document.getElementById('index-4').style.backgroundColor = 'transparent';
        document.getElementById('index-4').style.left = '-10px';

        document.getElementById('widget-1').style.opacity = '0%';
      };

      async function day_2_event(data){
        document.getElementById('widget-2').innerHTML =`
        <h3>Humidity:</h3>
        <p>${ await getAverage(data.list[getIndex()+11].main.humidity, data.list[getIndex()+12].main.humidity, data.list[getIndex()+13].main.humidity, data.list[getIndex()+14].main.humidity, data.list[getIndex()+15].main.humidity)}%<p>
        `;
        document.getElementById('widget-3').innerHTML = `
        <h3>Feels like:</h3>
        <p>${Math.round(getAverage(data.list[getIndex()+11].main.feels_like, data.list[getIndex()+12].main.feels_like, data.list[getIndex()+13].main.feels_like, data.list[getIndex()+14].main.feels_like, data.list[getIndex()+15].main.feels_like) - 273.15)}°C<p>
        `;
        document.getElementById('widget-4').innerHTML = `
        <h3>Wind:</h3>
        <p>${ await getWindDirection(getAverage(data.list[getIndex()+11].wind.deg, data.list[getIndex()+12].wind.deg, data.list[getIndex()+13].wind.deg, data.list[getIndex()+14].wind.deg, data.list[getIndex()+15].wind.deg))}<p>
        <h4>Beaufort-scale: ${getAverage(data.list[getIndex()+11].wind.speed, data.list[getIndex()+12].wind.speed, data.list[getIndex()+13].wind.speed, data.list[getIndex()+14].wind.speed, data.list[getIndex()+15].wind.speed)}<h4>
        `;
        document.getElementById('index-1').style.backgroundColor = 'transparent';
        document.getElementById('index-1').style.left = '-10px';

        document.getElementById('index-2').style.backgroundColor = '#D9D9D9';
        document.getElementById('index-2').style.left = '10px';

        document.getElementById('index-3').style.backgroundColor = 'transparent';
        document.getElementById('index-3').style.left = '-10px';

        document.getElementById('index-4').style.backgroundColor = 'transparent';
        document.getElementById('index-4').style.left = '-10px';

        document.getElementById('widget-1').style.opacity = '0%';
      };

      async function day_3_event(data){
        document.getElementById('widget-2').innerHTML =`
        <h3>Humidity:</h3>
        <p>${ await getAverage(data.list[getIndex()+19].main.humidity, data.list[getIndex()+20].main.humidity, data.list[getIndex()+21].main.humidity, data.list[getIndex()+22].main.humidity, data.list[getIndex()+23].main.humidity)}%<p>
        `;
        document.getElementById('widget-3').innerHTML = `
        <h3>Feels like:</h3>
        <p>${Math.round(getAverage(data.list[getIndex()+19].main.feels_like, data.list[getIndex()+20].main.feels_like, data.list[getIndex()+21].main.feels_like, data.list[getIndex()+22].main.feels_like, data.list[getIndex()+23].main.feels_like) - 273.15)}°C<p>
        `;
        document.getElementById('widget-4').innerHTML = `
        <h3>Wind:</h3>
        <p>${ await getWindDirection(getAverage(data.list[getIndex()+19].wind.deg, data.list[getIndex()+20].wind.deg, data.list[getIndex()+21].wind.deg, data.list[getIndex()+22].wind.deg, data.list[getIndex()+23].wind.deg))}<p>
        <h4>Beaufort-scale: ${getAverage(data.list[getIndex()+19].wind.speed, data.list[getIndex()+20].wind.speed, data.list[getIndex()+21].wind.speed, data.list[getIndex()+22].wind.speed, data.list[getIndex()+23].wind.speed)}<h4>
        `;
        document.getElementById('index-1').style.backgroundColor = 'transparent';
        document.getElementById('index-1').style.left = '-10px';

        document.getElementById('index-2').style.backgroundColor = 'transparent';
        document.getElementById('index-2').style.left = '-10px';

        document.getElementById('index-3').style.backgroundColor = '#D9D9D9';
        document.getElementById('index-3').style.left = '10px';

        document.getElementById('index-4').style.backgroundColor = 'transparent';
        document.getElementById('index-4').style.left = '-10px';

        document.getElementById('widget-1').style.opacity = '0%';
      };

      async function day_4_event(data){
        document.getElementById('widget-2').innerHTML =`
        <h3>Humidity:</h3>
        <p>${ await getAverage(data.list[getIndex()+27].main.humidity, data.list[getIndex()+28].main.humidity, data.list[getIndex()+29].main.humidity, data.list[getIndex()+30].main.humidity, data.list[getIndex()+31].main.humidity)}%<p>
        `;
        document.getElementById('widget-3').innerHTML = `
        <h3>Feels like:</h3>
        <p>${Math.round(getAverage(data.list[getIndex()+27].main.feels_like, data.list[getIndex()+28].main.feels_like, data.list[getIndex()+29].main.feels_like, data.list[getIndex()+30].main.feels_like, data.list[getIndex()+31].main.feels_like) - 273.15)}°C<p>
        `;
        document.getElementById('widget-4').innerHTML = `
        <h3>Wind:</h3>
        <p>${ await getWindDirection(getAverage(data.list[getIndex()+27].wind.deg, data.list[getIndex()+28].wind.deg, data.list[getIndex()+29].wind.deg, data.list[getIndex()+30].wind.deg, data.list[getIndex()+31].wind.deg))}<p>
        <h4>Beaufort-scale: ${getAverage(data.list[getIndex()+27].wind.speed, data.list[getIndex()+28].wind.speed, data.list[getIndex()+29].wind.speed, data.list[getIndex()+30].wind.speed, data.list[getIndex()+31].wind.speed)}<h4>
        `;
        document.getElementById('index-1').style.backgroundColor = 'transparent';
        document.getElementById('index-1').style.left = '-10px';

        document.getElementById('index-2').style.backgroundColor = 'transparent';
        document.getElementById('index-2').style.left = '-10px';

        document.getElementById('index-3').style.backgroundColor = 'transparent';
        document.getElementById('index-3').style.left = '-10px';

        document.getElementById('index-4').style.backgroundColor = '#D9D9D9';
        document.getElementById('index-4').style.left = '10px';

        document.getElementById('widget-1').style.opacity = '0%';
      };
    //Checking for the wrappers being clicked
      document.getElementById('wrapper-1').addEventListener('click', function(){day_1_event(data)});
      document.getElementById('wrapper-2').addEventListener('click', function(){day_2_event(data)});
      document.getElementById('wrapper-3').addEventListener('click', function(){day_3_event(data)});
      document.getElementById('wrapper-4').addEventListener('click', function(){day_4_event(data)});
    };
  //Resetting the search value to an empty string
    document.getElementById("search").value = "";
  //Running the 3 functions
    const geocodeData = await getLonAndLat();
    getWeatherData(geocodeData.lon, geocodeData.lat, await getAirData(geocodeData.lon, geocodeData.lat));
    getForecastData(geocodeData.lon, geocodeData.lat);
  //Making the information added visible 
    document.getElementById('side-nav').style.opacity = `100%`;
    document.getElementById('widgets').style.opacity = `100%`;
};


