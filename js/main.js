//Data Initialization
var listings;
var neighbourhoods;
var calendar;

d3.csv("../data/listings-pruned.csv", function(data) {
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
    });
    
    //return
    listings = data;
    document.getElementById("loading").innerHTML += "loaded listings!";
});

d3.csv("../data/neighbourhoods.csv", function(data) {
    neighbourhoods = [];
    var l = data.length;
    for (var i = 0; i < l; i++) { // loop through l items
        neighbourhoods.push(data[i].neighbourhood);
    }
    document.getElementById("loading").innerHTML += "loaded neighborhoods!";
    console.log(neighbourhoods[0]);
});

d3.csv("../data/calendar_available_only.csv", function(data) {
    //preprocess array
    //return
    calendar = data;
    document.getElementById("loading").innerHTML += "loaded calendar!";
});

//Graphs
function doSomething(){
    document.getElementById("ret").innerHTML = listings[0].neighbourhood_cleansed;
}