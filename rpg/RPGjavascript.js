$(function () {


    $('#save-new-character').click(function () {
        var charInput = $("#CharNameInput").val();
        var classInput = $("#CharClassInput").val();
        var maleRadio = $('#MaleRadio:checked').val();
        var femaleRadio = $('#FemaleRadio:checked').val();
        var genderInput;
        // JD: 18
        if (maleRadio == "MALE") { // JD: 17
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
                money: 0 // JD: 6 ...I guess it was intentional then?
            }),
            contentType: "application/json",
            dataType: "json",
            accept: "application/json",
            complete: function (jqXHR, textStatus) { // JD: 4
                // The new character can be accessed from the Location header.
                console.log("You may access the new character at:" + jqXHR.getResponseHeader("Location"));
                alert("Character created! You may create an additional character or close the modal.")
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
                // JD: 20
                //tr.attr('id', character.id);
                //console.log(tr.find('.buttons').children().each);
                tr.find('.buttons').children().each(function () {
                    //console.log(character.id);
                    //console.log(this);
                    $(this).attr('id', character.id); // JD: 19
                });
                //console.log(character);
                return tr;

            }));
            $('.DeleteButtonClass').click(function () {
                var trID = $(this).attr('id');
                // JD: 20
                //console.log(trID);

// JD: 21

                $.ajax({
                    type: 'DELETE',
                    url: "http://lmu-diabolical.appspot.com/characters/" + trID,
                    success: function (data, textStatus, jqXHR) { // JD: 4
                        alert("Character Deleted");
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
                        // JD: 22
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
                var charInput = character.name; // JD: 3 (what is character's value?)
                var classInput = character.classType;
                var genderInput = character.gender;
                var charLevel = character.level;
                var charMoney = character.money;
                var maleRadio = $('#EditMaleRadio:checked').val();
                var femaleRadio = $('#EditFemaleRadio:checked').val();
                if ($("#EditNameInput").val() === null) { // JD: 23
                    charInput = character.name;
                } else {
                    charInput = $("#EditNameInput").val();
                } // JD: Consider...   charInput = $("#EditNameInput").val() || character.name;
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
                // JD: 20
                //alert(charInput);
                //alert(classInput);
                //alert(genderInput);
                //alert(charLevel);
                //alert(charMoney);

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



    // JD: 24
    $('#spawn-item-button').click(function () {
        alert("Item Spawned!");
    });

});