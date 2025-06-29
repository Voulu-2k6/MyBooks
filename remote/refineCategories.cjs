const fs = require('fs');

const readStream = fs.createReadStream('../public/metadata/outsourcedSubjects.txt', 'utf8');

let lines = [];
readStream.on('data', (chunk) => {
  lines = lines.concat(chunk.split(/\r?\n/));
});

readStream.on('end', () => {
  console.log('Finished reading.');
  console.log(lines.length);
  refine(lines);
});

readStream.on('error', (err) => {
  console.error('Read error:', err);
});

async function refine(lines){
    let count = 0;
    for(category of lines)
    {
        count++;
        console.log(count + " of " + lines.length + ", " + (lines.length-count) + " to go");
        let queryURL = "subject:" + encodeURIComponent(category);
        const url = `https://www.googleapis.com/books/v1/volumes?q=${queryURL}&printType=books&orderBy=newest&maxResults=40&langRestrict=en`;

        try {

            const response = await fetch(url);
            const data = await response.json();
            await sleep(300);

            if(data.items)
            {
                if(data.items.length === 40){
                    console.log(category + ": common");
                    fs.appendFile('../public/metadata/NEOgeneralSubjects.txt', `\n${category}`, 'utf8', (err) => {
                        if (err) console.error('Write error:', err);
                    });
                }
                else{
                    console.log(category + ": rare");
                    fs.appendFile('../public/metadata/NEOrareSubjects.txt', `\n${category}`, 'utf8', (err) => {
                        if (err) console.error('Write error:', err);
                    });
                }
            }
            else{
                console.log(category + ": bad");
                fs.appendFile('../public/metadata/NEObadSubjects.txt', `\n${category}`, 'utf8', (err) => {
                    if (err) console.error('Write error:', err);
                });
            }
        }
        catch (error) {
            console.log(error);
        }

    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}