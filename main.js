// global variables
let option1 = document.querySelector('#option1')
	option2 = document.querySelector('#option2')
	option3 = document.querySelector('#option3')
	option4 = document.querySelector('#option4')
	tooltip=document.querySelector('.tooltip')

// promise
d3.csv('https://raw.githubusercontent.com/3milychu/12-9-workshop/master/data.csv')
	// data is all loaded! callback
	.then(function(data){
		console.log(data)

		// simple filters
		q1_ate_yes = data.filter(function(d){
			return d['time']=='12:10-12:55pm' && d['Did you eat before class?']==1
		})
		q1_ate_no = data.filter(function(d){
			return d['time']=='12:10-12:55pm' && d['Did you eat before class?']==0
		})
		q2_ate_yes = data.filter(function(d){
			return d['time']=='12:56-1:41pm'  && d['Did you eat before class?']==1
		})
		q2_ate_no = data.filter(function(d){
			return d['time']=='12:56-1:41pm'  && d['Did you eat before class?']==0
		})
		q3_ate_yes = data.filter(function(d){
			return d['time']=='1:42-2:18pm' && d['Did you eat before class?']==1
		})
		q3_ate_no = data.filter(function(d){
			return d['time']=='1:42-2:18pm' && d['Did you eat before class?']==0
		})
		q4_ate_yes = data.filter(function(d){
			return d['time']=='2:19-2:50pm' && d['Did you eat before class?']==1
		})
		q4_ate_no = data.filter(function(d){
			return d['time']=='2:19-2:50pm'  && d['Did you eat before class?']==0
		})

		// run upon loading the page - load bubblechart in specified containers the dataset passed through
		bubblechart('#ate_yes', q1_ate_yes)
		bubblechart('#ate_no', q1_ate_no)
		selectOption('#option1')

		// update the data simply based on filter selected
		option1.onclick=function(data) {
			clear()
			selectOption('#option1')
			bubblechart('#ate_yes', q1_ate_yes)
			bubblechart('#ate_no', q1_ate_no)
		}
		option2.onclick=function() {
			clear()
			selectOption('#option2')
			bubblechart('#ate_yes', q2_ate_yes)
			bubblechart('#ate_no', q2_ate_no)
		}
		option3.onclick=function() {
			clear()
			selectOption('#option3')
			bubblechart('#ate_yes', q3_ate_yes)
			bubblechart('#ate_no', q3_ate_no)
		}
		option4.onclick=function() {
			clear()
			selectOption('#option4')
			bubblechart('#ate_yes', q4_ate_yes)
			bubblechart('#ate_no', q4_ate_no)
		}
		window.onresize=function() {
			location.reload()
		}
	})
	.catch(function(error){
	})

function selectOption(item){
	item = document.querySelector(item)
	item.style.color='white'
	item.style.backgroundColor='#1d1d1d'
}

// clears all svgs 
function clear() {
	svg = d3.selectAll('svg')
	svg.remove()
	filters = document.querySelectorAll('.option')
	filters.forEach(function(item){
		item.style.backgroundColor='white'
		item.style.color='#1d1d1d'
	})
}

// gets position of mouse on the page
function getpos(event) {
	var e = window.event;
	x = e.clientX ;
	y = e.clientY ;
} 

// updates tooltip to the text passed through parameter
function updateTooltip(text_to_display){
	tooltip.innerHTML=text_to_display
	getpos()
	tooltip.style.opacity=1
	tooltip.style.left=x+30+"px"
	tooltip.style.top=y-30+"px"
}

// clears the tooltip
function clearTooltip() {
	tooltip.style.opacity=0
}

// creates bubblechart using d3.pack
function bubblechart(location, data){

let width = window.innerWidth
	height = window.innerHeight
	diameter = width/2.5, //max size of the bubbles
    format   = d3.format(",d");
    // color    = d3.scaleOrdinal(d3.schemeCategory10);
    // you can apply this in fill if you want d3 to automatically apply a categorical color palette to your data
    // in this tutorial we will specify our own color scheme based on class applied tied to the energy level of each person
    //more color options: https://github.com/d3/d3-scale-chromatic

// bubblechart layout; given a number of nodes, how to arrange them appropriately next to each other in a "pack"
let bubble = d3.pack()
    .size([diameter, diameter])
    .padding(1.5);

// size of the svg
let svg = d3.select(location)
    .append("svg")
    .attr("width", width/2)
    .attr("height", height)
    .attr("class", "bubble");

    //convert numerical values from strings to numbers
    data = data.map(function(d){ d.value = +d["Energy level (0 = low, 5 = high)"]; return d; });

    //Sets up a hierarchy of data object -- this returns a data object that gives the cx,cy (positions of nodes) 
    // and radius so that the bubbles appear in the pack layout arranged appropriately 
    var root = d3.hierarchy({children:data})
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

    //Once we have hierarchal data, run bubble generator
    bubble(root);
    // look at the r, value, x, and y fields generated that we now have ready to arrange our nodes in a chart next to each other
    console.log(root)

    //setup the chart
    var bubbles = svg.selectAll(".bubble")
        .data(root.children)
        .enter();

    //create the bubbles
    bubbles.append("circle")
    	// see lines 17-31 for colors designated to each node based on class
        .attr("class", function(d) {return "circle " + "energy"+d.data["Energy level (0 = low, 5 = high)"] })
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .on('mouseover', function(d){
        	let text_to_display="";
        	text_to_display+='<p>Engagement: '+ d.data["Engaged/interested in material (0 = low, 5 = high)"]+'</p>'
        	text_to_display+='<p>Comprehension: '+ d.data["Following the material (0 = low, 5 = high)"]+'</p>'
        	text_to_display+='<p>Overall mood: '+ d.data["Overall mood (0 = low, 5 = high)"]+'</p>'
        	updateTooltip(text_to_display)
        })
        .on("mouseout", function(d){
        	clearTooltip()
        });

    //format the text for each bubble
    // bubbles.append("text")
    //     .attr("x", function(d){ return d.x; })
    //     .attr("y", function(d){ return d.y + 5; })
    //     .attr("text-anchor", "middle")
    //     .text(function(d){ return d.data["Energy level (0 = low, 5 = high)"]; })
    //     .style("fill","white")
    //     .style("font-family", "Helvetica Neue, Helvetica, Arial, san-serif")
    //     .style("font-size", "12px");

}