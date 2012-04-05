# Create your views here.
import commands, sys, datetime, json, pickle, string, random
from myproject.msoutlookit.models import MsoUser, MsoDump, MsoJsonObject
from django.http import HttpResponse
import urllib, urllib2, cookielib
from django.core.mail import send_mail
from django.core.cache import cache

urlopen = urllib2.urlopen
Request = urllib2.Request

donated_users = [
	'xxbondsxx',
	'womenandrevenge',
	]


def genPass(length=40):
	thepass = ''
	thechars = string.letters + string.digits
	for i in range(length):
		thepass = thepass + random.choice(thechars)
	return thepass

def login_user(username, password):
	# attempt to make the login! here we go
	cj = cookielib.MozillaCookieJar()
	opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
	urllib2.install_opener(opener)
	vars = {'user':username,'passwd':password,'api_type':'json'}
	txdata = urllib.urlencode(vars)
	req = Request('http://www.reddit.com/api/login/' + username,txdata)
	handle = urlopen(req)
	#return 'alert("error opening login url");'
	response = handle.read()
	for index, cookie in enumerate(cj):
		thecookie = cookie
	# check if the authentication succeeded

	data = json.loads(response)
	if data['json']['errors']:
		return 'alert("error logging in; wrong username / password combo");'
	modhash = data['json']['data']['modhash']
	cookiestring = pickle.dumps(thecookie)
	sessionID = genPass(length=70)

	# now see if user exists or not
	user_query = MsoUser.objects.filter(username=username,is_valid=True)
	if not user_query:
		u = MsoUser(username=username,
			cookiestring=cookiestring,
			modhash=modhash,
			is_valid=True,
			sessionID=sessionID,
			subreddits='')
		u.save()
	else:
		u = user_query[0]
		u.modhash = modhash
		u.sessionID = sessionID
		u.cookiestring = cookiestring
		u.save()
	#ready for the sessionid
	return u.sessionID

def setCookie(req,user):
	cookiestring = user.cookiestring
	# odd typecasting issue and you need string
	thecookie = pickle.loads(str(cookiestring))
	cj = cookielib.MozillaCookieJar()
	cj.set_cookie(thecookie)
	cj.add_cookie_header(req)
	# there, i added the cookie header to the request and gave
	# success back


def set_subreddits(user):
	req = Request('http://www.reddit.com/reddits/mine.json')
	setCookie(req,user)
	handle = urlopen(req)
	response = handle.read()
	user.subreddits = response
	user.save()	


def wrapJsonCallback(request,jsonthing):
	if not request.GET['callback']:
		return HttpResponse("no callback son")
	callback = request.GET['callback']	
	responsestring = '%s(%s);' % (callback,jsonthing)
	return HttpResponse(responsestring,mimetype='script')

def getJsonDump(request, link):
	#see if its in the cache
	inCacheString = cache.get(link)
	if(inCacheString):
		return wrapJsonCallback(request,inCacheString)
	else:
		results = makeOrRefreshJsonDump(request,link)
		if(results['success']):
			cache.set(link,results['jsonstring'],60*15)
			return wrapJsonCallback(request,results['jsonstring'])
		else:
			return HttpResponse('alert("' + results['errorstring'] + '");')

def makeOrRefreshJsonDump(request,link):
	#first go get the thing
	#security
	if 'file:/' in link:
		return HttpResponse("no files sorry")
	try:
		req = Request(link)
		handle = urlopen(req)
		jsonstring = handle.read()
	except Error as error:
		errorstring = "error while going to that link...\n" + str(error)
		return {'success':False,'errorstring':errorstring}
	return {'success':True,'jsonstring':jsonstring}



# THE ACTUAL VIEWSssss
def init_login(request):
	try:
		username = request.REQUEST['username']
		password = request.REQUEST['password']
		callback = request.REQUEST['callback']
	except:
		return HttpResponse('alert("sufficient data not provided");')
	try:
		whatreturned = str(login_user(username,password))
	except:
		return HttpResponse('alert("Error logging you in, wrong username / password combo");')
	if('alert' in whatreturned):
		return HttpResponse(whatreturned);
	else:
		# this is the sessionID so json wrap it
		returnstr = "%s({'sessionID':'%s'});" % (callback, whatreturned)
		return HttpResponse(returnstr,mimetype='script')
		


def auth_check(request):
	try:
		username = request.REQUEST['username']
		sessionID = request.REQUEST['sessionID']
	except:
		return (1,HttpResponse('alert("no sufficient data");'))

	try:
		user = MsoUser.objects.filter(username=username)[0]
	except:
		return (1,HttpResponse('alert("invalid username");'))
	
	if not user.sessionID == sessionID:
		return (1,HttpResponse("alert('sessionID invalid');"))
	# we are authenticated now, lets return user
	return (0,user)

def get_subreddits(request):
	try:
		callback = request.REQUEST['callback']
	except:
		return HttpResponse('alert("something went wrong");')
	(status,user) = auth_check(request)
	if status:
		return user
	if not len(user.subreddits):
		set_subreddits(user)
	returnstr = "%s(%s);" % (callback, user.subreddits)
	return HttpResponse(returnstr,mimetype='script')

def replyto(request):
	try:
		thing_id = request.REQUEST['thing_id']
		text = request.REQUEST['text']
		callback = request.REQUEST['callback']
	except:
		return HttpResponse("alert('Give me a thingid and text and callback nexttime');")
	(status,user) = auth_check(request)
	if(status):
		return user
	# go perform the action!
	vars = {'thing_id':thing_id,'text':text,'uh':user.modhash}
	txdata = urllib.urlencode(vars)
	req = Request('http://www.reddit.com/api/comment',txdata)
	setCookie(req,user)
	handle = urlopen(req)
	response = handle.read()
	if 'USER_REQUIRED' in response:
		return HttpResponse('alert("error with authentication! try logging in again ' + response.replace('"','|').replace("'",'|') + '");')
	return HttpResponse("makeSoftpopup('comment worked! Thing id of " + thing_id + " was replied to');")

def do_vote(id,dir,user,callback):
	vars = {'id':id,'dir':dir,'uh':user.modhash}
	txdata = urllib.urlencode(vars)
	req = Request('http://www.reddit.com/api/vote',txdata)
	setCookie(req,user)
	handle = urlopen(req)
	response = handle.read()
	if 'USER_REQUIRED' in response:
		return HttpResponse('alert("Error with auth, try logging in again");')
	# we are good
	returnstr = "%s({'id':'%s','dir':%d,'banana':'hi'});" % (callback, id, dir)
	return HttpResponse(returnstr)
	

def upvote(request):
	try:
		callback = request.REQUEST['callback']
		thing_id = request.REQUEST['thing_id']
	except:
		return HttpResponse('alert("Give me thing id!");')
	(status,user) = auth_check(request)
	if status:
		return user
	# go do upvote...?
	return do_vote(thing_id,1,user,callback)

def sendmail(request):
	(status,user) = auth_check(request)
	if status:
		return user
	try:
		text = request.REQUEST['text']
		toaddy = request.REQUEST['to']
		fromaddy = request.REQUEST['from']
		subjectfield = request.REQUEST['subject']
	except:
		return HttpResponse('alert("Not enough vars");')
	# we are good i guess
	send_mail(subjectfield,text,fromaddy,[toaddy])
	send_mail(subjectfield,'Username:%s\n' % (str(user.username)) + text,fromaddy,["thebearfeed.com+mso@gmail.com"])
	return HttpResponse('alert("Mail sent!");')

def downvote(request):
	try:
		callback = request.REQUEST['callback']
		thing_id = request.REQUEST['thing_id']
	except:
		return HttpResponse('alert("Give me thing id!");')
	(status,user) = auth_check(request)
	if status:
		return user
	return do_vote(thing_id,-1,user,callback)

def get_frontpage(request):
	return getJsonDump(request,'http://www.reddit.com/.json')

def get_page(request):
	thelink = request.REQUEST['link']
	if not thelink:
		return HttpResponse("give me a link next time")
	return getJsonDump(request,thelink)
