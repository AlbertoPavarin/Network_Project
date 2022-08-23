from pyexpat import model

from attr import fields
from .models import Comment, Follower, Like, Message, Post, User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'password', 'username', 'email', 'date_joined', 'first_name', 'last_name', 'info')

class SearchUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', )

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
        fields = ('content', 'timestamp')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'commentator', 'post', 'content')
    
class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('content', 'post')

class BioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'info')

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = ('following', )

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = ('follower', )

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('liked_post',)

class MessageSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Message
        fields = ('recipient', 'content')

class GetMessageSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('sender', 'recipient', 'content')