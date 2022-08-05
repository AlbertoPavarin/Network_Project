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
    path('User/Following/<str:username>', index),
    path('User/Follower/<str:username>', index),
    path('Following/Posts', index),
    path('Chat/<str:room_name>', chat)
]