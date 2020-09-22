const request  = require('postman-request')

const forecast = (latitude, longitude,  callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=c667039aab0190f6f422f7d0781a7624&query=' + latitude + ',' + longitude +'&units=m'

    request( {url, json: true}, (error, {body}) => {
        //const data = JSON.parse(response.body)
        //console.log(data.current)    
        //console.log(response.body.current)
        if(error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to get forecast. Try searching with different location.', undefined)
        }
        else {
            const data = body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + 
                                ' degrees out there. It feels like ' + body.current.feelslike + ' degrees.'
            callback(undefined, data)
        }    
    } )
} 

module.exports = forecast