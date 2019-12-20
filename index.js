//APIs Used:
//NewsAPI https://newsapi.org/
//YouTube Data API https://developers.google.com/youtube/v3/

'use strict';

const searchObject = {
    query: null,
};


$('form').submit(function(){
    event.preventDefault();
    if($('label').hasClass('hidden') || $('select').hasClass('hidden')){
      $('label').removeClass('hidden');
      $('select').removeClass('hidden');
    }
    searchObject.query = $('#search-input').val();
    $('#news-sort-options').val("publishedAt");
    $('#video-sort-options').val("date");
    $('#youTubeAPI').empty();
    $('#newsAPI').empty();
    fetchNewsQuery(searchObject.query);
    fetchVideoQuery(searchObject.query);
});


$('#news-sort-options').change(function(){
    $('#newsAPI').empty();    
    fetchNewsQuery(searchObject.query);
});


$('#video-sort-options').change(function(){
    $('#youTubeAPI').empty();    
    fetchVideoQuery(searchObject.query);
});


function fetchNewsQuery(searchterm){
    //to fetch content from NewsAPI
    fetch(`https://newsapi.org/v2/everything?q=${searchterm}&sortBy=${$('#news-sort-options').val()}&language=en&apiKey=2bf9f921521a4c8ea170fca30ab191ad`)
        .then(response=>response.json())
        .then(responseJson=>api1response(responseJson))
        .catch(error=>alert(`${error.message}`));                    
};

/*
        .then(response => {
          if(response.ok){
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson=>api1response(responseJson))
        .catch(error=>$('#newsAPI').text(`${error.message}`));
*/

function fetchVideoQuery(searchterm){
    //to fetch content from YouTube Data API
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&order=${$('#video-sort-options').val()}&type=video&q=${searchterm}&key=AIzaSyChkVvlkXMt6Yc_F07bNPyZIyKUVUCVMTA`)
        .then(res=>res.json())
        .then(resJson=>api2response(resJson))
        .catch(err=>alert('Something went wrong. Try again later.'));
};


//to display results of latest articles of the input query
function api1response(responseJson){
  console.log(responseJson);
    $('#newsAPI').append(
      responseJson.articles.map(article => `
        <h1>${article.title}</h1>
        <p>${article.publishedAt}</p>  
        <p>${article.description}</p>
        <a href="${article.url}" target=_blank>${article.url}</a>
        `)
  );
};


function api2response(responseJson){
  console.log(responseJson);
  $('#youTubeAPI').append(
    responseJson.items.map(video => `
        <p>${video.snippet.title} [${video.snippet.publishedAt}]</p>
        <img src="${video.snippet.thumbnails.default.url}" alt="video-search-image-thumbnail"/><br>
        <a href="https://youtu.be/${video.id.videoId}" target=_blank>https://youtu.be/${video.id.videoId}</a>    
        `)
  );
};



