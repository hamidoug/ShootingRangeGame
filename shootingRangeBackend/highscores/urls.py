from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_highscore, name="get_highscore"),
    path('updatehighscore/', views.update_highscore, name="update_highscore")
]