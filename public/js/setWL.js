//TODO: database stuff
//TO DO: make it clear we added to the wish list

let setWLHome = document.querySelector(".addWLButton");

setWLHome.addEventListener('click', (e) => {

    let wishedBook = JSON.parse(sessionStorage.getItem("selectedBook"));

    // TO DO: Update this when we implement more APIs
    let formattedWishedBook = {
        
        title: wishedBook.title,
        author: wishedBook.authors[0],
        cover: wishedBook.cover,
        description: wishedBook.description,
        id: idMaker(wishedBook)

    };

    // TO DO: push to the database once we make it
    let wishList = JSON.parse(localStorage.getItem("wishList")) || {};
    wishList[formattedWishedBook.id] = formattedWishedBook;
    localStorage.setItem("wishList", JSON.stringify(wishList));
});