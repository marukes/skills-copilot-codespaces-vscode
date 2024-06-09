// Create web server and start listening on port 8080
// Create a web server that listens on port 8080
const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const { getComments, addComment } = require('./comments');
const { getPost, addPost } = require('./posts');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/comments') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(getComments()));
    } else if (req.url === '/posts') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(getPost()));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
    }
  } else if (req.method === 'POST') {
    if (req.url === '/comments') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const comment = parse(body);
        addComment(comment);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getComments()));
      });
    } else if (req.url === '/posts') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const post = parse(body);
        addPost(post);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getPost()));
      });
    }
  }
});

server.listen(8080, () => {
  console.log('Server started on http://localhost:8080');
});
