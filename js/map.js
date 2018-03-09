// https://bl.ocks.org/mbostock/9656675
//https://bl.ocks.org/puzzler10/49f13307e818ea9a909ba5adba5b6ed9
//https://bl.ocks.org/mbostock/2206590`
//https://bl.ocks.org/lorenzopub/494ef5270075e1e8fc314dda86c7fb9f

//https://1wheel.github.io/graph-scroll/

//https://bl.ocks.org/lorenzopub/494ef5270075e1e8fc314dda86c7fb9f
var shareMigData;
var zoomLevel=1;
var selRegion; //placeholder to update circle size and colors



var divMap = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

//function map(){
    var format = d3.format(",.1f");
    var margin = 20,centered;
    
    width = document.getElementById("regionalMap").offsetWidth,
    height_usage= 400;


    active = d3.select(null);

  	/**var zoom = d3.zoom()
      	.scaleExtent([1, 6])
  	    .on("zoom", zoomed);**/


    var yKey = d3.scaleLinear()
    .domain([0,50])
    .rangeRound([200, 350]);

  	var projection = d3.geoEquirectangular()
  	            .scale(width/7.75)
  	            .translate([(width) / 2, 1.1*height_usage/2])
  	        	.precision(.01);

  	var path = d3.geoPath()
                     .projection(projection);

  	var svg = d3.select("#regionalMap").append("svg")
  	    .attr("width", width)
  	    .attr("height", height_usage)
  	    .on("click", stopped, true);

    	svg.append("rect")
    	    .attr("class", "background")
    	    .attr("width", width)
    	    .attr("height", height_usage)
    	    .on("click", reset);

    var color = d3.scaleThreshold()
                  .range(['#9bc4d3','#90bac9','#85b0c0','#79a7b7','#6e9cae','#6293a5','#57899c','#4c8193','#40778a'])
                  //.range(d3.schemeBlues[9]);


//ACTIVATE OR DISACTIVATE ZOOM functions
  	//svg.call(zoom) 



    var world=svg.append("g")

    d3.json("data/world.json", function(error, worldData) {
                world.append("g")
                  .attr("id", "world")
                  .selectAll("path")
                    .data(worldData.features)
                  .enter().append("path")
                    .attr("class","world")
                    .attr("d", path);
    });


    var map=svg.append("g")

     
     d3.json("data/TL2_OECD_2016_OECD.json", function(error, worldData) {
        					map.append("g")
  					      .attr("id", "region")
  					    	.selectAll("path")
  					      	.data(worldData.features)
  					    	  .enter().append("path")
                    .attr("class", function(d){ return "region " + d.properties.TL2_CODE; })
  					      	.attr("d", path)
                    .on("click", clicked)
  					      	.on("mouseover", function(d) {
                      		d3.select(this).style("opacity",0.5);
                          divMap.transition()    
                                          .duration(200)    
                                          .style("opacity", .9);    
                          divMap.html(d.properties.TL2_NAME )  
                              .style("left", (d3.event.pageX) +28 + "px")   
                              .style("top", (d3.event.pageY - 28) + "px");  

                      		})

  					      	.on("mouseout", function(d) {

                          if(d3.select(this).attr("class").indexOf("active")>0){
                            d3.select(this).attr("fill","#E73741");
                            d3.select(this).style("opacity",1);
                          }
                          else
                            d3.select(this).style("opacity",1);
                            
                          divMap.transition()    
                              .duration(500)    
                              .style("opacity", 0); 
                      		})

          		
          		map.append("path")
        					.datum(topojson.mesh(worldData, worldData, function(a, b) { return a !== b; }))
      					.attr("id", "state-borders")
        					.attr("d", path)
                colorRegion();
                

    });



    function clicked(d) {
      selRegion=d.properties.TL2_CODE;

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

      var x, y, k;

      if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];

          k=6;
        centered = d;
        } else {
        x = width / 2;
        y = height_usage / 2;
       
          k=1;
        centered = null;
      }

      zoomLevel=k;

      map.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });

      map.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height_usage / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1 / k + "px");

      updateRegionCard(d);

    }

    function reset() {
      selRegion="";
      map.selectAll("path").classed("active", false);


      zoomLevel=1;

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
      
      active = d3.select(null);

      map.transition()
          .duration(750)
          .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + 1 + ")translate(" + -0 + "," + -0+ ")");


      world.transition()
          .duration(750)
          .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + 1 + ")");

      world.selectAll("path")
      .transition()
          .duration(750)
        .style("fill","#ffffff");

      updateRegionCard();
      
      document.getElementById("regionName").innerHTML="Select a region";
      //d3.select("#intro").style("visibility","visible")
    }

    function zoomed() {
      if(d3.event.transform.k==1){
        world.selectAll("path")
          .style("fill","#ffffff");
      }
      else{

    world.selectAll(".world")
      .style("fill","#deeaf1");
      }

     map.style("stroke-width", 1.5 / d3.event.scale + "px");
      map.attr("transform", "translate(" + d3.event.transform.x + ',' + d3.event.transform.y  + ') scale(' + d3.event.transform.k + ')')
      world.attr("transform", "translate(" + d3.event.transform.x + ',' + d3.event.transform.y  + ') scale(' + d3.event.transform.k + ')')
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
      if (d3.event.defaultPrevented) d3.event.stopPropagation();
  }


    function addKey(){
      var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(40,0)");

      g.selectAll("rect")
        .data(color.range().map(function(d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = yKey.domain()[0];
            if (d[1] == null) d[1] = yKey.domain()[1];
            return d;
          }))
        .enter().append("rect")
          .attr("width", 8)
          .attr("y", function(d) { return yKey(d[0]); })
          .attr("height", function(d) { return yKey(d[1]) - yKey(d[0]); })
          .attr("fill", function(d) { return color(d[0]); });
          
          g.append("rect")
          .attr("width", 8)
          .attr("y", 0.9*height_usage)
          .attr("height", 8)
          .attr("fill", "#ffffff")
          g.append("text")
          .attr("class", "caption")
          .attr("x", 15)
          .attr("y", 0.9*height_usage + 8 )
          .attr("fill", "#000")
          .attr("text-anchor", "start")
          .attr("font-weight", "normal")
          .text("No data available");;

      g.append("text")
          .attr("class", "caption")
          .attr("x", -20 )
          .attr("y", yKey.range()[0]-10)
          .attr("fill", "#000")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Share of migrants");

      g.call(d3.axisLeft(yKey)
          .tickSize(5)
          .tickFormat(function(yKey, i) { return d3.format(".0f")(i ? yKey : yKey) + "%"; })
          .tickValues(color.domain()))
        .select(".domain")
          .remove();
    }



  function colorRegion(){

        var maxCol=d3.max(dataTot.filter(function(d){return d.Indicator=="ShareMig"}), function(d) { return parseFloat(d.FB); })
        var minCol=d3.min(dataTot.filter(function(d){return d.Indicator=="ShareMig"}), function(d) { return parseFloat(d.FB); })
        color.domain(d3.range(minCol,maxCol,(maxCol-minCol)/8))
        shareMigData=dataTot.filter(function(d){return d.Indicator=="ShareMig"})
       
        addKey();
   
   //color.domain(d3.range(d3.min(ShareMigData, function(d) { return parseFloat(d.FB); }),d3.max(ShareMigData, function(d) { return parseFloat(d.FB); })))
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
                      })
  }
  
//}