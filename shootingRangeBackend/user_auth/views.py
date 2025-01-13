from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.sessions.models import Session
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.utils.decorators import method_decorator





# @ensure_csrf_cookie
# def set_csrf_token(request):
#     return JsonResponse({'message': 'CSRF cookie set'})
# @method_decorator(csrf_exempt, name='dispatch')    
class FetchHighScoreView(APIView):
    def get(self, request):
        print(f"FetchHighScoreView - Request user: {request.user}")  # Debug user
        print(f"FetchHighScoreView - Is authenticated: {request.user.is_authenticated}")  
        try: 
            user = request.user
            print(f"Username: {user.username}")
            if not user:
                print(f"user is not authenticated")
            profile = UserProfile.objects.get(user=user)
            serialized_data = UserProfileSerializer(profile)
            print(f"FetchHighScoreView works")
            print(f"CSRF cookie: {request.headers.get('X-CSRFToken')}")
            return Response(serialized_data.data, status=200)
        except Exception as e:
            return Response({'error': 'An unexpected error occurred', 'details': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @method_decorator(csrf_exempt, name='dispatch')
# @method_decorator(csrf_exempt, name='dispatch')
# class UpdateHighScoreView(APIView):
#     def post(self, request):
#         print(f"Entered UpdateHighscore View")
#         print(f"CSRF cookie: {request.headers.get('X-CSRFToken')}")
#         user = request.user
#         print(f"Authenticated user: {user}")
#         if not user.is_authenticated:
#             return Response({'error': 'User is not authenticated'}, 
#             status=status.HTTP_401_UNAUTHORIZED)
#         print(f"AUthenticated user: {user}")
#         new_score = request.data.get('game_score', 0)
#         game_difficulty = request.data.get('game_difficulty')
#         # if not user.is_authenticated:
#         #     return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
#         try:
#             profile = UserProfile.objects.get(user = user)

#             if game_difficulty == "Easy" and new_score > profile.easy_high_score:
#                 profile.easy_high_score = new_score
#             elif game_difficulty == "Medium" and new_score > profile.medium_high_score:
#                 profile.medium_high_score = new_score
#             elif game_difficulty == "Hard" and new_score > profile.hard_high_score:
#                 profile.hard_high_score = new_score
#             profile.save()
#             return Response({'Success': 'High Score Updated Properly'},
#             status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': 'An unexpected error occurred', 'details': str(e)}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class UpdateHighScoreView(APIView):
    def get(self, request):
        print(f"Entered UpdateHighScore View")
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        new_score = request.query_params.get('game_score', 0)
        game_difficulty = request.query_params.get('game_difficulty')

        try:
            profile = UserProfile.objects.get(user=user)

            if game_difficulty == "Easy" and float(new_score) > profile.easy_high_score:
                profile.easy_high_score = float(new_score)
            elif game_difficulty == "Medium" and float(new_score) > profile.medium_high_score:
                profile.medium_high_score = float(new_score)
            elif game_difficulty == "Hard" and float(new_score) > profile.hard_high_score:
                profile.hard_high_score = float(new_score)

            profile.save()
            return Response({'success': 'High Score Updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'An unexpected error occurred', 'details': str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    def post(self, request):
        try:
            #Get username and password from axios post request
            username = request.data.get('username')
            password = request.data.get('password')

            #If either username or password isn't provided, return error
            if not username or not password:
                return Response({'error': 'Must provide both username and password'}, 
                status=status.HTTP_400_BAD_REQUEST)

            #authenticate user with Django user auth
            user = authenticate(username=username, password=password)

            #If user exists, send success back to frontend to navigate user to different page, if user DNE, send error
            if user:
                login(request, user)
                print(f"User {user} is now logged in. Session ID: {request.session.session_key}")
                print(f"User Is Authenticated: {user.is_authenticated}")
                return Response({'Success': 'Login successful', 'user': username}, 
                status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Incorrect username and/or password'}, 
                status.HTTP_401_UNAUTHORIZED)
        
        #catch all other exceptions
        except Exception as e:
            return Response({'error': 'An unexpected error occurred', 'details': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateAccountView(APIView):
    def post(self, request):
        try: 
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({'error': 'Must provide both username and password'}, 
                status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists. Please choose a different username'}, 
                status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=username, password=password)
            user.save()
            UserProfile.objects.create(user=user)
            return Response({'Success': 'Account Created Successfully'}, 
                status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': 'An unexpected error occurred', 'details': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
