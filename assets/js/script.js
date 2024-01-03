var btn = document.getElementById('search');
;


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
//btn.addEventListener('click', getSuperData);

function getID() {
    var supername = document.getElementById('supername').value
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
//btn.addEventListener('click', getID);

function usesuperID(data) {
    //console.log(data);
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
    var cardName = $('<h1>').html(superName);

    console.log('name: '+ superName);
    console.log('height: '+ height);
    console.log('hair: '+ hair);
    console.log('eyes: '+ eyes);
    console.log('race: '+race);
    console.log('intelligence: '+superIntelligence);
    console.log('strength: '+ superStrength);
    console.log('speed: '+ superSpeed);
    var createdSuper = $('<div>').attr('class', 'pop-card');
    $('#superCard').append(createdSuper);
    createdSuper.append(cardName);
    createdSuper.append($('<img>').attr('src', data.image.url));
    createdSuper.append($('<p>').text('Height: '+ height));
    createdSuper.append($('<p>').html('Hair: '+ hair));
    createdSuper.append($('<p>').html('Eyes: '+ eyes));
    createdSuper.append($('<p>').html('Race:' + race));
    createdSuper.append($('<p>').html('Intelligence: '+ superIntelligence));
    createdSuper.append($('<p>').html('Strength: '+ superStrength));
    createdSuper.append($('<p>').html('Speed: '+ superSpeed));


    

}
function goBtn(){
    getID();
    usesuperID();
    getSuperData();
    createSuper();
    


}

btn.addEventListener('click', goBtn);

