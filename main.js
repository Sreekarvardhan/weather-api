function getCityCoordinates() {
    const weatherCardsDiv = document.querySelector(".weather-cards");                         
    const weatherTypeMapping = {                                                              
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
    
    const mySelected = document.getElementById("citySelected").value;         
    const matchedArr2 = mySelected.match(/-?\d+\.?\d+/g);                     
    const lat = matchedArr2[0];                                               
    const lon = matchedArr2[1];                                               
    
  
    const charArray = [...mySelected]; 
    const cityName = charArray.reduce(function (charString, element) { 
      const selectChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; 
      if (selectChar.includes(element)) {
          return charString + element;
      }
    return charString;
    }, "");
  
    
    if (cityName === "") return;
    if (lat === "") return;
    if (lon === "") return;
  
    
    const url = `https://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`;
    
  
    fetch(url) 
      .then(response => response.json())
      .then(data => {
        
        let html = `
        <div class="weather-data"> 
          <h3>Weather for ${cityName}:</h3>
        </div>
        `;                                                   
  
        
        data.dataseries.forEach((item, index) => {
          const unformattedDate = item.date.toString();
          const year = unformattedDate.substring(0, 4);
          const month = unformattedDate.substring(4, 6);
          const day = unformattedDate.substring(6, 8);
          const date = new Date(`${year}-${month}-${day}`);          
          const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          };
          const formattedDate = date.toLocaleDateString(undefined, options);                                   
  
          
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
        
