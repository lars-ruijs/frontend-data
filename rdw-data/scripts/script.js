// Endpoint with P+R Locations
const PenREndpoint = "https://opendata.rdw.nl/resource/6wzd-evwu.json";

// Endpoint with Parking Specifications
const specsEndpoint = "https://opendata.rdw.nl/resource/b3us-f26s.json?$limit=1600";

async function makeViz() {
	// Get all the P+R Data from the RDW and store it in 'prData'
	const prData = await getData(PenREndpoint);
	console.log(prData);
	
	// Get all the Parking Specification data from the RDW and store it in 'specData'
	const specData = await getData(specsEndpoint);
	console.log(specData);

}
// Fetch data from given url and convert the body of the response to JSON using d3.json
// Thanks to Laurens' lecture about fetching data and using async functions
async function getData(url) {
	const data = await d3.json(url);
	return data;
  }

///////////////
// OLD CODE //
///////////////

// // Fetch-code based on a lecture by Laurens 
// // Endpoint of Park and Ride locations in the Netherlands
// const PenR = "https://opendata.rdw.nl/resource/6wzd-evwu.json";

// // API Key for HERE geocoding serivces. Stored in a separate file to prevent abuse via GitHub. 
// // HERE API: https://developer.here.com/
// const apiHereKey = api;

// // HERE API to find the coordinates of a city
// function getLoc(cityName) {
// 	let positie = "";
// 	getData(`https://geocode.search.hereapi.com/v1/geocode?apiKey=${apiHereKey}&q=${cityName},%20NL`)
// 	.then(result => {
// 		return result.json();
// 	})

// 	.then(coorData => {
// 		positie = coorData.items[0].position;
// 	});
// 	return positie;
// }
	
// getData(PenR)
// 	.then(result => {
// 	return result.json();
// })
// .then(RDWData => {
// 	// All RDW Data from the P+R Dataset
// 	console.log(RDWData);

// 	// Get the areaDesc (name of parking facility) of the dataset
// 	const areaDesc = filterData(RDWData, "areadesc");
// 	console.log(areaDesc);

// 	// Get the parking locations city names
// 	const stadNaam = getCityName(areaDesc);

// 	// Remove duplicate city names with filter
// 	// Adapted code from: https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
// 	const enkelSteden= stadNaam.filter((item, index) => stadNaam.indexOf(item) === index);
// 	console.log(stadNaam);
// 	console.log(enkelSteden);

// 	getData(`https://geocode.search.hereapi.com/v1/geocode?apiKey=${apiHereKey}&q=${enkelSteden[0]},%20NL`)
// 	.then(result => {
// 		return result.json();
// 	})

// 	.then(coorData => {
// 		const position = coorData.items[0].position;
// 		console.log(position);
// 	});

// 	// Get the opening year of a parking facility
// 	const years = getYear(filterData(RDWData, "startdataarea"));
// 	console.log(years);

// 	// Create an empty array (used for storing objects later)
// 	const allRelevantData = [];

// 	// For/in loop that creates an object with the filtered data and pushes it in the 'allRelevantData' array.
// 	for (const item in areaDesc) {
// 		const object = {prName: areaDesc[item], cityName: stadNaam[item], openSince: years[item]};
// 		allRelevantData.push(object);
// 	}
// 	console.log(allRelevantData);
// });

// // Fetch the data from a given url (endpoint)
// function getData(url){
//   return  fetch(url);
// }

// // Returns all values for a certain key in an array of data
// function filterData(dataArray, key){
//   return dataArray.map(item => item[key]).filter(isEmpty);
// }

// // Remove empty values from the array
// function isEmpty(value) {
//     if (value) {
//         return true; // Return value if it's not empty
//     }
//     else {
//         return false; // Remove values that are empty 
//     }
// }

// // Extract the city names of P+R locations that are inside parenthesis and return those as a new array
// // RegEx code adapted from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
// function getCityName(dataItems) {
// 	return dataItems.map(item => /\(([^)]+)\)/.exec(item)[1]);
// }

// // Get the opening year of a P+R facility
// // Used substring() documentation from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
// function getYear(dataItems) {
// 	return dataItems.map(item => +item.substring(0, 4));
// }