function setupButtons() {

    d3.select('#toolbar')
      .selectAll('.button')
      .on('click', function () {

		// Remove active class from all buttons
        d3.selectAll('.button').classed('active', false);
        // Find the button just clicked
        var button = d3.select(this);

        // Set it as the active button
        button.classed('active', true);

        // Get the id of the button
        var buttonId = button.attr('id');
        
        if (buttonId== "contextBtn"){
console.log("test")
        }
        else if (buttonId== "eduBtn"){
console.log("test1")

        }
        else if (buttonId== "labourBtn"){
console.log("test2")

        }
   })
} ;    