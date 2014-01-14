var MemDB = require('memdb');
var Index = require('..');
var sub = require('level-sublevel');
var test = require('tape');
var multilevel = require('multilevel');
var createManifest = require('level-manifest');

test('multilevel object', function(t) {
  t.plan(7);

  var db = sub(MemDB({ valueEncoding: 'json' }));
  db.posts = Index(db.sublevel('posts'))
    .by('Title', 'title')
    .by('Length', ['body.length'])
    .by('Author', ['author', 'title'])
    .db;

  db.methods = db.methods || {};
  db.methods.posts = {
    type: 'object',
    methods: createManifest(db.posts).methods
  };
  var manifest = createManifest(db);
  
  var server = multilevel.server(db);
  var client = multilevel.client(manifest);

  server.pipe(client.createRpcStream()).pipe(server);

  var post = {
    title: 'a title',
    body: 'lorem ipsum',
    author: 'julian'
  };

  client.posts.put('1337', post, function(err) {
    t.error(err);

    client.posts.byTitle.get('a title', onPost);
    client.posts.byLength.get('11', onPost);
    client.posts.byAuthor.get('julian!a title', onPost);

    function onPost(err, _post) {
      t.error(err);
      t.deepEqual(_post, post);
    }
  });
});

