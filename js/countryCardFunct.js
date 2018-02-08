function countryCardFunct(data){

	ccSVG.selectAll("*").remove();

	var ccCard= ccSVG.append("g")
          .attr("transform", "translate(" + ccMargin.left + "," + ccMargin.top + ")");


 // need to rewrite so start, min, lowest are the same
    var classToPos = {
      "lollipop-start": "FB",
      "lollipop-end": "CountryMean"
    }
    
    var legendLabels = [
      {label: "Foreign-Born", class: "lollipop-start"}, 
      {label: "Other category", class: "lollipop-end"}
    ];

    data.forEach(function(d){
    	if(d.Indicator=="ShareMig")
    		d.Title="Share of migrants"
    	if(d.Indicator=="lengthStay")
    		d.Title="Duration of foreign born stay"
    	if(d.Indicator=="eduattain")
    		d.Title="Educational attainment"
    	if(d.Indicator=="Unemp")
    		d.Title="Unemployment rate"
    	if(d.Indicator=="PartRate")
    		d.Title="Participation rate"
    	if(d.Indicator=="overQualRate")
    		d.Title="Over-qualification rate"
    })
    var padding = 0;
    
    var y = d3.scaleBand()
    	.domain(data.map(function(d) { return d.Title }))
    	.range([0, ccHeight])
    	.padding(padding);
    
    var maxFB=d3.max(data, function(d) { return d.FB })
    var maxNB=d3.max(data, function(d) { return d.CountryMean })
    var x = d3.scaleLinear()
    	//.domain([0, d3.max([maxFB,maxNB])])
    	.domain([0, 100])
    	.range([ccMargin.left, ccWidth])
    	.nice();
    
    // code for positioning legend
    var legend = ccCard.append("g");
    
    var legendX = ccWidth / 2 - 200;
    var legendY = -50;
    var spaceBetween = 150;
    
    var legendPosition = {
      x: legendX + 70,
      y: legendY - 4
    };
    
    // add circles
    legend.selectAll("circle")
    	.data(legendLabels) 
    .enter().append("circle")
    	.attr("cx", function(d, i) {
      	return legendPosition.x + spaceBetween * i;
    	})  
    	.attr("cy", legendPosition.y)
    	.attr("r", 5)
    	.attr("class", function(d) { return d.class });
    
    // add labels
    legend.selectAll("text")
    	.data(legendLabels)
    .enter().append("text")
      .attr("x", function(d, i) {
      	return legendPosition.x + spaceBetween * i + 10;
    	})  
    	.attr("y", legendPosition.y + 4)
    	.text(function(d) { return d.label });
    
    var yAxis = d3.axisLeft().scale(y)
    	.tickSize(0);
    
    var xAxis = d3.axisTop().scale(x)
    	.tickFormat(function(d,i) {
        if (i == 0) {
          return "%"
        } else {
        	return d3.format(".1s")(d); 
        }
      });
    
    var yAxisGroup = ccCard.append("g")
    	.attr("transform", "translate("+ccMargin.left+", 0)")
    	.call(yAxis)
    	.select(".domain").remove();    
    
    var xAxisGroup = ccCard.append("g")
    	.call(xAxis);
    
    xAxisGroup.append("text")
    	.attr("class", "x-title")
    	.attr("x", legendX)
    	.attr("y", legendY)
    	.text("Migrants integration")
    	.attr("fill", "black");
    
    var lineGenerator = d3.line();
    var axisLinePath = function(d) {
      return lineGenerator([[x(d) + 0.5, 0], [x(d) + 0.5, ccHeight]]);
    };
     
    var axisLines = xAxisGroup.selectAll("path")
    	.data(x.ticks(10))
    .enter().append("path")
    	.attr("class", "grid-line")
    	.attr("d", axisLinePath);
    
    var lollipopLinePath = function(d) {
      return lineGenerator([[x(d.FB), y(d.Title) + (y.bandwidth() / 2) ], [x(d.CountryMean), y(d.Title) + (y.bandwidth() / 2)]]);
    };
    
   	var lollipopsGroup = ccCard.append("g").attr("class", "lollipops");
    
    var lollipops = lollipopsGroup.selectAll("g")
    	.data(data)
    .enter().append("g")
    	.attr("class", "lollipop")
    
    lollipops.append("path")
    	.attr("class", "lollipop-line")
    	.attr("d", lollipopLinePath);
    
    var startCircles = lollipops.append("circle")
    	.attr("class", "lollipop-start")
    	.attr("r", function(d){
    		if(d.FB=="")
    			return 0;
    		else
    			return 5;

    	})
      .attr("cx", function(d) { 
      	return x(d.FB); 
    	})
    	.attr("cy", function(d) {
        return y(d.Title) + y.bandwidth() / 2;
			})
    	.on("mouseover", showLabel)
      .on("mouseout", hideLabel);
    
  
    var endCircles = lollipops.append("circle")
    	.attr("class", "lollipop-end")
    	.attr("r", function(d){
    		if(d.CountryMean=="")
    			return 0;
    		else
    			return 5;

    	})
    	.attr("cx", function(d) { 
      	return x(d.CountryMean); 
    	})
    	.attr("cy", function(d) {
        return y(d.Title) + y.bandwidth() / 2;
			})
      .on("mouseover", showLabel)
      .on("mouseout", hideLabel);
    
    function showLabel() {
      var selection = d3.select(this);
      var pos = classToPos[selection.attr("class")];
      
      d3.select(this.parentNode).append("text")
        .attr("x", function(d) { return x(d[pos]); })
        .attr("y", function(d) { return y(d.Title) + y.bandwidth() / 2; })
        .attr("dy", "-1em")
        .attr("text-anchor", "middle")
        .text(function(d) {
        	return d3.format(".2s")(d[pos]);
      	});
    }
    
    function hideLabel(d) {
      d3.select(this.parentNode).select("text").remove();
    }
    
    

}