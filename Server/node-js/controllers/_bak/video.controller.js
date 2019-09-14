const { PracticeTime } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const fs = require('fs');

const get = function(req, res){
    let practice = req.practice;

    //const path = 'uploads/zni4N4dt23mQT_AvRcD3yw6n.webm';
    // const path = 'uploads/' + req.params.folder + '/' + req.params.filename;

    // change ext to mp4
    // media path
    let mediaPath = req.url;
    let mediaPathArray  = mediaPath.split('.');
    
    let mediaFileExt = mediaPathArray[mediaPathArray.length - 1];
    let contentType;
    
    switch (mediaFileExt) {
      case 'mp4':
        contentType = 'video/mp4';
        break;
      case 'webm':
        contentType = 'video/webm';
        break;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        contentType = 'image/' + mediaFileExt;
        break;
      default:
        break;
    }

    const path = '.' + mediaPath;

    console.log('FILE EXT', mediaFileExt);
    console.log('CONTENT TYPE', contentType);
    console.log('MEDIA PATH', path);

    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
          ? parseInt(parts[1], 10)
          : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
        }

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': contentType,
        }
        
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }

    // return ReS(res, {});
}
module.exports.get = get;