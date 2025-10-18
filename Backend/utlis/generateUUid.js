import fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid';

await fs.appendFile('./uuid.txt', `${uuidv4()}\n`, (err)=> {
    if(err) console.log(err)
    console.log("uuidv4 code generated in uuid.txt")
})

