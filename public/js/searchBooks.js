//Populates search box once we hit enter

/*
    Options
    General search type: Generic, Title, Author, ISBN, Subject

    Implement
        Search:
            restrict to books
            sort results by rating
            more search results...
        Display:
            link to goodreads
            rating
            metadata

*/


// getting our data
const userSearchHome = document.querySelector('#searchBoxHome');
let selectedLang = 'en';

userSearchHome.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        const query = userSearchHome.value;
        searchBooks(query);
    }
})

searchResultsBoxHome = document.querySelectorAll(`#searchResultsHome div`);
for(let i = 0; i < searchResultsBoxHome.length; i++){
    searchResultsBoxHome[i].setAttribute("id", "homeResult" + i);
    searchResultsBoxHome[i].addEventListener('click', (e) => {
            displaySelectedBook(i);
    });
}

// async keyword lets us pause the function using 'await' during API calls.
async function searchBooks(query){

    const queryURL = encodeURIComponent(query);
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${queryURL}&langRestrict=en&printType=books&maxResults=8`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        // loops through the data constant's items array with map()
        // we give map() a unique function as a parameter which is defined within the braces
        // results will be an array of whatever is returned by the function
        const results = data.items.map(item => {return mapBookData(item);});

        sessionStorage.setItem('onScreen', JSON.stringify(data.items));
        displayResults(results);

    } catch (error) {
        console.error(`Error fetching books:`, error);
        displayResults(-1);
    }

}

function displayResults(searchResults){

    console.log(searchResults);

    if(searchResults === -1){
        console.log("nothing found...");
    }
    else{

        for(let i = 0; i < searchResults.length; i += 1)
        {
            setInnerHTML(searchResultsBoxHome[i], searchResults[i]);
            searchResultsBoxHome[i].setAttribute('style', `grid-column: ${(i%4)+1}; grid-row:${(i/4)+1};`);
        }

        const blankResult = {
            title: "",
            authors: [""],
            cover: `../images/noCover.png`
        };
        for(let i = searchResults.length; i < 8; i += 1)
        {
            setInnerHTML(searchResultsBoxHome[i], blankResult);
            searchResultsBoxHome[i].setAttribute('style', `grid-column: ${(i%4)+1}; grid-row:${(i/4)+1};`);
        }

    }
}

function setInnerHTML(div, book){
    div.innerHTML = `<img class="cover" src="${book.cover}">
        <p class="title">${book.title}</p>
        <p class="author">${book.authors[0]}</p>`;
}

function displaySelectedBook(bookNo){

    //get the book data
    let selectedBook = mapBookData(JSON.parse(sessionStorage.getItem("onScreen"))[bookNo]);
    console.log(selectedBook);
    let selectedBookDisplayHome = document.querySelector("#selectedBookHome");

    // copy data from clicked book and add description, shorten if too long
    let selectedBookDescription = selectedBook.description;
    if(selectedBookDescription.length > 600){ // check for end of word
        let wordCutOff = 600;
        while(selectedBookDescription.substring(wordCutOff, wordCutOff+1) !== " "){wordCutOff += 1;}
        selectedBookDescription = selectedBookDescription.substring(0, wordCutOff) + "...";
    }
    setInnerHTML(selectedBookDisplayHome, selectedBook);
    selectedBookDisplayHome.innerHTML +=  `<p class="description">${selectedBookDescription}</p>`;

    // enlarge the cover
    selectedBookDisplayHome.firstElementChild.setAttribute('style', "height: auto; width: 70%;");

}

function mapBookData(rawBook){
    const volume = rawBook.volumeInfo;
    return { 
        id: rawBook.id,
        title: volume.title,
        authors: volume.authors || ['Unknown'],
        cover: volume.imageLinks?.thumbnail || `../images/noCover.png`,
        description: volume.description || 'No description',
        categories: volume.categories || 'None listed',
        isbn13: volume.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier,
        isbn10: volume.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier
    };
}

