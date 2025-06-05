// require is the function we use to search our machine for specific functions we need to store in the file
// like an import statement. 
// const fetch = require('node-fetch');
// but we don't need it for front end files. When we decide to code backend specific JS, come back here.

// getting our data
const userSearchHome = document.querySelector('#searchBoxHome');

userSearchHome.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        const query = userSearchHome.value;
        searchBooks(query);
        userSearchHome.value = "";
    }
})

// async keyword lets us pause the function using 'await' during API calls.
async function searchBooks(query){
    console.log(`We searched for ${query}`);
}

