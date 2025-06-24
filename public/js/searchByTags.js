let search = document.querySelector("#goButton");

searchResultsBoxSearch = document.querySelectorAll(`#searchResultsMain div`);
for(let i = 0; i < searchResultsBoxSearch.length; i++){
    searchResultsBoxSearch[i].setAttribute("id", "searchResult" + i);
    searchResultsBoxSearch[i].addEventListener('click', (e) => {
            displaySelectedBook(i);
    });
}

search.addEventListener('click', async (e) => {
    let tags = JSON.parse(sessionStorage.getItem("tagSearchList")) || null;
    let q = "";
    for(tag in tags){
        q += "subject:" + encodeURIComponent(tags[tag]);
        if(tag != tags.length-1){q += "+";}
    }
    console.log(q);

    const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&langRestrict=en&printType=books&maxResults=18`;

    try{
        const response = await fetch(url);
        const data = await response.json();

        console.log(data.totalItems); // DISPLAY THIS IN A NEW ELEMENT AT SOME POINT
        sessionStorage.setItem('OnScreen', JSON.stringify(data.items));

        // loops through the data constant's items array with map()
        // we give map() a unique function as a parameter which is defined within the braces
        // results will be an array of whatever is returned by the function
        const results = data.items.map((item) => {return mapBookData(item)});
        displayResults(results);

    } catch (error) {
        console.error(`Error fetching books:`, error);
        displayResults(-1);
    }

});

let resultBoxes = document.querySelectorAll("#searchResultsMain div");
for(let i = 0; i < resultBoxes.length; i++){
    resultBoxes[i].addEventListener('click', (e) => {
        let showBook = JSON.parse(sessionStorage.getItem('OnScreen'))[i] || null;
        console.log(showBook); // THIS WILL BECOME THE DISPLAYSELECTEDBOOK OF THIS FILE
    });
}

function displayResults(results){
    for(let i = 0; i < results.length; i++)
    {
        resultBoxes[i].innerHTML = `<img class="cover" src="${results[i].cover}">
        <p class="title">${results[i].title}</p>
        <p class="author">${results[i].authors[0]}</p>`;
    }
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

function displaySelectedBook(bookNo){

    //get the book data
    let selectedBook = mapBookData(JSON.parse(sessionStorage.getItem("OnScreen"))[bookNo]);
    console.log(selectedBook);
    let selectedBookDisplayHome = document.querySelector(".selectedBookDisplay");

    // copy data from clicked book and add description, shorten if too long
    let selectedBookDescription = selectedBook.description;
    if(selectedBookDescription.length > 600){ // check for end of word
        let wordCutOff = 600;
        while(selectedBookDescription.substring(wordCutOff, wordCutOff+1) !== " "){wordCutOff += 1;}
        selectedBookDescription = selectedBookDescription.substring(0, wordCutOff) + "...";
    }
    setInnerHTML(selectedBookDisplayHome, selectedBook);
    selectedBookDisplayHome.innerHTML +=  `<p class="description">${selectedBookDescription}</p>`;
}

function setInnerHTML(div, book){
    div.innerHTML = `<img class="cover" src="${book.cover}">
        <p class="title">${book.title}</p>
        <p class="author">${book.authors[0]}</p>`;
}