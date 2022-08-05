import json
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request, *args, **kargs):
    return render(request, 'frontend/index.html')

def chat(request, room_name):
    print(room_name)
    return render(request, 'frontend/index.html', {
        'room_name': room_name
    })

def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')