const dataStad = [{city: "'s-Hertogenbosch", prLocations: 5}, {city: "Purmerend", prLocations: 3}, {city: "Amsterdam", prLocations: 10}];


// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60};
const width = 460;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

 dataStad.sort((b, a) => a.prLocations - b.prLocations);

// append the svg object to the body of the page
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

svg.append("g")
  .call(d3.axisBottom(x))
  .attr("transform", `translate(0, ${innerHeight})`);

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, d3.max(dataStad, d => d.prLocations)])
  .range([innerHeight, 0]);

svg.append("g")
  .call(d3.axisLeft(y));

// Bars
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
  
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(100);

  // Data inside pie chart must be generated based on the capacity
  const pie = d3.pie()
    .sort(null)
    .value(d => d.capacity);

  // Select all group elements inside the main pieChart svg element
  const pieGroups = pieChart.selectAll("path")
    .data(pie(data));
  
  pieGroups
  .attr('d', arc)
    .attr("fill", (data, i)=>{ 
            return d3.schemeTableau10[i]; 
          });
  
  pieGroups
  .enter()
  .append('path')
    .attr('d', arc)
    .attr("fill", (data, i)=>{ 
            return d3.schemeTableau10[i]; 
          });
  pieGroups.exit().remove();

  const textGroups = pieChart.selectAll("text")
      .data(pie(data));

  textGroups
  .attr('class', 'pieText')
  .attr("transform", d => `translate(${arc.centroid(d)})`)
  .text(d => d.value)
  .style("text-anchor", "middle");
  
  textGroups
  .enter()
  .append('text')
  .attr('class', 'pieText')
  .attr("transform", d => `translate(${arc.centroid(d)})`)
  .text(d => d.value)
  .style("text-anchor", "middle");
  
 textGroups.exit().remove();


  // Group for every single 'slice'
  // Merge() with allGroups to draw a complete circle
  // const sliceGroup = pieGroups
  //   .enter()
  //   .append('g')
  // 	.attr('class', 'pieGroup')
  //   .merge(pieGroups);
  
  // const currentPieElements = pieChart.selectAll("path")
  // 	.attr('d', arc)
  //   .attr("fill", (data, i)=>{ 
  //           return d3.schemeTableau10[i]; 
  //         });
  
  //d3.selectAll('.pieSlice').remove();
  //d3.selectAll('.pieText').remove();

  // Add path to a 'slice' group element
//   sliceGroup
//     .append('path')
//     .attr('class', 'pieSlice')
//     .attr('d', arc)
//     .attr("fill", (data, i)=>{ 
//             return d3.schemeTableau10[i]; 
//           });

//   // Add text to a 'slice' group element
//   sliceGroup
//     .append('text')
//   	.attr('class', 'pieText')
//     .attr("transform", d => `translate(${arc.centroid(d)})`)
//     .text(d => d.value)
//     .style("text-anchor", "middle");

  // Remove all unnecessary group elements
 // pieGroups.exit().remove();
  

							
					
  
// // Select all group elements inside the main pieChart svg element
// const allGroups = pieChart.selectAll("g")
// 	.data(pie(data));

// // Group for every single 'slice'
// const sliceGroup = allGroups
// 	.enter()
//   .append('g')
// 	.merge(allGroups)

// const arc = d3.arc()
// 	.innerRadius(0)
// 	.outerRadius(100)

// // Add path to a 'slice' group element
// sliceGroup
//   .append('path')
//   .attr('d', arc)
//   .attr("fill", (data, i)=>{ 
//           return d3.schemeTableau10[i]; 
//         })
  
// // Add text to a 'slice' group element
// sliceGroup
// 	.append('text')
// 	.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
// 	.text(function(d){ 
// 		return d.value;  
// 	})
// 	.style("text-anchor", "middle")

// // Remove all unnecessary group elements
// allGroups.exit().remove()

    
//  // shape helper to build arcs:
// var arcGenerator = d3.arc()
//   .innerRadius(0)
//   .outerRadius(radius)

// // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
// svg
//   .selectAll('mySlices')
//   .data(data_ready)
//   .enter()
//   .append('path')
//     .attr('d', arcGenerator)
//     .attr('fill', function(d){ return(color(d.data.key)) })
//     .attr("stroke", "black")
//     .style("stroke-width", "2px")
//     .style("opacity", 0.7)

// // Now add the annotation. Use the centroid method to get the best coordinates
// svg
//   .selectAll('mySlices')
//   .data(data_ready)
//   .enter()
//   .append('text')
//   .text(function(d){ return "grp " + d.data.key})
//   .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
//   .style("text-anchor", "middle")
//   .style("font-size", 17) 

// const arc = d3.arc() 
//   .innerRadius(0) 
//   .outerRadius(100); 
  
// // Grouping different arcs 
// const arcs = pieChart.selectAll("arc") 
//   .data(pie(data)) 
//   .enter() 
//   .append("g")
  
// // Appending path  
// arcs.append("path") 
//   .attr("fill", (data, i)=>{ 
//           let value=data.data; 
//           return d3.schemeTableau10[i]; 
//         }) 
//   .attr("d", arc)
//   .merge(arcs)
//   .exit()
// 	.remove(); 

// Adding data to each arc 
// u.append("text") 
// 	.attr("transform",(d)=>{  
//         	return "translate("+  
//           u.centroid(d) + ")";  
//         }) 
//   .text(function(d){ 
//           return d.value;  
//         }); 

}