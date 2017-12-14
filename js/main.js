/////////////////////////////////Data Initialization/////////////////////////////////

var listings;
var neighbourhoods;
var calendar;
var available;

d3.csv("data/listings-pruned.csv", function(data) {
    //preprocess array
    data.forEach(function(d) {
        //type converstions
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        d.people_included = +d.people_included;
        d.price = Number(d.price.replace(/[^0-9\.-]+/g,""));
        d.weekly_price = Number(d.weekly_price.replace(/[^0-9\.-]+/g,""));
        d.monthly_price = Number(d.monthly_price.replace(/[^0-9\.-]+/g,""));
        d.security_deposit = Number(d.security_deposit.replace(/[^0-9\.-]+/g,""));
        d.cleaning_fee = Number(d.cleaning_fee.replace(/[^0-9\.-]+/g,""));
        d.extra_people = Number(d.extra_people.replace(/[^0-9\.-]+/g,""));
        d.availability_30 = +d.availability_30;
        d.availability_60 = +d.availability_60;
        d.availability_90 = +d.availability_90;
        d.availability_365 = +d.availability_365;
        d.number_of_reviews = +d.number_of_reviews;
        d.review_scores_rating = +d.review_scores_rating;
        d.review_scores_accuracy = +d.review_scores_accuracy;
        d.review_scores_cleanliness = +d.review_scores_cleanliness;
        d.review_scores_checkin = +d.review_scores_checkin;
        d.review_scores_communication = +d.review_scores_communication;
        d.review_scores_location = +d.review_scores_location;
        d.review_scores_value = +d.review_scores_value;
        d.calculated_host_listings_count = +d.calculated_host_listings_count;
        d.reviews_per_month = +d.reviews_per_month;
        //Other stuff
        if(d.weekly_price == 0){
            d.weekly_price = 7 * d.price;
        }
    });
    
    //return
    listings = data;
    //document.getElementById("loading").innerHTML += "loaded listings!";
});

d3.csv("data/neighbourhoods.csv", function(data) {
    neighbourhoods = [];
    var l = data.length;
    for (var i = 0; i < l; i++) { // loop through l items
        neighbourhoods.push(data[i].neighbourhood);
    }
    //document.getElementById("loading").innerHTML += "loaded neighborhoods!";
    console.log(neighbourhoods[0]);
});

d3.csv("data/calendar_available_only_dates.csv", function(data) {
    //preprocess array
    //return
    calendar = data;
    available = buildMap(_.countBy(calendar, 'date'));
    //document.getElementById("loading").innerHTML += "loaded calendar!";
});


///////////////////////////////////////Graphs////////////////////////////////////////
function showMap(){
    document.getElementById('map-container').style.display = 'block';
    document.getElementById('myChart1').style.display = 'none';
    document.getElementById('myChart2').style.display = 'none';
}

function getVariance(){
    document.getElementById('map-container').style.display = 'none';
    document.getElementById('myChart1').style.display = 'block';
    document.getElementById('myChart2').style.display = 'none';
    var ctx = document.getElementById('myChart1').getContext('2d');
    var chart = new Chart(ctx);
    
    var neighbourhoodVariance = [];
    for(var i = 0; i < neighbourhoods.length; i++){
        neighbourhoodVariance[i] = truncateDecimals(ss.standardDeviation(listings.filter(function(d) { return d.neighbourhood_cleansed == neighbourhoods[i]; }).map(function(d) { return d.price; })), 2);
    }
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: neighbourhoods,
            datasets: [{
                label: "Price Variance",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: neighbourhoodVariance
            }]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: 'Price Variance by Neighbourhood'
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    ticks:{ autoSkip:false}
                }]
            }
        }
    });
}

function getAvailability(){
    document.getElementById('map-container').style.display = 'none';
    document.getElementById('myChart1').style.display = 'none';
    document.getElementById('myChart2').style.display = 'block';
    var ctx = document.getElementById('myChart2').getContext('2d');
    var chart = new Chart(ctx);
    console.log(available);
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: Array.from(available.keys()),
            datasets: [{
                label: "Avalability by Day",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: Array.from(available.values())
            }]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: 'Availability by Date'
            },
            legend: {
                display: false
            }
        }
    });
}

///////////////////////////////////////Maps////////////////////////////////////////
mapboxgl.accessToken = 'pk.eyJ1IjoicmFzaGlkbGFza2VyIiwiYSI6ImNqOXh1b2xodjgwdmQycXBhNmpxN21na2cifQ.b7-TzrKTZ3Y_epVuBVynxA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 11,
    center: [-122.447303, 37.753574]
});
var sw = new mapboxgl.LngLat(-122.7, 37.6);
var ne = new mapboxgl.LngLat(-122.2, 37.9);
var llb = new mapboxgl.LngLatBounds(sw, ne);
console.log(map.getMaxBounds());
map.setMaxBounds(llb);
console.log(map.getMaxBounds());
map.addControl(new mapboxgl.NavigationControl());
map.setMinZoom(11);
map.setMaxZoom(16);
map.on('load', function () {

    map.addLayer({
        'id': 'population',
        'type': 'circle',
        'source': {
            type: 'vector',
            url: 'mapbox://rashidlasker.8mjls88g'
        },
        'source-layer': 'listings-pruned-8cm409',
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                property: 'number_of_reviews',
                stops: [
                    [0, 0],
                    [20, 1],
                    [40, 2],
                    [60, 3],
                    [80, 4],
                    [100, 5],
                    [150, 6],
                    [200, 7],
                    [300, 8]],
            },
            // color circles by ethnicity, using data-driven styles
            'circle-color': {
                property: 'review_scores_rating',
                stops: [
                    [0, '#F79E01'],
                    [40, '#EDA30A'],
                    [60, '#E4A913'],
                    [80, '#D3B323'],
                    [90, '#CAB82B'],
                    [95, '#A4CE50'],
                    [98, '#8BDD68'],
                    [100, '#65F38B']],
            }
        }
    });
});

///////////////////////////////////////Optimizations////////////////////////////////////////

function getEstimate(){
    document.getElementById("lat-error").innerHTML = "";
    document.getElementById("long-error").innerHTML = "";
    document.getElementById("message").innerHTML = "";
    if(document.getElementById("lat").value > 37.9 || document.getElementById("lat").value < 37.6){
        document.getElementById("lat-error").innerHTML = "Error: Latitude out of range";
    }
    if(document.getElementById("long").value < -122.6 || document.getElementById("long").value > -122.3 ){
        document.getElementById("long-error").innerHTML = "Error: Longitude out of range";
    }
    if(document.getElementById("lat").value == ""){
        document.getElementById("lat-error").innerHTML = "Error: No latitude given.";
        
    }
    if(document.getElementById("long").value == ""){
        document.getElementById("long-error").innerHTML = "Error: No longitude given.";
    }
    if(document.getElementById("lat-error").innerHTML == "" && document.getElementById("long-error").innerHTML == ""){
        var nearby =  listings.filter(function(d) { return Math.abs(d.longitude - document.getElementById("long").value) < 0.001; }).filter(function(d) { return Math.abs(d.latitude - document.getElementById("lat").value) < 0.001; });
        var l = nearby.length;
        var sum = 0
        for (var i = 0; i < l; i++) { // loop through l items
            sum += nearby[i].weekly_price;
        }
        var avg = sum/l;
        avg = avg.toFixed(2);
        if(avg !== avg){
            document.getElementById("message").innerHTML = "There's no one close enough to compare."; 
        } else{
            document.getElementById("message").innerHTML = "Your weekly income estimate is $" + avg + ".";
        }
    }
}

function getRevenue(){
    document.getElementById("lat-error").innerHTML = "";
    document.getElementById("long-error").innerHTML = "";
    document.getElementById("message").innerHTML = "";
    if(document.getElementById("lat").value > 37.9 || document.getElementById("lat").value < 37.6){
        document.getElementById("lat-error").innerHTML = "Error: Latitude out of range";
    }
    if(document.getElementById("long").value < -122.6 || document.getElementById("long").value > -122.3 ){
        document.getElementById("long-error").innerHTML = "Error: Longitude out of range";
    }
    if(document.getElementById("lat").value == ""){
        document.getElementById("lat-error").innerHTML = "Error: No latitude given.";
        
    }
    if(document.getElementById("long").value == ""){
        document.getElementById("long-error").innerHTML = "Error: No longitude given.";
    }
    if(document.getElementById("lat-error").innerHTML == "" && document.getElementById("long-error").innerHTML == ""){
        var nearby =  listings.filter(function(d) { return Math.abs(d.longitude - document.getElementById("long").value) < 0.005; }).filter(function(d) { return Math.abs(d.latitude - document.getElementById("lat").value) < 0.005; });
        var l = nearby.length;
        var sum = 0;
        var sumReviews = 0;
        for (var i = 0; i < l; i++) { // loop through l items
            sum += nearby[i].price * nearby[i].reviews_per_month;
            sumReviews += nearby[i].reviews_per_month;
        }
        var avg = sum/l;
        var avgR = sumReviews/l;
        avg = avg/avgR;
        avg = avg.toFixed(2);
        if(avg !== avg){
            document.getElementById("message").innerHTML = "There's no one close enough to compare."; 
        } else{
            document.getElementById("message").innerHTML = "Your optimized nightly rate is $" + avg + ".";
        }
    }
}

///////////////////////////////////////Utility////////////////////////////////////////
truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

function buildMap(obj) {
    let map = new Map();
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });
    return map;
}
