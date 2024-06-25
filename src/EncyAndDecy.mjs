
import zlib from 'zlib';

function compressString(inputString) {
  return new Promise((resolve, reject) => {
    zlib.gzip(inputString, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer.toString('base64'));
    });
  });
}

function decompressString(compressedString) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(compressedString, 'base64');
    zlib.gunzip(buffer, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer.toString());
    });
  });
}

export {compressString,decompressString};