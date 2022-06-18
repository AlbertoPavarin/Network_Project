from django.contrib import admin
from .models import Follower, Like, User, Post, Comment

# Register your models here.
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Follower)
admin.site.register(Like)