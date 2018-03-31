function cardReplacement(){
	
	ccSVG.selectAll("*").remove();
  ccSVG.append("g")
          .attr("transform", "translate(" + 0 + "," + 0 + ")");
//
    /**ccSVG.append("img")
        .attr("xlink:href", "/pic/jad-limcaco-256486.jpg")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", ccWidth)
        .attr("height", ccHeight**/     
     ccSVG.selectAll("g").append("svg:image")
        //.attr("xlink:href", "pic/jadlimcaco256486.jpg")

        .attr("xlink:href", "pic/test-01.png")
       // .attr("width", ccWidth)
        .attr("height", ccHeight+ccMargin.top+ccMargin.bottom);

    
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