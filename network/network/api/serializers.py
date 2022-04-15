from pyexpat import model
from .models import Post, User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'password', 'username', 'email')

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'owner', 'content', 'timestamp')
    
class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('owner', 'content', 'timestamp')