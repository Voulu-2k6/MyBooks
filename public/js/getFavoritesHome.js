//populates the favorites section on the home page
//TODO: page refresh update when a favorite gets added

const favoritesBoxesHome = document.querySelectorAll("#myFavoritesListHome div");

const favoritesHome = JSON.parse(localStorage.getItem('Favorites')); 

let favHomePopCount = 0;
for(a in favoritesHome){

    favoritesBoxesHome[favHomePopCount].innerHTML = 
        `<img class="cover" src="${favoritesHome[a].cover}">
        <p class="title">${favoritesHome[a].title}</p>
        <p class="author">${favoritesHome[a].author}</p>`;

    favHomePopCount++;
    if(favHomePopCount === 6){break;}
}

while(favHomePopCount < 6)
{
    favoritesBoxesHome[favHomePopCount].innerHTML = 
        `<img class="cover" src="../images/plus-sign-icon-2048x2048-mp0pz4g8.png" style="border: none;">
        <p class="title">Add another favorite!</p>`;
    favHomePopCount++;
}
