from django.urls import path
from . import views
# from .views import set_csrf_token

urlpatterns = [
    path('login/', views.LoginView.as_view(), name="login_view"),
    path('createaccount/', views.CreateAccountView.as_view(), name="createaccount_view"),
    path('updatehighscore/', views.UpdateHighScoreView.as_view(), name="updatehighscore_view"),
    path('fetchhighscore/', views.FetchHighScoreView.as_view(), name="fetchhighscore_view"),
    # path('set_csrf/', views.set_csrf_token, name="setcsrf"),
]