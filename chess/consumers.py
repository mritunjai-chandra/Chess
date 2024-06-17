# chess/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import re

class ChessConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        global global_game_rooms
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'{self.room_name}'
        print(f"Consumer connected to websocket, room_group_name: {self.room_group_name}")

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print("Consumer disconnected from websocket")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print("Consumer received message")
        data = json.loads(text_data)
        move = data['move']
        drag = data.get("drag", False)

        # Broadcast move to the group
        print("Broadcasting move to group")
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chess_move',
                'move': move,
                'drag': drag,
            }
        )

    async def chess_move(self, event):
        print("Consumer chess move")
        # Send event to WebSocket
        print(f"event: {event}")
        await self.send(text_data=json.dumps({
            'event': event
        }))
