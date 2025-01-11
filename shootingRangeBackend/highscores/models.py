from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class HighScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_difficulty = models.CharField(max_length=100, choices = [('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard')], default="Easy")
    score = models.IntegerField(default=0)
    def __str__(self):
        return f'{self.user.username} {self.game_difficulty} Mode Highscore: {self.score}'
