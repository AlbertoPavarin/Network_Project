from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('', index),
    path('login', index),
    path('register', index),
    path('logout', logout_view, name="logout"),
]
