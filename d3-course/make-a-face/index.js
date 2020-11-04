// Code adapted from D3 course by Curran Kelleher.
// VIDEO: 'Let's make a Face!'
// View live on Vizhub: https://vizhub.com/lars-ruijs/0720b3db85b6492f85026f23ef702ba9 

// Import select and arc as a module from D3.js (so you can use select() in stead of d3.select())
import { select, arc } from 'd3';

// Select the svg-element that's in index.html
const svg = select('svg');

// Get the height and with attribute values from the svg-element 
const height = parseFloat(svg.attr('height'));
const width = parseFloat(svg.attr('width'));

// Add element <g> inside <svg>-element and set attribute transform to translate the x and y position
const g = svg.append('g')
	.attr('transform', `translate(${width / 2}, ${height / 2})`);

// Add a <circle> element inside the <g>-element and set a radius, fill and stroke
const circle = g.append('circle')
  .attr('r',  height/2)
  .attr('fill', 'yellow')
  .attr('stroke', 'black');

const eyeSpacing = 100;
const eyeYOffset = -70;
const eyeRadius = 30;
const eyebrowWidth = 80;
const eyebrowHeight = 20;

// Eyes group added in parent <g> element
const eyesG = g.append('g')
	.attr('transform', `translate(0, ${eyeYOffset})`);

// Eyebrows group added inside eyesgroup <g>-element
const eyeBrowsG = eyesG.append('g')
		.attr('transform', `translate(0, ${eyeYOffset})`);

// Add a transition that moves the eyebrows up and down
eyeBrowsG
	.transition().duration(2000)
		.attr('transform', `translate(0, ${eyeYOffset - 50})`)
	.transition().duration(2000)
		.attr('transform', `translate(0, ${eyeYOffset})`);

// Add <circle> inside main <svg>-element and set the radius, x and y position, and fill color
const leftEye = svg.append('circle')
  .attr('r',  eyeRadius)
  .attr('cx', width/2 - eyeSpacing)
  .attr('cy', height/2 + eyeYOffset)
  .attr('fill', 'black');

// Add <circle> inside main <svg>-element and set the radius, x and y position, and fill color
const rightEye = svg.append('circle')
  .attr('r',  eyeRadius)
  .attr('cx', width/2 + eyeSpacing)
  .attr('cy', height/2 + eyeYOffset)
  .attr('fill', 'black');

// Add <rect> (rectangle) inside eyeBrows Group <g>-element and set x position, width and height
const rightEyebrow = eyeBrowsG.append('rect')
	.attr('x', +eyeSpacing - eyebrowWidth/2)
	.attr('width', eyebrowWidth)
    .attr('height', eyebrowHeight);
    
// Add <rect> (rectangle) inside eyeBrows Group <g>-element and set x position, width and height
const leftEyebrow = eyeBrowsG.append('rect')
	.attr('x', -eyeSpacing - eyebrowWidth/2)
	.attr('width', eyebrowWidth)
	.attr('height', eyebrowHeight);

// Add <path> to main <g>-element and set attributes
const mouth = g.append('path')
		.attr('d', arc()({
    		innerRadius: 0,
    		outerRadius: 130,
    		startAngle: Math.PI / 2,
    		endAngle: Math.PI* 3/2
    }));