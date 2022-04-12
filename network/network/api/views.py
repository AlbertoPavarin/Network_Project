from django.db import IntegrityError
from django.http import HttpResponsePermanentRedirect, HttpResponseRedirect
from rest_framework import generics
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from .models import User
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
class UserView(generics.CreateAPIView):
    querySet = User.objects.all()
    serializer_class = UserSerializer

class CreateUserView(APIView):
    serializerClass = CreateUserSerializer

    def post(self, request, format=None):
        serializer = self.serializerClass(data=request.data) # dati
        if serializer.is_valid():
            username = serializer.data.get('username')
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            try:
                user = User(username=username, email=email, password=password)
                user.save()
            except IntegrityError:
                return Response("Errore utente già esistente", status=405)
        return Response(UserSerializer(user), status=201)