var searches = {};


//Function to display searched City
function searchDisplay(city){
    var searchHistory = JSON.parse(localStorage.getItem('search-history'));
    if (searchHistory !=null){
        removeDisplay()
        for (var item in searchHistory){
            var pastSearch = $('<div><button class="btn btn-secondary" id="pastSearch">'+item+'</button></div>');
            $('#searchHistory').prepend(pastSearch);
        }
    }
    if (city==undefined){
        city = $('#searchHistory button').first().text();
        if(city==''){return}
    }
    var presentDayDisplay =$(
        '<h3 class="row title5">'+city+'('+moment().format('MMM Do')+')<img src="http://openweathermap.org/img/wn/'+searchHistory[city].weather+'@2x.png" id="icon"></img></h3>'+
        '<p class="row">Temp: '+searchHistory[city].temp+' °F</p>' +
        '<p class="row">Wind: '+searchHistory[city].wind+' MPH</p>' +
        '<p class="row">Humidity: '+searchHistory[city].humidity+' %</p>' +
        '<p class="row">UV Index:<span class="uvi-box"> '+(searchHistory[city].uvi).toFixed(2)+'</span></p>');
    $('#presentDay').append(presentDayDisplay);
    if((searchHistory[city].uvi).toFixed(2) < 3){
        $('.uvi-box').css({'background-color':'green', 'padding':'2px','width':'auto', 'margin-left':'10px','margin-bottom':'10px'});
    } else if ((searchHistory[city].uvi).toFixed(2) < 6 && (searchHistory[city].uvi).toFixed(2) >= 3) {
        $('.uvi-box').css({'background-color':'yellow', 'padding':'2px','width':'auto', 'margin-left':'10px','margin-bottom':'10px'});
    } else {
        $('.uvi-box').css({'background-color':'red','padding':'2px', 'width':'auto', 'margin-left':'10px', 'margin-bottom':'10px'});
    }

    for(i=0;i<5;i++){
        var forecastDay = moment().add((i+1),'d').format('MMM Do');
        var forecastDisplay = $(
            '<h4 class="row title4">'+forecastDay+'</h4>'+
            '<img class="row weather-icon" src="http://openweathermap.org/img/wn/'+searchHistory[city].forecast[i].weather+'@2x.png"></img>'+
            '<p class="row text">Temp: '+searchHistory[city].forecast[i].temp+' °F</p>' +
            '<p class="row text">Wind: '+searchHistory[city].forecast[i].wind+' MPH</p>' +
            '<p class="row text">Humidity: '+searchHistory[city].forecast[i].humidity+' %</p>');
        $('[display-forecast='+(i+1)+']').append(forecastDisplay);
    }
}
//Removes Display from Dash
function removeDisplay() {
    var content = document.querySelector('#searchHistory');
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }

    content = document.querySelector('#presentDay');
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }

    for(i=0;i<5;i++) {
        content = document.querySelector('[display-forecast="'+(i+1)+'"]');
        while(content.firstChild){
            content.removeChild(content.firstChild);
        }
    }
}
//Search button function
$('#search').on('click', function(){
    var userInput = document.querySelector('#place').value.toLowerCase()
    //Fetch for current weather
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q='+userInput+'&units=imperial&appid=af00273ef9867d9a0925a1f97898fa27'
        )
        .then(function(return1){
        if (!return1.ok){throw Error(response.statusText)}
            return return1.json();
        })
        .then(function(cordinates){
            if(localStorage.getItem('search-history')){
                searches = JSON.parse(localStorage.getItem('search-history'));
            }
        var lat = cordinates['coord'].lat;
        var lon = cordinates['coord'].lon;
        var city = cordinates['name'];
    
    
    
    
    
    
        //Fetch for 5 day forcast
        fetch(
            'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&units=imperial&appid=af00273ef9867d9a0925a1f97898fa27'
            )
            .then(function(return2){
                return return2.json();
        })
            .then(function(searchResults){
                var temp = searchResults['current'].temp;
                var hum = searchResults['current'].humidity;
                var uvi = searchResults['current'].uvi;
                var wind = searchResults['current'].wind_speed;
                var weather = searchResults['current'].weather[0].icon;
                var forecast={};

            for (i=0;i<5;i++){
                var foreTemp = searchResults['daily'][i].temp.day;
                var foreHum = searchResults['daily'][i].humidity;
                var foreUvi = searchResults['daily'][i].uvi;
                var foreWind = searchResults['daily'][i].wind_speed;
                var foreWeather = searchResults['daily'][i].weather[0].icon;
                forecast[i] = {'temp':foreTemp, 'humidity':foreHum, 'uvi':foreUvi, 'wind':foreWind, 'weather':foreWeather}
            }
        searches[city]={'temp':temp, 'humidity':hum, 'uvi':uvi, 'wind':wind, 'weather':weather, 'forecast':forecast};
        localStorage.setItem('search-history', JSON.stringify(searches));
        removeDisplay();
        searchDisplay(city);
        });
    })
})

$('#searchHistory').on('click','#pastSearch', function(){
    searchDisplay($(this).text())
})

searchDisplay()