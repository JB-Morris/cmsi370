
var count = 0;

var Items = {
    /**
     * Constant for the left mouse button.
     */
    LEFT_BUTTON: 1,

    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    setDrawingArea: function (jQueryElements) {
        jQueryElements
            .addClass("drawing-area")
            // "this" is Items.
            .click(this.spawnItem)
            .mousemove(this.trackDrag)

            // We conclude drawing on either a mouseup or a mouseleave.
            .mouseup(this.endDrag)
            .mouseleave(this.endDrag);
    },

    ///**
    // * Utility function for disabling certain behaviors when the drawing
    // * area is in certain states.
    // */
    //setupDragState: function () {
    //    $(".drawing-area .box")
    //        .unbind("mousemove")
    //        .unbind("mouseleave");
    //},

    spawnItem: function(event) {
      if(event.which === Items.LEFT_BUTTON) {
          this.spawnedItem = $("<div class='box' style='width: 200px; height: 200px; left: 0px; top: 0px'>Item</div>")
              .appendTo(this)
      }
        this.spawnedItem
            .mousemove(Items.highlight)
            .mouseleave(Items.unhighlight)
            .mousedown(Items.startMove);

    },
    /**
     * Begins a box draw sequence.
     */

    //startDraw: function (event) {
    //    // We only respond to the left mouse button.
    //    if (event.which === Items.LEFT_BUTTON) {
    //        // Add a new box to the drawing area.  Note how we use
    //        // the drawing area as a holder of "local" variables
    //        // ("this" as standardized by jQuery).
    //        //console.log("before: ");
    //        //console.log(this);
    //        this.anchorX = event.pageX;
    //        this.anchorY = event.pageY;
    //        //console.log("after: ");
    //        //console.log(this.anchorX);
    //        this.drawingBox = $("<div></div>")
    //            .appendTo(this)
    //            .addClass("box")
    //            .offset({ left: this.anchorX, top: this.anchorY });
    //        //console.log(drawingBox);
    //        //console.log(this);
    //
    //        // Take away the highlight behavior while the draw is
    //        // happening.
    //        Items.setupDragState();
    //    }
    //},

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    trackDrag: function (event) {
        // Don't bother if we aren't tracking anything.
        //console.log(this.drawingBox);
        if (this.drawingBox) {

            //console.log(this);
            // Calculate the new box location and dimensions.  Note how
            // this might require a "corner switch."
            var newOffset = {
                left: (this.anchorX < event.pageX) ? this.anchorX : event.pageX,
                top: (this.anchorY < event.pageY) ? this.anchorY : event.pageY
            };

            this.drawingBox
                .offset(newOffset)
                .width(Math.abs(event.pageX - this.anchorX))
                .height(Math.abs(event.pageY - this.anchorY));
        } else if (this.movingBox) {
            // Reposition the object.
            this.movingBox.offset({
                left: event.pageX - this.deltaX,
                top: event.pageY - this.deltaY
            });
        }
        var mouseX = event.pageX;
        var mouseY = event.pageY;
        if (mouseY + 50 > 400 && mouseY - 50 < 600 && mouseX - 50 < 400) {
            $(event.target).addClass("trash-highlight");
        }
        if(mouseY + 50 < 400 || mouseY - 50 > 600 || mouseX - 50 > 400) {
            $(event.target).removeClass("trash-highlight");
        }

        event.preventDefault();
    },

    /**
     * Concludes a drawing or moving sequence.
     */
    endDrag: function (event) {
        if (this.drawingBox) {
            // Finalize things by setting the box's behavior.
            this.drawingBox
                .mousemove(Items.highlight)
                .mouseleave(Items.unhighlight)
                .mousedown(Items.startMove);

            // All done.
            this.drawingBox = null;
        } else if (this.movingBox) {
            var mouseX = event.pageX;
            var mouseY = event.pageY;
            if (mouseY + 50 > 400 && mouseY - 50 < 600 && mouseX - 50 < 400) {
                $(event.target).remove();
                count = count + 1;
                console.log(count);
                $("#counter").text(count);
                console.log("bye!");
            }

            // Change state to "not-moving-anything" by clearing out
            // this.movingBox.
            this.movingBox = null;
        }

        // In either case, restore the highlight behavior that was
        // temporarily removed while the drag was happening.
        $(".drawing-area .box")
            .removeClass("box-highlight")
            .mousemove(Items.highlight)
            .mouseleave(Items.unhighlight);
    },

    /**
     * Indicates that an element is highlighted.
     */
    highlight: function () {
        $(this).addClass("box-highlight");
    },

    /**
     * Indicates that an element is unhighlighted.
     */
    unhighlight: function () {
        $(this).removeClass("box-highlight");
    },

    /**
     * Begins a box move sequence.
     */
    startMove: function (event) {
        // We only move using the left mouse button.
        if (event.which === Items.LEFT_BUTTON) {
            // Take note of the box's current (global) location.
            var jThis = $(this),
                startOffset = jThis.offset(),

            // Grab the drawing area (this element's parent).
            // We want the actual element, and not the jQuery wrapper
            // that usually comes with it.
                parent = jThis.parent().get(0);

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            parent.movingBox = jThis;
            parent.deltaX = event.pageX - startOffset.left;
            parent.deltaY = event.pageY - startOffset.top;

            // Take away the highlight behavior while the move is
            // happening.
            //Items.setupDragState();

            // Eat up the event so that the drawing area does not
            // deal with it.
            event.stopPropagation();
        }
    }

};

