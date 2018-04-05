function countryCardFunct(data){


    function showLabel() {
      var selection = d3.select(this);
      var pos = classToPos[selection.attr("class")];
      d3.select(this.parentNode).append("text")
        .attr("class","tooltipCircle")
        .attr("dy", "-0.5em")
        .attr("text-anchor", "middle")
        .text(function(d) {
            if(selection.attr("class")=="circleFB")
               return d3.format(".2s")(d.FB);
            else
               return d3.format(".2s")(d.NonFBCompValue);
        });
    }

    function hideLabel(d) {
      d3.select(this.parentNode).select(".tooltipCircle").remove();
    }


    function showDef(selection) {
      //var selection = d3.select(this);
     // console.log(selection)
      //var pos = classToPos[selection.attr("class")];
      //d3.select(this.parentNode).append("text")
    d3.select(this).attr("opacity",0.3)

    var xpos=d3.select(this).attr("x")
    var ypos=d3.select(this).attr("y")
    ccCard.append("text")
        .attr("class","labelIcon")
        .attr("x",xpos)
        .attr("y",ypos )
        .attr("dy", "-0.5em")
        .attr("text-anchor", "start")
        .text(function(d) {
            var originalTitle;

            data.forEach(function(d){
                if(d.Title==selection.indic)
                    originalTitle= d.subTitle;
            })
            return originalTitle;

        });
    }

    function hideDef(icon) {
    d3.select(this).attr("opacity",1)
      d3.selectAll(".labelIcon").remove();
    }    
        
	ccSVG.selectAll("*").remove();

	var ccCard= ccSVG.append("g")
          .attr("transform", "translate(" + ccMargin.left + "," + ccMargin.top + ")");

    
    data=data.filter(function(d){return d.Indicator!="ChangeShareMig"})
    
    if (data!=""){

     // need to rewrite so start, min, lowest are the same
        var classToPos = {
          "lollipop-start": "FB",
          "lollipop-end": "NonFBCompValue"
        }
        
        var legendLabels = [
          {label: "Foreign-Born", class: "lollipop-start"}/**, 
          {label: "Other category", class: "lollipop-end"}**/
        ];

        data.forEach(function(d){
        	if(d.Indicator=="ShareMig"){
        		d.Title="Amount of migrants";
                d.subTitle='Share of migrants in the working age population';
                d.FBTitle="Region";
                d.CountryMeanTitle='Country';
            }
        	if(d.Indicator=="lengthStay"){
        		d.Title="Length of migrants’ stay";
                d.subTitle='Length of migrants’ stay';
                d.FBTitle="Less than 10 years";
                d.CountryMeanTitle='More than 10 years';
            }
        	if(d.Indicator=="eduattain"){
        		d.Title="People with a higher degree";
                d.subTitle='Share of working age population with a higher degree';
                d.FBTitle="Foreign-Born";
                d.CountryMeanTitle='Native-Born';
            }
        	if(d.Indicator=="Unemp"){
        		d.Title="Unemployment";
                d.subTitle='Unmployment rate';
                d.FBTitle="Foreign-Born";
                d.CountryMeanTitle='Native-Born';
            }
        	if(d.Indicator=="PartRate"){
        		d.Title="People with a job or looking for work";
                d.subTitle='Share of people with a job or looking for work (participation rate)';
                d.FBTitle="Foreign-Born";
                d.CountryMeanTitle='Native-Born';
            }
        	if(d.Indicator=="overQualRate"){
        		d.Title="People who are over-qualified for the work they do";
                d.subTitle='Share of people who are over-qualified for their work';
                d.FBTitle="Foreign-Born";
                d.CountryMeanTitle='Native-Born';
            }
        })
        var padding = 0;
        
        var y = d3.scaleBand()
        	.domain(data.map(function(d) { return d.Title }))
        	.range([0, ccHeight])
        	.padding(padding);
        
        var maxFB=d3.max(data, function(d) { return d.FB })
        var maxNB=d3.max(data, function(d) { return d.NonFBCompValue })

        var x = d3.scaleLinear()
        	//.domain([0, d3.max([maxFB,maxNB])])
        	.domain([0, 100])
        	.range([2*ccMargin.left, ccWidth])
        	.nice();
        
        // code for positioning legend
        var legend = ccCard.append("g");
        
        var legendX = ccWidth / 2- 100;
        var legendY =  0;
        var spaceBetween = 150;
        
        var legendPosition = {
          x: legendX + 70,
          y: legendY - 4
        };
        
        // add circles
        /**legend.selectAll("circle")
        	.data(legendLabels) 
        .enter().append("circle")
        	.attr("cx", function(d, i) {
          	return legendPosition.x + spaceBetween * i;
        	})  
        	.attr("cy", legendPosition.y)
        	.attr("r", 5)
        	.attr("class", function(d) { return d.class });**/
        
        // add labels
       /** legend.selectAll("text")
        	.data(legendLabels)
        .enter().append("text")
          .attr("x", function(d, i) {
          	return legendPosition.x + spaceBetween * i + 10;
        	})  
        	.attr("y", legendPosition.y + 4)
        	.text(function(d) { return d.label });**/
        
        /**var yAxis = d3.axisLeft().scale(y)
        	.tickSize(0);**/
        
        var xAxis = d3.axisBottom().scale(x)
        	.tickFormat(function(d,i) {
            if (i == 0) {
                return 0;
              //return "%"
            } else {
            	return d3.format(".1s")(d); 
            }
          });
        
        var yAxisGroup = ccCard.append("g")
        	.attr("transform", "translate("+2*ccMargin.left+", 0)")
            .attr("class","yAxis")
        	.call(d3.axisLeft(y))
            .selectAll(".tick text")
            .call(wrapCountryCard, 100)
            .select(".domain").remove();    
        
        var xAxisGroup = ccCard.append("g")
            .attr("transform", "translate(0," + ccHeight+")")
            .attr("class","xAxis")
        	.call(xAxis);


        ccCard.append("text")
            .attr("id","xTitle")
            .attr("x",ccWidth+ ccMargin.right/2)
            .attr("y",ccHeight + ccMargin.bottom)
            .text("%");

        var iconTable=[{"indic":"Amount of migrants","img":"topic-society.svg"},{"indic":"Length of migrants’ stay","img":"indic-duration.svg"},{"indic":"People with a higher degree","img":"topic-education.svg"},{"indic":"Unemployment","img":"topic-unemployment.svg"},{"indic":"People with a job or looking for work","img":"topic-jobs.svg"},{"indic":"People who are over-qualified for the work they do","img":"topic-overqualif.svg"}]  
            
            ccCard.selectAll("img")
                .data(iconTable)
                .enter().append("svg:image")
                .attr("class","svg-icon")
                .attr("xlink:href", function(d){return "pic/"+d.img;})
                .attr("width", 25)
                .attr("height", 25)
                .attr("x", -ccMargin.left/1.5)
                .attr("y",function(d){return y(d.indic) +7.5;})
                .on("mouseover",showDef)
                .on("mouseout",hideDef);

        legend.append("text")
            .attr("class", "x-title")
            .attr("x", legendX)
            .attr("y", legendY)
            .text(data[0].RegionName);
        
        var lineGenerator = d3.line();
        var axisLinePath = function(d) {
          return lineGenerator([[x(d) + 0.5, 0], [x(d) + 0.5, -ccHeight]]);
        };
         
        var axisLines = xAxisGroup.selectAll("path")
        	.data(x.ticks(10))
        .enter().append("path")
        	.attr("class", "grid-line")
        	.attr("d", axisLinePath);
        
        var lollipopLinePath = function(d) {
          return lineGenerator([[x(d.FB), y(d.Title) + (y.bandwidth() / 2) ], [x(d.NonFBCompValue), y(d.Title) + (y.bandwidth() / 2)]]);
        };
        
       	var lollipopsGroup = ccCard.append("g").attr("class", "lollipops");

        var lollipops = lollipopsGroup.selectAll("g")
        	.data(data)
        .enter().append("g")
        	.attr("class", "lollipop")
        
        lollipops.append("path")
        	.attr("class", "lollipop-line")
        	.attr("d", lollipopLinePath);
        
        var FBCircles = lollipops.append("g")
        	.attr("class", "lollipop-start")
            .attr("transform", function(d){return "translate(" +x(d.FB)+ ","+ (y(d.Title) + y.bandwidth() / 2) + ")"});
            
            FBCircles.append("circle")
                .attr("class", "circleFB")
                .attr("r", function(d){
                    if(d.FB=="")
                        return 0;
                    else
                        return 5;

                })
            	.on("mouseover", showLabel)
                .on("mouseout", hideLabel);
        
          FBCircles.append("text")
            .attr("class","circleLabel")
            .attr("dy", "1.25em")
            .attr("text-anchor",function(d){
                if (parseFloat(d.FB)>parseFloat(d.NonFBCompValue))
                    return "start"
                else 
                    return "end"
            })
            .text(function(d){
                if(d.FB!="")
                    return d.FBTitle;
                else
                    return "";
                })
      
        var CountryMeanCircles = lollipops.append("g")
        	.attr("class", "lollipop-end")

            .attr("transform", function(d){return "translate(" +x(d.NonFBCompValue)+ ","+ (y(d.Title) + y.bandwidth() / 2) + ")"});

            CountryMeanCircles.append("circle")
                .attr("class", "circleCM")
                .attr("r", function(d){
                    if(d.NonFBCompValue=="")
                        return 0;
                    else
                        return 5;

                })
                .on("mouseover", showLabel)
                .on("mouseout", hideLabel);
        

          CountryMeanCircles.append("text")
            .attr("class","circleLabel")
            .attr("dy", "1.25em")
            .attr("text-anchor", function(d){
                if (parseFloat(d.FB)>parseFloat(d.NonFBCompValue))
                    return "end"
                else
                 return "start"
            })
            .text(function(d){
                if(d.NonFBCompValue!="")
                    return d.CountryMeanTitle;
                else
                    return "";
            })


    }
}