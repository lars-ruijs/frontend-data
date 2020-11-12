//////////////////
/// BAR CHART ///
/////////////////

// Dummy data (based on my cleaned data from RDW), this is a smaller sample
const dataStad = [{city: "'s-Hertogenbosch", prLocations: 5}, {city: "Purmerend", prLocations: 3}, {city: "Amsterdam", prLocations: 10}];

// set the dimensions and margins of the graph
const margin = {top: 20, right: 30, bottom: 80, left: 80};
const width = 460;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

dataStad.sort((b, a) => a.prLocations - b.prLocations);

// Append the svg object to the body of the page
const svg = d3.select(".charts")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// X axis
const x = d3.scaleBand()
  .domain(dataStad.map(d =>  d.city))
	.range([0, innerWidth])
  .padding(0.2);

// Add text to X axis
svg.append("g")
  .call(d3.axisBottom(x))
  .attr("transform", `translate(0, ${innerHeight})`)
	.append('text')
  .attr('class', 'axis-label')
  .attr('y', 50)
  .attr('x', innerWidth/2)
  .text('Steden met P+R');

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, d3.max(dataStad, d => d.prLocations)])
  .range([innerHeight, 0]);

// Add text to Y axis
svg.append("g")
  .call(d3.axisLeft(y))
	.append('text')
  .attr('class', 'axis-label')
  .attr('y', -40)
  .attr('x', -innerHeight/2+5)
  .attr("transform", `rotate(-90)`)
  .text('Aantal P+R locaties >');

// Create the bars
svg.selectAll("rect")
  .data(dataStad)
  .enter()
  .append("rect")
    .attr("x", d => x(d.city))
    .attr("y", d => y(d.prLocations))
    .attr("width", x.bandwidth())
    .attr("height", d => innerHeight - y(d.prLocations))
    .attr("fill", "dodgerblue")
		.attr("class", d => d.city)
		.on("click", updatePie);


//////////////////
/// PIE CHART ///
/////////////////

// Dummy data (based on my cleaned data from RDW), this is a smaller sample
const dataCap = [{city: "'s-Hertogenbosch", capacity: 10}, {city: "'s-Hertogenbosch", capacity: 3}, {city: "'s-Hertogenbosch", capacity: 20}, {city: "Purmerend", capacity: 6}, {city: "Amsterdam", capacity: 20}];

// Function that gets activated when a bar is pressed
function updatePie(val){
  const cityName = val.target.className.baseVal;
  const citySpecs = dataCap.filter(a => a.city == cityName);
  drawPie(citySpecs);
}

// Selecting SVG using d3.select() 
const pieChart = d3.select(".charts")
  .append("svg")
		.attr('class', 'pie')
    .attr("width", width/2)
    .attr("height", height)
	.append("g")
		.attr("transform", `translate(${width/2/2}, ${height/2})`);

// Function for making the Pie chart
function drawPie(data) {

  // Data inside pie chart must be generated based on the capacity
  const pie = d3.pie()
    .sort(null)
    .value(d => d.capacity);

  // Select all group elements inside the main pieChart svg element
  const allGroups = pieChart.selectAll("g")
    .data(pie(data));

  // Group for every single 'slice'
  // Merge() with allGroups to draw a complete circle
  const sliceGroup = allGroups
    .enter()
    .append('g')
    .merge(allGroups);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(100);

  // Add path to a 'slice' group element
  sliceGroup
    .append('path')
    .attr('d', arc)
    .attr("fill", (data, i)=>{ 
            return d3.schemeTableau10[i]; 
          });

  // Add text to a 'slice' group element
  sliceGroup
    .append('text')
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .text(d => d.value)
    .style("text-anchor", "middle");

  // Remove all unnecessary group elements
  allGroups.exit().remove();
  
}