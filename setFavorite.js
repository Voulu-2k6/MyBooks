let setFavoriteHome = document.querySelector("#addFavoriteButtonHome");

setFavoriteHome.addEventListener('click', (e) => {

    favoritedBook = JSON.parse(sessionStorage.getItem("selectedBook"));

    // TO DO: Update this when we implement more APIs
    let formattedFavoritedBook = {
        
        title: favoritedBook.title,
        author: favoritedBook.author,
        cover: favoritedBook.cover,
        description: favoritedBook.description,
        id: idMaker(favoritedBook)

    };

    // TO DO: push to the database once we make it
    let favoriteBooks = JSON.parse(localStorage.getItem("Favorites")) || {};
    favoriteBooks[formattedFavoritedBook.id] = formattedFavoritedBook;

    localStorage.setItem("Favorites", JSON.stringify(favoriteBooks));
});

function idMaker(book){
    // TO DO: make this file once we have sufficient data in our formattedFavoriteBook item
    return book.id;
}