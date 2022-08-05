import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, code):
        pass

    def receive(self, text_data):
        data_json = json.loads(text_data)
        message = data_json['message']

        self.send(text_data=json.dumps({ #json.dumps => obj to json str
            'message': message
        }))