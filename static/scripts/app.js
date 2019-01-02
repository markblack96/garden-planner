// a string value such as "draw" or "drag"
var selected_option = d3.select("input[name='options']:checked").property('value');


var svg = d3.select("#svg-container").append("svg").attr("width", "640px").attr("height", "480px");;

var plots = []; // Array to hold garden plot objects

var circles = [];


svg.selectAll("circle").data(circles).enter().append("circle")
	.attr("cx", function(d) { return (d.cx) })
	.attr("cy", function(d) { return (d.cy) })
  .attr("r", function(d) { return (d.r) })
  
d3.select("svg").
  	on("click", function() {
    	if (d3.select('input[name="options"]:checked').node().id === "draw") {
    	    var coords = d3.mouse(this);
            console.log(coords);
            new_circle = {cx: coords[0], cy: coords[1], r: 25};
            circles.push(new_circle);
            console.log(circles);
            svg.selectAll("circle")
      	    .data(circles).enter()
      	    .append("circle")
            .attr( "cx", function(d) { return (d.cx) })
      	    .attr("cy", function(d) { return (d.cy) })
      	    .attr("r", function(d) { return (d.r) })
            drag_methods(d3.selectAll("circle"))
            drag_methods(d3.selectAll("rect")) // let's just see where this goes
        }
    });
  
 var deltaX, deltaY;
 var drag_methods = d3.drag()
    .on("start", function() {
        // DRAW_PLOT FUNCTION
        if (d3.select('input[name="options"]:checked').node().id === "draw_plot") {
            console.log("Test 1!");
            var coords = d3.mouse(this);
            var plot_data = {
                x: coords[0],
                y: coords[1],
                width: 0,
                height: 0,
                class: "plot-active"
            };

            plots.push(plot_data); // push new plot into plots
            svg.selectAll("rect").data(plots).enter()
                .append("rect")
                .attr("x", function(d) { return d.x })
                .attr("y", function(d) { return d.y })
                .attr("class", function(d) { return d.class })
                .attr("width", 0)
                .attr("height", 0);
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
    	d3.select(this)
    	    .attr("cx", d3.event.x)
            .attr("cy", d3.event.y)
            .classed("selected", true);
            }
        else {
            d3.select(this)
                .attr("x", d3.event.x + deltaX)
                .attr("y", d3.event.y + deltaY)
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
                x: parseInt(active.attr("x"), 10),
                y: parseInt(active.attr("y"), 10),
                width: parseInt(active.attr("width"), 10),
                height: parseInt(active.attr("height"), 10)

            }
            var distance = {
                x: coords[0] - d.x,
                y: coords[1] - d.y
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
        console.log("Test 3!");
    }
  });
 drag_methods(d3.selectAll("svg"));
 drag_methods(d3.selectAll("circle"));
 drag_methods(d3.selectAll("rect"));



/* 
svg.on("mousedown", function() {
    var coords = d3.mouse(this);
    // update selected_option
    selected_option = d3.select("input[name='options']:checked").property('value');
    if (selected_option === "draw") {
        console.log("Test worked!");

        var plot_data = {
            x: coords[0],
            y: coords[1],
            width: 0,
            height: 0,
            class: "plot-active"
        };

        plots.push(plot_data); // push new plot into plots
        svg.selectAll("rect").data(plots).enter()
            .append("rect")
            .attr("x", function(d) { return d.x })
            .attr("y", function(d) { return d.y })
            .attr("class", function(d) { return d.class })
            .attr("width", 0)
            .attr("height", 0);
    };
})
.on("mousemove", function() {
    if (selected_option === "draw") { // we'll just assume selected_option is up-to-date
        var active = svg.select("rect.plot-active");
        if (!active.empty()) {
            var coords = d3.mouse(this);
            var d = { 
                x: parseInt(active.attr("x"), 10),
                y: parseInt(active.attr("y"), 10),
                width: parseInt(active.attr("width"), 10),
                height: parseInt(active.attr("height"), 10)

            };
            var distance = {
                x: coords[0] - d.x,
                y: coords[1] - d.y
            };
            if (distance.x < 1 || (distance.x*2<d.width)) {
                d.x = coords[0];
                d.width -= distance.x;
            } else {
                d.width = distance.x;
            }
            if (distance.y < 1 || (distance.y*2<d.height)) {
                d.y = coords[1];
                d.height -= distance.y;
            } else {
                d.height = distance.y;
            }   
            active.attr("x", d.x).attr("y", d.y)
            .attr("width", d.width).attr("height", d.height);
        };
    };
})
.on("mouseup", function() {
    var active = svg.selectAll("rect.plot-active");
    active.attr("class", "plot");
    console.log("Mouse released");
}); */
