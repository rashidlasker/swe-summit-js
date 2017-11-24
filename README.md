# Capital One Software Engineering Summit Challenge

For this task, I used a variety of JS libraries to bring the given data to life. For one, I used MapBox and d3 to parse through a pruned version of the listings.csv file to create a map that shows reviews in terms of positivity (color) and number of reviews (size). Then, I used Chart.js to graph the standard deviation of price per neighborhood, showing which neighborhoods are more stratified. Lastly, I charted the number of available listings per day to show which days tend to get a lot of business and which days do not.

For the second and third problems, I filtered out data that wasn't relevant to the given latitude and longitude to optimize performance. To find the potential weekly income, I averaged the weekly rates of nearby listings. To find the optimized booking price, I averaged the nightly rates with a weight depending on the number of reviews per month. 
