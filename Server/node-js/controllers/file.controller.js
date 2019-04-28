const { PracticeTime } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const fs = require('fs');
const opn = require('opn');

const get = function(req, res){
    // let practice = req.practice;
    
    const path = '.' + req.url;
    // const path = 'uploads/' + req.params.folder + '/' + req.params.filename;
    // const baseUrl = 'uploads/';
    // const path = baseUrl + req.params.folder + '/' + req.params.filename;

    const stat = fs.statSync(path);
    const fileSize = stat.size;
    //const range = req.headers.range;
    
    if (fileSize) {
        console.log('FILE', stat);
        opn(path).then(() => {
            // image viewer closed
        });
    }

    // if (range) {
    //     const parts = range.replace(/bytes=/, "").split("-")
    //     const start = parseInt(parts[0], 10)
    //     const end = parts[1] 
    //       ? parseInt(parts[1], 10)
    //       : fileSize-1
    //     const chunksize = (end-start)+1
    //     const file = fs.createReadStream(path, {start, end})
    //     const head = {
    //       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    //       'Accept-Ranges': 'bytes',
    //       'Content-Length': chunksize,
    //       'Content-Type': 'video/webm',
    //     }

    //     res.writeHead(206, head);
    //     file.pipe(res);
    // } else {
    //     const head = {
    //       'Content-Length': fileSize,
    //       'Content-Type': 'video/webm',
    //     }
        
    //     res.writeHead(200, head);
    //     fs.createReadStream(path).pipe(res);
    // }

    return ReS(res);
    // return;
}
module.exports.get = get;