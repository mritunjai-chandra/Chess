# chess/views.py
from django.shortcuts import render

def room(request, room_name):
    return render(request, 'chess/room.html', {
        'room_name': room_name
    })
