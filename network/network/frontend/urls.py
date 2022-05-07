from unicodedata import name
from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('', index),
    path('login', index),
    path('register', index),
    path('logout', logout_view, name="logout"),
    path('User/<str:username>', index),
    path('NewPost', index),
    path('Comments/<int:id>', index),
    path('Post/<int:id>', index),
    path('EditBio', index),
]
