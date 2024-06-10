# chess/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChessConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chess_{self.room_name}'
        print("Consumer connected to websocket")

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

        # Broadcast move to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chess_move',
                'move': move
            }
        )

    async def chess_move(self, event):
        print("Consumer chess move")
        move = event['move']
        # Send move to WebSocket
        await self.send(text_data=json.dumps({
            'move': move
        }))
