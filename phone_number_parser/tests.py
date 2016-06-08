import json

from django.core.urlresolvers import reverse
from django.http import JsonResponse
from django.test import TestCase, Client


# Create your tests here.
class TestSomething(TestCase):

    def setUp(self):
        self.client = Client()

    def test_get_home_page(self):
        response = self.client.get(reverse('parse'))
        self.assertEqual(response.status_code, 200)

    def test_post_text_with_numbers(self):
        response = self.client.post(
            reverse('parse'),
            {'the_text': "(850) 555 - 1212\n"
            "8505551213\n"
            "850.555.1214\n"
            "+1 850.572.1234\n"
            "(702)1112323 and some of the phone numbers have text on the same line\n"
            "and the text keeps going\n"
            "and there are some dates like 12.01.2016 and 201601015'\n"}
        )
        response_json = json.loads(str(response.content, 'utf-8'))
        phone_list = response_json['phone_number_list']
        self.assertEqual(len(phone_list), 5)
        self.assertEqual(type(response), JsonResponse)
        self.assertEqual(response.status_code, 200)

    def test_post_without_numbers(self):
        response = self.client.post(
            reverse('parse'),
            {'the_text': "abcdefghijklmnop"}
        )
        response_json = json.loads(str(response.content, 'utf-8'))
        phone_list = response_json['phone_number_list']
        self.assertEqual(len(phone_list), 0)
        self.assertEqual(type(response), JsonResponse)
        self.assertEqual(response.status_code, 200)