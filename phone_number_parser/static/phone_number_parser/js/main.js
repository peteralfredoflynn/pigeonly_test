///////////////////////////////////////////////////////////////////////////////
// Function parse_text() gets called after the form is submitted.
// It sends an ajax call to the Django view and retrieves a JSON list of
// phone numbers. If there are numbers, they are rendered to the screen.
// If not, a message displays that no numbers were found.
///////////////////////////////////////////////////////////////////////////////
function parse_text() {

    function add_list_item(item) {
        $('#numbers').append('<li>' + item + '</li>')
    }

    $.ajax({
        url: "/",
        type: "POST",
        data: { the_text : $('#parse-text').val()},
        success: function(json) {
            $('#parse-text').val('');
            var num_list = json.phone_number_list;
            if (num_list.length > 0) {
                $('#message').text('Voila! Numbers found.');
                json.phone_number_list.forEach(add_list_item);
            } else {
                $('#message').text('No numbers found.')
            }

        },
        error: function(xhr, errmsg, err) {
            $('#error_message').html("<div class='alert alert-warning' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='/' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText);
        }

    });
}
///////////////////////////////////////////////////////////////////////////////
// Submit post on submit
// Manual check to see if text is required minimum length
///////////////////////////////////////////////////////////////////////////////
$('#parse-form').on('submit', function(e){
    event.preventDefault();
    if ($('#parse-text').val().length > 9) {
        $('#numbers').html('');
        console.log("form submitted!");  // sanity check
        parse_text();
    } else {
        console.log('Invalid Form')
    }

});

///////////////////////////////////////////////////////////////////////////////
// Third Party Code to add CSRF Token in order to comply with Django
///////////////////////////////////////////////////////////////////////////////
$(function() {

    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});