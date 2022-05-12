from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    info = models.CharField(blank=True, max_length=512)

    def __str__(self):
        return f"{self.username}"

class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_owner")
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}"

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