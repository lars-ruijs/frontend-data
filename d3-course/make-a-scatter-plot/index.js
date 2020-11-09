// Code adapted from D3 course by Curran Kelleher.
// VIDEO: 'Making a Scatter Plot with D3.js'
// View live on Vizhub: https://vizhub.com/lars-ruijs/6dea8c20d3264ce6bb8dc0347e997457

console.log("Hello");

// Import modules from d3
import { select, csv, scaleLinear, extent, axisLeft, axisBottom, format } from 'd3';

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
    // The domain starts at the minimum value and ends at the maximum value (using d3 extent())
    // The range starts at 0 and ends at the innerWidth of the svg element (divides the available pixel space)
    // .nice() creates a last tick to include a overlapping end point
    const xScale = scaleLinear()
        .domain(extent(data, d => d.horsepower))
        .range([0, innerWidth])
        .nice();

    // The Y-Scale for the scatter plot uses scaleLinear(). Set the domain and range. 
    // The domain starts at the minimum value and ends at the maximum value (using d3 extent())
    // The range starts at 0 and ends at the innerWidth of the svg element (divides the available pixel space)
    // .nice() creates a last tick to include a overlapping end point
    const yScale = scaleLinear()
        .domain(extent(data, d => d.weight))
        .range([0, innerHeight])
        .nice();
    
    // Add a new <g>-element inside the <svg>, set the x/y location.
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // Create a new bottom axis using axisBottom(), take xScale as the scale for the axis.
    // Set the tickSize (length of the ticks) to the negative heigt of the graph and set the padding of the ticks to 20. 
    const xAxis = axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(20);
    
    // Add new <g>-element inside parent <g> and set the Y scale. 
    // Set the tickSize (length of the ticks) to the negative width of the graph and set the padding of the ticks to 10. 
	const yAxisG = g.append('g').call(axisLeft(yScale)
    .tickSize(-innerWidth)
  	.tickPadding(10));

    // Remove the lines around the graph
    yAxisG.selectAll('.domain').remove();
    
    // Add new <g>-element inside parent <g> and set the X scale. Translate the x axis to the bottom of the graph
    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    
    // Remove the lines around the graph
    xAxisG.select('.domain').remove();
  
    // Add the text 'Horsepower' to the x axis
    xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', 60)
    .attr('x', innerWidth/2)
    .attr('fill', 'black')
    .text('Horsepower');
    
    // Add the text 'Weight' to the y axis. Center the text with 'text-anchor: middle'. Rotate the text 90deg.
    yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', -70)
    .attr('x', -innerHeight/2)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .text('Weight')
    .attr('transform', `rotate(-90)`);

    // Create the circles that make the scatter plot. 
    // Set attributes that control the positions and height of the circles. Set the radius of the circles to 15.
    g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cy', d => yScale(d.weight))
        .attr('cx', d => xScale(d.horsepower))
        .attr('r', 10);

    // Add a title to the top of the graph
    g.append('text')
    .attr('y', -20)
    .text('Horsepower vs. weight');
  
};

// Get the data from a online file. Convert the strings to numbers.
csv('https://vizhub.com/curran/datasets/auto-mpg.csv').then(data => {
	data.forEach(d => {
    d.mpg = +d.mpg;
    d.cylinders = +d.cylinders;
    d.displacement = +d.displacement;
    d.horsepower = +d.horsepower;
    d.weight = +d.weight;
    d.accelleration = +d.acceleration;
    d.year = +d.year;
  });
  render(data);
});