const request = new XMLHttpRequest()

window.onload = function(){
    request.open('POST', '/recommendations?genre=dance', true)
    request.onload = function () {
        if (request.status == 200) {
            displayRecommendations(JSON.parse(request.responseText))
        }
    };
    request.onerror = function () {
        console.error(request.responseText)
    };
    request.send()
}

const displayRecommendations = function(recommendations) {
    let tracks = recommendations.tracks
    let content = ""
    const theDiv = document.getElementById("resultsArea")
    tracks.forEach(function (entry) {
        const track = entry.name + " - " + entry.artists[0].name
        content += "<div class='row'>"
        content += "<div class='col-md-11'>"
        content += "<i onclick='playSong(\"" + track + "\")' class='fas fa-play-circle '></i> " + track
        content += "</div>"
        content += "<div class='col-md-1'>"
        content += "<a href='"+ entry.external_urls.spotify+ "'><i class='fab fa-spotify'></i></a>"
        content += "</div>"
        content += "</div>"
        content+= "<hr>"
    });
    theDiv.innerHTML = content
}

const loadYoutubeFrame = function (videoId){
    let player = document.getElementById("ytplayer")
    const url = "https://hooktube.com/embed/" + videoId + "?autoplay=1"
    player.innerHTML = "<iframe id='video' src='"+ url + "'></iframe>";
}

const searchRecommendations = function (e) {
    e.preventDefault()
    const artist = document.getElementById("q").value
    request.open('POST', '/recommendations?artist=' + artist, true)
    request.onload = function () {
        if (request.status == 200) {
            displayRecommendations(JSON.parse(request.responseText))
        }
    };
    request.onerror = function () {
        console.error(request.responseText)
    };
    request.send()
};

const playSong = function (e) {
    request.open('POST', '/play?track=' + e, true)
    request.onload = function () {
        if (request.status == 200) {
            let resp = request.responseText
            let data = JSON.parse(resp)
            loadYoutubeFrame(data.id)
        }
    };
    request.onerror = function () {
        console.error(request.responseText)
    };
    request.send()
}

const form = document.getElementById('searchForm')
form.addEventListener('submit', function (e) {
    e.preventDefault()
    searchRecommendations(e)
});

const elements = document.getElementById('myElement')
elements.onclick = searchRecommendations;