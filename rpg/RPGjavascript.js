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
                alert(trID);
                var charInput;
                var classInput;
                var genderInput;
                var charLevel;
                var charMoney;
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
                    genderInput = null;
                }
                if ($("#EditLevelInput").val() === null) {
                    charLevel = character.level;
                } else {
                    charLevel = $("#EditLevelInput").val();
                }
                if ($("#EditMoneyInput").val() === null) {
                    charMoney = character.money;
                } else {
                    charMoney = $("#EditmoneyInput").val();
                }

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
        alert("Item Spawned!");
    });

});