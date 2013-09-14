
# level-sec

High-level API for creating secondary indexes using
[level-secondary](https://github.com/juliangruber/level-secondary).

[![build status](https://secure.travis-ci.org/juliangruber/level-sec.png)](http://travis-ci.org/juliangruber/level-sec)

## Example

Index posts by title and body length, then query for them:

```js
var level = require('level');
var Index = require('level-sec');
var sub = require('level-sublevel');

var db = sub(level(__dirname + '/db', {
  valueEncoding: 'json'
}));

var posts = Index(db.sublevel('posts'))
  .by('title')
  .by('length', function(post) { return post.body.length })
  .db;

posts.put('1337', {
  title: 'a title',
  body: 'lorem ipsum'
}, function(err) {
  if (err) throw err;

  posts.byTitle.get('a title', function(err, post) {
    if (err) throw err;
    console.log('get', post);

    posts.del('1337', function(err) {
      if (err) throw err;
      posts.byTitle.get('a title', function(err) {
        console.log(err.name)
      });
    });
  });

  posts.byLength.createReadStream({
    start: 10,
    end: 20
  }).on('data', console.log.bind(console, 'read'));

  posts.byLength.createKeyStream({
    start: 10,
    end: 20
  }).on('data', console.log.bind(console, 'key'));

  posts.byLength.createValueStream({
    start: 10,
    end: 20
  }).on('data', console.log.bind(console, 'value'));
});
```

## API

### Index(db)

Index `db`.

### Index#by(name[, fn])

Index by property `name` and optional function `fn`.
See [level-secondary](https://github.com/juliangruber/level-secondary).

### Index.db

The underlying `db`.

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install level-sec
```

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
