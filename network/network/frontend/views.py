from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout

# Create your views here.
def index(request, *args, **kargs):
    return render(request, 'frontend/index.html')

def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')