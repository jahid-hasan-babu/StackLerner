const fs = require('fs/promises')
const path = require('path')
const dbPath = path.resolve('src/data', 'db.json')


exports.readFile = async () =>{
    const data = await fs.readFile(dbPath)
    return JSON.parse(data)
}

exports.writefile = async (data) =>{
    await fs.writeFile(dbPath, JSON.stringify(data))

}