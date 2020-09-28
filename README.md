# Music Recommender

Music recommendation client powered using the Spotify Recommendations API.

View on Heroku: [https://music-recommender1.herokuapp.com](https://music-recommender1.herokuapp.com)

## Development

Export the following environment variables:

``` bash
export SPOTIFY_CLIENT_ID=''
export SPOTIFY_CLIENT_SECRET=''
export YOUTUBE_API_KEY=''
```

Install the requirements:

``` bash
pip install -r requirements.txt
```

Launch a development server:

``` bash
python app.py
```

Run in production:

```
gunicorn -w 4 app:app
```
