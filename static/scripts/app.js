// a string value such as "draw" or "drag"
var selected_option = d3.select("input[name='options']:checked").property('value');

var width = 640;
var height = 480;
// var numTicks = 10; // used later for gridlines and snapping
var resolution = 20;

var svg = d3.select("#svg-container")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

// Arrays to hold garden plot objects
var plots = [];
var circles = [];


// Alternative to scale: just add a bunch of lines on the fly
svg.selectAll('.vertical')
    .data(d3.range(1, width/resolution)).enter().append("line")
    .attr('class', 'vertical')
    .attr('x1', function(d) { return d * resolution; })
    .attr('y1', 0)
    .attr('x2', function(d) { return d * resolution; })
    .attr('y2', height)
    .attr('stroke', '#000').attr('shapeRendering', 'crispEdges');
    
svg.selectAll('.horizontal')
    .data(d3.range(1, height / resolution))
  .enter().append('line')
    .attr('class', 'horizontal')
    .attr('x1', 0)
    .attr('y1', function(d) { return d * resolution; })
    .attr('x2', width)
    .attr('y2', function(d) { return d * resolution; })
    .attr('stroke', '#000').attr('shapeRendering', 'crispEdges');

// Define scales and axes for grid
//var x_scale = d3.scaleLinear().domain([0, 100]).range([0, width]);
// var y_scale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

/*var x_gridlines = d3.axisTop()
                    .tickFormat("") // no ticks
                    .tickSize(-height) // tick all the way to bottom of the screen
                    .scale(x_scale).ticks(numTicks);
  */                  
// var y_gridlines = d3.axisLeft().tickFormat("").tickSize(-width).scale(y_scale).ticks(numTicks);
                    
// add gridlines
// svg.append("g").attr("class", "grid").call(x_gridlines);
// svg.append("g").attr("class", "grid").call(y_gridlines);

// adds circles from circle data
svg.selectAll("circle").data(circles).enter().append("circle")
	.attr("cx", function(d) { return (d.cx) })
	.attr("cy", function(d) { return (d.cy) })
    .attr("r", function(d) { return (d.r) })
 
// controls click functionality for svg element

var selected_element;

d3.select("svg")
    .on("click", function() {
	    var coords = d3.mouse(this);
    	if (d3.select('input[name="options"]:checked').node().id === "draw") 
    	{
            console.log(coords);
            var new_circle = {cx: coords[0], cy: coords[1], r: 25, id: current_id, selected: false, contains: null};
            circles.push(new_circle);
            console.log(circles);
            svg.selectAll("circle")
      	        .data(circles).enter()
      	        .append("circle")
                .attr( "cx", function(d) { return (d.cx) })
      	        .attr("cy", function(d) { return (d.cy) })
      	        .attr("r", function(d) { return (d.r) })
      	        .attr("id", function(d) { return (d.id) })
      	        .attr("contains", function(d) { return (d.contains) })
			    .on("mouseover", mouseOverHandler).on("mouseout", mouseOutHandler)
			    .on("click", select_handler);
            drag_methods(d3.selectAll("circle"));
            drag_methods(d3.selectAll("rect"));
            current_id++;
        }
		else if (d3.select('input[name="options"]:checked').node().id === "draw_plot") 
		{
			var new_plot = {x: coords[0], y: coords[1]}; // temporary data, we should prob move this to the end
			console.log(new_plot);
		}
		
    });
    
 // drag functionality implementation 
 var deltaX, deltaY;
 var current_id = 1;
 var drag_methods = d3.drag()
    .on("start", function() {
        // DRAW_PLOT FUNCTION
        if (d3.select('input[name="options"]:checked').node().id === "draw_plot") {
            console.log("Test 1!");
            var coords = d3.mouse(this);
            var plot_data = {
				id: current_id,
                x: coords[0],
                y: coords[1],
                width: 0,
                height: 0,
                class: "plot-active",
                selected: false,
                contains: null
            };

            plots.push(plot_data); // push new plot into plots
            svg.selectAll("rect").data(plots).enter()
                .append("rect")
                .attr("x", function(d) { return d.x })
                .attr("y", function(d) { return d.y })
                .attr("class", function(d) { return d.class })
                .attr("width", 0)
                .attr("height", 0)
				.on("mouseover", mouseOverHandler)
				.on("mouseout", mouseOutHandler)
				.on("click", select_handler);
            drag_methods(d3.selectAll("rect"));
            console.log("Test 2!");
        }
        // DRAG
        if (d3.select('input[name="options"]:checked').node().id === "drag") {
            var current = d3.select(this)
            deltaX = current.attr("x") - d3.event.x;
            deltaY = current.attr("y") - d3.event.y;
            
        }
    })
 	.on("drag", function(d) {
      	if (d3.select('input[name="options"]:checked').node().id === "drag"){
      	    if (d3.select(this).node().tagName === "circle") {
        	d3.select(this) // Instead of using width and height use a resolution that can be changed according to the level of zoom
        	    .attr("cx", Math.ceil(d3.event.x/resolution) * resolution) // Math.round(d3.event.x/(width/numTicks)) * (width/numTicks) )
                .attr("cy", Math.ceil(d3.event.y/resolution) * resolution) // Math.round(d3.event.y/(height/numTicks)) * (height/numTicks) )
                .classed("selected", true);
                }
            else {
                d3.select(this)
                    .attr("x", Math.ceil((d3.event.x+deltaX)/resolution) * resolution) //Math.round((d3.event.x + deltaX)/(width/numTicks)) * (width/numTicks))
                    .attr("y", Math.ceil((d3.event.y+deltaY)/resolution) * resolution) //Math.round((d3.event.y + deltaY)/(height/numTicks)) * (height/numTicks))
                    .classed("selected", true)
            }
        }
      	else if (d3.select('input[name="options"]:checked').property("id") === "resize") {
        	// There's got to be a better way!
			    d3.select(this).attr("r", d3.event.x)
        }
        else if (d3.select('input[name="options"]:checked').node().id === "draw_plot") {
            var active = svg.select("rect.plot-active");
            if (!active.empty()) {
                var coords = d3.mouse(this)
                var d = { 
                    x: Math.ceil( parseInt(active.attr("x"), 10)/resolution ) * resolution, // parseInt(active.attr("x"), 10) for just pixel by pixel
                    y: Math.ceil( parseInt(active.attr("y"), 10)/resolution ) * resolution,
                    width: parseInt(active.attr("width"), 10),
                    height: parseInt(active.attr("height"), 10)

                }
                var distance = {
                    x: Math.ceil(((coords[0] - d.x)/resolution)) * resolution, // use just coords[0] - d.x for pixel by pixel transition
                    y: Math.ceil(((coords[1] - d.y)/resolution)) * resolution 
                }
                
                if (distance.x < 1 || (distance.x*2<d.width)) {
                    d.x = coords[0];
                    d.width -= distance.x
                } else {
                    d.width = distance.x
                }
                if (distance.y < 1 || (distance.y*2<d.height)) {
                    d.y = coords[1];
                    d.height -= distance.y
                } else {
                    d.height = distance.y
                }   
                active.attr("x", d.x).attr("y", d.y)
                .attr("width", d.width).attr("height", d.height)
            }
        }
      })
  .on("end", function() {
  	d3.select(this).classed("selected", false);
  	
    if (d3.select('input[name="options"]:checked').node().id === "draw_plot") {
        var active = svg.selectAll("rect.plot-active");
        active.attr("class", "plot");
		// get current plot data
		var plot_data = plots.find(x => x.id === current_id);
		plot_data.x = active.attr("x"); plot_data.y = active.attr("y");
		plot_data.width = active.attr("width");
		plot_data.height = active.attr("height");
		plot_data.class = "plot";
		current_id++;
		console.log(plot_data);
        console.log("Test 3!");
    }
  });
 drag_methods(d3.selectAll("svg")); // this should probably be refactored but I don't want to look up what the better way to do it is
 drag_methods(d3.selectAll("circle"));
 drag_methods(d3.selectAll("rect"));
 
 
 // Our tooltip div
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
 
 // Mouse over tool tip
function mouseOverHandler(d, i) {
	div.transition()
	 	.duration(200)
	 	.style("opacity", .9);
	 // div.html("Tooltip")
	div.html("Contains: "+d.contains)
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY-28) + "px");
			
};

function mouseOutHandler(d, i) {
 	div.transition()
	 	.duration(500)
	 	.style("opacity", 0);
}

function select_handler(d) { // i herd u leik spaghet cöd
    var edit_input = document.getElementById('edit_input');
    var edit_send = document.getElementById('edit_send');
    
    test_edit_input = edit_input;
    
	if (!d.selected) {
        d.selected = true;
        console.log(d); // {... selected: true}
        d3.select(this).classed("selected", d.selected);
        // open edit div
        edit_input.disabled = false;
        edit_send.disabled = false;
        edit_input.value = d.contains;
        d3.select('#edit_send').on("click", function() {
            d.contains = edit_input.value;
            console.log("If you see this it might work: " + d.contains);
        });	
	}
	else
	{
	    d.selected = false;
	    d3.select(this).classed("selected", d.selected);
	    document.getElementById('edit_input').disabled = true;
        document.getElementById('edit_send').disabled = true;
	}
}
