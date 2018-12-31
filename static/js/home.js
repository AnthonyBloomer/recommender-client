const request = new XMLHttpRequest()

window.onload = () => {
    request.open("POST", '/genres', true)
    request.onload = () => {
        if (request.status === 200 || request.status === 0) {
            resp = JSON.parse(request.responseText)
            loadGenres(resp)
        } else {
            displayAlert(JSON.parse(request.responseText), "alert-danger")
        }
    }

    request.send(null)
}

const loadGenres = (genres) => {
    const shuffled = genres.sort(() => .5 - Math.random())
    let selected = shuffled.slice(0, 1).join()
    request.open('POST', `/recommendations?genre=${selected}&min_popularity=40`, true)
    request.send()
    request.onload = () => {
        if (request.status == 200) {
            displayRecommendations(JSON.parse(request.responseText))
            selected = selected.replace("-", ' ');
            displayAlert(`Here's some <span class='capitalize'>${selected}</span> music we thought you'd like...`, "alert-info")
        } else {
            parsed = JSON.parse(request.responseText)
            displayAlert(parsed.error, "alert-danger")
        }
    };
    request.onerror = () => {
        parsed = JSON.parse(request.responseText)
        displayAlert(parsed.error, "alert-danger")
    };
}

const hideAlert = () => {
    document.getElementById("alertBox").style.display = 'none'
    document.getElementById("alertMessage").innerHTML = ""
}

const displayAlert = (alertMessage, alertType) => {
    document.getElementById("alertBox").style.display = 'block'
    document.getElementById("alertBox").classList.add(alertType);
    document.getElementById("alertMessage").innerHTML = alertMessage
}

const displayRecommendations = recommendations => {
    let tracks = recommendations.tracks
    let content = ""
    const theDiv = document.getElementById("resultsArea")
    content = "<h4>Tracks</h4>"
    tracks.forEach(({name, artists, external_urls}) => {
        const track = `${name} - ${artists[0].name}`
        content += "<div class='row'>"
        content += "<div class='col-md-11'>"
        content += `${track}`
        content += "</div>"
        content += "<div class='col-md-1'>"
        content += `<a href='${external_urls.spotify}'><i class='fab fa-spotify'></i></a>  `
        content += `<a onclick='playSong("${track}")'><i style='color: white; cursor: pointer' class='fab fa-youtube'></i></a>`
        content += "</div>"
        content += "</div>"
        content+= "<hr>"
    });
    theDiv.innerHTML = content
    displayResults()
}

const searchRecommendations = e => {
    e.preventDefault()
    let artist = document.getElementById("artist").value
    let genre = document.getElementById("genre").value
    let track = document.getElementById("track").value
    request.open('POST', `/recommendations?artist=${artist}&genre=${genre}&track=${track}`, true)
    request.onload = () => {
        if (request.status == 200) {
            displayRecommendations(JSON.parse(request.responseText))
        } else {
            parsed = JSON.parse(request.responseText)
            displayAlert(parsed.error, "alert-danger")
        }
    };
    request.onerror = () => {
        parsed = JSON.parse(request.responseText)
        displayAlert(parsed.error, "alert-danger")

    };
    request.send()

};

const loadYoutubeFrame = videoId => {
    const url = `https://hooktube.com/embed/${videoId}?autoplay=1`
    document.getElementById("video").src = url
}

const displayResults = () => {
    document.getElementById("videoArea").style.display = 'none'
    document.getElementById("resultsArea").style.display = 'block'
}

const displayVideo = () => {
    document.getElementById("resultsArea").style.display = 'none'
    document.getElementById("videoArea").style.display = 'block'
}

const findSimilarTracks = () => {
    let track = document.getElementById("moreLikeThis").name
    request.open('POST', `/recommendations?track=${track}`, true)
    request.onload = () => {
        if (request.status == 200) {
            displayRecommendations(JSON.parse(request.responseText))
        } else {
            parsed = JSON.parse(request.responseText)
            displayAlert(parsed.error, "alert-danger")
        }
    };
    request.onerror = () => {
        parsed = JSON.parse(request.responseText)
        displayAlert(parsed.error, "alert-danger")

    };
    request.send()
}

const playSong = e => {
    hideAlert()
    request.open('POST', `/play?track=${e}`, true)
    request.onload = () => {
        if (request.status == 200) {
            let resp = request.responseText
            let data = JSON.parse(resp)
            displayVideo()
            loadYoutubeFrame(data.id) 
            displayAlert(`<i class='fas fa-play'></i> Playing <a href='#' onclick='displayVideo()'>${e}</a>.`, "alert-info")
            document.getElementById("moreLikeThis").name = e
        } else {
            parsed = JSON.parse(request.responseText)
            displayAlert(parsed.error, "alert-danger")
        }
    };
    request.onerror = () => {
        parsed = JSON.parse(request.responseText)
        displayAlert(parsed.error, "alert-danger")
    };
    request.send()
}

const form = document.getElementById('searchForm')
form.addEventListener('submit', e => {
    e.preventDefault()
    searchRecommendations(e)
});

const ele = document.getElementById('findRecommendations')
ele.onclick = searchRecommendations;