const path    = require('path')
const express = require('express')
const hbs = require('hbs')
const geoCode = require('./utils/geoCode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsDirectoryPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)

//Setup Static directory to serve
app.use(express.static(publicDirectoryPath))
hbs.registerPartials(partialsDirectoryPath)

app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather',
        name: 'Ravi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful Text!',
        title: 'Help',
        name: 'Ravi'
    })
})

app.get('/about', (req, res) => {
   res.render('about', {
       title: 'About Me',
       name: 'Ravi'
   })
})

app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: 'Location address to be provided.'
        })
    }

    geoCode(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
           return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
      return  res.send({
          error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ravi',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ravi',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Service is up and running on port ' + port)
})
