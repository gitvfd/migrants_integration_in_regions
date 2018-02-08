function updateRegionCard(d){
    if(d!=undefined){
		document.getElementById("regionName").innerHTML=d.properties.TL2_NAME;
	    //d3.select("#intro").style("visibility","hidden")

	    countryCardFunct(dataTot.filter(function(k){return d.properties.TL2_CODE==k.Region}));
    }
    else
    	cardReplacement();

     d3.select("#graph").selectAll("circle").attr("r",4).style("opacity", opacityCircles)
     .attr('fill',function(d){
         	if(d.CountryMean>d.FB)
            	return "#8EA4B1";
          	else if (d.CountryMean<=d.FB)
            	return "#993484";
         });

    if(d!=undefined)
	     d3.select("#graph")
	 		.selectAll(".regions."+d.properties.TL2_CODE)
	 		.attr("r",function(d) {
	         	if(d.FB==""||d.CountryMean==""){
	         		return 0;
	         	}else 
	            	return 15;
	         })
	 		.attr('fill','#F68385').style("opacity", 1);;

}

function updateMap(w,i) {
	map.selectAll(".region")
      .attr("fill", function(d) { 
          var colorReg="#fff";
          shareMigData.forEach(function(v){
            if(v.Region==d.properties.TL2_CODE){
              if(v.FB!="")
                colorReg = color(v.FB); 
              else
                colorReg="#fff"
            }
          })
          return colorReg;
        });


    world.selectAll(".world")
      .style("fill","#deeaf1");

	var d;

	regionMap.forEach(function(v){
		if(v.properties.TL2_CODE==w.data.Region){
			d=v;
		}
	})

  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];

    centered = d;
	k=6
  } else {
    x = width / 2;
    y = height_usage / 2;
    k=1
    centered = null;
  }
	zoomLevel=k;
	
	selRegion=d.properties.TL2_CODE;

	testclass="."+d.properties.TL2_CODE;
	  map.selectAll("path")
	      .classed("active", centered && function(d) { return d === centered; });
	  map.selectAll(testclass)
		  .attr("fill","#E73741");

	 map.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2 + "," + height_usage / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1 / k + "px");


	  updateRegionCard(d);

}