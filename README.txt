Tate Sorensen - 6/4/2025

This project aims to build an online 'library' as a website. 

Link to the project: https://voulu-2k6.github.io/MyBooks/public/html/index.html 

Tools used in this project:
    Frontend: HTML/CSS/JavaScript
    Backend: Node.js/Express.js/JavaScript to gather metadata
    APIs: Google Books API

Features to be implemented: 
    linking to review site - search.html, myBooks.html
    How does the user know that what they're hovering over is clickable?
    Create Favs and WL html files

Features to be improved upon:
    Search by tags
        -filter down our massive metadata sets
        -attatch a warning considering the relevancy of these tags
        -improve the algorithm 
    Display selected book 
        -don't create a new eventlistener every time
    Favorites/Wishlist
        -pagination for the case that >6 are on the list
        -removal feature
    Search/Tagsearch
        -implement pagination or scrolling by pulling all 40 possible books.
        -recode css to show a divsor of 40 so pagination ends evenly
        -create an onscreen warning. 
    UI:
        -Main feature of the home page should be the basic search.
        -rename tagSearch page as such.
        -make the display much larger and easier to see
        -create an explaination on how the API is used and how the user can then exploit the search to their advantage
    
Known Bugs:
    Problem: The session 'selectedBook' persists when the page is reloaded, so accidentally clicking the buttons will add unwated books to the list.
    Fix: Make the buttons appear only when a book is selected. 
    Problem: The 'warning' varible in sessionstorage doesn't operate.
    Fix: unknown.

Polishing for final release: 
    -CSS runthrough
    -extensive commenting
    -eliminate console non-error messaging