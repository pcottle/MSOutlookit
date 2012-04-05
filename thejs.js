

var noTaskbar = 0;

var alwaysHideNSFW = true;

var randomNames = [
	'Rick Deckard - HR',
	'James Bond - Operations',
	'Korben Dallas - Transportation',
	'Danny Ocean - Talent Acquisition',
	'Cha Tae-sik - Global',
	'Homer Hickam - Aeronautics',
	'Ben Wade - Management',
	'Jon Osterman - R&D',
	'Vincent Freeman - Astronautics',
	'Llewelyn Moss - Agriculture',
	'Richard Winters - Operations',
	'Lewis Nixon - Operations',
	'George Luz - Operations',
	'Larry Compton - Operations',
	'Ronald Speirs - Operations',
	'Anton Chigurh - Headhunting',
	'Irene Cassini - Astronautics', 
	'Sam Bell - minerals',
	'Gerty - Automation',
	'Edward Blake - Morale Department',
	'Dan Evans - Agriculture',
	'Charlie Prince - Internal Affairs',
	'Quentin - Aeronautics',
	'Jeong So-mi - Intern',
	'Bryan Mills - Retainment Department',
	'Rusty Ryan - Operations',
	'Linus Caldwell - Reconnaissance',
	'Jean-Baptiste Emanuel Zorg - VP',
	'Father Vito Cornelius - Legacy',
	'Ruby Rhod - Marketing',
	'Chief John Anderton - Market Prediction'
	
	];



var globalStoryDict = {};

function getRandomName()
{
	return randomNames[Number(Math.floor(Math.random()*randomNames.length))];
}

function myFolder()
{
	this.after = '';
	this.count = 0;
	this.emailDict = {};
	this.subredditname = '';
	this.strippedID = '';
}

var spawnEdge = 100;
function myWindow(type, state, tofield, ccfield, subjectfield, bodyfield, isLogin)
{
	this.type = type;
	this.state = state;
	this.id = String(Math.floor(Math.random()*10000));
	this.tofield = tofield;
	this.ccfield = ccfield;
	this.subjectfield = subjectfield;
	this.bodyfield = bodyfield;
	this.idfinder = '#' + String(this.id);
	this.minfinder = '#m' + String(this.id);
	this.isMaxed = false;

	//maximization support
	this.oldHeight = null;
	this.oldWidth = null;
	this.oldLeft = null;
	this.oldTop = null;

	//add myself to dict
	globalWindowDict[this.id] = this;
	//add myself to the DOM
	var html = '<div id="%id" class="emailwindow" style="position:absolute;left:100px;top:300px;"><div class="closebuttons"></div><div class="minimize"></div><div class="maximize"></div><div class="windowclose"></div><div class="upperleftemailwindow"></div><div class="emailwindowbanner"></div><div class="emailbuttons"></div><div class="emailbuttonsbanner"></div><div class="emailcomposewindow"><input type="button" value="Send" class="sendbutton"  tabindex="%tabindex5"><div class="emailcomposebuttons"></div><input type="text" rows="1" cols="40" class="afield tofield" tabindex="%tabindex1" value="%tofield"><input type="text" rows="1" cols="19" class="afield ccfield" tabindex="%tabindex2" value="%ccfield"><input type="text" rows="1" cols="19" tabindex="%tabindex3" class="afield subjectfield" value="%subjectfield"><textarea tabindex="%tabindex4" class="emailcomposebody">%bodyfield</textarea></div></div>';
	if(isLogin)
	{
		html = html.replace('type="text" rows="1" cols="19" class="afield ccfield','type="password" rows="1" cols="19" class="afield ccfield');
	}
	//unhighlight outlook
	$('.outlookminhi').removeClass('outlookminhi');
	//tabindex stuff
	//we actually can't just do numbers because 2 windows might be open
	var tempNum = Math.floor(Math.random() * 1000);
	html = html.replace('%tabindex1',tempNum+1);
	html = html.replace('%tabindex2',tempNum+2);
	html = html.replace('%tabindex3',tempNum+3);
	html = html.replace('%tabindex4',tempNum+4);
	html = html.replace('%tabindex5',tempNum+5);

	html = html.replace('%id',String(this.id));
	
	html = html.replace('%bodyfield',bodyfield);
	html = html.replace('%tofield',tofield);
	html = html.replace('%subjectfield',subjectfield);
	html = html.replace('%ccfield',ccfield);

	$('body').append(html);
	//go to the correct spawn edge
	$(this.idfinder).css({'left':spawnEdge,'top':spawnEdge});
	spawnEdge += 50;
	if(spawnEdge > $(window).height()-200)
	{
		spawnEdge = 50;
	}
	//also focus on that to field
	$(this.idfinder).children('.emailcomposewindow').children('.tofield').focus();	

	//actually we will focus on the subject if we are replying
	if(tofield.substr(0,5) == 'reply')
	{
		$(this.idfinder).children('.emailcomposewindow').children('.emailcomposebody').focus();
	}

	//add the minimize thing
	var html = '<div id="m%id" class="emailmin emailminhigh"></div>';
	html = html.replace("%id",String(this.id));
	//unhighlight all the others because we are the top now
	$('.emailminhigh').removeClass('emailminhigh');
	
	$('.minholder').append(html);
	
	
	var scopeidfinder = this.idfinder;
	//resize function WITH CLOSURES YEAH BABYYY
	//this is an excellent use of closures. Still digesting...
	var resizeFunc = function () {
		//the back shading :O I probably wouldn't have to do this
		//if i had used some fancy divs with margins or something but it seems
		//like theres no option. yay jquery and javascript
		$(scopeidfinder).children('.emailcomposewindow').height($(scopeidfinder).height()-152);
		var tempheight = $(scopeidfinder).children('.emailcomposewindow').height();
		var tempwidth = $(scopeidfinder).children('.emailcomposewindow').width();
		$(scopeidfinder).children('.emailcomposewindow').children
						('.emailcomposebody').height(tempheight - 112);
		$(scopeidfinder).children('.emailcomposewindow').children
						('.emailcomposebody').width(tempwidth - 34);
		
		$(scopeidfinder).children('.emailcomposewindow').children
						('.afield').width(tempwidth - 133);
		
	}
	//init resize
	resizeFunc();
	//keep it for later on maximize
	this.resizeFunc = resizeFunc;
	//events
	$(this.idfinder).draggable({containment:'window'});
	$(this.idfinder).resizable({
					minHeight:320,
					minWidth:673,
					resize:resizeFunc
					});
	$(this.idfinder).children('.emailcomposewindow').children('.sendbutton').click(function(){
		//the function to do all the actual handling of stuff
		var tofield = $(this).parent().children('.tofield').val();
		var ccfield = $(this).parent().children('.ccfield').val();
		var subjectfield = $(this).parent().children('.subjectfield').val();
		var body = $(this).parent().children('.emailcomposebody').val();
		var id = $(this).parent().parent().attr('id');
		//do the email send
		handleEmailSend(id,tofield,ccfield,subjectfield,body);
	});
	
	$(this.minfinder).click(function(){
		//get your minid
		var minid = $(this).attr('id');
		//get the string portion ?
		var id = minid.substr(1);
		//if we are already highlighted, hide us
		if($(this).hasClass('emailminhigh'))
		{
			//hide the window
			$('#' + id).css('display','none');
			$('#' + minid).removeClass('emailminhigh');
		}
		else
		{
			//open up the window
			globalWindowDict[id].bringToFront();
		}
	});
	
	$(this.idfinder).mousedown(function(){
		globalWindowDict[$(this).attr('id')].bringToFront();
	});

	//buttons. these don't use closures and could be general but
	//for the sake of window initialization i will have them here
	$(this.idfinder).children('.minimize').click(function(){
		globalWindowDict[$(this).parent().attr('id')].minimize();
	});

	$(this.idfinder).children('.windowclose').click(function(){
		globalWindowDict[$(this).parent().attr('id')].close();
	});

	$(this.idfinder).children('.maximize').click(function(){
		globalWindowDict[$(this).parent().attr('id')].maximize();
	});

	this.bringToFront = function()
	{
		//undo the outlook one
		$('.outlookminhi').removeClass('outlookminhi');
		$('.emailwindow').css('z-index',50);
		$(this.idfinder).css('z-index',51);
		$(this.idfinder).css('display','block');
		$('.emailminhigh').removeClass('emailminhigh');
		$(this.minfinder).addClass('emailminhigh');
	}

	this.minimize = function()
	{
		//basically just go to display none and unhighlight your mind
		$(this.minfinder).removeClass('emailminhigh');
		$(this.idfinder).css('display','none');
	}
	
	this.close = function()
	{
		//we will even delete ourselves from the global dict
		delete globalWindowDict[this.id];
		$(this.minfinder).css('display','none');
		$(this.idfinder).css('display','none');
		spawnEdge = 100;
	}

	this.maximize = function()
	{
		$('.outlookminhi').removeClass('outlookminhi')
		if(!this.isMaxed)
		{
			this.bringToFront();
			//get correct height and stuff
			var width = $(window).width();
			var height = $(window).height() - 55;

			//store old variables
			this.oldWidth = $(this.idfinder).css('width');
			this.oldHeight = $(this.idfinder).css('height');
			this.oldLeft = $(this.idfinder).css('left');
			this.oldTop = $(this.idfinder).css('top');

			$(this.idfinder).css('width',String(width) + 'px');
			$(this.idfinder).css('height',String(height) + 'px');
			$(this.idfinder).css('position','absolute');
			$(this.idfinder).css('top','0px');
			$(this.idfinder).css('left','0px');
			
			//cant drag if maximized
			$(this.idfinder).draggable('disable');

			this.resizeFunc();
			this.isMaxed = true;
		}
		else
		{
			//do stuff
			this.bringToFront();
			$(this.idfinder).css({
					'width':this.oldWidth,
					'height':this.oldHeight,
					'left':this.oldLeft,
					'top':this.oldTop
				});
			this.resizeFunc();
			$(this.idfinder).draggable('enable');
			this.isMaxed = false;
		}

	}
}

function myStory(parentJson,folder,addToDom)
{
	var rootJson = parentJson.data;
	this.rootJson = rootJson;
	this.folder = folder;
	
	//first make the HTML for the preview
	//Im sure there's a better way to do this but who knows...
	var previewHTML = '<div id="%id" class="anemail emailunread"><div class="emailicon"></div><div class="emailiconright"></div><div class="emailpreview"><div class="emailname">%randomname (%author)</div><div class="emailtitle">(RE:^%score)  %title</div></div></div>';
	//replace all the necessary things
	var name = getRandomName();
	var author = rootJson.author;
	this.id = rootJson.name;
	var num_comments = rootJson.num_comments;
	var score = rootJson.score;
	this.url = rootJson.url;
	this.title = rootJson.title;
	//console.log(rootJson);

	//if over18
	if(rootJson.over_18)
	{
		if(!alwaysHideNSFW || true)
		{
			this.title = this.title + '<b><font style="color:red"> NSFW</font></b>';
		}
	}
	
	//theres DEF a better way to do this. too busy hackin'
	//If you are an employer don't judge!
	previewHTML = previewHTML.replace('%author',author);
	previewHTML = previewHTML.replace('%randomname',name);
	previewHTML = previewHTML.replace('%score',score);
	previewHTML = previewHTML.replace('%title',this.title);
	previewHTML = previewHTML.replace('%id',this.id);
	
	this.previewHTML = previewHTML;
	this.bodyHTML = '';
	
	//now that we have id
	folder.emailDict[this.id] = this;
	globalStoryDict[this.id] = this;
	
	//add to the preview area
	if(addToDom)
	{
		$('#previewarea').append(previewHTML);
	}
	//do body later when populating
	
	this.addToArea = function()
	{
		$('#previewarea').append(this.previewHTML);
	}

}

function populateStory(id)
{
	var story = globalStoryDict[id];
	currentStory = id;	
	if(story == null)
	{
		//ruh rho
		//not in database!
		return 0;
	}
	
	if(story.bodyHTML.length > 1)
	{
		//if we already loaded just peace
		return 0;
	}
	//now we have to load the story...
	$('div.theemailbody').html('<img src="loading.gif">');

	var storyName = id.substr(3);
	var link = "http://www.reddit.com/comments/" + storyName + '.json';
	//go get this stuff
	$.get('http://www.thebearfeed.com/msoutlookit/get_page',{'link':link},commentsCallback,'jsonp');

	//we are loading, so return true
	return true;
}
currentStory = null;

function commentsCallback(storyJSON)
{
	mainJSON = storyJSON[0].data.children[0].data;
	var theStoryID = mainJSON.name;	
	var story = globalStoryDict[theStoryID];

	if(isImgur(mainJSON.url))
	{
		//is an image
		var expando = makeImgurExpando(mainJSON.url,mainJSON.title);
		story.bodyHTML += expando;
	}
	else
	{
		story.bodyHTML += '<a href="' + mainJSON.url + '">' + mainJSON.title + '</a><br/>';
		if(mainJSON.selftext_html)
		{
			story.bodyHTML += mainJSON.selftext_html;
		}
	}
	//add support for self posts
	if(mainJSON.isSelf)
	{
		if(mainJSON.selftext_html != null)
		{
			story.bodyHTML += mainJSON.selftext_html;
		}
	}
	//imgur, lynx, youtube, etc
	story.bodyHTML = unEncode(story.bodyHTML);
	//add the upvote and reply for the story
	story.bodyHTML += '<div class="uparrow storyup" id="u' + theStoryID + '"></div>';
     	story.bodyHTML += '<div class="downarrow storydown" id="d' + theStoryID + '"></div>';
	story.bodyHTML += '<a id="r' + theStoryID + '" href="javascript:void(0)" class="textreplybutton storyreply">Reply to the Link</a>';
	story.bodyHTML += '<div class="storycommentline"></div>';
	
	//populate comments
	var commentsRoot = storyJSON[1].data.children;
	
	var commentsHTML = '';
	//do the root ones manually, recursive for the replies
	//-1 because the last comment is for loading more
	for(var i = 0; i < commentsRoot.length; i++)
	{
		//skip the load extra thing
		if (commentsRoot[i].kind == 'more')
		{
			continue;
		}
		var commentJSON = commentsRoot[i].data;
		var author = commentJSON.author;
		var body_html = unEncode(commentJSON.body_html);
		var score = commentJSON.ups - commentJSON.downs;
		var id = commentJSON.name;
		
		commentsHTML += makeCommentHeader(score,author,body_html,id);
		commentsHTML += '<div class="childrencomments child0">';
		//the below should fail when no extra comments are there
		try {
		commentsHTML += getChildComments(commentJSON.replies.data.children,1);
		} catch (err) {}
		//one div closure for root, another for child comments
		commentsHTML += '</div></div>';
		
	}
	//finally add this too
	story.bodyHTML += commentsHTML;
	//if we are still looking
	if(currentStory == theStoryID)
	{
		$('.theemailbody').html(story.bodyHTML);
		//for events
		onStoryLoad();
	}	
	else
	{
		//console.log('not the right story selected right now');
	}
}

function makeCommentHeader(score, author, body_html,id)
{
	commentsHTML = '';
	commentsHTML += '<div id="' + id + '" class="commentroot">';
	commentsHTML += '<div class="uparrow" id="u' + id + '"></div><div class="downarrow" id="d' + id + '"></div>';
	commentsHTML += '<div class="authorandstuff showhover">';
	commentsHTML += '<span class="score">' + score + '</span> <span class="commentauthor">' + author + '</span>';
	commentsHTML += '  <a id="r' + id + '" href="javascript:void(0)" class="textreplybutton"> Reply</a>';
	commentsHTML += '</div>';
	commentsHTML += '<div class="commentbody">' + body_html + '</div>';
	return commentsHTML;
}

function getChildComments(jsonroot,level)
{
	if(jsonroot == null)
	{
		return '';
	}
	var tempHTML = '';
	for(var i = 0; i < jsonroot.length; i++)
	{
		if(jsonroot[i].kind == 'more')
		{
			continue;
		}
		var commentjson = jsonroot[i].data;
		var author = commentjson.author;
		var body_html = unEncode(commentjson.body_html);
		var score = commentjson.ups - commentjson.downs;
		var id = commentjson.name;
		
		//make the html with level in mind
		tempHTML += makeCommentHeader(score,author,body_html,id);
		tempHTML += '<div class="childrencomments child' + level + '">';
		try {
			tempHTML += getChildComments(commentjson.replies.data.children,level + 1);
		} catch (err) {
			//nothing, its expected that the above will fail if there are no children comments
		}
		//one for root, another for child comments
		tempHTML += "</div></div>";
	}
	
	return tempHTML;
}


function unEncode(text)
{
	text = text.replace(/&lt;/ig,'<');
	text = text.replace(/&gt;/ig,'>');
	text = text.replace(/\n/g,'<br/>');
	//look of disapproval lol. I should get a UTF decoder or something
	text = text.replace(/&#3232;/g,'?');
	text = text.replace(/&amp;/ig,'&');
	debug = false;
	if(text.indexOf('uploads') != -1)
	{
		debug = true;
		//console.log(text);
	}


	//this is a bit ridiculous, but i think we are going to add
	//imgur expansion support via regular expressions :O
	numcaptures = 4; //number of results per match
	results = /<a href="(http:.*?\.(jpg|jpeg|png|gif|JPEG|GIF|PNG))".*?>(.*?)<\/a>/gi.exec(text);



	//wow ok this is super ugly because apparently javascript regex's
	//match globally on match() but not on the exec() method which is
	//useless because i want to get variables within the regex and
	//not have to split stuff up infinitely. i miss python :-/
	while(results != null)
	{
		var complete = results[0];
		var url = results[1];
		var title = results[3];
		//make the expando button and replace!
		var tempHTML = makeImgurExpando(url,title);
		text = text.replace(complete,tempHTML);

		var tosearch = text.substr(text.indexOf(tempHTML)+tempHTML.length);
		results = /<a href="(http:.*?\.(jpg|jpeg|png|gif|JPEG|GIF|PNG))".*?>(.*?)<\/a>/gi.exec(text.substr(text.indexOf(tempHTML)+tempHTML.length));
	}
	//do this again for IDIOTS WHO DONT LINK TO THE IMAGE DIRECTLY!!!
	results = /<a.*?href="(http:\/\/imgur.com\/(\w+))".*?>(.*?)<\/a>/g.exec(text);
	while(results != null)
	{
		for(var i = 0; i < results.length; i += 4)
		{
			var complete = results[i];
			var url = results[i+1];
			var code = results[i+2];
			var title = results[i+3];
			url = 'http://i.imgur.com/' + code + '.jpg';
			var tempHTML = makeImgurExpando(url,title);
			text = text.replace(complete,tempHTML);
		}
		results = /<a.*?href="(http:\/\/imgur.com\/(\w+))".*?>(.*?)<\/a>/g.exec(text);
	}
	
	//holdup, lets do the same for youtube (this is exhausting)
	results = /<a.*?href="(http:.*?youtube.com.*?v=([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
	//check for the dumb short one
	if(results == null)
	{
		results = /<a.*?href="(http:.*?youtu\.be\/([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
	}
	while(results != null)
	{
		var complete = results[0];
		var url = results[1];
		var code = results[2];
		var title = results[3];
		var tempHTML = makeYoutubeExpando(url,title);
		text = text.replace(complete,tempHTML);

		//next loop
		results = /<a.*?href="(http:\.*?youtube.com\.*?v=(\w+))".*?>(.*?)<\/a>/gi.exec(text);
		if(results == null)
		{
			results = /<a.*?href="(http:.*?youtu\.be\/([-\w]+)).*?".*?>(.*?)<\/a>/gi.exec(text);
		}
	}		

	//and screendump support. i am a beast!
	//that space inbetween the a and the href is quite important...
	//btw, I am only doing this on the first link since this whole
	//find and replace thing fails hardcore when you maintain the
	//link structure :-/ I could keep track of this with indexes and
	//such but I'm on a deadline!!!
	results = /<a href="(http:.*?)".*?>(.*?)<\/a>/gi.exec(text);
	if(results != null)
	{
		//this catches youtube unfortunately, so lets
		//remove those cases
		if(results[0].indexOf('youtube.com') == -1 && results[0].indexOf('reddit.com') == -1)
		{
			//console.log(text);
			var complete = results[0];
			var url = results[1];
			var title = results[2];
			var tempHTML = getLynxdump(url,title);
			text = text.replace(complete,tempHTML);
		}
	}

	return text;
}	

function lynxexpandoClick()
{
	var tempid = $(this).attr('id');
	var finder = '#lynxexpando' + tempid;
	$(finder).toggle();
	if($(finder).text() == null || $(finder).text().length < 1)
	{
		//its empty, make the call
		tempLynxAjaxID = finder;
		//get the link
		var finder2 = '#lynxlink' + tempid;
		var thelink = $(finder2).attr('href');
		$(finder).text('Loading... please wait :D this crap takes a while because its my server and not yahoo');
		//now do the call!!!
		$.post('http://www.thebearfeed.com/gettextdump/',{'link':thelink},textdumpBack,'jsonp');
	}
}

function textdumpBack(data)
{
	textdump = data.textdump;
	textdump = textdump.replace(/\n/g,'</br>');
	$(tempLynxAjaxID).html(textdump);
}


function expandoClick()
{
	var tempid = $(this).attr('id');
	var finder = '#img' + tempid;
	$(finder).toggle();
	
	//make resize func
	var resizeFunc = function()
	{
		var idFinder = finder;
		var height = $(idFinder).children('.ui-wrapper').height();
		var width = $(idFinder).children('.ui-wrapper').width();
		$(idFinder).children('.ui-wrapper').children('.ui-resizable-e').width(width);
		$(idFinder).children('.ui-wrapper').children('.ui-resizable-e').height(height);
		$(idFinder).children('.ui-wrapper').children('.ui-resizable-e').css('top','-' + String(height) + 'px');
		
	}
	
	$(finder).children('img.normal').resizable({
			'aspectRatio':true,
			resize:resizeFunc
	});
	resizeFunc();
}

function makeImgurExpando(externallink,title)
{
	//first, if not i.imgur.com then make it
	//add support for non imgurthings
	if(externallink.indexOf('i.imgur.com') == -1 && externallink.indexOf('imgur.com') != -1)
	{
		externallink.replace('imgur.com','i.imgur.com');
	}
	//also, if not .jpg or something, add a random file extension
	//and the browser SHOULD look at the file to interpret the data anyways
	if(externallink.substr(-4,1) != '.' && externallink.indexOf('.jpeg') == -1)
	{
		//add an extension?
		externallink += '.jpg';
		externallink = externallink.replace('?full','');
	}
	var randId = String(Math.floor(Math.random() * 10000));
	//yes i know im using random numbers and there are collision issues but i dont think
	// its super critical :P
	var expando = '<div class="showhover expando" id="' + randId + '" >+</div>';
	expando += '<a href="javascript:void(0)" class="expando" id="' + randId + '">' + title + '</a>';
	expando += '<div id="' + 'img' + randId + '" style="width:100%;display:none">';
	expando += '<img class="normal" id="' + 'ig' + randId + '" class="expandoimg" src="' + externallink + '" style="width:100%;" alt="redditlol"/>';
	expando += '</div>';
	return expando;
}

function makeYoutubeExpando(externallink,title)
{
	//get the video ID
	var normallink = /youtube\.com\/watch\?.*?v=([-\w]+)/ig.exec(externallink);
	if(normallink == null)
	{
		//for the shortened links
		normallink = /youtu\.be\/([-\w]+)/ig.exec(externallink);
	}
	//console.log(externallink);
	var videoid = normallink[1];
	var expando = '<div class="expando showhover" id="' + videoid + '" >V</div>';
	expando += '<a href="javascript:void(0)" class="expando" id="' + videoid + '">' + title + '</a>';
	expando += '<div style="display:none" id="img' + videoid + '">';
	expando += '<iframe ' + videoid + '" width="560" height="349"';
	expando += ' src="http://www.youtube.com/embed/' + videoid + '" frameborder="0" allowfullscreen></iframe>';
	expando += '</div>';
	return expando;
}

function getLynxdump(externallink,title)
{
	//so we need to have a box in case someone wants to open this
	//the ajax stuff will be handled in the click event I suppose
	var randId = String(Math.floor(Math.random() * 100000));
	var expando = '<div class="lynxexpando showhover" id="' + randId + '">Lynx</div>';
	expando += '<a id="lynxlink' + randId + '" href="' + externallink + '">' + title + '</a>';
	expando += '<div id="lynxexpando' + randId + '" class="lynxexpandodiv" style="display:none"></div>';
	return expando;
}

function isYoutube(externallink)
{
	if(externallink.indexOf('youtube.com') != -1 || externallink.indexOf('youtu.be') != -1)
	{
		return true;
	}
	else
	{
		return false;
	}
}


function isImgur(externallink)
{
	var filetype = externallink.substr(-3,3).toLowerCase();
	//add support for flickr and stuff
	if(externallink.indexOf('imgur.com') != -1)
	{
		return true;
	}
	else if (filetype == 'png' || filetype == 'peg' || filetype == 'jpg' || filetype == 'gif')
	{
		return true;
	}
	else
	{
		return false;
	}
}

function isActuallyImgur(externallink)
{
	if(externallink.indexOf('imgur.com') != -1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function onResize()
{
	$('.backgradient').height($(window).height()-139 + noTaskbar*60);
	$('.mainrow').height($(window).height()-166 + noTaskbar*60);
	$('#previewarea').height($(window).height()-226 + noTaskbar*60);
	$('.theemailbody').height($(window).height()-146 + noTaskbar*60);
	$('.right').width($(window).width()-595 + noTaskbar*60);
	$('.minholder').width($(window).width()-(180+170) + noTaskbar*60);
	$('.folderholder').height($(window).height()-550 + noTaskbar*60);
}

function toggleTaskbar()
{
	if(noTaskbar)
	{
		showTaskbar();
	}
	else
	{
		hideTaskbar();
	}
}

function showTaskbar()
{
	noTaskbar = 0;

	$('.start').show();
	$('.startbanner').show();
	$('.icons').show();
	$('.iconsbanner').show();
	$('.minholder').show();
	onResize();
	$('.clockholder').show();
	
	$('.bottombar').css('bottom','60px');
	$('.leftcollower').css('bottom','80px');
}


function hideTaskbar()
{
	noTaskbar = 1;

	$('.start').hide();
	$('.startbanner').hide();
	$('.icons').hide();
	$('.iconsbanner').hide();
	$('.minholder').hide();
	$('.clockholder').hide();

	$('.bottombar').css('bottom','0px');
	$('.leftcollower').css('bottom','20px');

	onResize();
}

function onReload()
{
	$('.anemail').click(emailClick);
}

function onStoryLoad()
{
	$('.expando').click(expandoClick);
	$('.lynxexpando').click(lynxexpandoClick);

	//$('img.normal').resizable({
	//		'aspectRatio':true,
	//		});
	
	
	$('.textreplybutton').click(function(){
		//get id
		var id = $(this).attr('id').substr(1);
		spawnReplyWindow(id);
	});
	$('.uparrow').click(function(){
		if(sessionID == '')
		{
			makePopup('You need to be logged in to do that!');
			spawnCommandWindow();
			return 0;
		}
		$(this).addClass('upped');
		makeSoftpopup('Upvoting ' + $(this).attr('id').substr(1) + ' ...');
		var thing_id = $(this).attr('id').substr(1);
		$.get('http://www.thebearfeed.com/msoutlookit/upvote',{'sessionID':sessionID,'thing_id':thing_id,'username':username},votingCallback,'jsonp');

	});	

	$('.downarrow').click(function(){
		if(sessionID == '')
		{
			makePopup('You need to be logged in to do that!');
			spawnCommandWindow();
			return 0;
		}
		$(this).addClass('downed');

		makeSoftpopup('Downvoting ' + $(this).attr('id').substr(1) + '...');
		var thing_id = $(this).attr('id').substr(1);
		$.get('http://www.thebearfeed.com/msoutlookit/downvote',{'sessionID':sessionID,'thing_id':thing_id,'username':username},votingCallback,'jsonp');
	});
	
}
function votingCallback(data)
{
	var id = data.id;
	var finder = '';
	if(data.dir == 1)
	{
		finder = 'u' + id;
	}
	else
	{
		finder = 'd' + id;
	}
	makeSoftpopup('Voting on ' + id.substr(1) + ' was successful');

	$('#' + finder).addClass('arrowshadow');
	//console.log(data);
	//console.log(finder);
	//lets do the adding or subtracting of numbers!!!
	var holder = $('#' + finder).parent().children('.authorandstuff').children('.score');
	var theScore = Number(holder.html());
	theScore += Number(data.dir);
	holder.html(String(theScore));
}

function spawnReplyWindow(id)
{
	var asd = new myWindow('','','reply ' + id,'','Type your reply below:','\n\n',false);
}
firsttime = true;
function folderClick(folder_name)
{
	//get rid of scroll behavior
	currentStory = null;
	//we are now viewing this folder
	current_folder = globalFolderDict[folder_name];

	//wipe out the previous stories
	$('#previewarea').html('');
	if(!firsttime)
	{
		$('.theemailbody').html('');
		firsttime = false;
	}
	//check if this folder is empty. this is a super ugly way of doing this but
	//javascript has no object.length!?!?!?
	var length = 0;
	for (key in globalFolderDict[folder_name].emailDict)
	{
		length++;
		break;
	}
	if(length > 0)
	{
		displayFolder(folder_name);
	}
	else
	{
		//unbind clicking out
		$('.afolder').unbind('click');
		//add the spinning thing TODO
		$('#previewarea').html('<img src="loading.gif"/>');
		//we actually have to query this now :O
		//and hopefully the subreddit name is the same as the folder name
		//this is a limitation of our data aray stuff
		var subredditname = folder_name.substr(7);
		var link = "http://www.reddit.com/r/" + subredditname + '/.json';
		//except for front page
		if(subredditname == 'FrontPage')
		{
			//sometimes doing just reddit.com doesn't work.. it gives me upcoming??
			link = "http://www.reddit.com/r/all/.json";
		}

		tempFolderName = folder_name;
		$.post('http://www.thebearfeed.com/msoutlookit/get_page',{'link':link},folderCallback,'jsonp');
	}
}

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


function updateClock()
{
	var d = new Date();
	var dayOfNumeric = d.getDay();
	
	var dayOfWeekString = days[dayOfNumeric];
	var dayOfMonth = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	
	var hour = d.getHours();
	var minutes = d.getMinutes();
	if(hour > 12)
	{
		var amppm = 'PM';
		hour -= 12;
	}
	else
	{
		var amppm = 'AM';
	}
	var minuteString = String(minutes);
	if(minutes < 10)
	{
		minuteString = '0' + minuteString;
	} 
	
	var dateString = String(month) + '/' + String(dayOfMonth) + '/' + String(year);
	var timeString = String(hour) + ':' + minuteString + ' ' + amppm;
	
	$('.clockholder').html(timeString + '<br/>' + dayOfWeekString + '<br/>' + dateString);
	
	var secondsToWait = 60 - d.getSeconds();
	
	setTimeout('updateClock()',1000*secondsToWait);
}

globalScrollDict = {};
function moarButton()
{
	//unbind switching
	$('.afolder').unbind('click');
	if(current_folder.subredditname == 'Front Page')
	{
		var link = "http://www.reddit.com/?count=" + current_folder.count + '&after=' + current_folder.after;
	}
	else
	{
		var link = "http://www.reddit.com/r/" + current_folder.subredditname + "/?count=" + current_folder.count + '&after=' + current_folder.after;
	}
	link += '/.json';
	//go get those things and add to this folder!

	var alerttext = "Want bottomless loading? Well the reddit API doesn't return JSON objects after the first";
	alerttext += " page, so there's nothing I can do :-/ ";
	alerttext += " Go tell the reddit admins to fix it!! I have the code all ready to process a further page";
	alerttext += "\nFor example, the link you requested:\n" + link + "\ndoes not return a json object when it should :O";
	alerttext += "\nIf this becomes enough of an issue, I might work on a server-side regex-heavy HTML parser to grab and reconstruct the JSON, but it wouldn't be pretty :O";
	alert(alerttext);

	//$.get('http://www.thebearfeed.com/msoutlookit/get_page',{'link':link},folderCallback,'jsonp');
}


tempFolderName = null;
//GAHHHH this should have been part of the folder datatype but i messed up when making that data struct
//should have gone for an array inside object rather than a straight up dict

function folderCallback(data)
{
	$('.afolder').click(folderIconClick);
	//we should populate this folder with the data we just got
	var thefolder = globalFolderDict[tempFolderName];
	//console.log(data);
	//set up the bottomless stuff
	var after = data.data.after;
	globalFolderDict[tempFolderName].after = after;
	globalFolderDict[tempFolderName].count += 25;

	for(var i = 0; i < data.data.children.length; i++)
	{
		var story = new myStory(data.data.children[i],thefolder,false);
	}
	//the below function will take care of if we are still viewing that or not
	displayFolder(tempFolderName);
	
}

function displayFolder(folder_name)
{
	//only if we are viewing this folder still... ajax callbacks change this!
	//i actually got rid of this but whatever
	if(current_folder == globalFolderDict[folder_name])
	{
		$('#previewarea').html('');
		for(key in globalFolderDict[folder_name].emailDict)
		{
			globalFolderDict[folder_name].emailDict[key].addToArea();
		}
		//also, add the moar button
		$('#previewarea').append('<input type="button" value="Moar!" onclick="moarButton()" >');

		onReload();
	}
}

function handleEmailSend(id,tofield,ccfield,subjectfield,body)
{
	//first, subreddit support
	if(tofield.substr(0,9) == 'subreddit')
	{
		//for the rest, get their subreddits and make folders
		//also, close window
		$(globalWindowDict[id].idfinder).css('display','none');
		$(globalWindowDict[id].minfinder).css('display','none');
		results = tofield.split(' ');
		//make all the subreddits
		for(var i = 1; i < results.length; i++)
		{
			makeFolder(results[i]);
			//register the event?
			$('.afolder').click(folderIconClick);
		}
		return 0;
	}

	//next, reddit links to stories:
	if(tofield.indexOf('http://') != -1 && tofield.indexOf('reddit.com') != -1)
	{
		//close out the window
		$(globalWindowDict[id].idfinder).css('display','none');
		$(globalWindowDict[id].minfinder).css('display','none');	
		//try to take that link and get an email... :O
		if(tofield.substr(-1) != '/')
		{
			tofield += '/';
		}
		var link = tofield += '/.json';
		link = link.replace(/\s/g,'');
		//now go get this link
		$.get('http://www.thebearfeed.com/msoutlookit/get_page',{'link':link},randomLinkCallback,'jsonp');
		//do the loading thing
		$('.theemailbody').html('<img src="loading.gif">');
		$('.anemailhi').removeClass('anemailhi');
		//done, callback
		return 0;
	}
	//trying to login?
	if(ccfield.length > 0 && ccfield.indexOf('@') == -1)
	{
		//close window
		$(globalWindowDict[id].idfinder).css('display','none');
		$(globalWindowDict[id].minfinder).css('display','none');
		if(sessionID != '')
		{
			makeSoftpopup('Changing user accounts, getting rid of  your subreddits');
			globalFolderDict = {};
			$('.customfolder').remove();
		}
		//do login
		//username is now tofield
		username = tofield.replace(/\s/g,'');
		var password = ccfield;	
		//make the call
		$.post('http://www.thebearfeed.com/msoutlookit/login',{'username':username,'password':password},loginCallback,'jsonp');
		return 0;
	}

	//trying to reply to something?
	if(tofield.substr(0,5) == 'reply')
	{
		if(sessionID == '')
		{
			makePopup('You need to be logged in to do that!');
			//make a window with that usage
			spawnCommandWindow();
			return 0;
		}
		var thing_id = tofield.split(' ')[1];
		var text = body;
		text = text.replace(/\r/g,'\n');
		if(text.length > 1900)
		{
			makePopup("Sorry that is too long of a message, current browsers dictate that URL's have to be less than 2000 characters long :-/ ");
			return 0;
		}

		$.get('http://www.thebearfeed.com/msoutlookit/replyto',{'sessionID':sessionID,'thing_id':thing_id,'text':text,'username':username},replytoCallback,'jsonp');
		//close this out
		$(globalWindowDict[id].idfinder).css('display','none');
		$(globalWindowDict[id].minfinder).css('display','none');
		makeSoftpopup('Comment sent...');
		return 0;
	}
	
	//trying to do email? see if valid email address
	var emailpattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	if(emailpattern.exec(ccfield) != null && emailpattern.exec(tofield) != null)
	{
		//send email
		if(sessionID == '')
		{
			makePopup("You need to be logged in to do that!");
			spawnCommandWindow();
			return 0;
		}
		//go send the email and close the window
		$(globalWindowDict[id].idfinder).css('display','none');
		$(globalWindowDict[id].minfinder).css('display','none');
		makeSoftpopup("Email sent...");
		$.get('http://www.thebearfeed.com/msoutlookit/sendmail',{'sessionID':sessionID,'username':username,'to':tofield,'from':ccfield,'text':body,'subject':subjectfield},emailCallback,'jsonp');
		return 0;
	}

	//if we are still here!
	var tempHolder = $(globalWindowDict[id].idfinder).children('.emailcomposewindow').children('.emailcomposebody');
	var tempVal = tempHolder.val();
	tempHolder.val('Error!!! Read below:\n' + tempVal);
}

function emailCallback(data)
{
	//console.log(data);
}

function replytoCallback(data)
{
	//console.log(data);
	makeSoftpopup("Comment posted!");
}

function loginCallback(data)
{
	sessionID = data.sessionID;
	makeSoftpopup('You are now logged in ' + username + ' with sessionID ' + sessionID.substr(0,8) + '... Getting your subreddits');
	$.get('http://www.thebearfeed.com/msoutlookit/get_subreddits',{'username':username,'sessionID':sessionID}, subredditCallback,'jsonp');
	//also store this stuff
}

function subredditCallback(data)
{
	//console.log(data);
	//the array is
	var subList = data.data.children;
	var tempAlreadyThere = {};
	for (key in globalFolderDict)
	{
		tempAlreadyThere[globalFolderDict[key].subredditname] = 'yo';
	}
	//god i wish javascript had a if "asd" in Dictionary thing...
	for(var i = subList.length - 1; i >= 0; i--)
	{
		var subName = subList[i].data.display_name;
		//console.log(subName);
		if(tempAlreadyThere[subName] == null)
		{
			makeFolder2(subName,true);
		}
	}	
	makeSoftpopup('Got all your subreddits');
}

function makePopup(string)
{
	$('body').append('<div style="display:none"class="popup notclosed">' + string + '</div>');
	$('.notclosed').slideToggle(400);
	setTimeout('closePopup()',3000);
	$('.popup').click(function(){$(this).slideUp(400);});
}

function closePopup()
{
	$('.popup').slideUp(400);
}

function makeSoftpopup(string)
{
	$('body').append('<div style="display:none" class="softpopup spnotdone">' + string + '</div>');
	$('.spnotdone').fadeIn();
	setTimeout('closeSoftpopup()',3000);
}

function closeSoftpopup()
{
	$('.spnotdone').fadeOut(function(){
		$('.spnotdone').remove();
	});
}


function randomLinkCallback(data)
{
	//shouldnt be too hard...
	//wait real quick make the story!
	var story = new myStory(data[0].data.children[0],current_folder,true); 
	commentsCallback(data);
	//now just display stuff?
	$('.theemailbody').html(current_folder.emailDict[story.id].bodyHTML);
	//get the event
	$('.anemail').unbind('click');
	onReload();
	onStoryLoad();
	//also we aren't highlighted anyumore
}

var username = '';
var sessionID = '';

function emailClick()
{
	//first, store the old story scroll position
	if(currentStory != null)
	{
		globalScrollDict[currentStory] = $('.theemailbody').scrollTop();
	}		

	var id = $(this).attr('id');
	if(!populateStory(id))
	{
		//only if the story is already loaded should we display it,
		//otherwise we will display the loading gif
		//and on callback we will populate it!
		$('.theemailbody').html(current_folder.emailDict[id].bodyHTML);
		//check if there is a scroll entry for it
		if(globalScrollDict[currentStory] != null)
		{
			$('.theemailbody').scrollTop(globalScrollDict[currentStory]);
		}
		else
		{
			$('.theemailbody').scrollTop(0);
		}
	}
	//also do unread vs read stuff
	//make us highlighted
	$('.anemailhi').removeClass('anemailhi');
	$(this).addClass('anemailhi');

	//also we are not unread anymore!
	$(this).removeClass('emailunread');
	onStoryLoad();

}

function makeFolder(name)
{
	makeFolder2(name,false);
}


function makeFolder2(name,custom)
{
	//also, real quick, whitespace strip to remove id issues
	var strippedID = 'folder_' + name.replace(/\s/g,'');
	//make a folder with this name
	globalFolderDict[strippedID] = new myFolder();
	globalFolderDict[strippedID].strippedID = strippedID;
	globalFolderDict[strippedID].subredditname = name;

	var tempHTML = '<div class="afolderwrapper "><div class="afolder" id="' + strippedID + '">' + name + '</div></div>';
	if(custom)
	{
		tempHTML = tempHTML.replace('afolderwrapper','afolderwrapper customfolder');
	}
	//unhighlight the others
	$('.foldwraphi').removeClass('foldwraphi');
	//add to the dom
	$('.folderholder').append(tempHTML);
	
	//now register the events
	$('#' + strippedID).click(folderIconClick);

	//return the dictionary
	return globalFolderDict[strippedID];
}
function folderIconClick()
{
		//ok sowe have a few things to do
		//unhighlight the others
		$('.foldwraphi').removeClass('foldwraphi');
		//highlight meee
		$(this).parent().addClass('foldwraphi');
		//populate the folder... TODO
		folderClick($(this).attr('id'));
}
globalWindowDict = {};	
globalFolderDict = {};

function spawnCommandWindow()
{
	var usage = "Usage:\n\n";
	usage += "Add subreddits:\n";
	usage += "\tIn the TO field, type subreddit [subredditname]+";
	usage += "\n\nLogin:\n\tIn the TO field, type your username.\n";
	usage += "\tIn the CC field, type your password";	
	usage += "\n\nGo to a comments page:\n\tJust paste in the link in the to field and hit send! Eg:\n";
	usage += "\thttp://www.reddit.com/r/gaming/comments/jkiu2/battlefield_3_caspian_border_gameplay_hd";
	usage += "\n\nEmergency Email Function:\n\tTo Field: desired email address to send";
	usage += "\n\tCc field: The email address to spoof it from";
	usage += "\n\tSubject and Body: Desired subjects and body";
	var asd = new myWindow('','','','','',usage,true);
}
$(document).ready(function(){

	//makePopup("Sorry, webfaction / my django app just barfed and all requests are hanging indefinitely. I'll try to fix this by the weekend (I'm in finals right now at Berkeley) <p></p> if you are good at debugging django apps, email me! I'm getting hanging database calls with no error logs");
	
	updateClock();
	onResize();
	$(window).resize(onResize);
	
	//set the buttons
	$('.newemailbutton').click(spawnCommandWindow);
	
	//attempt to add emails
	//add the folder
	main_inbox = makeFolder('Front Page');
	makeFolder('gaming');
	makeFolder('pics');
	makeFolder('askreddit');
	makeFolder('reddit.com');
	makeFolder('funny');
	makeFolder('iama');
	makeFolder('wtf');

	//load inbox
	$('#folder_FrontPage').parent().addClass('foldwraphi');
	folderClick('folder_FrontPage');
	makeSoftpopup('Welcome! If you are a lawyer, this is no way affiliated with Microsoft or trying to replicate the functionality of MS Outlook. Not like that will stop you from ruining the party though :P');

	//some events that never need re-doing

	$('.outlookmin').click(function()
	{
		//minimize all other windows and highlight myself
		for(key in globalWindowDict)
		{
			globalWindowDict[key].minimize();
		}
		$(this).addClass('outlookminhi');
	});

	$('.authorandstuff').keyup(function(event){
		if(event.keyCode == 82)
		{
			//stuff
			//get the first highlighted mofo
			var id = $('.commentroothi').parent().attr('id');
			if(id != null)
			{
				spawnReplyWindow(id);
			}
			else
			{
				spawnCommandWindow();
			}
		}
	});

	//taskbar off by default now
	hideTaskbar();

});
