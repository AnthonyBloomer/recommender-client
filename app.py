from flask import Flask, render_template, request, jsonify
from recommender.api import Recommender

import os

app = Flask(__name__)

@app.route('/recommendations', methods=['POST'])
def recommendations():
    if not request.args.get('artist'):
        return jsonify({
            'error': 'Artist is required.'
        })
    recommender = Recommender()
    recommender.artists = request.args.get('artist')
    return jsonify(recommender.find_recommendations())


@app.route("/", methods=['GET'])
def home():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 33507))
    app.run(debug=True, host='0.0.0.0', port=port)
