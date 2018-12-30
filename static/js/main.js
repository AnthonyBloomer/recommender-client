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
                content += "<i class='fas fa-play-circle'></i> " + entry.name + " - " + entry.artists[0].name + "\n" + "<hr>"
            });
            theDiv.innerHTML = content
        }
    };
    request.onerror = function () {
        console.error(request.responseText)
    };
    request.send()
};

const form = document.getElementById('searchForm')
form.addEventListener('submit', function (e) {
    e.preventDefault()
    searchRecommendations(e)
});

const elements = document.getElementById('myElement')
elements.onclick = searchRecommendations;








