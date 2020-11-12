// Endpoint with P+R Locations
const PenREndpoint = "https://opendata.rdw.nl/resource/6wzd-evwu.json";

// Endpoint with Parking Specifications
const specsEndpoint = "https://opendata.rdw.nl/resource/b3us-f26s.json?$limit=1600";

// Settings for the SVG data visualizations
const margin = {top: 10, right: 30, bottom: 170, left: 80};
const width = 900;
const height = 420;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Adding the (empty) Pie Chart svg to the body
const pieChart = d3.select(".charts")
  .append("svg")
		.attr('class', 'pie')
    .attr("width", width/2)
    .attr("height", height - 40)
	.append("g")
		.attr("transform", `translate(${width/2/2}, ${height/2})`);

// Used for storing the combined specification data (about capacity)
let combinedData = "";

makeViz();

async function makeViz() {
  // Get all the P+R data and Parking Specification data from the RDW
	const prData = await getData(PenREndpoint);
  const specData = await getData(specsEndpoint);
  
  // Make an array with areaIDs of P+R facilities (used for filtering specData) 
  const prAreas = prData.map(a => a.areaid);
  // Filter the parking specification data to only include objects with a P+R areaID
  const prSpecData = specData.filter(id => prAreas.includes(id.areaid));
  
  // Combine the P+R data with the P+R parking specification data. Store in 'dataCap'
  combinedData = combineData(prData, prSpecData);

  // Get all the P+R city names in an array
  const cities = combinedData.map(a => a.city);
  
  // Data for bar chart. Array of unique city names with the total number of P+R facilities
  const cityData = await getCityData(cities);
  
  //Make a bar chart for cities with more than 2 P+R locations and less than 15.
  makeBarChart(cityData.filter(d => d.prLocations > 2 && d.prLocations < 15));
}


//////////////////
/// BAR CHART ///
/////////////////

// Function used to make the bar chart
function makeBarChart(cityData) {
  
  // Sort data from highest to lowest. So city with the most P+R locations comes first. 
  cityData.sort((b, a) => a.prLocations - b.prLocations);

  // Append the svg object to the body of the page
  const svg = d3.select(".charts")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // X-axis with scaleBand() used for catigorical elements (here: city names)
  const x = d3.scaleBand()
    .domain(cityData.map(d =>  d.city))
    .range([0, innerWidth])
    .padding(0.2);

  // Add label to X-axis 'City's with P+R'
  svg.append("g")
    	.call(d3.axisBottom(x))
    	.attr("transform", `translate(0, ${innerHeight})`)
    .append('text')
    	.attr('class', 'axis-label')
    	.attr('y', 100)
    	.attr('x', innerWidth/2)
    	.text('Steden met P+R');

  // Rotate the city names (tick text)
  svg.selectAll(".tick text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
  
  // Y-axis with scaleLinear(). 
  // Domain starts at 0 and ends at the maximum data value of P+R locations. 
  const y = d3.scaleLinear()
    .domain([0, d3.max(cityData, d => d.prLocations)])
    .range([innerHeight, 0]);

  // Add label to Y-axis with the text "Number of P+R locations"
  svg.append("g")
    	.call(d3.axisLeft(y))
    .append('text')
    	.attr('class', 'axis-label')
    	.attr('y', -40)
    	.attr('x', -innerHeight/2+15)
    	.attr("transform", `rotate(-90)`)
    	.text('Aantal P+R locaties >');

  // Create the bars based on the cityData
  // Give it a class with the name of the city (used for generating pie chart later)
  // Add onclick to invoke the updatePie function to generate or update the pie chart
  svg.selectAll("rect")
    .data(cityData)
    .enter()
    .append("rect")
      .attr("x", d => x(d.city))
      .attr("y", d => y(d.prLocations))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight - y(d.prLocations))
      .attr("fill", "#1873cc")
      .attr("class", d => d.city)
  		.on("mouseover", function(d) {d3.select(this).style("cursor", "pointer");})
      .on("click", updatePie);
}


//////////////////
/// PIE CHART ///
/////////////////

// This function gives the clicked city name to the drawPie() function
// First: get the name of the city from the targets' className
// Then: filter the combined parking specification data to get an array with only selected city data.
function updatePie(val){
  const cityName = val.target.className.baseVal;
  const citySpecs = combinedData.filter(a => a.city == cityName);
  drawPie(citySpecs);
}

// Function to make the pie chart
function drawPie(data) {

  // Set the inner and outer radius and make a pie circle using d3.arc()
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(150);

  // Data inside pie chart must be generated based on the parking capacity
  const pie = d3.pie()
    .value(d => d.capacity);

  // Select all path elements inside the main pieChart svg element. Bind the data to it.
  const paths = pieChart.selectAll("path")
    .data(pie(data));
  
  // Update existing path data (d attribute). 
  // Use d3.interpolateRainbow to generate a fill color.
  paths
  	.attr('d', arc)
  	.attr("fill", (data, i)=>{ 
            return d3.interpolateRainbow(i/10); 
          });
  
  // Add new path elements using enter() and append() if more are needed.
  paths
    .enter()
    .append('path')
      .attr('d', arc)
      .attr("fill", (data, i)=>{ 
              return d3.interpolateRainbow(i/10); 
            })
      .attr("stroke", "white")
      .style("stroke-width", "2px");
  
  // Remove the path elements that are not needed annymore. 
  paths
  	.exit()
    .remove();

  // Select all text elements inside the main pieChart svg element. Bind the data to it.
  const texts = pieChart.selectAll("text")
      .data(pie(data));

  // Update existing text labels with new data. Set text to the current capacity value. 
  texts
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .text(d => d.value);
  
  // Add new text elements using enter() and append() if more are needed.
  texts
    .enter()
    .append('text')
      .attr('class', 'pieText')
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .text(d => d.value)
      .style("text-anchor", "middle");
  
	// Remove text elements that are not needed annymore.
   texts
     .exit()
     .remove();
}


//////////////////////
/// DATA CLEANING ///
////////////////////


// Count city names, remove duplicates and use 'getCoordinates' to get the lat and lng
// Code adapted from: https://stackoverflow.com/questions/49676897/javascript-es6-count-duplicates-to-an-array-of-objects
function getCityData(cities) {
  
  // Acc is the accumulator. The value that gets returned.
  // City is the name of a city (the current value)
  // First: set a city name to contain an array with the city name and 0
  // Then: add 1 to the number (second place in array)
  // Object.values returns an array with the values of an object (so here: an array with arrays)
  // Map loops over the arrays and returns an array with objects.
  const result = Object.values(cities.reduce((acc, city) => {
    acc[city] = acc[city] || [city, 0];
    acc[city][1]++;
    return acc;
	},{})).map(async object=> {
    //const coor = await getCoordinates(object[0]);
    return {
    city: object[0], 
    prLocations: object[1],
    //...coor
    };
  });
  
// Use Promise.all when using await inside map()
// Code adapted from: https://zellwk.com/blog/async-await-in-loops/
return Promise.all(result);
}

// Use HERE Maps API Geocoding to get latitude and longitude coordinates for a city name
async function getCoordinates(cityName) {
	const geo = await getData(`https://geocode.search.hereapi.com/v1/geocode?apiKey=B1CkIQ-gETJxbw3X00kk3YE0S2gkkODYpcBk_Nl2Bf4&q=${cityName},%20NL`);
	return geo.items[0] ? geo.items[0].position : {lat: null, lng: null};
}

// Combine the P+R Data with the Parking Specification data
function combineData(prData, specData) {
  
  // First: make an array with the areaIDs of the Specification data
  const specAreaIds = specData.map(a => a.areaid);
  
  // Create an empty array to store the combined data in
  const combinedData = [];

  // For every item of the P+R Data array, create an object with the combined data
  for (const object in prData) {
    
    // Get the index-number of a Parking Specification object belonging to the current P+R areaID.  
    const index = specAreaIds.indexOf(prData[object].areaid);
    
  	// If necessary: check if the object key exists and has a value, if not set value as null.
    // Facilities with no information about capacity are set to 1, because this is needed for the pie chart.
    // Thanks to Laurens' lecture about checking if data is valid
    const newObject = {
        areaId: prData[object].areaid, 
        name: prData[object].areadesc ? prData[object].areadesc : null,
        lat: prData[object].location ? +prData[object].location.latitude : null,
        lng: prData[object].location ? +prData[object].location.longitude : null,
      	city: prData[object].areadesc ? getCityName(prData[object].areadesc) : null,
      	openingYear: prData[object].startdataarea ? getYear(prData[object].startdataarea) : null, 
        capacity: specData[index] ? +specData[index].capacity : 1
    };  
    
    // Push the objects to the array 
    combinedData.push(newObject);
  }
  return combinedData;
}

// Extract the years from a string that is formated as YYYYMMDD
// Used substring() documentation from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
function getYear(yyyymmdd) {
	return +yyyymmdd.substring(0, 4);
}

// Extract the cityname from the parentheses
// RegEx code adapted from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
function getCityName(parkingName) {
	return /\(([^)]+)\)/.exec(parkingName)[1];
}


///////////////////
/// FETCH DATA ///
/////////////////

// Fetch data from given url and convert the body of the response to JSON using d3.json
// Thanks to Laurens' lecture about fetching data and using async functions
async function getData(url) {
  const data = await d3.json(url);
  return data;
}

//PR DATA OBJECT
  //areadesc: "P+R Hemriksein (Leeuwarden)"
  //areaid: "80_PRHEM"
  //areamanagerid: "80"
  //enddataarea: "29991231"
  //location: {latitude: "53.165117644", longitude: "5.829843478", human_address: "{"address": "", "city": "", "state": "", "zip": ""}"}
  //startdataarea: "20150728"
  //usageid: "PARKRIDE"

//SPECS DATA OBJECT
  //areaid: "599_KRZM"
  //areamanagerid: "599"
  //capacity: "1700"
  //chargingpointcapacity: "4"
  //disabledaccess: "0"
  //enddatespecifications: "20991231235959"
  //maximumvehicleheight: "0"
  //startdatespecifications: "20141101000000"