from getpass import getuser
from django.urls import path
from .views import *

urlpatterns = [
    path('create-user', UserView.as_view()),
    path('get-user/', GetUser.as_view()),
    path('create-post', CreatePostView.as_view())
]