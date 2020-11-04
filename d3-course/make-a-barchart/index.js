// Code adapted from D3 course by Curran Kelleher.
// VIDEO: 'Making a Bar chart!'
// View live on Vizhub: https://vizhub.com/lars-ruijs/599b0ebde4fa41779cba75522c920494 

// Import modules from d3
import { select, csv, scaleLinear, max, scaleBand, axisLeft, axisBottom } from 'd3';

// Select the svg element from the html
const svg = select('svg');

// Get the height and with attribute values from the svg-element 
const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    // Set defaults for margin and innerWidth/height
    const margin = { top: 20, right: 40, bottom: 20, left: 100 };
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
    
    // Add new <g>-element inside parent <g> and set the X and Y scales.
    g.append('g').call(axisLeft(yScale));
    g.append('g').call(axisBottom(xScale))
  	    .attr('transform', `translate(0, ${innerHeight})`);

    // Create the rectangles that make the bars of the barchart. 
    // Set attributes that control the positions and height of the bars. 
    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('y', d => yScale(d.country))
        .attr('width', d => xScale(d.population))
            .attr('height', yScale.bandwidth());
};

// Get the data from the csv file.
csv('data.csv').then(data => {
	data.forEach(d => {
    d.population = +d.population * 1000;
  });
  render(data);
});