//JS from baazar utilized

(function ($) {
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

        spawnItem: function (event) {
            if (event.which === Items.LEFT_BUTTON) {
                this.spawnedItem = $("<div class='box' style='width: 200px; height: 200px; left: 0px; top: 0px'>Item</div>")
                    .appendTo(this)
            }
            this.spawnedItem
                .mousemove(Items.highlight)
                .mouseleave(Items.unhighlight)
                .mousedown(Items.startMove);

        },


        trackDrag: function (event) {
            if (this.movingBox) {
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
            if (mouseY + 50 < 400 || mouseY - 50 > 600 || mouseX - 50 > 400) {
                $(event.target).removeClass("trash-highlight");
            }

            event.preventDefault();
        },

        /**
         * Concludes a drawing or moving sequence.
         */
        endDrag: function (event) {
            if (this.movingBox) {
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
    $.fn.Items = function() {
        Items.setDrawingArea(this);
    };

}( jQuery));



$(function () {




    $('#save-new-character').click(function () {
        var charInput = $("#CharNameInput").val();
        var classInput = $("#CharClassInput").val();
        var maleRadio = $('#MaleRadio:checked').val();
        var femaleRadio = $('#FemaleRadio:checked').val();
        var genderInput;
        if (maleRadio == "MALE") {
            genderInput = maleRadio;
        } else if (femaleRadio == "FEMALE") {
            genderInput = femaleRadio;
        } else {
            genderInput = null;
        }
        var charLevel = $('#InputCharLevel').val();
        var charMoney = $('#InputCharMoney').val();

        $.ajax({
            type: 'POST',
            url: "http://lmu-diabolical.appspot.com/characters",
            data: JSON.stringify({
                name: charInput,
                classType: classInput,
                gender: genderInput,
                level: charLevel,
                money: 0
            }),
            contentType: "application/json",
            dataType: "json",
            accept: "application/json",
            complete: function (jqXHR, textStatus) {
                // The new character can be accessed from the Location header.
                console.log("You may access the new character at:" + jqXHR.getResponseHeader("Location"));
            }
        });
    });



//Table
    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters",

        function (characters) {

            $("tbody").append(characters.map(function (character) {

                var tr = $(".character-template").clone();
                tr.find(".avatar-container").append(
                    $("." + character.gender.toLowerCase() + ".avatar").clone());
                tr.find(".name").text(character.name);
                tr.find(".class").text(character.classType);
                tr.find(".gender").text(character.gender);
                tr.find(".level").text(character.level);
                tr.find(".money").text(character.money);
                //tr.attr('id', character.id);
                //console.log(tr.find('.buttons').children().each);
                tr.find('.buttons').children().each(function () {
                    //console.log(character.id);
                    //console.log(this);
                    $(this).attr('id', character.id);
                });
                //console.log(character);
                return tr;

            }));
            $('.DeleteButtonClass').click(function () {
                var trID = $(this).attr('id');
                //console.log(trID);



                $.ajax({
                    type: 'DELETE',
                    url: "http://lmu-diabolical.appspot.com/characters/" + trID,
                    success: function (data, textStatus, jqXHR) {
                        console.log("Gone baby gone.");
                    }
                });

            });


            $('.ViewButtonClass').click(function () {
                var trID = $(this).attr('id');
                $.getJSON(
                    "http://lmu-diabolical.appspot.com/characters/" + trID,

                    function (character) {
                        var cardName = character.name;
                        var cardClass = character.classType;
                        var cardGender = character.gender;
                        var cardLevel = character.level;
                        var cardMoney = character.money;
                        console.log(cardName);
                        $('#CardName span').html(" " + cardName);
                        $('#CardClass span').html(" " + cardClass);
                        $('#CardGender span').html(" " + cardGender);
                        $('#CardLevel span').html(" " + cardLevel);
                        $('#CardMoney span').html(" " + cardMoney);
                        $('#EditNameInput').attr('placeholder', character.name);
                        $('#EditClassInput').attr('placeholder', character.classType);
                        $('#EditLevelInput').attr('placeholder', character.level);
                        $('#EditmoneyInput').attr('placeholder', character.money);


                    });
            });

            $('#save-edited-character').click(function () {
                var trID = $('.DeleteButtonClass').attr('id');
                //alert(trID);
                var charInput = character.name;
                var classInput = character.classType;
                var genderInput = character.gender;
                var charLevel = character.level;
                var charMoney = character.money;
                var maleRadio = $('#EditMaleRadio:checked').val();
                var femaleRadio = $('#EditFemaleRadio:checked').val();
                if ($("#EditNameInput").val() === null) {
                    charInput = character.name;
                } else {
                    charInput = $("#EditNameInput").val();
                }
                if ($("#EditClassInput").val() === null) {
                    classInput = character.classType;
                } else {
                    classInput = $("#EditClassInput").val();
                }
                if (maleRadio == "MALE") {
                    genderInput = maleRadio;
                } else if (femaleRadio == "FEMALE") {
                    genderInput = femaleRadio;
                } else {
                genderInput = character.gender;
                }
                if ($("#EditLevelInput").val() === null) {
                    charLevel = character.level;
                } else {
                    charLevel = $("#EditLevelInput").val();
                }
                if ($("#EditMoneyInput").val() === null) {
                    charMoney = character.money;
                } else {
                    charMoney = $("#EditMoneyInput").val();
                }
                alert(charInput);
                alert(classInput);
                alert(genderInput);
                alert(charLevel);
                alert(charMoney);

                $.ajax({
                    type: 'PUT',
                    url: "http://lmu-diabolical.appspot.com/characters/" + trID,
                    data: JSON.stringify({
                        id: trID,
                        name: charInput,
                        classType: classInput,
                        gender: genderInput,
                        level: charLevel,
                        money: charMoney
                    }),
                    contentType: "application/json",
                    dataType: "json",
                    accept: "application/json",
                    success: function (data, textStatus, jqXHR) {
                        console.log("Done: no news is good news.");
                    }
                });

            });

        });




    $('#spawn-item-button').click(function () {
        //alert("Item Spawned!");
        var item = "<td>item</td>";
        item.appendTo($("#item-table"));
    });

});