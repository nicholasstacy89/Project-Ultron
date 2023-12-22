var timeStamp = '1681802982683';



var pubKey = '228fa4b706c011a83b9bd0b501e5320d';
var hash = '830607a7cd9950993dac64c6f74ab021';
var characterName = 'spider-man';
//how to create a hash

function getMarvelData() {  
    var marvelURL = 'https://gateway.marvel.com:443/v1/public/characters?nameStartsWith='+ characterName+ '&ts=' + timeStamp + '&apikey=' + pubKey + '&hash=' + hash;
    console.log(marvelURL); 
    fetch(marvelURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            marvelApi(data);
        })
        .catch(function (error) {
            console.log(error);
        });
        
};  
function marvelApi(data) {
    console.log(data);
        for (var i = 0; i < data.data.results.length; i++) {
        console.log(data.data.results[i].name);
        var marvelCard = $('<div>').addClass('singlecard tile is-child').attr('style', 'background-color: #34A8DA', 'margin: 10px','width: 18rem;');
        var list = document.getElementById('list');
        list.append(marvelCard);
        marvelCard.append($('<h3 class="card-title">').text(data.data.results.name));
        marvelCard.append($('<p class="card-text">').text(data.data.results.description));
        marvelCard.append($('<p class="card-text">').text(data.data.results.thumbnail));
        marvelCard.append($('<p class="card-text">').text(data.data.results.comics));

    }};

getMarvelData();


