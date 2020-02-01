'use strict'
const boilerplate = require('@skynet1024/probot-serverless');
const path = require('path');
const express = require('express');
const debug = require('debug');

const contextDebugListener = description => ctx => debug('listener:' + description)("payload - %o", ctx.payload)

const appFn = ctx => {
  ctx.on('*', contextDebugListener('*'))
  ctx.on('installation', contextDebugListener('installation'))
  ctx.on('installation.created', contextDebugListener('installation'))

  const router = ctx.route();
  router.get('/ping', (req, res) => {
    res.type('txt')
    res.send('pong')
  })

  router.get('/render-view-example', (req, res) => 
      // render the view foobar
      res.render("foobar", { message: 'Hello from handlebars', ts: new Date() }))

  router.get('/render-json-example', (req, resp) => resp.json({'js': 'on'}))

  router.use('/static', express.static(path.join(__dirname, 'static')))

};

const expressFunction = app => {
  app.set('view engine', 'hbs')
  app.set('views', path.join(__dirname, 'views'))
};

const opts = { appFn, expressFunction };

let handler = null;

if (process.env.SERVERLESS === "SERVERLESS") {
  handler = boilerplate.setupServerless(opts);
} else {
  boilerplate.setupServer(opts);
}

module.exports = {
  handler
};