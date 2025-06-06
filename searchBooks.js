// getting our data
const userSearchHome = document.querySelector('#searchBoxHome');

userSearchHome.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        const query = userSearchHome.value;
        searchBooks(query);
        userSearchHome.value = ""; /* TO DO: remove this line if we want searches to persist */
    }
})

// async keyword lets us pause the function using 'await' during API calls.
async function searchBooks(query){
    console.log(`We searched for ${query}`); //temp

    const queryURL = encodeURIComponent(query);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${queryURL}&maxResults=8`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        // loops through the data constant's items array with map()
        // we give map() a unique function as a parameter which is defined within the braces
        // results will be an array of whatever is returned by the function
        const results = data.items.map((item) => {

            // Google books API returns an obect in JSON form, the data in this object we need is nested in the volumeInfo trait.
            const volume = item.volumeInfo;
            return { // if the bottom 3 don't have attatched data the fillers on the right will take their place
                id: item.id,
                title: volume.title,
                authors: volume.authors || ['Unknown'],
                cover: volume.imageLinks?.thumbnail || 'No cover available',
                description: volume.description || 'No description'
            };
        });

        displayResults(results);

    } catch (error) {
        console.error(`Error fetching books:`, error);
        displayResults(-1);
    }
}

function displayResults(searchResults){

    if(searchResults === -1){console.log("nothing found..."); /* TO DO: display on page */ }
    else{

        searchResultsBoxHome = document.querySelectorAll(`#searchResultsHome div`);

        for(let i = 0; i < searchResultsBoxHome.length; i += 1)
        {
            searchResultsBoxHome[i].innerHTML = `
            
            <img class="cover" src="${searchResults[i].cover}">
            <p class="title">${searchResults[i].title}</p>
            <p class="author">${searchResults[i].authors[0]}</p>
            
            `;

            searchResultsBoxHome[i].setAttribute('style', `grid-column: ${(i%4)+1}; grid-row:${(i/4)+1};`);
        
            searchResultsBoxHome[i].addEventListener('click', (e) => {

                sessionStorage.setItem("selectedBook", JSON.stringify(searchResults[i]));

                // get the aside div box and make in invisible
                selectedSearchedBookHome = document.querySelector("#selectedBookHome");
                selectedSearchedBookHome.setAttribute('style', 'opacity: 0;');

                // copy data from clicked book and add description, shorten if too long
                selectedBookDescription = searchResults[i].description;
                if(selectedBookDescription.length > 600){ // check for end of word
                    wordCutOff = 600;
                    while(selectedBookDescription.substring(wordCutOff, wordCutOff+1) !== " "){wordCutOff += 1;}
                    selectedBookDescription = selectedBookDescription.substring(0, wordCutOff) + "...";
                }
                selectedSearchedBookHome.innerHTML = searchResultsBoxHome[i].innerHTML + `
                    <p class="description">${selectedBookDescription}</p>
                `;

                // enlarge the cover
                selectedSearchedBookHome.firstElementChild.setAttribute('style', "height: auto; width: 70%;");

                // force reload so the page knows to run the animation again once it's added. Idk why it's like this.
                void selectedSearchedBookHome.offsetHeight;

                // fade in animations
                selectedSearchedBookHome.setAttribute('style', `${selectedSearchedBookHome.getAttribute('style')} 
                    animation: fadeIn 0.8s forwards;`);

                document.querySelector("#addFavoriteButtonHome").setAttribute('style', `animation: fadeIn 0.8s forwards;`);

                
            });
        }

    }
}