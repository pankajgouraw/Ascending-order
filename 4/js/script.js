$(function() {
    let noOfDrop = 0;
    let result = '';
    let index = 0;
    let correctAns = 0;
    let chance = 0;
    let userAns = 0;
    let totalCorrect = 0;
    let output = $('.output');
    $("#headerText").text(headerText);
    // $("#instruction").css({
    //     color: headerInstructionColor
    // }); 
    // $("#instruction").text(Instruction);
    $('body').css({
        'background-image': bg
    });
    $('.dropContainer').css({
        'left': 0
    });



    // generate numbers
    let arrayContainer = [];
    let noOfBoxLength = noOfBox;

    function generateNumbers() {
        for (let i = 0; i < noOfBoxLength; i++) {
            let x = Math.floor(Math.random() * (maxNumber - minNumber) + 1) + minNumber;
            if (!arrayContainer.includes(x)) {
                arrayContainer.push(x);
                if (ascending == true) {
                    arrayContainer.sort(function(a, b) {
                        return a - b
                    })
                } else {
                    arrayContainer.sort(function(a, b) {
                        return b - a
                    })
                }

            } else {
                noOfBoxLength++;
            }
        }
    } // end generate numbers
    generateNumbers();
 

   // function for audio
   var audioSound;
   function playAudio(x){
     var audioSound = new Audio(x);
     audioSound.play();
   }

    // function for drag and drop
    function dragDrop() {

        $('.drag').draggable({
            revert: 'invalid',
            snapMode: 'inner',
            // helper: 'clone'
        });

        $(".drop").droppable({

            accept: ".drag",
            // tolerance: 'intersect',
            drop: function(event, ui) {

                if ($(event.target).attr('data-user') == '') {
                    $(event.target).attr('data-user', ui.draggable.text())

                    setTimeout(function() {
                        // $(event.target).text(ui.draggable.text());
                         $(event.target).append(`<span class='spanHint ${ui.draggable.attr('id')}'>${ui.draggable.text()}</span>`);
                    }, 1000)

                } else {
                    $(ui.draggable).animate({
                        top: "0px",
                        left: "0px"
                    });
                    return false;
                }
                // centering element when drop
                var drop_el = $(this).offset();
                var drag_el = ui.draggable.offset();
                var left_end = (drop_el.left + ($(this).width() / 2)) - (drag_el.left + (ui.draggable.width() / 2));
                var top_end = (drop_el.top + ($(this).height() / 2)) - (drag_el.top + (ui.draggable.height() / 2));
                ui.draggable.animate({
                    top: '+=' + top_end,
                    left: '+=' + left_end
                });
                // centering element when drop end
                setTimeout(function() {
                    $(ui.draggable).hide();
                }, 1000)

                noOfDrop++;

                if (noOfDrop == checkRunAfter){
                setTimeout(function() {
                          check();
                }, 1000)
                   
                }

            } // drop method end here
        });

    } //end here drag and drop 



     // load dynamic data

    let generateHints = [];

    function loadDynamicData() {
        let trainContainer = '';
        let dataContainer = '';
        let noOfHints = hints;
        for (let i = 0; i < noOfHints; i++) {
            // let x = Math.floor(Math.random() * arrayContainer.length);
            let x = arrayContainer[Math.floor(Math.random() * arrayContainer.length)];
            if (!generateHints.includes(x)) {
                generateHints.push(x);
            } else {
                noOfHints++;
            }
        }
        // console.log(generateHints)

        let arr = arrayContainer;
        // console.log('main arr', arr)
        let colorIndex = 0;
        $.each(arr, function(index, value) {

            if (generateHints.includes(value)) {
                let comp = `<li class='animated' data-ans='${value}' data-user=''><span class='spanHint'>${value}</span></li>`;
                trainContainer += comp;
            } else {
                let comp = `<li class='drop animated' data-ans='${value}' data-user=''></li>`;
                let compDrag = `<li class='dragLi'><span id='${colorClass[colorIndex]}' class='drag'>${value}</span></li>`;
                dataContainer += compDrag;
                trainContainer += comp;
                // colorIndex++;
            }
        })
        $('#dropData').html(trainContainer);
        $('#dragData').html(dataContainer).hide();

        setTimeout(function() {
            $('#dragData').show();
        }, 1500);



    } // end load dynamic data


    // check answer function  
    function check() {

        let dropLength = $('.drop').length;
        let dropTag = $('.drop');
        let userInput = '';
        $.each(dropTag, function(i, value) {
            let userData = $(value).text();
            userInput += userData;
        });

        correctAns = null;
        $.each($('.drop'), function(index, value) {
            let dataUser = $(value).attr('data-user');
            let dataAns = $(value).attr('data-ans');
            // console.log(dataUser, dataAns);
            if (dataUser == dataAns) {
                // console.log('working...');
                correctAns++;
            }
        })

         if (correctAns == dropLength) {
            totalCorrect++;
               $('.engineContainer img').addClass('shake');
               $('#dropData li').addClass('shake');
               console.log('totalCorrect',totalCorrect);
           
            $('#showAnswer').hide();
            $(output[userAns]).css("background-image", "url(" + 'img/happy.png' + ")");
            // $('.drop').css({
            //     'backgroundImage': 'url(img/trainCompartment.png)'
            // });
            chance = 0;
            userAns++;
            // $('.drop').css({'backgroundColor':'transparent'})
            // var audio = new Audio('audio/welldone.mp3');
            // audio.play();
            playAudio('audio/welldone.mp3');
            // setTimeout(function() {
                $('.wellDone').fadeIn();

            // }, 500)
            setTimeout(function() {
                 playAudio('audio/steam-train.mp3');
                    $('.dropContainer').css({
                        'left': '-100%',
                        'transition': 'all 3s ease-in-out'
                    });

                    $('.engineContainer img').removeClass('shake');
                   $('#dropData li').removeClass('shake');
            },2500);

            setTimeout(function(){
                if(totalCorrect == 2){
                   $('#level2').show();
                }else{
                    if(!(userAns==2)){
                        next();
                    }
                }
            },3000)
      
            $('#reset').hide();
            // $('#check').hide();
            //$('#next').show();
        } else {
            if (chance == 0) {
                chance++;
               
                playAudio('audio/tryAgain.mp3');
                $('.tryAgain').fadeIn();
                setTimeout(function(){
                         $('.tryAgain').fadeOut();
                          reset();
                },3000)
                return false;
            } else {
                $(this).hide();
                $('#reset').hide();
                $('#showAnswer').show();
                $('#next').show();
                $(output[userAns]).css("background-image", "url(" + 'img/sad.png' + ")");
                userAns++;
            }

        }
        console.log('user answer', userAns);
        if (userAns == 2) {
            $('#next').hide();
            setTimeout(function(){
            $('#playAgain').show();

            },3000)
        }

    } // check answer function  end


    //check answer function
    // $('#check').click(function() {
 
  

    //     // if(chance >= 1){
    //     //   $(this).hide();
    //     //   $('#showAnswer').show();
    //     //   $('#next').show();
    //     //   $('#reset').hide();
    //     //   $(output[userAns]).css("background-image", "url(" + 'img/sad.png' + ")");
    //     //     userAns++;

    //     // }


    //     check();

    //     // console.log('droplength',dropLength)
    //     // console.log('correctAns', correctAns)
       
    // }) // end check answer function 


    //reset question function
    function reset() {
        noOfDrop=0
        $('.drop').empty().attr('data-user', '');
        $('.drag').animate({
            top: "0px",
            left: "0px"
        }).show();
        correctAns = 0;
        optionRandPosition();
        $('#check').show();

    }
    //reset question function end

    // to suffle the position of options at random places
    let optionRandPosition = function() {
        let dragElement = $('.dragLi');
        $.each(dragElement, function(i, value) {
            $(this).css({
                order: Math.floor(Math.random() * 5)
            });
        })
    }
optionRandPosition();


    $('#next').click(function(){
        next();
        totalCorrect=0;
        playAudio('audio/beep.mp3');
    });

    function next() {
        noOfDrop=0;
        $('.dropContainer').css({
            // 'opacity': 0,
            'left': '-100%',
            'transition': 'left 3s ease-in-out'
        })
         setTimeout(function() {
            $('.dropContainer').css({
                'opacity': 0,
                'left': '100%',
                'transition': 'none'
            });
         },2500)

        setTimeout(function() {
                    chance = 0;
            noOfHints = hints;
            arrayContainer = [];
            generateHints = [];
            noOfBoxLength = noOfBox;
            generateNumbers();
            $('.dropContainer').css({
                'opacity': 1,
                'left': '0%',
                'transition': 'left 3s ease-in-out'
            });

        $('#dropData').empty();
        loadDynamicData();
        dragDrop();
        $('#check').show();
        $('#reset').show();
        $('#showAnswer').hide();
        $('#next').hide();
        $('.wellDone').hide();
        optionRandPosition()
        }, 3000);

    } // for next


    // show answer function
    $('#showAnswer').click(function() {
        playAudio('audio/beep.mp3');
        chance = 0;
        $.each($('.drop'), function(index, value) {
            $(this).children('span').text($(this).attr('data-ans'));
        })

        // $('.drop > span').text($('.drop').attr('data-ans'));

       // $('#dragData').hide();
       // $('.drop').css({
       //     'backgroundImage': 'url(img/trainCompartment.png)'
       //  });
        // $(this).hide();
    })


    $('#playAgain').click(function() {
        playAudio('audio/beep.mp3');
        // location.reload();
         correctAns = 0;
        // chance = 0;
        $(this).hide();
        userAns = 0;
        next();
        $('#level2').hide();

        output.css("background-image", "url(" + 'img/resultBg.png' + ")");
        totalCorrect=0;
    })


    loadDynamicData();
    dragDrop();
    optionRandPosition();


    // new script add 
    var backMusic = new Audio('audio/backgrund.mp3');
    $('.stopAudio').click(function(){
        playAudio('audio/beep.mp3');
        $(this).hide();
        $('.playAudio').show();
        backMusic.play();
    });

    $('.playAudio').click(function(){
        playAudio('audio/beep.mp3');
        $(this).hide();
        $('.stopAudio').show();
        backMusic.pause();
    });


    $('#level2').click(function(){
        playAudio('audio/beep.mp3');
        window.location.href='../5/main.html';
    })

}); // end document function 