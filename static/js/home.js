const request = new XMLHttpRequest()

document.getElementById('searchTypeSelector').addEventListener('input', function (evt) {
    if (this.value === 'genre'){
        document.getElementById('searchQuery').style.display = 'none'
        document.getElementById('genreSelector').style.display = 'block'
    } else {
        document.getElementById('genreSelector').style.display = 'none'
        document.getElementById('searchQuery').style.display = 'block'
    }
});

window.onload = () => {
    request.open("POST", '/genres', true)
    request.onload = () => {
        if (request.status === 200 || request.status === 0) {
            let resp = JSON.parse(request.responseText)
            loadGenres(resp)
        } else {
            displayAlert(request.responseText, "alert-danger")
        }
    }

    request.send(null)
}

const loadGenres = (genres) => {
    const shuffled = genres.sort(() => .5 - Math.random())
    let selected = shuffled.slice(0, 1).join()
    request.open('POST', `/recommendations?q=${selected}&t=genre&min_popularity=40`, true)
    request.send()
    request.onload = () => {
        if (request.status == 200) {
            displayRecommendations(JSON.parse(request.responseText))
        } else {
            displayAlert(request.responseText, "alert-danger")
        }
    }
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
    content += "<table class='table table-hover table-bordered'>"
    content += "<thead class='thead-dark'>"
    content +=  '<tr>'
    content +=  '<th scope="col">#</th>'
    content +=  '<th scope="col">Track</th>'
    content +=  '<th scope="col">Artist</th>'
    content +=  '</tr>'
    content += "</thead>"
    content += "<tbody>"
    let count = 1
    tracks.forEach(({name, artists, external_urls}) => {
        let displayName = `${name} - ${artists[0].name}`
        let cleanDisplayName = displayName.replace(/["']/g, "")
        content += `<tr style='cursor:pointer' onclick='playSong("${cleanDisplayName}")'>`
        content += `<th scope="row">${count}</th>`
        content += `<td>${name}</th>`
        content += `<td>${artists[0].name}</th>`
        content += "</tr>"
        count += 1

    });
    content += "</tbody>"
    content += "</table>"
    theDiv.innerHTML = content
    displayResults()
}

const searchRecommendations = e => {
    e.preventDefault()
    let searchQuery = ""
    let searchType = document.getElementById("searchTypeSelector").value
    if (searchType === 'genre'){
        searchQuery = document.getElementById("genreSelector").value
    } else {
        searchQuery = document.getElementById("searchQuery").value
    }
    request.open('POST', `/recommendations?q=${searchQuery}&t=${searchType}`, true)
    request.onload = () => {
        if (request.status == 200) {
            parsed = JSON.parse(request.responseText)
            if (parsed.hasOwnProperty('error')){
                displayAlert(parsed.error.message, "alert-warning")
            } else {
                displayRecommendations(parsed)
                if (typeof newrelic == 'object') {
                    newrelic.addPageAction('search-performed', {'searchQuery': searchQuery, 'searchType', searchType});
                }
            }
        } else {
            parsed = JSON.parse(request.responseText)
            displayAlert(parsed.error, "alert-warning")
        }
    }
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
    request.open('POST', `/recommendations?q=${track}&t=track`, true)
    request.onload = () => {
        if (request.status == 200) {
            let parsed = JSON.parse(request.responseText)
            if (parsed.hasOwnProperty('error')){
                displayAlert(`Status: ${parsed.error.status}Error: ${parsed.error.message}`, "alert-danger")
            } else {
                if (typeof newrelic == 'object') {
                    newrelic.addPageAction('user-clicked-find-similar', {'result': 'success'});
                }
                displayRecommendations(parsed)
            }

        } else {
            displayAlert(request.responseText, "alert-warning")
        }
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
            if (typeof newrelic == 'object') {
                newrelic.addPageAction('song-played', {'song-name': e});
            }
        } else {
            displayAlert("Could not load video.", "alert-danger")
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
