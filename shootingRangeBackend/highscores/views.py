from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

def get_highscore(request):
    return HttpResponse(status=200)

def update_highscore(request):
    return HttpResponse(status=200)