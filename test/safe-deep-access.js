var MemDB = require('memdb');
var Index = require('..');
var sub = require('level-sublevel');
var test = require('tape');

test('sec', function(t) {
  t.plan(5);

  var db = sub(MemDB({ valueEncoding: 'json' }));

  var posts = Index(db.sublevel('posts'))
    .by('Title', 'title')
    .by('Length', ['body.length'])
    .by('Author', ['author', 'title'])
    .db;

  var post = {
    title: 'a title',
    author: 'julian'
  };

  posts.put('1337', post, function(err) {
    t.error(err);

    posts.byTitle.get('a title', onPost);
    posts.byAuthor.get('julian!a title', onPost);

    function onPost(err, _post) {
      t.error(err);
      t.deepEqual(_post, post);
    }
  });
});
