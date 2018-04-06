function peopleChart(topic,regionCode,RegionName){

 	var topicID="#"+topic+"Small";
 	var pickedRegLabel="#"+ topic + "PickedReg"
  var dataSilhouette=dataTot.filter(function(d){return d.Indicator==topic && d.Region==regionCode;})

  if(dataSilhouette!=""){
    var text1;
    var text2;
    if (dataSilhouette[0].quartile==""){
    	text1 =" "
    	text2 = "";
    }else if (dataSilhouette[0].quartile=="1"){
    	text1 ="a "
    	text2 = "b c d";
    }else  if (dataSilhouette[0].quartile=="2"){
    	text1 ="a b"
    	text2 = " c d";
    }else if (dataSilhouette[0].quartile=="3"){
    	text1 ="a b c"
    	text2 = " d";
    }else if (dataSilhouette[0].quartile=="4"){
    	text1 ="a b c d"
    	text2 = "";
    }

   
   d3.select(topicID).selectAll("*").remove();

   d3.select(topicID)
		.append("tspan")
		.attr("class","weepeople migrant")
          .html( text1 )

   d3.select(topicID)
		.append("tspan")
		.attr("class","weepeople")
          .html( text2 )

  var textReg = "How does " + RegionName + " rank?"
   d3.select(pickedRegLabel).selectAll("*").remove();
    if(dataSilhouette[0].quartile==""){
    	d3.select(pickedRegLabel)
		.append("tspan")
          .html( "" )
    }else{
    	d3.select(pickedRegLabel)
		.append("tspan")
          .html( textReg )

    }
  }
  else{
    
      d3.select("#ShareMigPickedReg").selectAll("*").remove();
      d3.select("#ShareMigSmall").selectAll("*").remove();

      d3.select("#lengthStayPickedReg").selectAll("*").remove();
      d3.select("#lengthStaySmall").selectAll("*").remove();

      d3.select("#eduattainPickedReg").selectAll("*").remove();
      d3.select("#eduattainSmall").selectAll("*").remove();

      d3.select("#UnempPickedReg").selectAll("*").remove();
      d3.select("#UnempSmall").selectAll("*").remove();

      d3.select("#PartRatePickedReg").selectAll("*").remove();
      d3.select("#PartRateSmall").selectAll("*").remove();

      d3.select("#overQualRatePickedReg").selectAll("*").remove();
      d3.select("#overQualRateSmall").selectAll("*").remove();
  }
}