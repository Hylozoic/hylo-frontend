angular.module('hyloFilters', ['ngSanitize'])

.filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  }
}).

// Filter to convert urls in text like "www.test.com" into clickable links.
// This should be used on top of the linky filter, ie: {{ expression | linky | linkyShort}}
filter('linkyShort', [ '$sanitize', function($sanitize) {
  return function(text) {
    if (!text) return text;
    //URLs starting with "www."
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var replacedText = text.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //returns the text result
    return replacedText;
  }
}]).

filter('hashtag', [ '$sce', function($sce) {
  return function(text) {
    if (!text) return text;
    // convert hashtags into clickable items
    var replacePattern = /^#([a-zA-Z0-9]+)|\s#([a-zA-Z0-9]+)/g;
    var replacedText = text.replace(replacePattern, function(hash) {
      var trimmedHash = hash.trim();
      return '<a class="hashtag" ui-sref="community.search({community: $root.community.slug, q: \'' + trimmedHash + '\'})">'+hash+'</a>';
    });

    var cleaned = $sce.trustAsHtml(replacedText);

    return cleaned;
  }
}]).

filter('userMention', [ '$sce', function($sce) {
  return function(text) {
    if (!text) return text;
    // convert user mentions into clickable items
    var replacePattern = /\[~([0-9]+)~([^\]]*)\]/g;
    var replacedText = text.replace(replacePattern, '<a class="userProfile" ui-sref="profile({id: \'$1\'})">$2</a>');
    console.log(replacedText);

    var cleaned = $sce.trustAsHtml(replacedText);

    return cleaned;
  }
}]).

filter('capitalize', function() {
  return function(input, scope) {
    if (!input) { return input }

    input = input.toLowerCase();
    return input.substring(0,1).toUpperCase()+input.substring(1);
  }
}).

filter('convertCarriageReturn', [ function() {
  return function(text) {
    if (!text) return text;

    var replacedText = text.replace(/(\r\n|\n|\r|&#10;)/g, "<br/>");
    return replacedText;
  }
}]).

filter('postPrefix', function() {
  return function(postType) {
    var prefix;
    switch (postType) {
      case 'request': prefix = 'is looking for'; break;
      case 'intention': prefix = 'would like to create'; break;
      case 'offer': prefix = 'would like to share'; break;
    }
    return prefix;
  }
}).

filter('postPrompt', function() {
  return function(postType) {
    var prompt;
    switch (postType) {
      case 'request': prompt = "I'm looking for"; break;
      case 'intention': prompt = "I'd like to create"; break;
      case 'offer': prompt = "I'd like to share"; break;
    }
    return prompt;
  }
}).

// A reputation prompt filter
filter('repPrompt', function() {
  return function(repType) {
    var prompt;
    switch (repType) {
      case 'TY': prompt = "Thanked for "; break;
      case 'C': prompt = "Contributed to "; break;
    }
    return prompt;
  }
}).

filter('postDescPlaceholder', function() {
  return function(postType) {
    var prompt;
    switch (postType) {
      case 'request': prompt = "Why do you need this? Any important dates or details we should know about?"; break;
      case 'intention': prompt = "Why would you like to do this? Any important details? What do you need?"; break;
      case 'offer': prompt = "Any important dates or details we should know about?"; break;
    }
    return prompt;
  }
}).

filter('postTitlePlaceholder', function() {
  return function(postType) {
    var prompt;
    switch (postType) {
      case 'request': prompt = "What are you looking for that your community may have or be able to connect you to?"; break;
      case 'intention': prompt = "What would you like to create?"; break;
      case 'offer': prompt = "What would you like to share with your community?"; break;
    }
    return prompt;
  }
});
