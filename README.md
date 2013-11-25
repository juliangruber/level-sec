# level-sec

High-level API for creating secondary indexes using
[level-secondary](https://github.com/juliangruber/level-secondary). Also works over [multilevel](https://github.com/juliangruber/multilevel).

[![build status](https://secure.travis-ci.org/juliangruber/level-sec.png)](http://travis-ci.org/juliangruber/level-sec)

## Example

Index posts by title and body length, then query for them:

```js
var Index = require('level-sec');
var level = require('level');
var sub = require('level-sublevel');

var db = sub(level('db', { valueEncoding: 'json' }));

var posts = Index(db.sublevel('posts'))
  .by('Title', 'title')
  .by('Length', 'body.length')
  .by('Author', ['author', 'title'])
  .db;

var post = {
  title: 'a title',
  body: 'lorem ipsum',
  author: 'julian'
};

posts.put('1337', post, function(err) {
  if (err) throw err;

  posts.byTitle.get('a title', console.log);
  posts.byLength.get('11', console.log);
  posts.byAuthor.get('julian!a title', console.log);
});
```

## API

### Index(db)

Index `db`.

### Index#by(name, props)

Create an index called `name` and index by `props`.

`props` should be a string or an array of strings that each name a property.
Deep object access is enabled via
[deep-access](https://github.com/juliangruber/deep-access). Use multiple
properties if you can't guarantee the uniqueness of the first property's
value.

### Index.db

The underlying `db`.

### Index.db.by{Name}.get(key[, opts], fn)
### Index.db.by{Name}.create{Key,Value,Read}Stream([opts])

See [level-secondary](https://github.com/juliangruber/level-secondary).

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
