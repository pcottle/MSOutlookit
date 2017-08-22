var noTaskbar = 0;
var alwaysHideNSFW = true;
var randomNames = [
  'Rick Deckard',
  'James Bond',
  'Korben Dallas',
  'Danny Ocean',
  'Cha Tae-sik',
  'Homer Hickam',
  'Ben Wade',
  'Jon Osterman',
  'Vincent Freeman',
  'Llewelyn Moss',
  'Richard Winters',
  'Lewis Nixon',
  'George Luz',
  'Lynn Compton',
  'Ronald Speirs',
  'Anton Chigurh',
  'Irene Cassini',
  'Sam Bell',
  'Gerty',
  'Edward Blake',
  'Dan Evans',
  'Charlie Prince',
  'Quentin',
  'Jeong So-mi',
  'Bryan Mills',
  'Rusty Ryan',
  'Linus Caldwell',
  'Jean-Baptiste Emanuel Zorg',
  'Father Vito Cornelius',
  'Ruby Rhod',
  'Chief John Anderton'
];
var idList = [];
var globalStoryDict = {};

function getRandomName() {
  return randomNames[Number(Math.floor(Math.random() * randomNames.length))];
}

function myFolder() {
  this.after = '';
  this.count = 0;
  this.emailDict = {};
  this.subredditname = '';
  this.strippedID = '';
}
var spawnEdge = 100;

function generateUid() {
  var uid = Math.floor((Math.random() * 100000) + 1);
  if (idList.indexOf(uid) > -1) {
    generateUid();
    return;
  }
  return uid;
}

function myWindow(type, state, tofield, ccfield, subjectfield, bodyfield, isLogin) {
  this.type = type;
  this.state = state;
  this.id = String(generateUid());
  this.tofield = tofield;
  this.ccfield = ccfield;
  this.subjectfield = subjectfield;
  this.bodyfield = bodyfield;
  this.idfinder = '#' + String(this.id);
  this.minfinder = '#m' + String(this.id);
  this.isMaxed = false;
  this.oldHeight = null;
  this.oldWidth = null;
  this.oldLeft = null;
  this.oldTop = null;
  globalWindowDict[this.id] = this;
  var html = '<div id="%id" class="emailwindow" style="position:absolute;left:100px;top:300px;"><div class="closebuttons"></div><div class="minimize"></div><div class="maximize"></div><div class="windowclose"></div><div class="upperleftemailwindow"></div><div class="emailwindowbanner"></div><div class="emailbuttons"></div><div class="emailbuttonsbanner"></div><div class="emailcomposewindow"><input type="button" value="Send" class="sendbutton"  tabindex="%tabindex5"><div class="emailcomposebuttons"></div><input type="text" rows="1" cols="40" class="afield tofield" tabindex="%tabindex1" value="%tofield"><input type="text" rows="1" cols="19" class="afield ccfield" tabindex="%tabindex2" value="%ccfield"><input type="text" rows="1" cols="19" tabindex="%tabindex3" class="afield subjectfield" value="%subjectfield"><textarea tabindex="%tabindex4" class="emailcomposebody">%bodyfield</textarea></div></div>';
  if (isLogin) {
    html = html.replace('type="text" rows="1" cols="19" class="afield ccfield', 'type="password" rows="1" cols="19" class="afield ccfield');
  }
  $('.outlookminhi').removeClass('outlookminhi');
  var tempNum = Math.floor(Math.random() * 1000);
  html = html.replace('%tabindex1', tempNum + 1);
  html = html.replace('%tabindex2', tempNum + 2);
  html = html.replace('%tabindex3', tempNum + 3);
  html = html.replace('%tabindex4', tempNum + 4);
  html = html.replace('%tabindex5', tempNum + 5);
  html = html.replace('%id', String(this.id));
  html = html.replace('%bodyfield', bodyfield);
  html = html.replace('%tofield', tofield);
  html = html.replace('%subjectfield', subjectfield);
  html = html.replace('%ccfield', ccfield);
  $('body').append(html);
  $(this.idfinder).css({
    'left': spawnEdge,
    'top': spawnEdge
  });
  spawnEdge += 50;
  if (spawnEdge > $(window).height() - 200) {
    spawnEdge = 50;
  }
  $(this.idfinder).children('.emailcomposewindow').children('.tofield').focus();
  if (tofield.substr(0, 5) == 'reply') {
    $(this.idfinder).children('.emailcomposewindow').children('.emailcomposebody').focus();
  }
  var html = '<div id="m%id" class="emailmin emailminhigh"></div>';
  html = html.replace("%id", String(this.id));
  $('.emailminhigh').removeClass('emailminhigh');
  $('.minholder').append(html);
  var scopeidfinder = this.idfinder;
  var resizeFunc = function() {
    $(scopeidfinder).children('.emailcomposewindow').height($(scopeidfinder).height() - 152);
    var tempheight = $(scopeidfinder).children('.emailcomposewindow').height();
    var tempwidth = $(scopeidfinder).children('.emailcomposewindow').width();
    $(scopeidfinder).children('.emailcomposewindow').children('.emailcomposebody').height(tempheight - 112);
    $(scopeidfinder).children('.emailcomposewindow').children('.emailcomposebody').width(tempwidth - 34);
    $(scopeidfinder).children('.emailcomposewindow').children('.afield').width(tempwidth - 133);
  }
  resizeFunc();
  this.resizeFunc = resizeFunc;
  $(this.idfinder).draggable({
    containment: 'window'
  });
  $(this.idfinder).resizable({
    minHeight: 320,
    minWidth: 673,
    resize: resizeFunc
  });
  $(this.idfinder).children('.emailcomposewindow').children('.sendbutton').click(function() {
    var tofield = $(this).parent().children('.tofield').val();
    var ccfield = $(this).parent().children('.ccfield').val();
    var subjectfield = $(this).parent().children('.subjectfield').val();
    var body = $(this).parent().children('.emailcomposebody').val();
    var id = $(this).parent().parent().attr('id');
    handleEmailSend(id, tofield, ccfield, subjectfield, body);
  });
  $(this.minfinder).click(function() {
    var minid = $(this).attr('id');
    var id = minid.substr(1);
    if ($(this).hasClass('emailminhigh')) {
      $('#' + id).css('display', 'none');
      $('#' + minid).removeClass('emailminhigh');
    } else {
      globalWindowDict[id].bringToFront();
    }
  });
  $(this.idfinder).mousedown(function() {
    globalWindowDict[$(this).attr('id')].bringToFront();
  });
  $(this.idfinder).children('.minimize').click(function() {
    globalWindowDict[$(this).parent().attr('id')].minimize();
  });
  $(this.idfinder).children('.windowclose').click(function() {
    globalWindowDict[$(this).parent().attr('id')].close();
  });
  $(this.idfinder).children('.maximize').click(function() {
    globalWindowDict[$(this).parent().attr('id')].maximize();
  });
  this.bringToFront = function() {
    $('.outlookminhi').removeClass('outlookminhi');
    $('.emailwindow').css('z-index', 50);
    $(this.idfinder).css('z-index', 51);
    $(this.idfinder).css('display', 'block');
    $('.emailminhigh').removeClass('emailminhigh');
    $(this.minfinder).addClass('emailminhigh');
  }
  this.minimize = function() {
    $(this.minfinder).removeClass('emailminhigh');
    $(this.idfinder).css('display', 'none');
  }
  this.close = function() {
    delete globalWindowDict[this.id];
    $(this.minfinder).css('display', 'none');
    $(this.idfinder).css('display', 'none');
    spawnEdge = 100;
  }
  this.maximize = function() {
    $('.outlookminhi').removeClass('outlookminhi')
    if (!this.isMaxed) {
      this.bringToFront();
      var width = $(window).width();
      var height = $(window).height() - 55;
      this.oldWidth = $(this.idfinder).css('width');
      this.oldHeight = $(this.idfinder).css('height');
      this.oldLeft = $(this.idfinder).css('left');
      this.oldTop = $(this.idfinder).css('top');
      $(this.idfinder).css('width', String(width) + 'px');
      $(this.idfinder).css('height', String(height) + 'px');
      $(this.idfinder).css('position', 'absolute');
      $(this.idfinder).css('top', '0px');
      $(this.idfinder).css('left', '0px');
      $(this.idfinder).draggable('disable');
      this.resizeFunc();
      this.isMaxed = true;
    } else {
      this.bringToFront();
      $(this.idfinder).css({
        'width': this.oldWidth,
        'height': this.oldHeight,
        'left': this.oldLeft,
        'top': this.oldTop
      });
      this.resizeFunc();
      $(this.idfinder).draggable('enable');
      this.isMaxed = false;
    }
  }
}

function myStory(parentJson, folder, addToDom) {
  var rootJson = parentJson.data;
  this.rootJson = rootJson;
  this.folder = folder;
  var previewHTML = '<div id="%id" class="anemail emailunread"><div class="emailicon"></div><div class="emailiconright"></div><div class="emailpreview"><div class="emailname">%randomname (%author)</div><div class="emailtitle">(RE:^%score)  %title <br /><span style="color: #3498DB">%subreddit | %domain</span></div></div></div>';
  var name = getRandomName();
  var author = rootJson.author;
  this.id = rootJson.name;
  var num_comments = rootJson.num_comments;
  var score = rootJson.score;
  this.url = rootJson.url;
  this.title = rootJson.title;
  if (rootJson.over_18) {
    if (!alwaysHideNSFW || true) {
      this.title = this.title + '<b><font style="color:red"> NSFW</font></b>';
    }
  }
  previewHTML = previewHTML.replace('%author', author);
  previewHTML = previewHTML.replace('%randomname', name);
  previewHTML = previewHTML.replace('%score', score);
  previewHTML = previewHTML.replace('%title', this.title);
  previewHTML = previewHTML.replace('%subreddit', rootJson.subreddit);
  previewHTML = previewHTML.replace('%domain', rootJson.domain);
  previewHTML = previewHTML.replace('%id', this.id);
  this.previewHTML = previewHTML;
  this.bodyHTML = '';
  folder.emailDict[this.id] = this;
  globalStoryDict[this.id] = this;
  if (addToDom) {
    $('#previewarea').append(previewHTML);
  }
  this.addToArea = function() {
    $('#previewarea').append(this.previewHTML);
  }
}

function getRedditDomain() {
  return (window.location.protocol === 'https:') ?
    'https://pay.reddit.com' :
    'http://www.reddit.com';
}

function populateStory(id) {
  var story = globalStoryDict[id];
  currentStory = id;
  if (story == null) {
    return 0;
  }
  if (story.bodyHTML.length > 1) {
    return 0;
  }
  $('div.theemailbody').html('<img src="loading.gif">');
  var storyName = id.substr(3);
  var link = getRedditDomain() + '/comments/' + storyName + '.json';
  link = link + '?jsonp=commentsCallback';
  $.get(link, commentsCallback, 'jsonp');
  return true;
}
currentStory = null;

function commentsCallback(storyJSON) {
  mainJSON = storyJSON[0].data.children[0].data;
  var theStoryID = mainJSON.name;
  var story = globalStoryDict[theStoryID];
  if (isImgur(mainJSON.url)) {
    var expando = makeImgurExpando(mainJSON.url, mainJSON.title);
    story.bodyHTML += expando;
  } else {
    story.bodyHTML += '<a href="' + mainJSON.url + '">' + mainJSON.title + '</a><br/>';
    if (mainJSON.selftext_html) {
      story.bodyHTML += mainJSON.selftext_html;
    }
  }
  if (mainJSON.isSelf) {
    if (mainJSON.selftext_html != null) {
      story.bodyHTML += mainJSON.selftext_html;
    }
  }
  story.bodyHTML = unEncode(story.bodyHTML);
  story.bodyHTML += '<div class="storycommentline"></div>';
  var commentsRoot = storyJSON[1].data.children;
  var commentsHTML = '';
  for (var i = 0; i < commentsRoot.length; i++) {
    if (commentsRoot[i].kind == 'more') {
      continue;
    }
    var commentJSON = commentsRoot[i].data;
    var author = commentJSON.author;
    var body_html = unEncode(commentJSON.body_html);
    var score = commentJSON.ups - commentJSON.downs;
    var id = commentJSON.name;
    commentsHTML += makeCommentHeader(score, author, body_html, id);
    commentsHTML += '<div class="childrencomments child0">';
    try {
      commentsHTML += getChildComments(commentJSON.replies.data.children, 1);
    } catch (err) {}
    commentsHTML += '</div></div>';
  }
  story.bodyHTML += commentsHTML;
  if (currentStory == theStoryID) {
    $('.theemailbody').html(story.bodyHTML);
    onStoryLoad();
  } else {}
}

function makeCommentHeader(score, author, body_html, id) {
  commentsHTML = '';
  commentsHTML += '<div id="' + id + '" class="commentroot">';
  commentsHTML += '<div class="authorandstuff showhover">';
  commentsHTML += '<span class="score">' + score + '</span> <span class="commentauthor">' + author + '</span>';
  commentsHTML += '</div>';
  commentsHTML += '<div class="commentbody">' + body_html + '</div>';
  return commentsHTML;
}

function getChildComments(jsonroot, level) {
  if (jsonroot == null) {
    return '';
  }
  var tempHTML = '';
  for (var i = 0; i < jsonroot.length; i++) {
    if (jsonroot[i].kind == 'more') {
      continue;
    }
    var commentjson = jsonroot[i].data;
    var author = commentjson.author;
    var body_html = unEncode(commentjson.body_html);
    var score = commentjson.ups - commentjson.downs;
    var id = commentjson.name;
    tempHTML += makeCommentHeader(score, author, body_html, id);
    tempHTML += '<div class="childrencomments child' + level + '">';
    try {
      tempHTML += getChildComments(commentjson.replies.data.children, level + 1);
    } catch (err) {}
    tempHTML += "</div></div>";
  }
  return tempHTML;
}

function unEncode(text) {
  text = text.replace(/&lt;/ig, '<');
  text = text.replace(/&gt;/ig, '>');
  text = text.replace(/\n/g, '<br/>');
  text = text.replace(/&#3232;/g, '?');
  text = text.replace(/&amp;/ig, '&');
  debug = false;
  if (text.indexOf('uploads') != -1) {
    debug = true;
  }
  numcaptures = 4;
  results = /<a href="(http:.*?\.(jpg|jpeg|png|gif|JPEG|GIF|PNG))".*?>(.*?)<\/a>/gi.exec(text);
  while (results != null) {
    var complete = results[0];
    var url = results[1];
    var title = results[3];
    var tempHTML = makeImgurExpando(url, title);
    text = text.replace(complete, tempHTML);
    var tosearch = text.substr(text.indexOf(tempHTML) + tempHTML.length);
    results = /<a href="(http:.*?\.(jpg|jpeg|png|gif|JPEG|GIF|PNG))".*?>(.*?)<\/a>/gi.exec(text.substr(text.indexOf(tempHTML) + tempHTML.length));
  }
  results = /<a.*?href="(http:\/\/imgur.com\/(\w+))".*?>(.*?)<\/a>/g.exec(text);
  while (results != null) {
    for (var i = 0; i < results.length; i += 4) {
      var complete = results[i];
      var url = results[i + 1];
      var code = results[i + 2];
      var title = results[i + 3];
      if (url.toLowerCase().indexOf(".gifv") > -1) {
        url = 'http://i.imgur.com/' + code;
      } else {
        url = 'http://i.imgur.com/' + code + '.jpg';
      }
      var tempHTML = makeImgurExpando(url, title);
      text = text.replace(complete, tempHTML);
    }
    results = /<a.*?href="(http:\/\/imgur.com\/(\w+))".*?>(.*?)<\/a>/g.exec(text);
  }
  results = /<a.*?href="(http:.*?youtube.com.*?v=([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
  if (results == null) {
    results = /<a.*?href="(http:.*?youtu\.be\/([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
  }
  while (results != null) {
    var complete = results[0];
    var url = results[1];
    var code = results[2];
    var title = results[3];
    var tempHTML = makeYoutubeExpando(url, title);
    text = text.replace(complete, tempHTML);
    results = /<a.*?href="(http:\.*?youtube.com\.*?v=(\w+))".*?>(.*?)<\/a>/gi.exec(text);
    if (results == null) {
      results = /<a.*?href="(http:.*?youtu\.be\/([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
    }
  }
  results = /<a href="(http:.*?)".*?>(.*?)<\/a>/gi.exec(text);
  if (results != null) {
    if (results[0].indexOf('youtube.com') == -1 && results[0].indexOf('reddit.com') == -1) {
      var complete = results[0];
      var url = results[1];
      var title = results[2];
      var tempHTML = getLynxdump(url, title);
      text = text.replace(complete, tempHTML);
    }
  }
  return text;
}

function lynxexpandoClick() {
  var tempid = $(this).attr('id');
  var finder = '#lynxexpando' + tempid;
  $(finder).toggle();
  if ($(finder).text() == null || $(finder).text().length < 1) {
    tempLynxAjaxID = finder;
    var finder2 = '#lynxlink' + tempid;
    var thelink = $(finder2).attr('href');
    $(finder).text('Loading... please wait :D this crap takes a while because its my server and not yahoo');
    makePopup('whoops! Sorry I had to take down my own server, I dont support this functionality anymore, but you can go ' +
      ' to the link here: \n ' + thelink);
    return;
  }
}

function textdumpBack(data) {
  textdump = data.textdump;
  textdump = textdump.replace(/\n/g, '</br>');
  $(tempLynxAjaxID).html(textdump);
}

function expandoClick() {
  var tempid = $(this).attr('id');
  var finder = '#img' + tempid;
  $(finder).toggle();
  var resizeFunc = function() {
    var idFinder = finder;
    var height = $(idFinder).children('.ui-wrapper').height();
    var width = $(idFinder).children('.ui-wrapper').width() - 10;
    $(idFinder).children('.ui-wrapper').children('.ui-resizable-e').width(width);
    $(idFinder).children('.ui-wrapper').children('.ui-resizable-e').height(height);
    $(idFinder).children('.ui-wrapper').children('.ui-resizable-e').css('top', '-' + String(height) + 'px');
  }
  $(finder).children('img.normal').resizable({
    'aspectRatio': true,
    resize: resizeFunc
  });
  resizeFunc();
}

function makeImgurExpando(externallink, title) {
  if (externallink.indexOf('i.imgur.com') == -1 && externallink.indexOf('imgur.com') != -1) {
    externallink.replace('imgur.com', 'i.imgur.com');
  }
  if (externallink.substr(-4, 1) != '.' && externallink.indexOf('.jpeg') == -1 && externallink.indexOf('.gifv') == -1) {
    externallink += '.jpg';
    externallink = externallink.replace('?full', '');
  }
  var randId = String(Math.floor(Math.random() * 10000));
  var expando = '<div class="showhover expando" id="' + randId + '" >+</div>';
  if (externallink.indexOf('.gifv') >= 0) {
    externallink = externallink.replace(".gifv", ".mp4");
    expando += '<a href="javascript:void(0)" class="expando" id="' + randId + '">' + title + '</a>';
    expando += '<div id="' + 'img' + randId + '" style="width:100%;display:none">';
    expando += '<video class="normal" id="' + 'ig' + randId + '" class="expandoimg" style="width:100%;" autoplay loop><source src="' + externallink + '" type="video/mp4"></video>';
  } else {
    expando += '<a href="javascript:void(0)" class="expando" id="' + randId + '">' + title + '</a>';
    expando += '<div id="' + 'img' + randId + '" style="width:100%;display:none">';
    expando += '<img class="normal" id="' + 'ig' + randId + '" class="expandoimg" src="' + externallink + '" style="width:100%;" alt="redditlol"/>';
  }
  expando += '</div>';
  return expando;
}

function makeYoutubeExpando(externallink, title) {
  var normallink = /youtube\.com\/watch\?.*?v=([-\w]+)/ig.exec(externallink);
  if (normallink == null) {
    normallink = /youtu\.be\/([-\w]+)/ig.exec(externallink);
  }
  var videoid = normallink[1];
  var expando = '<div class="expando showhover" id="' + videoid + '" >V</div>';
  expando += '<a href="javascript:void(0)" class="expando" id="' + videoid + '">' + title + '</a>';
  expando += '<div style="display:none" id="img' + videoid + '">';
  expando += '<iframe ' + videoid + '" width="560" height="349"';
  expando += ' src="http://www.youtube.com/embed/' + videoid + '" frameborder="0" allowfullscreen></iframe>';
  expando += '</div>';
  return expando;
}

function getLynxdump(externallink, title) {
  var randId = String(Math.floor(Math.random() * 100000));
  //var expando = '<div class="lynxexpando showhover" id="' + randId + '">Lynx</div>';
  //expando += '<a id="lynxlink' + randId + '" href="' + externallink + '">' + title + '</a>';
  //expando += '<div id="lynxexpando' + randId + '" class="lynxexpandodiv" style="display:none"></div>';
  var expando = '<a id="lynxlink' + randId + '" href="' + externallink + '">' + title + '</a>';
  return expando;
}

function isYoutube(externallink) {
  if (externallink.indexOf('youtube.com') != -1 || externallink.indexOf('youtu.be') != -1) {
    return true;
  } else {
    return false;
  }
}

function isImgur(externallink) {
  var filetype = externallink.substr(-3, 3).toLowerCase();
  if (externallink.indexOf('imgur.com') != -1) {
    return true;
  } else if (filetype == 'png' || filetype == 'peg' || filetype == 'jpg' || filetype == 'gif') {
    return true;
  } else {
    return false;
  }
}

function isActuallyImgur(externallink) {
  if (externallink.indexOf('imgur.com') != -1) {
    return true;
  } else {
    return false;
  }
}

function onResize() {
  $('.backgradient').height($(window).height() - 139 + noTaskbar * 60);
  $('.mainrow').height($(window).height() - 166 + noTaskbar * 60);
  $('#previewarea').height($(window).height() - 216 + noTaskbar * 60);
  $('.theemailbody').height($(window).height() - 146 + noTaskbar * 60);
  $('.right').width($(window).width() - 640 + noTaskbar * 60);
  $('.minholder').width($(window).width() - (180 + 170) + noTaskbar * 60);
  $('.folderholder').height($(window).height() - 490 + noTaskbar * 60);
}



function onReload() {
  $('.anemail').click(emailClick);
}

function onStoryLoad() {
  $('.expando').click(expandoClick);
  $('.lynxexpando').click(lynxexpandoClick);
  $('.textreplybutton').click(function() {
    var id = $(this).attr('id').substr(1);
    spawnReplyWindow(id);
  });
  $('.uparrow').click(function() {
    makePopup('Sorry, I dont support upvoting anymore because I had to take down my server');
    return 0;
  });
  $('.downarrow').click(function() {
    makePopup('Sorry, I dont support downvoting anymore because I had to take down my server');
    return 0;
  });
}

function votingCallback(data) {
  var id = data.id;
  var finder = '';
  if (data.dir == 1) {
    finder = 'u' + id;
  } else {
    finder = 'd' + id;
  }
  makeSoftpopup('Voting on ' + id.substr(1) + ' was successful');
  $('#' + finder).addClass('arrowshadow');
  var holder = $('#' + finder).parent().children('.authorandstuff').children('.score');
  var theScore = Number(holder.html());
  theScore += Number(data.dir);
  holder.html(String(theScore));
}

function spawnReplyWindow(id) {
  var asd = new myWindow('', '', 'reply ' + id, '', 'Type your reply below:', '\n\n', false);
}
firsttime = true;

function folderClick(folder_name) {
  currentStory = null;
  current_folder = globalFolderDict[folder_name];
  $('#previewarea').html('');
  if (!firsttime) {
    $('.theemailbody').html('');
    firsttime = false;
  }
  var length = 0;
  for (key in globalFolderDict[folder_name].emailDict) {
    length++;
    break;
  }
  if (length > 0) {
    displayFolder(folder_name);
  } else {
    $('.afolder').unbind('click');
    $('#previewarea').html('<img src="loading.gif"/>');
    var subredditname = folder_name.substr(7);
    var link = getRedditDomain() + '/r/' + subredditname + '/.json';
    if (subredditname == 'FrontPage') {
      link = getRedditDomain() + '/r/all/.json';
    }
    link = link + '?jsonp=folderCallback';
    tempFolderName = folder_name;
    $.get(link, folderCallback, 'jsonp');
  }
}
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function updateClock() {
  var d = new Date();
  var dayOfNumeric = d.getDay();
  var dayOfWeekString = days[dayOfNumeric];
  var dayOfMonth = d.getDate();
  var month = d.getMonth() + 1;
  var year = d.getFullYear();
  var hour = d.getHours();
  var minutes = d.getMinutes();
  if (hour > 12) {
    var amppm = 'PM';
    hour -= 12;
  } else {
    var amppm = 'AM';
  }
  var minuteString = String(minutes);
  if (minutes < 10) {
    minuteString = '0' + minuteString;
  }
  var dateString = String(month) + '/' + String(dayOfMonth) + '/' + String(year);
  var timeString = String(hour) + ':' + minuteString + ' ' + amppm;
  $('.clockholder').html(timeString + '<br/>' + dayOfWeekString + '<br/>' + dateString);
  var secondsToWait = 60 - d.getSeconds();
  setTimeout('updateClock()', 1000 * secondsToWait);
}
globalScrollDict = {};

function moarButton() {
  $('.afolder').unbind('click');
  if (current_folder.subredditname == 'Front Page') {
    var link = getRedditDomain() + '/.json?count=' + current_folder.count + '&after=' + current_folder.after;
  } else {
    var link = getRedditDomain() + '/r/' + current_folder.subredditname + "/.json?count=" + current_folder.count + '&after=' + current_folder.after;
  }
  link += '&jsonp=folderCallback';
  $.get(link, folderCallback, 'jsonp');
}
tempFolderName = null;

function folderCallback(data) {
  console.log('the data is');
  $('.afolder').click(folderIconClick);
  var thefolder = globalFolderDict[tempFolderName];
  if (console.log) {
    console.log('what we got back');
    console.log(data);
  }
  var after = data.data.after;
  globalFolderDict[tempFolderName].after = after;
  globalFolderDict[tempFolderName].count += 25;
  for (var i = 0; i < data.data.children.length; i++) {
    var story = new myStory(data.data.children[i], thefolder, false);
  }
  displayFolder(tempFolderName);
}

function displayFolder(folder_name) {
  if (current_folder == globalFolderDict[folder_name]) {
    $('#previewarea').html('');
    for (key in globalFolderDict[folder_name].emailDict) {
      globalFolderDict[folder_name].emailDict[key].addToArea();
    }
    $('#previewarea').append('<input type="button" value="Load more posts" onclick="moarButton()" >');
    onReload();
  }
}

function handleEmailSend(id, tofield, ccfield, subjectfield, body) {
  if (tofield.substr(0, 9) == 'subreddit') {
    $(globalWindowDict[id].idfinder).css('display', 'none');
    $(globalWindowDict[id].minfinder).css('display', 'none');
    results = tofield.split(' ');
    for (var i = 1; i < results.length; i++) {
      makeFolder(results[i]);
      $('.afolder').click(folderIconClick);
    }
    return 0;
  }
  if (tofield.indexOf('http://') != -1 && tofield.indexOf('reddit.com') != -1) {
    $(globalWindowDict[id].idfinder).css('display', 'none');
    $(globalWindowDict[id].minfinder).css('display', 'none');
    if (tofield.substr(-1) != '/') {
      tofield += '/';
    }
    var link = tofield += '/.json';
    link = link.replace(/\s/g, '');
    link = link + '?jsonp=randomLinkCallback';
    $.get(link, randomLinkCallback, 'jsonp');
    $('.theemailbody').html('<img src="loading.gif">');
    $('.anemailhi').removeClass('anemailhi');
    return 0;
  }
  if (ccfield.length > 0 && ccfield.indexOf('@') == -1) {
    makePopup('sorry, dont support logging in anymore :(');
    $(globalWindowDict[id].idfinder).css('display', 'none');
    $(globalWindowDict[id].minfinder).css('display', 'none');
    return 0;
  }
  if (tofield.substr(0, 5) == 'reply') {
    makePopup('sorry, dont support logging in anymore :(');
    $(globalWindowDict[id].idfinder).css('display', 'none');
    $(globalWindowDict[id].minfinder).css('display', 'none');
    return 0;
  }
  var tempHolder = $(globalWindowDict[id].idfinder).children('.emailcomposewindow').children('.emailcomposebody');
  var tempVal = tempHolder.val();
  tempHolder.val('Error!!! Read below:\n' + tempVal);
}

function emailCallback(data) {}

function replytoCallback(data) {
  makeSoftpopup("Comment posted!");
}

function loginCallback(data) {}

function subredditCallback(data) {
  var subList = data.data.children;
  var tempAlreadyThere = {};
  for (key in globalFolderDict) {
    tempAlreadyThere[globalFolderDict[key].subredditname] = 'yo';
  }
  for (var i = subList.length - 1; i >= 0; i--) {
    var subName = subList[i].data.display_name;
    if (tempAlreadyThere[subName] == null) {
      makeFolder2(subName, true);
    }
  }
  makeSoftpopup('Got all your subreddits');
}

function makePopup(string) {
  $('body').append('<div style="display:none"class="popup notclosed">' + string + '</div>');
  $('.notclosed').slideToggle(400);
  setTimeout('closePopup()', 3000);
  $('.popup').click(function() {
    $(this).slideUp(400);
  });
}

function closePopup() {
  $('.popup').slideUp(400);
}

function makeSoftpopup(string) {
  $('body').append('<div style="display:none" class="softpopup spnotdone">' + string + '</div>');
  $('.spnotdone').fadeIn();
  setTimeout('closeSoftpopup()', 3000);
}

function closeSoftpopup() {
  $('.spnotdone').fadeOut(function() {
    $('.spnotdone').remove();
  });
}

function randomLinkCallback(data) {
  var story = new myStory(data[0].data.children[0], current_folder, true);
  commentsCallback(data);
  $('.theemailbody').html(current_folder.emailDict[story.id].bodyHTML);
  $('.anemail').unbind('click');
  onReload();
  onStoryLoad();
}
var username = '';
var sessionID = '';

function emailClick() {
  if (currentStory != null) {
    globalScrollDict[currentStory] = $('.theemailbody').scrollTop();
  }
  var id = $(this).attr('id');
  if (!populateStory(id)) {
    $('.theemailbody').html(current_folder.emailDict[id].bodyHTML);
    if (globalScrollDict[currentStory] != null) {
      $('.theemailbody').scrollTop(globalScrollDict[currentStory]);
    } else {
      $('.theemailbody').scrollTop(0);
    }
  }
  $('.anemailhi').removeClass('anemailhi');
  $(this).addClass('anemailhi');
  $(this).removeClass('emailunread');
  onStoryLoad();
}

function makeFolder(name) {
  makeFolder2(name, false);
}

function makeFolder2(name, custom) {
  var strippedID = 'folder_' + name.replace(/\s/g, '');
  globalFolderDict[strippedID] = new myFolder();
  globalFolderDict[strippedID].strippedID = strippedID;
  globalFolderDict[strippedID].subredditname = name;
  var tempHTML = '<div class="afolderwrapper "><div class="afolder" id="' + strippedID + '">' + name + '</div></div>';
  if (custom) {
    tempHTML = tempHTML.replace('afolderwrapper', 'afolderwrapper customfolder');
  }
  $('.foldwraphi').removeClass('foldwraphi');
  $('.folderholder').append(tempHTML);
  $('#' + strippedID).click(folderIconClick);
  return globalFolderDict[strippedID];
}

function folderIconClick() {
  $('.foldwraphi').removeClass('foldwraphi');
  $(this).parent().addClass('foldwraphi');
  folderClick($(this).attr('id'));
}
globalWindowDict = {};
globalFolderDict = {};

function spawnCommandWindow() {
  var usage = "Usage:\n\n";
  usage += "Add subreddits:\n";
  usage += "\tIn the TO field, type subreddit [subredditname]+\n\texample: subreddit starcraft linux programming\n";
  usage += "\n\nGo to a comments page:\n\tJust paste in the link in the to field and hit send! example:\n";
  usage += "\thttp://www.reddit.com/r/gaming/comments/jkiu2/battlefield_3_caspian_border_gameplay_hd";
  var asd = new myWindow('', '', '', '', '', usage, true);
}

function addSubReddit() {
    var subreddit = prompt("Please enter a subreddit name");
    if (subreddit != null) {
        makeFolder(subreddit);
    }
}
$(document).ready(function() {
  onResize();
  $(window).resize(onResize);
  $('.newemailbutton').click(addSubReddit);
  main_inbox = makeFolder('Front Page');
  makeFolder('gaming');
  makeFolder('pics');
  makeFolder('askreddit');
  makeFolder('jokes');
  makeFolder('funny');
  makeFolder('iama');
  makeFolder('wtf');
  $('#folder_FrontPage').parent().addClass('foldwraphi');
  folderClick('folder_FrontPage');
  $('.outlookmin').click(function() {
    for (key in globalWindowDict) {
      globalWindowDict[key].minimize();
    }
    $(this).addClass('outlookminhi');
  });
  $('.authorandstuff').keyup(function(event) {
    if (event.keyCode == 82) {
      var id = $('.commentroothi').parent().attr('id');
      if (id != null) {
        spawnReplyWindow(id);
      } else {
        spawnCommandWindow();
      }
    }
  });
});
