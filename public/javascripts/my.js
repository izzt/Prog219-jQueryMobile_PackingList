
$(document).on('pagebeforeshow ', '#home', function () {   // see: https://stackoverflow.com/questions/14468659/jquery-mobile-document-ready-vs-page-events
    var info_view = "";      //string to put HTML in
    $('#products').empty();  // since I do this everytime the page is redone, I need to remove existing before apending them all again
    $.getJSON('/notelist/')   //Send an AJAX request
        .done(function (data) {
            $.each(data, function (index, record) {   // make up each li as an <a> to the details-page
                $('#products').append('<li><a data-parm="' + record.Subject + '" href="#details-page">' + record.Subject + '</a></li>');
            });

            $("#products").listview('refresh');  // need this so jquery mobile will apply the styling to the newly added li's

            $("a").on("click", function (event) {    // set up an event, if user clicks any, it writes that items data-parm into the details page's html so I can get it there
                var parm = $(this).attr("data-parm");
                //do something here with parameter on  details page
                $("#detailParmHere").html(parm);

            });

        }); // end of .done

});




$(document).on('pagebeforeshow', '#details-page', function () {

    var textString = 'fix me';
    var id = $('#detailParmHere').text();
    $.getJSON('/findnote/' + id)
        .done(function (data) {
            textString = "Item: " 
            + data.Subject + "\n Category: " + data.Description;
            $('#showdata').text(textString);
        })
        .fail(function (jqXHR, textStatus, err) {
            textString = "could not find";
            $('#showdata').text(textString);
        });



});



$(document).on('pagebeforeshow', '#deletepage', function () {

    $('#deleteProductName').val('');
});

function deleteNote() {
    var Subject = $('#deleteNoteSubject').val();
    $.ajax({
        url: '/deleteNote/' + Subject,
        type: 'DELETE',
        contentType: "application/json",
        success: function (response) {
            alert("Product successfully deleted in cloud");
        },
        error: function (response) {
            alert("Product NOT deleted in cloud");
        }
    });
}



// clears the fields
$(document).on('pagebeforeshow', '#addpage', function () {
    $('#newProduct').val('');
    $('#newDetails').val('');
    $('#newPrice').val('');
});

function addItem() {
    var subject = $('#newItem').val();
    var description = $('#newDescription').val();
    var newNote = { Subject: subject, Description: description };
   
    $.ajax({
        url: '/addNote',
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(newNote),
    });
    
}


function saveItem() {    
    var id = $('#detailParmHere').text();
    var subject = $('#editItem').val();
    var description = $('#editDescription').val();
    var newNote = { Subject: subject, Description: description };
   
    $.ajax({
        url: '/updatenote/' + id,
        type: "PUT",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(newNote),
    });
    
}

$(document).on('pagebeforeshow', '#editpage', function () {

    var textString = 'fix me';
    var id = $('#detailParmHere').text();
    $.getJSON('/findnote/' + id)
        .done(function (data) {
            $('#editItem').val(data.Subject)
           
        })
        .fail(function (jqXHR, textStatus, err) {
            textString = "could not find";
            $('#showdata').text(textString);
        });



});




