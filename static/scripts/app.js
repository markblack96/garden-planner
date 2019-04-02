// a string value such as "draw" or "drag"
var selected_option = d3.select("input[name='options']:checked").property('value');

var width = 640;
var height = 480;
var resolution = 20;

var svg = d3.select("#svg-container")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

var g = svg.append("g");

var background = g.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "background");
                
// Arrays to hold garden plot objects
var plots = [];
var circles = [];

// Scales and axes for grid
var x = d3.scaleLinear()
    .domain([0, 32])
    .range([-1, 640+1]);

var y = d3.scaleLinear()
    .domain([0, 48])
    .range([-1, 480 + 1]);

var xAxis = d3.axisBottom(x)
        .ticks((640 + 2)/(480 + 2) * 20)
        .tickSize(480)
        .tickPadding(8 - 480);

var yAxis = d3.axisRight(y)
    .ticks(20)
    .tickSize(640)
    .tickPadding(8 - 640);

var gX = g.append("g")
    .attr("class", "axis axis--x")
    .attr("fill", "#000")
    .call(xAxis);

var gY = g.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);



svg.call(d3.zoom()
    .scaleExtent([1/2, 8])
    .on("zoom", zoomed));

function zoomed() {
    if (d3.select('input[name="options"]:checked').node().id === "select")
        g.attr("transform", d3.event.transform);
        // gX.call(xAxis.scale(d3.event.transform.rescaleX()));
        // gY.call(xAxis.scale(d3.event.transform.rescaleX()));
}

// adds circles from circle data
g.selectAll("circle").data(circles).enter().append("circle")
	.attr("cx", function(d) { return (d.cx) })
	.attr("cy", function(d) { return (d.cy) })
    .attr("r", function(d) { return (d.r) })
    .attr("class", "pot");
 
// controls click functionality for svg element

var selected_element;
    
 // drag functionality implementation 
 var deltaX, deltaY;
 var current_id = 1;
 var debugger_var;
 var drag_methods = d3.drag()
    .on("start", function() {
        // DRAW_PLOT FUNCTION
        console.log("First real test");
        debugger_var = d3.select(this);
        var active;
        var coords = d3.mouse(this);
    	if (d3.select('input[name="options"]:checked').node().id === "draw") 
    	{
            console.log(coords);
            var new_circle = {cx: coords[0], cy: coords[1], r: 25, id: "i" + current_id, selected: false, contains: null}; // numeric id's are wonky, i# is the format
            circles.push(new_circle);
            console.log(circles);
            g.selectAll("circle")
      	        .data(circles).enter()
      	        .append("circle")
                .attr( "cx", function(d) { return (d.cx) })
      	        .attr("cy", function(d) { return (d.cy) })
      	        .attr("r", function(d) { return (d.r) })
      	        .attr("id", function(d) { return (d.id) })
      	        .attr("class", "pot")
      	        .attr("contains", function(d) { return (d.contains) })
			    .on("mouseover", mouseOverHandler).on("mouseout", mouseOutHandler)
			    .on("click", select_handler);
            drag_methods(d3.selectAll("circle"));
            
            current_id++;
        }
        
        
        if (d3.select('input[name="options"]:checked').node().id === "draw_plot") {
            var coords = d3.mouse(this);
            var plot_data = {
				id: "i" + current_id,
                x: Math.ceil(((coords[0])/resolution)) * resolution,
                y: Math.ceil(((coords[1])/resolution)) * resolution,
                width: 0,
                height: 0,
                class: "plot-active",
                selected: false,
                contains: null
            };

            plots.push(plot_data); // push new plot into plots
            g.selectAll("rect").data(plots).enter()
                .append("rect")
                .attr("x", function(d) { return d.x }) 
                .attr("y", function(d) { return d.y })
                .attr("id", function(d) { return "i" + current_id } )
                .attr("class", function(d) { return d.class })
                .attr("width", 0)
                .attr("height", 0)
				.on("mouseover", mouseOverHandler)
				.on("mouseout", mouseOutHandler)
				.on("click", select_handler);
            drag_methods(d3.selectAll(".plot-active"));
        }
        // DRAG
        if (d3.select('input[name="options"]:checked').node().id === "drag") {
//            && d3.select(this).attr("class") !== "background") {
            var current = d3.select(this)
            deltaX = current.attr("x") - d3.event.x;
            deltaY = current.attr("y") - d3.event.y;
            
        }
    })
 	.on("drag", function(d) {
      	if (d3.select('input[name="options"]:checked').node().id === "drag"){
      	    if (d3.select(this).node().tagName === "circle") {
        	d3.select(this)
        	    .attr("cx", Math.ceil(d3.event.x/resolution) * resolution)
                .attr("cy", Math.ceil(d3.event.y/resolution) * resolution)
                .classed("selected", true);
                }
            else {
                d3.select(this)
                    .attr("x", Math.ceil((d3.event.x+deltaX)/resolution) * resolution)
                    .attr("y", Math.ceil((d3.event.y+deltaY)/resolution) * resolution)
                    .classed("selected", true)
            }
        }
      	else if (d3.select('input[name="options"]:checked').property("id") === "resize") {
        	// There's got to be a better way!
			    d3.select(this).attr("r", d3.event.x)
        }
        else if (d3.select('input[name="options"]:checked').node().id === "draw_plot") {
            active = g.select("rect.plot-active");
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
        active = g.selectAll("rect.plot-active");
        active.attr("class", "plot");
		// get current plot data
		var plot_data = plots.find(x => x.id === "i" + current_id);
		plot_data.x = active.attr("x"); plot_data.y = active.attr("y");
		plot_data.width = active.attr("width");
		plot_data.height = active.attr("height");
		plot_data.class = "plot";
		current_id++;
		console.log(plot_data);
        console.log("Test 3!");
    }
  });
 svg.call(drag_methods);
 drag_methods(g);
 
 
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
	div.html("Contains: "+d.contains )
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY-28) + "px");
			
};

function mouseOutHandler(d, i) {
 	div.transition()
	 	.duration(500)
	 	.style("opacity", 0);
}

function select_handler(d) { 
    var edit_input = document.getElementById('edit_input');
    var edit_send = document.getElementById('edit_send');
    var edit_delete = document.getElementById('edit_delete');
    if (d3.select('input[name="options"]:checked').node().id === 'select')
    {
    test_edit_input = edit_input;
    
    
	if (!d.selected) {
        d.selected = true;
        console.log(d); // {... selected: true}
        d3.select(this).classed("selected", d.selected);
        // open edit div
        edit_input.disabled = false;
        edit_send.disabled = false;
        edit_delete.disabled = false;
        
        edit_input.value = d.contains;
        d3.select('#edit_send').on("click", function() {
            d.contains = edit_input.value;
            console.log("If you see this it might work: " + d.contains);
        });	
        d3.select('#edit_delete').on("click", function() {
            // delete the selected element and associated data
            d3.select("#" + d.id).remove();
            plots.pop("#i" + d.id);
        });
	}
	else
	{
	    d.selected = false;
	    d3.select(this).classed("selected", d.selected);
	    document.getElementById('edit_input').disabled = true;
        document.getElementById('edit_send').disabled = true;
        document.getElementById('edit_delete').disabled = true;
	}
}
}
