//Global...
let flag = 0;
const api = 'https://api.openweathermap.org/data/2.5/onecall?lat=41.835108&lon=12.500752&exclude=minutely,hourly&appid=cd72d5ff50e365968e0c6af474f2198a';
let fivedays = [];
let icon;
let mainweather;
let descriptionweather;
let tempId = 0
const kelvinConversion = 273.15;
let lat;
let lon;
let flagforecast = false;
//...declaration


function initMap() {
    //define const for the location --> getLocation
    const location = { lat: lat, lng: lon};
    //map centered at location
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: location,
    });
    // align marker at position (red)
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
}

// function to getLocation at the moment
function getLocation(){
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
    function success(pos){
        let cordinates = pos.coords
        lat = cordinates.latitude;
        lon = cordinates.longitude;
        flagforecast = true;
        if(flagforecast){
            this.getForecast()
        }
    }
    function error (error){
        console.warn(`ERROR(${error.code}): ${error.message}`)
    }
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
}

//function for get forecast 
function getForecast(){
    setTimeout(() => {
        //api call
        fetch(api).then(response => {
            return response.json();
        }).then(responsejson => {
                fivedays = responsejson.daily.map(element => {
                    element.weather.map( e => {
                        icon = 'https://api.openweathermap.org/img/w/' + e.icon + '.png';
                        mainweather = e.main;
                        descriptionweather = e.description;
                    })
                    var temp = new Date(element.dt * 1000);
                    return {
                        //object with all utils properties
                        location: responsejson.timezone.substring(responsejson.timezone.lastIndexOf('/') + 1),
                        day: temp.getDay(),
                        max: Math.round(element.temp.max - kelvinConversion),
                        min: Math.round(element.temp.min - kelvinConversion),
                        daystemp: Math.round(element.temp.day - kelvinConversion),
                        icon: icon,
                        main: mainweather,
                        description: descriptionweather,
                        windspeed: element.wind_speed,
                        clouds: element.clouds
                    };
                })
            //conversion number in relative daysweek    
            fivedays.slice(0,5).map(element => {
                let today = new Date()
                today = today.getDay();
                if(element.day === today){
                    element.day = 'Today'
                }else if(element.day === 3){
                    element.day = 'Wed'
                }else if(element.day === 4){
                    element.day = 'Thu'
                }else if(element.day === 5){
                    element.day = 'Fri'
                }else if(element.day === 6){
                    element.day = 'Sat'
                }else if(element.day === 1){
                    element.day = 'Mon'
                }else{
                    element.day = 'Sun'
                }
                //utils variable
                let location = element.location;
                let day = element.day;
                let max = element.max; 
                let min = element.min; 
                let daystemp = element.daystemp;
                let icon = element.icon;
                let main = element.main;
                let description = element.description;
                let windspeed = element.windspeed;
                let clouds = element.clouds;
                //main weather in left container
                let array = fivedays.reverse();
                array.map((el) => {
                    document.getElementById('location').innerHTML = el.location;
                    document.getElementById('temp').innerHTML = el.daystemp + ' C˚';
                    document.getElementById('icon').setAttribute('src', el.icon);
                    document.getElementById('icon').style.width = '80px'
                    document.getElementById('main').innerHTML = el.main;
                    document.getElementById('description').innerHTML = el.description;
                    document.getElementById('min').innerHTML = el.min + ' C˚';
                    document.getElementById('max').innerHTML = el.max + ' C˚';
                })
                //div like list item in right container
                const container = document.createElement('div');
                container.className = 'flex-start mt-25 centervertical';
                container.innerHTML;
                container.id = tempId;
                document.getElementById('forecast').appendChild(container);
                const spanday  = document.createElement('span');
                spanday.className = 'spanlistforecast offwhite widthDay';
                spanday.innerHTML = day;
                document.getElementById(tempId).appendChild(spanday)
                const imgIcon = document.createElement('img');
                imgIcon.src = icon;
                imgIcon.alt = 'icon';
                imgIcon.style.width = '10%'
                imgIcon.innerHTML;
                document.getElementById(tempId).appendChild(imgIcon);
                const spantemp  = document.createElement('span');
                spantemp.className = 'spanlistforecast offgrey tempbox';
                spantemp.innerHTML = daystemp + ' C˚';
                document.getElementById(tempId).appendChild(spantemp);
                const spandesc  = document.createElement('span');
                spandesc.className = 'spanlistforecast offwhite widthDescription';
                spandesc.innerHTML = description;
                document.getElementById(tempId).appendChild(spandesc)
                const spanwind  = document.createElement('span');
                spanwind.className = 'detailsforecast offgrey widthWind';
                spanwind.innerHTML = 'wind ' + windspeed + ' m/s ';
                document.getElementById(tempId).appendChild(spanwind)
                const spancloud  = document.createElement('span');
                spancloud.className = 'detailsforecast offgrey cloudsWidth';
                spancloud.innerHTML = 'clouds '+ clouds + ' %';
                spancloud.style.marginLeft = '8px'
                document.getElementById(tempId).appendChild(spancloud)
                tempId ++;                
            })
            return responsejson;
        }).catch( error => alert(error))
    }, 300);
}

//function to show or hide map
function showHide(){
    if(flag === 1){
        document.getElementById("map").style.display = "none";
        return flag = 0
    }else{
        initMap();
        document.querySelector('.bottomcontainer').scrollIntoView({
            behavior: 'smooth',
        })
        document.getElementById("map").style.display  = "inline";
        return flag = 1;
    }
}