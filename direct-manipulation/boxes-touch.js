var boxIDs = [];

var drawingBoxes = [];

var BoxesTouch = {



    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */


    setDrawingArea: function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior.
        jQueryElements
            .addClass("drawing-area")
            // Event handler setup must be low-level because jQuery

            //Adds event listener to drawing area in general

            //element.addEventListener("touchstart", BoxesTouch.startDraw, false);
            .on("touchstart", BoxesTouch.setBoxIDs)
            .on("touchstart", BoxesTouch.startDraw)

            //.on("touchmove", BoxesTouch.trackDrag)



            .each(function (index, element) {
                element.addEventListener("touchmove", BoxesTouch.trackDrag, false);
                element.addEventListener("touchend", BoxesTouch.endDrag, false);
                //.on("touchmove", BoxesTouch.trackDrag, false)
                //.on("touchend", BoxesTouch.endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startMove, false);
                element.addEventListener("touchend", BoxesTouch.unhighlight, false);
                //.on("touchstart", BoxesTouch.startMove, false);
                //.on("touchend", BoxesTouch.unhighlight, false);
            });
    },

    setBoxIDs: function(event){
        $.each(event.originalEvent.changedTouches, function (index, touch) {
            var ID = touch.identifier;
            //console.log("hello");
            //console.log(touch);
            boxIDs.push(ID);
            //console.log(boxIDs);
            var value = {
                anchorX : 0,
                anchorY : 0,
                drawingBox : null
            }
            drawingBoxes.push(value);
            //console.log("anchorX");
            //console.log(value.anchorX);
        });
    },
    //for each touch, assign the touch ID to the box object
    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    setupDragState: function () {
        $(".drawing-area .box")
            .unbind("touchstart")
            .unbind("touchleave");
    },

    startDraw: function (event) {
        //setBoxIDs(event);
        $.each(event.originalEvent.changedTouches, function (index, touch) {
            if (!touch.target.movingBox) {

                //console.log(this);

                drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorX = touch.pageX;
                drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorY = touch.pageY;
                //console.log($("#drawing-area").anchorX);
                //console.log($("#drawing-area"));
                drawingBoxes[boxIDs.indexOf(touch.identifier)].drawingBox = $("<div></div>")
                    .appendTo($("#drawing-area"))
                    .addClass("box")
                    .offset({left: drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorX, top: drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorY});

                // Take away the highlight behavior while the draw is
                // happening.
                BoxesTouch.setupDragState();
            }
        });
    },


    trackDrag: function (event) {
        //console.log(event.changedTouches);
        $.each(event.changedTouches, function (index, touch) {
            //console.log(this);
            // Don't bother if we aren't tracking anything.
                if (touch.target.movingBox) {
                    // Reposition the object.
                    touch.target.movingBox.offset({
                        left: touch.pageX - touch.target.deltaX,
                        top: touch.pageY - touch.target.deltaY
                    });

                    var touchX = touch.pageX;
                    var touchY = touch.pageY;
                    var touchedBoxWidth = $(touch.target).width();
                    var touchedBoxHeight = $(touch.target).height();
                    var trash
                    if (touchX + touchedBoxWidth/2 > 520 && touchY + touchedBoxHeight/2 > 520) {
                        $(touch.target).addClass("trash-highlight");
                    }
                    if (touchX + touchedBoxWidth/2 < 520 || touchY + touchedBoxHeight/2 < 520) {
                        $(touch.target).removeClass("trash-highlight");
                    }
                }else if (drawingBoxes[boxIDs.indexOf(touch.identifier)].drawingBox) {
                    //console.log("tracking");
                    // Calculate the new box location and dimensions.  Note how
                    // this might require a "corner switch."
                    var newOffset = {
                        left: (drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorX < touch.pageX) ? drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorX : touch.pageX,
                        top: (drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorY < touch.pageY) ? drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorY : touch.pageY

                };
                    drawingBoxes[boxIDs.indexOf(touch.identifier)].drawingBox
                        .offset(newOffset)
                        .width(Math.abs(touch.pageX - drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorX))
                        .height(Math.abs(touch.pageY - drawingBoxes[boxIDs.indexOf(touch.identifier)].anchorY));
            }
            //PSEUDO CODE: while box overlaps with trash bin, apply red highlight class
            //while (touch.target.deltaX == trashX && touch.target.deltaY == trashY)
        });

        // Don't do any touch scrolling.
        event.preventDefault();
    },

    /**
     * Concludes a drawing or moving sequence.
     */
    endDrag: function (event) {

        $.each(event.changedTouches, function (index, touch) {

            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                var touchX = touch.pageX;
                var touchY = touch.pageY;
                var touchedBoxWidth = $(touch.target).width();
                var touchedBoxHeight = $(touch.target).height();
                //var trash
                if (touchX + touchedBoxWidth/2 > 520 && touchY + touchedBoxHeight/2 > 520) {
                    $(touch.target).remove();
                }
                touch.target.movingBox = null;
            }else if (drawingBoxes[boxIDs.indexOf(touch.identifier)].drawingBox) {
                console.log(drawingBoxes[boxIDs.indexOf(touch.identifier)].drawingBox)
                drawingBoxes[boxIDs.indexOf(touch.identifier)].drawingBox
                    //.touchend(BoxesTouch.unhighlight)
                    .on("touchend", BoxesTouch.unhighlight)
                    //.touchstart(BoxesTouch.startMove)
                    .on("touchstart", BoxesTouch.startMove);
                drawingBoxes[boxIDs.indexOf(touch.identifier)].drawingBox = null;
                console.log("TOUCH END!");
                //for()

            }
            if(boxIDs.indexOf(touch.identifier) != -1){
                boxIDs.splice(boxIDs.indexOf(touch.identifier), 1);
                drawingBoxes.splice(boxIDs.indexOf(touch.identifier), 1);
            }

            //if (touch.target.movingBox.offset()  === $("#trash-bin").offset()) {
            //    $("#trash-bin", event).droppable(touch.target.remove());
            //    console.log("Bye!!");
            //}

        });
        //PSEUDO CODE: if box and trash can overlap, delete box: $(this).remove()
    },

    /**
     * Indicates that an element is unhighlighted.
     */
    unhighlight: function () {
        $(this).removeClass("box-highlight");
        $(this).removeClass("trash-highlight");
        $("#trash-bin").removeClass("trash-highlight");
    },

    /**
     * Begins a box move sequence.
     */
    startMove: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            console.log(touch.target);
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            $("#trash-bin").addClass("trash-highlight");

            // Take note of the box's current (global) location.
            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            touch.target.movingBox = jThis;
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    }//,

    //createBox: function(event) {
    //    if(event.target = "#drawing-area"){
    //        console.log("Hello!");
    //        $.each(event.changedTouches, function (index, touch) {
    //
    //            var firstCornerX = touch.pageX;
    //            var firstCornerY = touch.pageY;
    //            console.log("x = " + firstCornerX);
    //            console.log("y = " + firstCornerY);
    //
    //        });
    //    }
    //}

};

//PSEUDO CODE: If user touches "drawing-area" create a box
//will need to utilize touch id
//$("#drawing-area").append("<div class = box style="width: " + w + "px; height: " + h + "px; left: " + w + "px; top: " + t + "px"></div>
//associate each box with a touch id and maintain a seperate data structure (possibly wrapped in a function) to map all of them