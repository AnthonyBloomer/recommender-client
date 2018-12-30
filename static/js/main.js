const searchRecommendations = function (e) {
    e.preventDefault()
    const request = new XMLHttpRequest()
    const artist = document.getElementById("q").value
    request.open('POST', '/recommendations?artist=' + artist, true)
    request.onload = function () {
        if (request.status == 200) {
            let resp = request.responseText
            let recommendations = JSON.parse(resp)
            let tracks = recommendations.tracks
            let content = ""
            const theDiv = document.getElementById("resultsArea")
            tracks.forEach(function (entry) {
                const track = entry.name + " - " + entry.artists[0].name
                content += "<i onclick='playSong(\"" + track + "\")' class='fas fa-play-circle '></i> " + track + "\n" + "<hr>"
            });
            theDiv.innerHTML = content
        }
    };
    request.onerror = function () {
        console.error(request.responseText)
    };
    request.send()
};

const playSong = function (e) {
    const request = new XMLHttpRequest()
    request.open('POST', '/play?track=' + e, true)
    request.onload = function () {
        if (request.status == 200) {
            let resp = request.responseText
            let data = JSON.parse(resp)
            let player = document.getElementById("ytplayer")
            player.innerHTML = "<br><iframe width='100%' height='500' id='video' src='https://hooktube.com/embed/" + data.id + "?autoplay=1'></iframe>";
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








