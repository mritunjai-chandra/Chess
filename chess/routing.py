# chess/routing.py
from django.urls import path
from .consumers import ChessConsumer

websocket_urlpatterns = [
    path('ws/chess/<str:room_name>/', ChessConsumer.as_asgi()),
]
