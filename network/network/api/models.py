from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

    def __str__(self) -> str:
        return f"{self.username}"

class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_owner")
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.owner}"