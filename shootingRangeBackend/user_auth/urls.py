from django.urls import path
from . import views
# from .views import set_csrf_token

urlpatterns = [
    path('delete', views.DeleteAccountView.as_view()),
    path('update_user_profile', views.UpdateUserProfileView.as_view()),
    path('user_profile', views.GetUserProfileView.as_view()),
    path('get_users', views.GetUsersView.as_view()),
    path('authenticated', views.CheckAuthenticatedView.as_view()),
    path('login/', views.LoginView.as_view(), name="login_view"),
    path('logout/', views.LogoutView.as_view(), name="logout_view"),
    path('createaccount/', views.CreateAccountView.as_view(), name="createaccount_view"),
    path('csrf_cookie', views.GetCSRFToken.as_view()),
    # path('updatehighscore/', views.UpdateHighScoreView.as_view(), name="updatehighscore_view"),
    # path('fetchhighscore/', views.FetchHighScoreView.as_view(), name="fetchhighscore_view"),
    # path('set_csrf/', views.SetCSRFTokenView.as_view(), name='set_csrf'), #added to try and fix csrf passing issue
]