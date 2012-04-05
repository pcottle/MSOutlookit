from django.db import models
import datetime

# Create your models here.


class MsoUser(models.Model):
	username = models.CharField(max_length = 50)
	cookiestring = models.TextField(blank=True,default='')
	modhash = models.CharField(max_length=200,blank=True,default='')
	is_valid = models.BooleanField(default=True)
	sessionID = models.CharField(max_length = 100,blank=True,default='')
	subreddits = models.TextField(default='',blank=True)

# class FbSession(models.Model):
#	sessionID = models.CharField(max_length = 200, blank=True,default='')
#	status = models.CharField(max_length=200, blank=True,default='')
# 	lastCommand = int?
#	seconds? It's like 'playing' '40s' 'playing' '80s' -> seek
#	'paused' -> playing '40s' -> play -> seek
#
#
# no no, we should do it based on last command. so like 
# actually issue with last command is that then you need to playback
# whatever happened to get to the right point, and with time
# doesnt make sense. Status with constant pinging is better
#
#
# other issue is packet overlapping might happen, maybe attach
# timestamp on return for when you get back packets, you can compare
# or just in JS, make sure you have a 'packetNum' and only check
# if packetNum is the same and then increment! much better solution
# and then just keep pinging and asserting status.
#
#
# need to check latency to BF and see what that is. this might be
# a ton of disk access is my only concern, unless it's cached.
# see i think preventing writing will solve the caching.
#
#
# OR it could be playing at 40s SINCE time. don't need to keep
# writing to disk, only read (and thats cached). so  you
# essentially have the remote control holder keep updating
# and making sure we are playing at a time that makes sense
# from last time we sent the command. if this changes, aka
# we seeked somewhere, we sent another packet saying
# 'play at 40 seconds SINCE timestamp'. Then this gets
# sent down to the clients, and we basically do seek to 
# timeGiven + (currentTime - timeStamp)
#
#
# on packetReceive from clients, just check status against 
# the current status and if it's different, no problem.
#
# if it is different, only THEn do we actually send a full packet
# to the client. awesome. then they update status accordingly
#
#
#
# last thing is how to get this from the chat window. and how to
# tell if its you. maybe tell based on textarea thing,
# and then client just reads.
#
# should we use the same code? I think so!!! have textarea vs
# reading, and once it goes, it just goes
#
# extra credit for being able to watch multiple videos



class MsoDump(models.Model):
	date_grabbed = models.DateTimeField()
	link = models.CharField(max_length=200,default='')
	json_string = models.TextField(default='',blank=True)


class MsoJsonObject(models.Model):
	date_grabbed = models.DateTimeField()
	link = models.CharField(max_length=300,default='')
	json_string = models.TextField(default='',blank=True)

