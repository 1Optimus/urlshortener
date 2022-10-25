import express  from "express"
import cors from 'cors'
import rutas from './routes/routes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/', rutas)
app.listen(8000, ()=>{
    console.log('Server UP running in http://localhost:8000/')
})