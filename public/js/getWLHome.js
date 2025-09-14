//populates the favorites section on the home page
//update when a favorite gets added

const wlBoxesHome = document.querySelectorAll("#myWishListHome div"); 

const wishListHome = JSON.parse(localStorage.getItem('wishList')); 

let wlHomePopCount = 0;
for(a in wishListHome){

    wlBoxesHome[wlHomePopCount].innerHTML = 
        `<img class="cover" src="${wishListHome[a].cover}">
        <p class="title">${wishListHome[a].title}</p>
        <p class="author">${wishListHome[a].author}</p>`;

    wlHomePopCount++;
    if(wlHomePopCount === 6){break;}
}

while(wlHomePopCount < 6)
{
    wlBoxesHome[wlHomePopCount].innerHTML = 
        `<img class="cover" src="../images/plus-sign-icon-2048x2048-mp0pz4g8.png" style="border: none;">
        <p class="title">Add to your wish list!</p>`;
    wlHomePopCount++;
}