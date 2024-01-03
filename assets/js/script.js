// var timeStamp = '1681802982683';
// var pubKey = '228fa4b706c011a83b9bd0b501e5320d';
// var hash = '830607a7cd9950993dac64c6f74ab021';
// var characterName = 'spider-man';
// //how to create a hash

// function getMarvelData() {  
//     var marvelURL = 'https://gateway.marvel.com:443/v1/public/characters?nameStartsWith='+ characterName+ '&ts=' + timeStamp + '&apikey=' + pubKey + '&hash=' + hash;
//     console.log(marvelURL); 
//     fetch(marvelURL)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             console.log(data);
//             marvelApi(data);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
        
// };  
// function marvelApi(data) {
//     console.log(data);
//         for (var i = 0; i < data.data.results.length; i++) {
//         console.log(data.data.results[i].name);
//         var marvelCard = $('<div>').addClass('singlecard tile is-child').attr('style', 'background-color: #34A8DA', 'margin: 10px','width: 18rem;');
//         var list = document.getElementById('list');
//         var charName = data.data.results[i].name;
//         list.append(marvelCard);
//         marvelCard.append($('<h3 class="card-title">').text(charName));
      

//     }};

// getMarvelData();
// Marvel API data fectch obsolite due to API not having the data we need.


var btn = document.getElementById('search');

function getSuperData(superID) {
    fetch('https://www.superheroapi.com/api.php/10163066703485828/'+superID)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            createSuper(data);
        })
        .catch(function (error) {
            console.log(error);
        });
 }
btn.addEventListener('click', getSuperData);
var supername = document.getElementById('supername').value;
var btn = document.getElementById('search');
function getID() {
   
    console.log(supername);
    fetch('https://www.superheroapi.com/api.php/10163066703485828/search/'+supername)        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            usesuperID(data);
        })
        .catch(function (error) {
            console.log(error);
        });
 }
btn.addEventListener('click', getID);

function usesuperID(data) {
    console.log(data);
    var superID = data.results[0].id;
    console.log(superID);
    getSuperData(superID);
    
}

function createSuper(data) { 

   
        
    
    var superName = data.name;
    var eyes = data.appearance["eye-color"];
    var height = data.appearance.height[0];
    var hair = data.appearance["hair-color"];
    var race = data.appearance.race;
    var superIntelligence = data.powerstats.intelligence;
    var superStrength = data.powerstats.strength;
    var superSpeed = data.powerstats.speed;
    var appearance = data.appearance;

    console.log('name: '+ superName);
    console.log('height: '+ height);
    console.log('hair: '+ hair);
    console.log('eyes: '+ eyes);
    console.log('race: '+race);
    console.log('intelligence: '+superIntelligence);
    console.log('strenght: '+ superStrength);
    console.log('speed: '+ superSpeed);
    

    

}

createSuper();
// will get super data function to work before moving
// var giphyAPIkey = 'V8zVuDYLK9YXnITSBHQrcoevS2oMCdUY';

// function getGiphyData() {
//     var giphyURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + giphyAPIkey + '&q=' + supername;
//     console.log(giphyURL);
//     fetch(giphyURL)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             console.log(data);
//             //giphyIMG(data);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
        
// }
