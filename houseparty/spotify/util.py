# for saving our tokens in db
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

BASE_URL = "http://api.spotify.com/v1/me"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_token(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save(update_fields=['access_token', 'refresh_token', 'token_type', 'expires_in'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, token_type=token_type, expires_in=expires_in, refresh_token=refresh_token)
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiring = tokens.expires_in
        if expiring <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False

def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    
    response = post('https://accounts.spotify.com/api/token', data={
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token'
    }).json()

    print("refresh response")
    print(response)
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_token(
        session_id, access_token, token_type, expires_in, refresh_token)
    

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    headers = {'Content-Type': 'application/json', 
              'Authorization': "Bearer " + tokens.access_token}
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    if endpoint != "/player/currently-playing":
        print(endpoint)
        print(response)
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}

def play_song(session_id):
    return execute_spotify_api_request(session_id,
                                       "/player/play",
                                       put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id,
                                       "/player/pause",
                                       put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id,
                                       "/player/next",
                                       post_=True)