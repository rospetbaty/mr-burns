
'use strict'

const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')
const config = require('./config/config')
const commands = require('./commands')
const helpCommand = require('./commands/help')

let bot = require('./bot')

let app = express()

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') })
/*
app.post('/commands/mr-burns', (req, res) => {
  let payload = req.body

  if (!payload || payload.token !== config('MRBURNS_COMMAND_TOKEN')) {
    let err = 'Release the Hounds! An invalid command was provided'
    console.log(err)
    res.status(401).end(err)
    return
  }

  let cmd = _.reduce(commands, (a, cmd) => {
    return payload.text.match(cmd.pattern) ? cmd : a
  }, helpCommand)

  cmd.handler(payload, res)
})
*/
app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n🚀  Mr Burns LIVES on PORT ${config('PORT')} 🚀`)

  if (config('SLACK_TOKEN')) {
    console.log(`🤖  beep boop: @mr-burns is alive\n`)
    bot.listen({ token: config('SLACK_TOKEN') })
  }
})
