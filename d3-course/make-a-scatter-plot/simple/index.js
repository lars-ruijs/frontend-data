// Code adapted from D3 course by Curran Kelleher.
// VIDEO: 'Making a Scatter Plot with D3'
// View live on Vizhub: https://vizhub.com/lars-ruijs/846c33f62efb4ffa80e6cf98b1eab27b

console.log("Hello");

// Import modules from d3
import { select, csv, scaleLinear, max, scalePoint, axisLeft, axisBottom, format } from 'd3';

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
  
    // The X-Scale for the scatter plot uses scaleLinear(). Set the domain and range. 
    // The domain starts at 0 and ends at the maximum value of the data (using d3 max())
    // The range starts at 0 and ends at the innerWidth of the svg element (divides the available pixel space)
    // .nice() creates a last tick to include a overlapping end point
    const xScale = scaleLinear()
        .domain([0, max(data, d => d.population)])
        .range([0, innerWidth])
        .nice();
  
    // The Y-Scale for the scatter plot uses scalePoint(). This creates a point in the center of a value.
    // Set the domain, range and padding. 
    // The domain contains the country names
    // The range starts at 0 and ends at the innerHeight of the svg element (divides the available pixel space)
    // Add padding between the country names
    const yScale = scalePoint()
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
    
    // Add new <g>-element inside parent <g> and set the Y scale. Set the length of tick lines to the innerWidth 
    g.append('g')
    .call(axisLeft(yScale).tickSize(-innerWidth))
  	.selectAll('.domain')
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
  
    // Create the circles that make the scatter plot. 
    // Set attributes that control the positions and height of the circles. Set the radius of the circles to 15.
    g.selectAll('circle').data(data)
      .enter().append('circle')
    	.attr('cy', d => yScale(d.country))
        .attr('cx', d => xScale(d.population))
    	.attr('r', 15);

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