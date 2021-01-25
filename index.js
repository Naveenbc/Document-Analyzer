var http = require('http');
var https = require('https');

const manualAnalyzer = require('./manual-analyzer')

var request = http.get("http://norvig.com/big.txt", async function (res) {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', async function () {
        console.log("done");
        let manualAnalyze = new manualAnalyzer();
        let topWords = await manualAnalyze.process(data);
        for(let word of topWords) {
            let temp = await lookUp(word.word);
            let format = {'word': word.word, 'output': {'count': word.count, 'synonyms': temp.def[0] ? temp.def[0].tr[0].syn : '', 'pos': temp.def[0] ? temp.def[0].pos : ''}};
            console.log(JSON.stringify(format))
        }

    });
});
request.on('error', function (e) {
    console.log(e.message);
});
request.end();

const lookUp = (text) => {
    var result = [];
    var response = {};
    return new Promise((resolve, reject) => {
        try {
            let APIkey = "dict.1.1.20210124T142002Z.58128b6135835b6e.5d00e37c290c4651e49db24a1136eccb06034dda"
            let url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key="+APIkey+"&lang=en-en&text="+text;
            let options = {
                rejectUnauthorized: false,
                method: 'GET'
            }
            var postreq = https.request(url, options, function (res) {
                res.on('data', (d) => {
                    result.push(d);
                });
                let header = res.headers['content-type'];
                res.on("end", function () {
                    var body = Buffer.concat(result);
                    try {
                        if (header) {
                            if (header.includes('json')) {
                                if (body.length > 0) {
                                    var temp = JSON.parse(body.toString());
                                    if (Array.isArray(temp)) {
                                        response.data = JSON.parse(body.toString());
                                    } else {
                                        response = JSON.parse(body.toString())
                                    }
                                } else {
                                    response.data = body.toString();
                                }
                            } else {
                                response.data = body.toString();
                            }
                        } else {

                            response.data = body.toString();
                        }

                    } catch (error) {
                        return reject(error);
                    }
                    return resolve(response);
                });
            });
            postreq.on('error', function (e) {
                console.log(e.message);
            });
            postreq.end();

        } catch(error) {
            return reject(error);
        }
    })
}
