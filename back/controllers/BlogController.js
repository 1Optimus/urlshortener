import crypto from 'crypto'
var urls=[]
export const postNewUrl = async (req, res) => {
    try {
        var newUrl=crypto.randomBytes(3).toString("hex");
        urls.push({shorter:newUrl, link:req.body.link})
        res.json( {message: "all correct", newLink:"http://localhost:8000/go/"+newUrl} )
    } catch (error) {
        res.status(400)
        res.json( {message: error.message} )
    }
}
export const irToUrl = async (req, res) => {
    try {
        let getUrl=findUrl(req.params.id)
        if (getUrl!=='') {
            res.redirect(getUrl)
        } else {
            res.status(400)
            res.json({message:"This link is not valid"} )
        }
    } catch (error) {
        res.json( {message: error.message} )
    }
}
const findUrl=(code)=>{
    var link=''
    urls.map((data)=>{
        code===data.shorter&&(link=data.link)
    })
    return link
}