var axios = require('axios');
var FormData = require('form-data');

export const uploadFileAPI = async (file) => {
    try{
        const formData = new FormData()
        formData.append("file", file)
        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
                'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
                'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
                "Content-Type": "multipart/form-data"
            },
        })
        console.log(resFile)
        return (resFile.data.IpfsHash)
    } catch (error) {
        console.log("Error sending File to IPFS: ")
        console.log(error)
    }
}