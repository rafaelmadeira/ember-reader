App.Feed = DS.Model.extend({
  name: DS.attr('string'),
  url: DS.attr('string'),

  feedItems: DS.hasMany('App.FeedItem'),

  refresh: function() {
    var url = this.get('url');
    var googleUrl = document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url);
    $.ajax({
      url: googleUrl,
      dataType: 'json',
      context: this,
      success: function(data) {
        var feed = data.responseData.feed;
        var items = feed.entries.forEach(function(entry) {
          if(this.get('feedItems').findProperty('link', entry.link)) {
            return;
          }
          var feedItem = this.get('feedItems').createRecord({
            title: entry.title,
            author: entry.author,
            body: entry.content,
            bodySnippet: entry.contentSnippet,
            link: entry.link,
            publishedDate: entry.publishedDate
          });
        }, this);
        this.get('store').commit();
      }
    });
  }
});

App.Feed.FIXTURES = [
  {id: 1, name: 'CodeBrief', url: 'http://codebrief.com/atom.xml'},
  {id: 2, name: 'GroupTalent Blog', url: 'https://grouptalent.com/blog/feed.xml'}
];