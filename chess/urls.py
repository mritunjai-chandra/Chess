# chess/urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('chess/<str:room_name>/<str:colour>', views.room, name='room'),
]
