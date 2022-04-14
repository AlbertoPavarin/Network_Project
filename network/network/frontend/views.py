import json
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request, *args, **kargs):
    return render(request, 'frontend/index.html')

def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect('/')
        else:
            return render(request, 'frontend/login.html', {
                'error': 'Invalid user or password'
            })

    return render(request, 'frontend/login.html')