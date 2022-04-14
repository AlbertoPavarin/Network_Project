import json
from django.db import IntegrityError
from django.http import HttpResponsePermanentRedirect, HttpResponseRedirect
from rest_framework import generics
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from .models import User
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


# Create your views here.
class UserView(generics.CreateAPIView):
    querySet = User.objects.all()
    serializer_class = UserSerializer

class CreateUserView(APIView):
    serializerClass = CreateUserSerializer
    

    def get(self, request, format=None):
        serializer = self.serializerClass(data=request.data) # dati
        if serializer.is_valid():
            username = serializer.data.get('username')
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            try:
                user = User(username=username, email=email, password=password)
                user.save()
            except IntegrityError:
                return Response({'User already exist'})
        return Response(UserSerializer(user))

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