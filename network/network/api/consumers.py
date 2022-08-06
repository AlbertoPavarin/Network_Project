from email import message
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.group_name = 'chat_' + self.room_name

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data_json = json.loads(text_data)
        message = data_json['message']

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_mess',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_mess(self, event): # name of the method must be the same of the type
        message = event['message']

        await self.send(text_data=json.dumps({ #json.dumps => obj to json str
            'message': message
        }))