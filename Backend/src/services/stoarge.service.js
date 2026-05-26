const ImageKit = require("@imagekit/nodejs")

const imageKit = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile(buffer){
    console.log(buffer)
    const result = await imageKit.files.upload({
        file : buffer.toString("base64"),
        fileName : `user_${Date.now()}.jpg`
    })
    return result;
}

module.exports = uploadFile;