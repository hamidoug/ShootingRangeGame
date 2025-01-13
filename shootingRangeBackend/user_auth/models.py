from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    easy_high_score = models.FloatField(default=0)
    medium_high_score = models.FloatField(default=0)
    hard_high_score = models.FloatField(default=0)
    def __str__(self):
        return f'{self.user.username} Profile'
