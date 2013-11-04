var level = require('level-test')();
var Index = require('./');
var sub = require('level-sublevel');
var test = require('tape');

test('sec', function(t) {
  t.plan(7);

  var db = sub(level('db', { valueEncoding: 'json' }));

  var posts = Index(db.sublevel('posts'))
    .by('Title', 'title')
    .by('Length', ['body.length'])
    .by('Author', ['author', 'title'])
    .db;

  var post = {
    title: 'a title',
    body: 'lorem ipsum',
    author: 'julian'
  };

  posts.put('1337', post, function(err) {
    t.error(err);

    posts.byTitle.get('a title', onPost);
    posts.byLength.get('11', onPost);
    posts.byAuthor.get('julian!a title', onPost);

    function onPost(err, _post) {
      t.error(err);
      t.deepEqual(_post, post);
    }
  });
});

