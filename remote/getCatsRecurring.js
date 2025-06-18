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

    let count = 0;

    for(const subject of subjects){
        
        count += 1;
        console.log(count + " of " + subjects.length);

        let queryURL = "subject:" + encodeURIComponent(subject);
        const url = `https://www.googleapis.com/books/v1/volumes?q=${queryURL}&printType=books&orderBy=newest&maxResults=40&langRestrict=en`;

        try {

            const response = await fetch(url);
            const data = await response.json();
            await sleep(300);

            if(data.items){
                console.log(data.items.length); // use this later to net rare tags
                data.items.forEach(book => {
                if(book.volumeInfo.categories){
                    book.volumeInfo.categories.forEach(category => {
                        
                        //we could put common tag check first to speed up
                        const isDuplicate = subjectsSet.has(category.trim().toUpperCase());
                        if (!isDuplicate) {
                            subjectsSet.add(category.trim().toUpperCase());
                            subjects.push(category);
                            fs.appendFile('../metadata/subjects.txt', `\n${category}`, 'utf8', (err) => {
                                if (err) console.error('Write error:', err);
                            });
                        }

                    });
                }
                else{
                    // console.log(book.volumeInfo.title + " had an error reading categories");
                }
            });} // end data.items forEach
            else{
                 console.log(subject + " nets a bad search. Bad tag or inputs too quick!"); //use this later to remove bad tags
            }
        
        } // end try
        catch(error){
            console.log(`couldn't find books matching ${subject}: ${error}`);
        }

    }; // end subjects for in

    console.log("100% done. Ended with " + subjects.length + "tags. We began with " + initialLength + " tags.");

} // end Function

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

