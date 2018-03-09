function scatterplot(svg,data){
	    var margin = 50,
        height ,
        width;


	var div = d3.select("body").append("div")
    	.attr("class", "tooltip")
    	.style("opacity", 0);

    if ( document.getElementById("graph").offsetWidth < 900 )
    	width=document.getElementById("graph").offsetWidth 
    else
    	width=900;

    height=width;
    var opacityCircles = 0.7; 
    
    var svgChart="#"+ svg;
    chart = d3.select("#graph").append("svg")
               .attr("width", width)
               .attr("height", height);


      //Create scale functions
      var xScale = d3.scaleLinear()
                 .domain([0, d3.max(data, function(d) { return parseFloat(d.FB); })])
                 .range([margin, width - margin * 2]);

      var yScale = d3.scaleLinear()
                 .domain([0, d3.max(data, function(d) { return parseFloat(d.NonFBCompValue); })])
                 .range([height - margin, margin]);

      //Create X axis
      chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + yScale(0) + ")")
        .call(d3.axisBottom(xScale));
      
      //Create Y axis
      chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin + ",0)")
        .call(d3.axisLeft(yScale));

      chart.append("text")
        .attr("x",xScale(d3.max(data, function(d) { return parseFloat(d.FB)}))-100)
        .attr("y",yScale(0)+30)
        .text("Foreign-Born");

      chart.append("text")
        .attr("x",xScale(0)-35)
        .attr("y",yScale(d3.max(data, function(d) { return parseFloat(d.NonFBCompValue)}))-10)
        .text("Country Mean");

      

      //Create circles
      chart.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr("class", function(d,i) { return "regions " + d.Region; }) // define a class per circle to attach the voronoi grid to it
         .attr("cx", function(d) {
            return xScale(parseFloat(d.FB));
         })
         .attr("cy", function(d) {
            return yScale(parseFloat(d.NonFBCompValue));
         })
         .attr("r", function(d) {
            return 4;
         })
         .attr("fill",function(d){
         	if(d.NonFBCompValue>d.FB)
            	return "rgb(126,126,126)";
          	else if (d.NonFBCompValue<=d.FB)
            	return "rgb(102,189,58)";
         })
         .style("opacity", 0.7);


      //Create labels

      chart.selectAll("text")
         .data(data)
         .enter()
         .append("text")
         .text(function(d) {
            if(!(d.ISO=="NOR") && !(d.ISO=="FIN") && !(d.ISO=="CHE")&& !(d.ISO=="ESP")&& !(d.ISO=="FRA")&& !(d.ISO=="GRC")&& !(d.ISO=="CAN")&& !(d.ISO=="BEL")&& !(d.ISO=="DEU")&& !(d.ISO=="NZL")&& !(d.ISO=="OECD")&& !(d.ISO=="JPN")){
              return d.ISO;
            }

         })
         .attr("x", function(d) {
            if(d.NonFBCompValue>=0)
            return xScale(parseFloat(d.FB)) + 8;
            else
            return xScale(parseFloat(d.FB)) +8;
         })
         .attr("y", function(d) {
            if(d.NonFBCompValue>=0)
            return yScale(parseFloat(d.NonFBCompValue))+ 0;
          else
            return yScale(parseFloat(d.NonFBCompValue))+ 5;
         })
         .attr("font-family", "sans-serif")
         .attr("font-size", "10px");
 



      var voronoi = d3.voronoi()
              .x(function(d) { return xScale(d.FB); })
              .y(function(d) { return yScale(d.NonFBCompValue); })
              .extent([[0, 0], [width, height]]);


      //Initiate a group element to place the voronoi diagram in
      var voronoiGroup = chart.append("g")
        .attr("class", "voronoiWrapper");
 
      //Create the Voronoi grid
      voronoiGroup.selectAll("path")
              .data(voronoi.polygons(data)) //Use vononoi() with your dataset inside
              .enter().append("path")
              .attr("d", function(d, i) {return d ? "M" + d.join("L") + "Z" : null; })
              //.datum(function(d, i) { return d.point; })
              //Give each cell a unique class where the unique part corresponds to the circle classes
              //.attr("class", function(i) { return "voronoi " +data[i].Region })
              //.style("stroke", "#2074A0") //If you want to look at the cells
              .style("fill", "none")
              .style("pointer-events", "all")
              .on("mouseover",showTooltip)
              .on("mouseout",  removeTooltip)
         	  .on("click", updateMap);

		///////////////////////////////////////////////////////////////////////////
		/////////////////// Hover functions of the circles ////////////////////////
		///////////////////////////////////////////////////////////////////////////

		//Hide the tooltip when the mouse moves away
		function removeTooltip (d, i) {

		  //Save the chosen circle (so not the voronoi)
		  var element = d3.selectAll("regions "+d.data.Region);
		    
		  //Fade out the bubble again
		  element.style("opacity", 0.7);
		  
		  //Hide tooltip

	       div.transition()
	         .duration(500)
	         .style("opacity", 0);
		  
		  //Fade out guide lines, then remove them
		  d3.selectAll(".guide")
		    .transition().duration(200)
		    .style("opacity",  0)
		    .remove();
		    
		}//function removeTooltip

		//Show the tooltip on the hovered over slice
		function showTooltip (d, i) {
		  
		  //Save the chosen circle (so not the voronoi)
		  var element = d3.selectAll(".regions."+d.data.Region);
		  var element_Class = ".regions."+d.data.Region;


			var div_text;
			 if(d.data.NonFBCompValue>d.data.FB)
			 div_text="proportion of FB is less in this region than at national level";
			else if (d.data.NonFBCompValue<d.data.FB)
			 div_text= "proportion of FB is more in this region than at the national level";
			else
			 div_text= "proportion of FB in this region is in line with national level ";

			div.transition()
			         .duration(200)
			         .style("opacity", .9);
			       div .html( d.data.RegionName + ", " + d.data.Country + "<br/> "+ div_text)     
			         .style("left", (d3.event.pageX) + "px")             
			         .style("top", (d3.event.pageY ) + "px");
			       


		  element.style("opacity", 1);
		  
		  //Append lines to bubbles that will be used to show the precise data points
		  //vertical line
		  chart.append("g")
		    .attr("class", "guide")
		    .append("line")
		      .attr("x1", element.attr("cx"))
		      .attr("x2", element.attr("cx"))
		      .attr("y1", +element.attr("cy"))
		      .attr("y2", (height-margin))
		      .style("stroke", element.style("fill"))
		      .style("opacity",  0)
		      .style("pointer-events", "none")
		      .transition().duration(200)
		      .style("opacity", 0.5);
		  //horizontal line
		  chart.append("g")
		    .attr("class", "guide")
		    .append("line")
		      .attr("x1", +element.attr("cx"))
		      .attr("x2", margin)
		      .attr("y1", element.attr("cy"))
		      .attr("y2", element.attr("cy"))
		      .style("stroke", element.style("fill"))
		      .style("opacity",  0)
		      .style("pointer-events", "none")
		      .transition().duration(200)
		      .style("opacity", 0.5);
		          
		}

}