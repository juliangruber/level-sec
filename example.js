var Index = require('./');
var level = require('level');
var sub = require('level-sublevel');

var db = sub(level('db', { valueEncoding: 'json' }));

var posts = Index(db.sublevel('posts'))
  .by('Title', ['title'])
  .by('Length', ['body.length'])
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
