# chess/urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('chess/<str:room_name>/', views.room, name='room'),
]
