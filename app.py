from flask import Flask, render_template, request, jsonify
from recommender.api import Recommender
import requests
import os
import json

app = Flask(__name__)


def load_genres():
    with open('resources/genres.json') as f:
        data = json.load(f)
    return data


def make_request(url, params):
    req = requests.get(url, params=params)
    if not req.ok:
        print(req.content)
    return req.json()


@app.route('/play', methods=['POST'])
def play():
    if not request.args.get('track'):
        return jsonify({
            'error': 'Track is required.'
        }), 400

    get_video_id = make_request('https://www.googleapis.com/youtube/v3/search', {
        'q': request.args.get('track'),
        'part': 'id,snippet',
        'maxResults': 1,
        'type': 'video',
        'key': os.getenv('YOUTUBE_API_KEY')
    })

    return jsonify({
        "id": get_video_id['items'][0]['id']['videoId']
    })


@app.route('/recommendations', methods=['POST'])
def recommendations():
    recommender = Recommender()
    if not request.args.get('artist') and not request.args.get('genre') and not request.args.get('track'):
        return jsonify({
            'error': 'At least one artist, genre or track is required.'
        }), 400
    if request.args.get('artist'):
        recommender.artists = request.args.get('artist')

    if request.args.get('genre'):
        recommender.genres = request.args.get('genre')

    if request.args.get('track'):
        recommender.tracks = request.args.get('track')

    recommender.track_attributes = {
        'min_popularity': request.args.get('min_popularity'),
        'max_popularity': request.args.get('max_popularity'),
    }

    recs = recommender.find_recommendations()
    if 'error' in recs:
        print(recs)
    return jsonify(recs)


@app.route("/genres", methods=['POST'])
def genres():
    music_genres = load_genres()['genres']
    return jsonify(music_genres)


@app.route("/", methods=['GET'])
def home():
    music_genres = load_genres()['genres']
    return render_template('index.html', genres=music_genres)


@app.errorhandler(400)
def page_not_found(e):
    return jsonify({
        'error': "Bad Request"
    })


@app.errorhandler(404)
def page_not_found(e):
    return jsonify({
        'error': "Page not Found"
    })


@app.errorhandler(405)
def page_not_found(e):
    return jsonify({
        'error': "Message not allowed."
    })


@app.errorhandler(500)
def page_not_found(e):
    return jsonify({
        'error': "Internal server error."
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 33507))
    app.run(debug=False, host='0.0.0.0', port=port)
