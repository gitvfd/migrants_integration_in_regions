
var oldWidth = 0
var margin=50
var opacityCircles = 0.2; 
var r = 5;



var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

function render(data){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth
  var width = height = d3.select("#graph").node().offsetWidth
  
  var r = 5;
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(data.filter(function(d){return d.Indicator=="ShareMig"}), function(d) { return parseFloat(d.FB); })])
    .range([margin, width - margin * 2]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data.filter(function(d){return d.Indicator=="ShareMig"}), function(d) { return parseFloat(d.CountryMean); })])
     .range([height - margin, margin]);

  if (innerWidth <= 900){
    width = innerWidth
    height = innerHeight*.7
  }
  // return console.log(width, height)
  var svg = d3.select('#graph').html('')
    .append('svg')
      .attrs({width: width, height: height})

  //Create X axis
  svg.append("g")
    .attr("class", "axis x")
    .attr("transform", "translate(0," + yScale(0) + ")")
    .call(d3.axisBottom(xScale));
  
  //Create Y axis
  svg.append("g")
    .attr("class", "axis y")
    .attr("transform", "translate(" + margin + ",0)")
    .call(d3.axisLeft(yScale));



  svg.append("text")
  	.attr("id","xTitle")
    .attr("x",xScale(d3.max(data, function(d) { return parseFloat(d.FB)}))-100)
    .attr("y",yScale(0)+30)
    .text("Foreign-Born");

  svg.append("text")
  	.attr("id","yTitle")
    .attr("x",xScale(0)-35)
    .attr("y",yScale(d3.max(data, function(d) { return parseFloat(d.CountryMean)}))-10)
    .text("Country Mean");

  var circles= svg.selectAll("circle")
         .data(data.filter(function(d){return d.Indicator=="ShareMig"}))
         .enter()
         .append("circle")
         .attr("class", function(d,i) { return "regions " + d.Region; }) // define a class per circle to attach the voronoi grid to it
         .attr("cx", function(d) {
         	if(d.FB==""||d.CountryMean=="")
            	return 0;
            else 
            	return xScale(parseFloat(d.FB));
         })
         .attr("cy", function(d) {
         	if(d.FB==""||d.CountryMean=="")
            	return 0;
            else 
            	return yScale(parseFloat(d.CountryMean));
         })
         .attr("r", function(d) {
         	if(d.FB==""||d.CountryMean=="")
            	return 0;
            else if(d.Region==selRegion)
            	return 15
            else
            	return 5;
         })
         .attr("fill",function(d){
         	if(d.Region==selRegion)
            	return "#F68385"
         	else if(d.CountryMean>d.FB)
            	return "#8EA4B1";
          	else if (d.CountryMean<=d.FB)
            	return "#993484";
         })
         .style("opacity", opacityCircles);




	var voronoi = d3.voronoi()
	      .x(function(d) { return xScale(d.FB); })
	      .y(function(d) { return yScale(d.CountryMean); })
	      .extent([[0, 0], [width, height]]);


	//Initiate a group element to place the voronoi diagram in
	var voronoiGroup = svg.append("g")
	.attr("class", "voronoiWrapper");

	//Create the Voronoi grid
	voronoiGroup.selectAll("path")
	      .data(voronoi.polygons(data.filter(function(d){return d.Indicator=="ShareMig"}))) //Use vononoi() with your dataset inside
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
	  var element = d3.selectAll(".regions."+d.data.Region);

	  var ElementOPacity;
	  if(d.data.Region===selRegion)
	            	ElementOPacity= 1
	  else
	            	ElementOPacity= opacityCircles;

	  //Fade out the bubble again
	  element.style("opacity",ElementOPacity);
	  
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
		 if(d.data.CountryMean>d.data.FB)
		 div_text="proportion of FB is less in this region than at national level";
		else if (d.data.CountryMean<d.data.FB)
		 div_text= "proportion of FB is more in this region than at the national level";
		else
		 div_text= "proportion of FB in this region is in line with national level ";

		div.transition()
		         .duration(200)
		         .style("opacity", .9);
		       div .html( d.data.RegionName + ", " + d.data.Country + "<br/> "+ div_text)     
		         .style("left", (d3.event.pageX) + "px")             
		         .style("top", (d3.event.pageY ) + "px");
		       


	  element.style("opacity",1);
	  
	  //Append lines to bubbles that will be used to show the precise data points
	  //vertical line
	  svg.append("g")
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
	  svg.append("g")
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

      
  //var circle = svg.append('circle')
    //  .attrs({cx: 0, cy: 0, r: r})
  
  //var colors = ['orange', 'purple', 'steelblue', 'pink', 'black']
  var dataPos=[data.filter(function(d){return d.Indicator=="ShareMig"}),data.filter(function(d){return d.Indicator=="lengthStay"}),data.filter(function(d){return d.Indicator=="eduattain"}),data.filter(function(d){return d.Indicator=="Unemp"}),data.filter(function(d){return d.Indicator=="PartRate"}),data.filter(function(d){return d.Indicator=="overQualRate"})]
  //var dataPos=[ShareMigData,lengthStayData,eduattainData,UnempData,PartRateData,overQualRateData]
  var axisLabels=[{"x":"Foreign-Born","y":"Country Mean"},{"x":"New arrivals","y":"Settled migrants"},{"x":"Foreign-Born","y":"Native-Born"},{"x":"Foreign-Born","y":"Native-Born"},{"x":"Foreign-Born","y":"Native-Born"},{"x":"Foreign-Born","y":"Native-Born"}]


  var gs = d3.graphScroll()
      .container(d3.select('.container-1'))
      .graph(d3.selectAll('container #graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('.container-1 #sections > div'))
      // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
      .on('active', function(i){


		xScale.domain([0, d3.max(dataPos[i], function(d) { return parseFloat(d.FB); })])
		yScale.domain([0, d3.max(dataPos[i], function(d) { return parseFloat(d.CountryMean); })])


  		svg.select("#xTitle").transition().duration(600).attr("x",xScale(d3.max(dataPos[i], function(d) { return parseFloat(d.FB)}))-100).attr("y",yScale(0)+30).text(axisLabels[i].x);
  		svg.select("#yTitle").transition().duration(600).attr("x",xScale(0)-35).attr("y",yScale(d3.max(dataPos[i], function(d) { return parseFloat(d.CountryMean)}))-10).text(axisLabels[i].y);


		svg.select(".x").transition().duration(600).call(d3.axisBottom(xScale));
		svg.select(".y").transition().duration(600).call(d3.axisLeft(yScale));


        circles.data(dataPos[i]).transition().duration(600) 
	         .attr("cx", function(d) {
	         	if(d.FB==""||d.CountryMean=="")
	            	return 0;
	            else 
	            	return xScale(parseFloat(d.FB));
	         })
	         .attr("cy", function(d) {
	         	if(d.FB==""||d.CountryMean=="")
	            	return 0;
	            else 
	            	return yScale(parseFloat(d.CountryMean));
	         })

	         .attr("r", function(d) {
	         	if(d.FB==""||d.CountryMean=="")
	            	return 0;
	            else if(d.Region==selRegion)
	            	return 15
	            else
	            	return 5;
	         })
	         .attr("fill",function(d){
	         	if(d.Region==selRegion)
	            	return "#F68385"
	         	else if(d.CountryMean>d.FB)
	            	return "#8EA4B1";
	          	else if (d.CountryMean<=d.FB)
	            	return "#993484";
	         })
	    

	//Create the Voronoi grid
	voronoiGroup.selectAll("path").remove();
	      voronoiGroup.selectAll("path")
	      .data(voronoi.polygons(dataPos[i])) //Use vononoi() with your dataset inside
	      .enter().append("path")
	      .attr("d", function(d, i) {return d ? "M" + d.join("L") + "Z" : null; })
	      .style("fill", "none")
	      .style("pointer-events", "all")
	      .on("mouseover",showTooltip)
	      .on("mouseout",  removeTooltip)
	 	  .on("click", updateMap);          
      })

  d3.select('#source')
      //.styles({'margin-top': window.innerHeight - 450 + 'px', padding: '100px'})
      .styles({'margin-bottom': window.innerHeight + 0 + 'px', padding: '50px'})
}
//render();
d3.select(window).on('resize', render)
