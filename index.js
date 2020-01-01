//APIs Used:
//NewsAPI https://newsapi.org/
//YouTube Data API https://developers.google.com/youtube/v3/

'use strict';

const searchObject = {
    query: null,
};

$('form').one('submit', function(event){
  event.preventDefault();
  $('.top-label, label, select, #youTubeAPI, #newsAPI').removeClass('hidden');
});


$('form').submit(function(event){
    event.preventDefault();
    searchObject.query = $('#search-bar').val();
    $('#news-sort-options').val("relevancy");
    $('#video-sort-options').val("date");
    $('#youTubeAPI').empty();
    $('#newsAPI').empty();
    fetchNewsQuery(searchObject.query);
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
        /*
        .then(response=>response.json())
        .then(responseJson=>api1response(responseJson))
        .catch(error=>alert(`${error.message}`));    
        */
        .then(response => {
          if(response.ok)
            return response.json();
          return response.json().then(e => Promise.reject(e));
        })      
        .then(api1response)
        .catch(error=>$('#newsAPI').text(`${error.message}`));                 
};


function fetchVideoQuery(searchterm){
    //to fetch content from YouTube Data API
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&order=${$('#video-sort-options').val()}&type=video&q=${searchterm}&key=AIzaSyChkVvlkXMt6Yc_F07bNPyZIyKUVUCVMTA`)
        .then(response => {
          if(response.ok)
            return response.json();
          return response.json().then(e => Promise.reject(e));
        })
        .then(api2response)
        .catch(error=>$('#youTubeAPI').text(`${error.message}`));  
};


//to display results of latest articles of the input query
function api1response(responseJson){
  //console.log(responseJson);
  if(responseJson.articles.length===0){
    $('#newsAPI').append(`
      <p>No results found</p>
    `);
  } else {
    $('#newsAPI').append(
      responseJson.articles.map(article => `
        <div id="news-div">
          <h2 class="article-title">${article.title}</h2>
          <img src="${article.urlToImage}" id="article-image-preview" alt="article-preview-image">  
          <p class="published-date-article">${article.publishedAt.slice(0,10)}</p>
          <p class="article-description">${article.description}</p>
          <a href="${article.url}" target=_blank class="article-link">...Continue Reading</a>
        </div>        
      `)
    );
  }
};


//to display results of latest videos of the input query
function api2response(responseJson){
  //console.log(responseJson);
  if(responseJson.items.length===0){
    $('#youTubeAPI').append(`
      <p>No results found</p>
    `);
  } else {
    $('#youTubeAPI').append(
      responseJson.items.map(video => `
        <div id="vids-div">
          <p class="vid-title">${video.snippet.title}</p>
          <a href="https://youtu.be/${video.id.videoId}" target=_blank><img src="${video.snippet.thumbnails.default.url}" id="vid-image-preview" alt="video-search-image-thumbnail"/></a><br>
          <p class="published-date-vid">${video.snippet.publishedAt.slice(0,10)}</p>
          <a href="https://youtu.be/${video.id.videoId}" class="vid-link" target=_blank>Watch Video</a>    
        </div>  
     `)
    );
  }    
};
