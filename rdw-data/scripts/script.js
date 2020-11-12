// Endpoint with P+R Locations
const PenREndpoint = "https://opendata.rdw.nl/resource/6wzd-evwu.json";

// Endpoint with Parking Specifications
const specsEndpoint = "https://opendata.rdw.nl/resource/b3us-f26s.json?$limit=1600";

makeViz();

async function makeViz() {
  // Get all the P+R data and Parking Specification data from the RDW
	const prData = await getData(PenREndpoint);
  const specData = await getData(specsEndpoint);
  
  // Make an array with areaIDs of P+R facilities (used for filtering specData) 
  const prAreas = prData.map(a => a.areaid);
  // Filter the parking specification data to only include objects with a P+R areaID
  const prSpecData = specData.filter(id => prAreas.includes(id.areaid));
  
  // Combine the P+R data with the P+R parking specification data. Store in 'combinedData'
  const combinedData = combineData(prData, prSpecData);
    
  // Get all the P+R city names in an array
  const cities = combinedData.map(a => a.city);
  
  const cityData = await getCityData(cities);
  console.log(cityData);
}

function getCityData(cities) {
	// Count city names, remove duplicates and use 'getCoordinates' to get the lat and lng
  // Code adapted from: https://stackoverflow.com/questions/49676897/javascript-es6-count-duplicates-to-an-array-of-objects
  
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
    // Thanks to Laurens' lecture about checking if data is valid
    const newObject = {
        areaId: prData[object].areaid, 
        name: prData[object].areadesc ? prData[object].areadesc : null,
        lat: prData[object].location ? +prData[object].location.latitude : null,
        lng: prData[object].location ? +prData[object].location.longitude : null,
      	city: prData[object].areadesc ? getCityName(prData[object].areadesc) : null,
      	openingYear: prData[object].startdataarea ? getYear(prData[object].startdataarea) : null, 
        capacity: specData[index] ? +specData[index].capacity : null
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