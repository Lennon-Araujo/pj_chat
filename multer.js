const multer = require('multer');
const crypto = require('crypto');
const path = require('path');


module.exports = {
    dest: path.resolve(__dirname, "uploads"),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb (null, path.resolve(__dirname, "uploads"));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, fileName);
            });
        },

    }),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },


}