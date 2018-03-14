function peopleChart(topic,regionCode,RegionName){

 	var topicID="#"+topic+"Small";
 	var pickedRegLabel="#"+ topic + "PickedReg"
    var dataSilhouette=dataTot.filter(function(d){return d.Indicator==topic && d.Region==regionCode;})

    var text1;
    var text2;
    if (dataSilhouette[0].decile==""){
    	text1 =" "
    	text2 = "";
    }else if (dataSilhouette[0].decile=="1"){
    	text1 ="a "
    	text2 = "b c d e f G H I J";
    }else  if (dataSilhouette[0].decile=="2"){
    	text1 ="a b"
    	text2 = " c d e f G H I J";
    }else if (dataSilhouette[0].decile=="3"){
    	text1 ="a b c"
    	text2 = " d e f G H I J";
    }else if (dataSilhouette[0].decile=="4"){
    	text1 ="a b c d"
    	text2 = " e f G H I J";
    }else if (dataSilhouette[0].decile=="5"){
    	text1 ="a b c d e"
    	text2 = " f G H I J";
    }else if (dataSilhouette[0].decile=="6"){
    	text1 ="a b c d e f"
    	text2 = " G H I J";
    }else if (dataSilhouette[0].decile=="7"){
    	text1 ="a b c d e f G"
    	text2 = " H I J";
    }else if (dataSilhouette[0].decile=="8"){
    	text1 ="a b c d e f G H"
    	text2 = "I J";
    }else if (dataSilhouette[0].decile=="9"){
    	text1 ="a b c d e f G H I"
    	text2 = " J";
    }else if (dataSilhouette[0].decile=="10"){
    	text1 ="a b c d e f G H I J"
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

  var textReg = "How does " + RegionName + " rank compared to others?"
   d3.select(pickedRegLabel).selectAll("*").remove();
    if(dataSilhouette[0].decile==""){
    	d3.select(pickedRegLabel)
		.append("tspan")
          .html( "" )
    }else{
    	d3.select(pickedRegLabel)
		.append("tspan")
          .html( textReg )

    }
}