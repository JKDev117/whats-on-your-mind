/*
APIs Used:
NewsAPI https://newsapi.org/
YouTube Data API https://developers.google.com/youtube/v3/
*/

'use strict';

//object to hold the value that the user inputs in the search box
const searchObject = {
    query: null,
};

//function for handling submits
function onSubmit(){
  //to unhide elements related to search results when the user hits submit for the first time
  $('form').one('submit', function(event){
    event.preventDefault();
    $('.row-column').removeClass("hidden");
  });

  //processes to run whenever the user submits a search query;
  //these processes include storing the user input, setting the sort options by relevancy & date,
  //empyting sections to clear for new search, & calling methods to fetch the results from the APIs
  $('form').submit(function(event){
      event.preventDefault();
      searchObject.query = $('#search-bar').val();
      $('#news-sort-options').val("relevancy");
      $('#video-sort-options').val("date");
      //emptying section #youTubeAPI to clear room for new search
      $('#youTubeAPI').empty();
      //emptying section #newsAPI to clear room for new search
      $('#newsAPI').empty();
      fetchNewsQuery(searchObject.query);
      fetchVideoQuery(searchObject.query);
      //to set the window view to the search results sections
      window.location = '#row-column-news';
  });
}

//function for handling sort option changes
function sortOptions(){
  //procesess to run when the user selects a sorting option for articles;
  //these processes include emptying the sections & calling the API for the sorted search results
  $('#news-sort-options').change(function(){
      $('#newsAPI').empty();    
      fetchNewsQuery(searchObject.query);
  });

  //procesess to run when the user selects a sorting option for videos;
  //these processes include emptying the sections & calling the API for the sorted search results
  $('#video-sort-options').change(function(){
      $('#youTubeAPI').empty();    
      fetchVideoQuery(searchObject.query);
  });
}


//function to fetch content from NewsAPI & handle the responses
function fetchNewsQuery(searchterm){
    fetch(`https://newsapi.org/v2/everything?q=${searchterm}&sortBy=${$('#news-sort-options').val()}&language=en&apiKey=2bf9f921521a4c8ea170fca30ab191ad`)
        .then(response => {
          if(response.ok)
            return response.json();
          return response.json().then(e => Promise.reject(e));
        })      
        .then(api1response)
        .catch(error=>$('#newsAPI').append(
          `<p class="error-message">${error.message}</p>` 
        ));
          
};

//function to fetch content from YouTube Data API & handle the responses
function fetchVideoQuery(searchterm){
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&order=${$('#video-sort-options').val()}&type=video&q=${searchterm}&key=AIzaSyChkVvlkXMt6Yc_F07bNPyZIyKUVUCVMTA`)
        .then(response => {
          if(response.ok)
            return response.json();
          return response.json().then(e => Promise.reject(e));
        })
        .then(api2response)
        .catch(error=>$('#youTubeAPI').append(
          `<p class="error-message">${error.message}</p>` 
        ));          
};


//function to display results of latest articles of the input query
function api1response(responseJson){
  if(responseJson.articles.length===0){
    $('#newsAPI').append(`
      <p class="no-results">No Results Found</p>
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


//function to display results of latest videos of the input query
function api2response(responseJson){
  if(responseJson.items.length===0){
    $('#youTubeAPI').append(`
      <p class="no-results">No Results Found</p>
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

function start() {
  onSubmit();
  sortOptions();
}

$(start);