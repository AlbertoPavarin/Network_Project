import json
from django.db import IntegrityError
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect, JsonResponse
from rest_framework import generics
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from .models import User
from rest_framework import status
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
class UserView(generics.CreateAPIView):
    querySet = User.objects.all()
    serializer_class = UserSerializer

class CreateUserView(APIView):
    serializerClass = CreateUserSerializer
    
    def post(self, request, format=None):
        serializer = self.serializerClass(data=request.data) # dati
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@csrf_exempt
def login_view(request):
        if request.method == 'POST':
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            user = User.objects.filter(username=username)
            if len(user) > 0:
                if user[0].is_superuser == True:
                    userA = authenticate(request, username=username, password=password)
                    if userA is not None:
                        login(request, userA)
                        return JsonResponse({'ok':'ok'})
            
                if user[0].password == password:
                    login(request, user[0])
                    return JsonResponse({'ok':'ok'})
                else:
                    return JsonResponse({'Bad request':'Bad request'}, status=status.HTTP_400_BAD_REQUEST )       
            return JsonResponse({'Bad request':'Bad request'}, status=status.HTTP_400_BAD_REQUEST)

        return HttpResponseRedirect('/login')
        
            

class GetUser(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'username'

    def get(self, request, format=None):
        username = request.GET.get(self.lookup_url_kwarg)
        if username is not None:
            user = User.objects.filter(username=username)
            if len(user) > 0:
                data = UserSerializer(user[0]).data
                return Response(data, status=200)
            return Response({'User not found': 'Invalid username'}, status=404)
        
        return Response({'Bad request': 'No username passed'}, status=400)

class PostView(generics.CreateAPIView):
    query_set = Post.objects.all()
    serializer_class = PostSerializer

class CreatePostView(APIView):
    serializer_class = CreatePostSerializer

    #@login_required
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            content = serializer.data.get('content')
            post = Post(owner=request.user, content=content)
            post.save()
        
        return Response(serializer.data)