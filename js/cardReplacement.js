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
}