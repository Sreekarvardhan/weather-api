function getCityCoordinates() {
    const weatherCardsDiv = document.querySelector(".weather-cards");                         //it displays the cards in the "weather-cards" div
    const weatherTypeMapping = {                                                              //text fetched for each possible weather variable
      clear: "Clear",
      cloudy: "Cloudy",
      humid: "Humid",
      ishower: "Shower",
      lightrain: "Light rain",
      lightsnow: "Light snow",
      mcloudy: "Mostly cloudy",
      oshower: "Occasional shower",
      pcloudy: "Partially cloudy",
      rain: "Rain",
      rainsnow: "Rain and snow",
      snow: "Snow",
      ts: "Thunderstorm",
    };
    
    //1st step, we extract latitude, longitude and name of city:
    const mySelected = document.getElementById("citySelected").value;         //assigns the value of selected city string to "mySelected"
    const matchedArr2 = mySelected.match(/-?\d+\.?\d+/g);                     //note: fixed the regex... with "-?" it now includes "-" in match
    const lat = matchedArr2[0];                                               //selecting the 1st decimal number
    const lon = matchedArr2[1];                                               //selecting the 2nd decimal number
    //NOTE: ALWAYS MAKE SURE LONGITUDE AND LATITUDE ARE ASSIGNED IN THE CORRECT ORDER, VERY COMMON MISTAKE TO MIX THEM UP!!!
  
    const charArray = [...mySelected]; //making the string into an array of characters
    const cityName = charArray.reduce(function (charString, element) { //function that reduces the original string into string with select chars
      const selectChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // selects letters only
      if (selectChar.includes(element)) {
          return charString + element;
      }
    return charString;
    }, "");
  
    //Not sure if this is needed (maybe as failsafe):
    if (cityName === "") return;
    if (lat === "") return;
    if (lon === "") return;
  
    //2nd step, we define then fetch the URL:
    const url = `https://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`;
    //NOTE: ALWAYS MAKE SURE LONGITUDE AND LATITUDE ARE ASSIGNED IN THE CORRECT ORDER, VERY COMMON MISTAKE TO MIX THEM UP!!!
  
    fetch(url) 
      .then(response => response.json())
      .then(data => {
        
        let html = `
        <div class="weather-data"> 
          <h3>Weather for ${cityName}:</h3>
        </div>
        `;                                                   //lets initialize our card display string with cityName, then append other strings 
  
        //3rd step is setting up the date format:
        data.dataseries.forEach((item, index) => {
          const unformattedDate = item.date.toString();
          const year = unformattedDate.substring(0, 4);
          const month = unformattedDate.substring(4, 6);
          const day = unformattedDate.substring(6, 8);
          const date = new Date(`${year}-${month}-${day}`);          //not sure why the universal date format is year-month-day, weird, but ok...
          const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          };
          const formattedDate = date.toLocaleDateString(undefined, options);                                   //card date is finished formatting
  
          //4th step is setting up the card display:
          html += (`
          <div class="day">
            <p class="small">${formattedDate}</p>
            <img src="images/${item.weather}.png" alt="weather-icon">
            <h4>${weatherTypeMapping[item.weather]}</h4>
            <p>Temp Max: <strong>${item.temp2m.max}°C</strong></p>
            <p>Temp Min: <strong>${item.temp2m.min}°C</strong></p>
          </div>
          `);
        });
  
        weatherCardsDiv.innerHTML = html;                     
          
        html = null;                                                                                                   
      });
        
