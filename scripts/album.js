  var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
 
     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

	    if (currentlyPlayingSongNumber !== null) {
		  // Revert to song number for currently playing song because user started playing new song.
		  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		  currentlyPlayingCell.html(currentlyPlayingSongNumber);
	    }
         
	    if (currentlyPlayingSongNumber !== songNumber) {
		  // Switch from Play -> Pause button to indicate new song is playing.
		  $(this).html(pauseButtonTemplate);
            
		  //currentlyPlayingSongNumber = songNumber;
          //currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
          setSong(songNumber);
            
          updatePlayerBarSong();
	    } else if (currentlyPlayingSongNumber === songNumber) {
		    // Switch from Pause -> Play button to pause currently playing song.
		    $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
		    currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
	    }
     };
      
     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
     };
     
     var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
         
/*        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
*/        
         if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
     };
     
     // #1
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
 };

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     // #1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
     
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song) {
     //console.log(album.songs.indexOf(song));
     return album.songs.indexOf(song);
 };

 var changeSong = function(mode) {
     var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
     
     //console.log(currentSongIndex);
     //console.log(typeof mode);
     
     if(mode === 'next') {
         // Note that we're _incrementing_ the song here
         currentSongIndex++;

         if (currentSongIndex >= currentAlbum.songs.length) {
             currentSongIndex = 0;
         }
     } else if (mode === 'previous') {
         // Note that we're _decrementing_ the index here
         currentSongIndex--;

         if (currentSongIndex < 0) {
             currentSongIndex = currentAlbum.songs.length - 1;
         }
     }

     // Save the last song number before changing it
     var lastSongNumber = currentlyPlayingSongNumber;

     // Set a new current song
     setSong(currentSongIndex + 1);

     // Update the Player Bar information
     updatePlayerBarSong();

     var $activeSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
     var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

     $activeSongNumberCell.html(pauseButtonTemplate);
     $lastSongNumberCell.html(lastSongNumber);   
 };
  
var setSong = function(songNumber) {
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};
/* write a findParentByClassName function that keeps traversing the DOM upward until a parent with a specified class name is found
var findParentByClassName = function(element, parentClassName) {
    if(element) {
        var parent = element.parentElement;
        while (parent) {
            if(parent.className === parentClassName) {
                return parent;
            }
            parent = parent.parentElement;           
        }
    }
};

/* My own solution
var getSongItem = function(elem) {
    switch (elem.className) {
        case 'song-item-number':
            return elem;
        case 'song-item-title':
        case 'song-item-duration':
            return(findParentByClassName(elem, 'album-view-song-item').children[0]);
        case 'album-view-song-item':
            //console.log(elem.children);
            return elem.children[0];
        default:
            return null;
    }
};

var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
 };
*/

/* Elements we'll be adding listeners to 
 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
 var songRows = document.getElementsByClassName('album-view-song-item');
*/
var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
}

 // Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

// #1
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
 
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(function(){changeSong('previous');});
    $nextButton.click(function(){changeSong('next');});
    //$previousButton.bind('ckick', {param: 'previous'}, changeSong);
    //$nextButton.bind('click', {param: 'next'}, changeSong);
});