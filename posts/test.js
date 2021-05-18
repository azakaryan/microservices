const axios = require('axios');

async function main() {
    const data = await axios.get('http://127.0.0.1:4000/posts');
    console.log(data.status)

}


main();