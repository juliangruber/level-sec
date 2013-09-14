var level = require('level-test')();
var Index = require('./');
var sub = require('level-sublevel');

var db = sub(level('db', {
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
