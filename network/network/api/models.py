from distutils.command.upload import upload
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    info = models.CharField(blank=True, max_length=512)
    profile_pic = models.ImageField(blank=True, null=True, upload_to='images/')

    def __str__(self):
        return f"{self.username}"

class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_owner")
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now=True)
    liked = models.ManyToManyField(User, related_name="liked", default=None)

    def __str__(self):
        return f"{self.id}"

    def getLike(self):
        return f"{self.liked.all().count()}"

class Comment(models.Model):
    commentator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commentator")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post")
    content = models.CharField(max_length=512)

    def __str__(self):
        return f'{self.id}'

class Follower(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")

    def __str__(self):
        return f'{self.following}'

class Like(models.Model):
    liked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked_user")
    liked_post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="liked_post")

    def __str__(self):
        return f'{self.liked_user} liked {self.liked_post}'

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="message_sender")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="message_recipient")
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.content}, {self.sender} to {self.recipient}'