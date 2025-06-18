const fs = require('fs');

const readStream = fs.createReadStream('../metadata/subjects.txt', 'utf8');

let lines = [];
readStream.on('data', (chunk) => {
  lines = lines.concat(chunk.split(/\r?\n/));
});

readStream.on('end', () => {
  console.log('Finished reading.');
  console.log(lines.length);
  multiply(lines);
});

readStream.on('error', (err) => {
  console.error('Read error:', err);
});


async function multiply(subjects){

    const initialLength = subjects.length;
    const subjectsSet = new Set(subjects.map(s => s.trim().toUpperCase()));

    const startIndex = 5500;
    const diff = initialLength-startIndex;

    let newCats = [];
    for(let i = startIndex; i < initialLength; i++){
        
        let percent = (((i-startIndex)/diff)*100).toFixed(2);
        console.log("%d% done.", percent);

        let queryURL = "subject:" + encodeURIComponent(subjects[i]);
        const url = `https://www.googleapis.com/books/v1/volumes?q=${queryURL}&printType=books&maxResults=40&langRestrict=en`;

        try {

            const response = await fetch(url);
            const data = await response.json();
            await sleep(100);

            if(data.items){
                //console.log(data.items.length); // use this later to net rare tags
                data.items.forEach(book => {
                if(book.volumeInfo.categories){
                    book.volumeInfo.categories.forEach(category => {
                        
                        const isDuplicate = subjectsSet.has(category.trim().toUpperCase());
                        if (!isDuplicate) {
                            newCats.push(category);
                            subjectsSet.add(category.trim().toUpperCase());
                        }

                    });
                }
                else{
                    // console.log(book.volumeInfo.title + " had an error reading categories");
                }
            });} // end data.items forEach
            else{
                // console.log(subjects[i] + " nets a bad search."); //use this later to remove bad tags
            }
        
        } // end try
        catch(error){
            console.log(`couldn't find books matching ${subjects[i]}: ${error}`);
        }

    }; // end subjects for in

    try{

        for(let i = 0; i < newCats.length; i++){
            fs.appendFile('../metadata/subjects.txt', `\n${newCats[i]}`, 'utf8', (err) => {
                if (err) console.error('Write error:', err);
            });
        }
    }
    catch (error){
        console.log(`write error: ${error}`);
    }

    console.log("100% done. Ended with " + newCats.length + " new tags. We began with " + initialLength + " tags.");

} // end Function

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

