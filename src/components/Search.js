var query = `
query ($str: String) {
    Page(perPage:3) {
        media(search: $str, type: ANIME) {
            id
            title {
                romaji
                english
                native
            }
            coverImage {
                large
            }
        }
    }
}`;

var variables = {
    str: "けいおん"
};

var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

fetch(url, options).then(handleResponse)
    .then(handleData)   
    .catch(handleError);

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    const medias = data.data.Page.media;
    medias.forEach(media => {
        // console.log(media.id);
        // console.log(media.title.native);
        // console.log(media.coverImage.large);
    });
}

function handleError(error) {
    alert('Error, check console');
    // console.error(error);
}