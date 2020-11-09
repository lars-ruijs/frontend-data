// Code adapted from D3 course by Curran Kelleher.
// VIDEO: 'Customizing Axes of a Bar Chart with D3.js!'
// View live on Vizhub: https://vizhub.com/lars-ruijs/7786fab2df9341eb8ed1661e2d8ed2d2 

console.log("Hello");

// Import modules from d3
import { select, csv, scaleLinear, max, scaleBand, axisLeft, axisBottom, format } from 'd3';

// Select the svg element from the html
const svg = select('svg');

// Get the height and with attribute values from the svg-element 
const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    
    // Set defaults for margin and innerWidth/height
    const margin = { top: 50, right: 40, bottom: 80, left: 100 };
    const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
  
    // The X-Scale for the bar chart uses scaleLinear(). Set the domain and range. 
    // The domain starts at 0 and ends at the maximum value of the data (using d3 max())
    // The range starts at 0 and ends at the innerWidth of the svg element (divides the available pixel space)
    const xScale = scaleLinear()
        .domain([0, max(data, d => d.population)])
        .range([0, innerWidth]);
  
    // The Y-Scale for the bar chart uses scaleBand(). Set the domain, range and padding. 
    // The domain contains the country names
    // The range starts at 0 and ends at the innerHeight of the svg element (divides the available pixel space)
    // Add padding between the country names
    const yScale = scaleBand()
        .domain(data.map(d => d.country))
        .range([0, innerHeight])
        .padding(0.2);

    // Add a new <g>-element inside the <svg>, set the x/y location.
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // Formatting the population numbers of the x axis to 3 numbers and a letter (eg. 200M) using format(). 
    // Replace 1.00G to 1.00B using .replace().
    const xAxisTickFormat = number => 
    format('.3s')(number)
        .replace('G', 'B');
  
    // Create a new bottom axis using axisBottom(), take xScale as the scale for the axis.
    // Set the tickFormat to xAxisTickFormat (defined above) and set the tickSize (length of the ticks) to the negative heigt of the graph. 
    const xAxis = axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight);
    
    // Add new <g>-element inside parent <g> and set the Y scale. Remove the tick lines. 
    g.append('g')
    .call(axisLeft(yScale))
  	.selectAll('.domain, .tick line')
          .remove();
      
    // Add new <g>-element inside parent <g> and set the X scale. Translate the x axis to the bottom of the graph
    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
  
    // Remove the lines around the graph
    xAxisG.select('.domain').remove();
  
    // Add the text 'Population' to the x axis
    xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', 60)
    .attr('x', innerWidth/2)
    .attr('fill', 'black')
    .text('Pupulation');
  
    // Create the rectangles that make the bars of the barchart. 
    // Set attributes that control the positions and height of the bars. 
    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('y', d => yScale(d.country))
        .attr('width', d => xScale(d.population))
            .attr('height', yScale.bandwidth());

    // Add a title to the top of the graph
	g.append('text')
        .attr('y', -10)
        .text('Top 10 Most Populous Countries');
};

// Get the data from the csv file. Multiply the population numbers by 1000.
csv('data.csv').then(data => {
	data.forEach(d => {
    d.population = +d.population * 1000;
  });
  render(data);
});