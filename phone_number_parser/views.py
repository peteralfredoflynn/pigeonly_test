from django.http import JsonResponse
from django.shortcuts import render
from phone_number_parser.forms import TextForm
import re


def parse_text(request):
    ###########################################################################
    #
    # Parse Text is the lone view for this project. A GET request renders a
    # form with one textarea field. A POST of this form passes the text via an
    # ajax call in the field 'the_text'. The text is parsed using REGEX for
    # phone numbers and passed back as a JSON object.
    # See main.js for the ajax request and success callback function.
    #
    ###########################################################################

    if request.method == 'POST':
        text = request.POST.get('the_text')
        phone_number_list = []
        matches = re.findall(r'\(?(\d{3})\)?[\.\-]?\s*(\d{3})\s*[\.\-]?\s*(\d{4})', text)
        for match in matches:
            phone_number_list.append('({}) {}-{}'.format(match[0], match[1], match[2]))

        response_data = {'phone_number_list': phone_number_list}

        return JsonResponse(response_data)

    else:
        form = TextForm()

        return render(request, 'phone_number_parser/index.html', {'form': form})
