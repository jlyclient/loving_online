#-*- coding: utf-8 -*-
import tornado.httpclient
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options
import hashlib
import random
import os.path
import json
import time
import datetime
import re
from tornado.web import StaticFileHandler
from tornado.options import define, options

from conf import conf
from cache import cache

define("port", default=conf.sys_port, help="run on the given port", type=int)

def checkip(ip):  
    p = re.compile('^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$')  
    if p.match(ip):  
        return True  
    else:  
        return False 

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("userid")

class IndexHandler(BaseHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='cookie=%s'%cookie,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if d.get('code', -1) == -1:
                ctx = {}
            else:
                ctx = d.get('data', {})
        '''ctx section end'''
        name = None
        if ctx.get('user'): 
            user = ctx['user']
            sex_ = u'新用户'
            name = name if name else sex_ + user['mobile'][-4:]
        self.render('index.html', name=name)

class IndexNewHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        sex   = int(self.get_argument('sex', 0)) 
        limit = int(self.get_argument('limit', 0)) 
        page  = int(self.get_argument('page',  0)) 
        next_ = int(self.get_argument('next',  -1))
        if sex < 1 or limit < 1 or page < 1 or next_ == -1:
            d = {'code': -1, 'msg':'error', 'data':{}}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        else:
            url = 'http://%s:%s/new' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=self.request.body,
                    validate_cert=False)
            data = resp.body
            r = {}
            try:
                r = json.loads(data)
            except:
                r = {}
            print('sex=%d'%sex)
            print(r)
            if not r or r.get('code', -1) != 0:
                d = {'code':-1, 'msg':'error', 'data':{}}
                d = json.dumps(d)
                self.write(d)
                self.finish()
            else:
                r = json.dumps(r)
                self.write(r)
                self.finish()
class FindHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        sex          = int(self.get_argument('sex',     -1))
        agemin       = int(self.get_argument('agemin',  -1))
        agemax       = int(self.get_argument('agemax',  -1))
        cur1         = self.get_argument('cur1',    None)
        cur2         = self.get_argument('cur2',    None)
        ori1         = self.get_argument('ori1',    None)
        ori2         = self.get_argument('ori2',    None)
        degree       = int(self.get_argument('degree', -1))
        salary       = int(self.get_argument('salary', -1))
        xz           = self.get_argument('xingzuo', None)
        sx           = self.get_argument('shengxiao', None)
        limit        = int(self.get_argument('limit', -1))
        page         = int(self.get_argument('page', -1))
        next_        = int(self.get_argument('next', -1))
        if sex != -1 or agemin != -1 or agemax != -1 or cur1 or cur2 or ori1 or ori2 or degree != -1 or salary != -1 or xz or sx or limit != -1 or page != -1 or next_ != -1:
            '''ctx section begin '''
            cookie = self.get_secure_cookie('userid')
            ctx = {}
            if cookie:
                url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
                headers = self.request.headers
                http_client = tornado.httpclient.AsyncHTTPClient()
                resp = yield tornado.gen.Task(
                        http_client.fetch,
                        url,
                        method='POST',
                        headers=headers,
                        body='cookie=%s'%cookie,
                        validate_cert=False)
                b = resp.body
                d = {}
                try:
                    d = json.loads(b)
                except:
                    d = {}
                if d.get('code', -1) == -1:
                    ctx = {}
                else:
                    ctx = d.get('data', {})
                '''ctx section end '''
                if not ctx:
                    self.clear_cookie('userid')
                    r = {'code':-1, 'msg':'请先登录!', 'data':{}}
                    r = json.dumps(r)
                    self.write(r)
                    self.finish()
                else:
                    url = 'http://%s:%s/find' % (conf.dataserver_ip, conf.dataserver_port)
                    headers = self.request.headers
                    http_client = tornado.httpclient.AsyncHTTPClient()
                    resp = yield tornado.gen.Task(
                            http_client.fetch,
                            url,
                            method='POST',
                            headers=headers,
                            body=self.request.body,
                            validate_cert=False)
                    b = resp.body
                    d = {}
                    try:
                        d = json.loads(b)
                    except:
                        d = {}
                    if not d or d.get('code', -1) != 0 or not d.get('data'):
                        r = {'code':-1, 'msg':'error', 'data':[]}
                        r = json.dumps(r)
                        self.write(r)
                        self.finish()
                    else:
                        r = {'code':0, 'msg':'ok',
                             'count':d.get('count', 0),'data':d['data']}
                        r = json.dumps(r)
                        self.write(r)
                        self.finish()

            else:
                r = {'code':-1, 'msg':'请先登录!', 'data':[]}
                r = json.dumps(r)
                self.write(r)
                self.finish()
        else:
            url = 'http://%s:%s/find' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=self.request.body,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if not d or d.get('code', -1) != 0 or not d.get('data'):
                r = {'code':-1, 'msg':'error', 'data':[]}
                r = json.dumps(r)
                self.write(r)
                self.finish()
            else:
                r = {'code':0, 'msg':'ok',
                     'count': d.get('count', 0), 'data':d['data']}
                r = json.dumps(r)
                self.write(r)
                self.finish()

class LoginHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        mobile = self.get_argument('mobile', None)
        passwd = self.get_argument('password', None)
        p = '^(1[356789])[0-9]{9}$'
        if not mobile or not re.match(p, mobile) or not passwd:
            r = {'code':-1, 'msg':'', 'data':{}}
            r = json.dumps(r)
            self.write(r)
            self.finish()
        else:
            url = 'http://%s:%s/login' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=self.request.body,
                    validate_cert=False)
            r = resp.body
            try:
                r = json.loads(r)
            except:
                r = {}
            if not r:
                a = {'code': -2, 'msg': '服务器出错!'}
                a = json.dumps(a)
                self.write(a)
            elif r.get('code', -1) == -1:
                a = {'code': -1, 'msg': '手机号或密码错误!'}
                a = json.dumps(a)
                self.write(a)
            elif r.get('code', -1) == 0:
                try:
                    d = r['data']
                    user = d['user']
                    sex_ = str(conf.male_name) if user['sex'] == 1 else str(conf.female_name)
                    print(sex_)
                    key = 'userid_%d' % user['id']
                    self.set_secure_cookie('userid', key)
                    name = user['nick_name']
                    name = name if len(name) else u'新用户%s' % user['mobile'][-3:]
                    a = {'code': 0, 'msg': 'ok', 'data':{'nick_name':name}}
                except:
                    a = {'code': -2, 'msg': '服务器错误'}
                a = json.dumps(a)
                self.write(a)
            self.finish()

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie('userid')
        self.redirect('/')

class VerifyHandler(tornado.web.RequestHandler):
    #获得验证码
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        p = '^(1[356789])[0-9]{9}$'
        mobile  = self.get_argument('mobile', None)
        if not mobile or not re.match(p, mobile):
            d = {'code': -1, 'msg':'电话号码不正确'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        else:
            url = 'http://%s:%s/verify' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            body = "mobile=%s&ip=%s" % (mobile, self.request.remote_ip)
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {}
            try:
                d = json.loads(r)
            except:
                d = {}
            if not d:
                d = {'code':-1, 'msg': '服务器错误'}
            elif d['code'] < 0:
                d = {'code':-1, 'msg': d['msg']}
            else:
                d = {'code':0, 'msg':'ok', 'time':d['time'], 'token':d['token']}
            d = json.dumps(d)
            self.write(d)
            self.finish()
    #手机验证
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        mobile  = self.get_argument('mobile', None)
        t_      = self.get_argument('time',   None)
        code    = self.get_argument('code',   None)
        token   = self.get_argument('token',  None)
        cookie = self.get_secure_cookie('userid')
        p = '^(1[356789])[0-9]{9}$'
        if not mobile or not re.match(p, mobile) or not t_ or not token or not cookie:
            d = {'code': -5, 'msg': 'request error'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        else:
            '''ctx section begin '''
            ctx = {}
            url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='cookie=%s'%cookie,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if d.get('code', -1) == -1:
                ctx = {}
            else:
                ctx = d.get('data', {})
            '''ctx section end'''
            if not ctx or not ctx.get('data'):
                d = {'code': -4, 'msg': 'invalid request'}
                d = json.dumps(d)
                self.write(d)
                self.finish()
            else:
                sec = 'jly'
                s = code + t_ + sec
                m2 = hashlib.md5()
                m2.update(s)
                digest = m2.hexdigest()
                if digest != token:
                    d = {'code': -2, 'msg':'code invalid'}
                    d = json.dumps(d)
                    self.write(d)
                    self.finish()
                else:
                    t = int(time.time())
                    if t-t_ > 120:
                        d = {'code': -1, 'msg':'code timeout'}
                        d = json.dumps(d)
                        self.write(d)
                        self.finish()
                    else:
                        url = 'http://%s:%s/verify_mobile' % (conf.dataserver_ip, conf.dataserver_port)
                        uid = ctx['user']['id']
                        headers = self.request.headers
                        body = 'mobile=%s&uid=%d' % (mobile, uid)
                        http_client = tornado.httpclient.AsyncHTTPClient()
                        resp = yield tornado.gen.Task(
                                http_client.fetch,
                                url,
                                method='POST',
                                headers=headers,
                                body=body,
                                validate_cert=False)
                        r = resp.body
                        d, D = {}, {}
                        try:
                            D = json.loads(r)
                        except:
                            D = {}
                        if D.get('code', -1) != 0:
                            d = {'code': D.get('code', -1), 'msg': 'inner error'}
                        else:
                            d = {'code': 0, 'msg':'ok'}
                        d = json.dumps(d)
                        self.write(d)
                        self.finish()

class FindVerifyHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        p = '^(1[356789])[0-9]{9}$'
        mobile  = self.get_argument('mobile', None)
        if not mobile or not re.match(p, mobile):
            d = {'code': -1, 'msg':'电话号码不正确'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        else:
            url = 'http://%s:%s/find_verify' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            body = "mobile=%s&ip=%s" % (mobile, self.request.remote_ip)
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {}
            try:
                d = json.loads(r)
            except:
                d = {}
            if not d:
                d = {'code':-1, 'msg': '服务器错误'}
            elif d['code'] < 0:
                d = {'code':-1, 'msg': d['msg']}
            else:
                d = {'code':0, 'msg':'ok', 'time':d['time'], 'token':d['token']}
            d = json.dumps(d)
            self.write(d)
            self.finish()

class FindPasswordHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        mobile   = self.get_argument('mobile', None)
        code     = self.get_argument('code',   None)
        token    = self.get_argument('token',  None)
        t_       = self.get_argument('time',   None)
        passwd1  = self.get_argument('passwd1',None)
        passwd2  = self.get_argument('passwd2',None)
        d = {}
        if not mobile:
            d = {'code': -1, 'msg': '手机号不能为空'}
        elif not code:
            d = {'code': -2, 'msg': '验证码不能为空'}
        elif not token or not t_:
            d = {'code': -3, 'msg': '非法请求'}
        elif not passwd1 or not passwd2 or passwd1 != passwd2:
            d = {'code': -4, 'msg': '两次密码不一致'}
        else:
            sec = 'jly'
            s = code + t_ + sec
            m2 = hashlib.md5()
            m2.update(s)
            digest = m2.hexdigest()
            if digest != token:
                d = {'code': -3, 'msg': '非法请求'}
            else:
                tn = int(time.time())
                if tn - int(t_) > 120:
                    d = {'code': -5, 'msg': '验证码超时'}
                else:
                    url = 'http://%s:%s/find_password' % (conf.dataserver_ip, conf.dataserver_port)
                    headers = self.request.headers
                    body = 'mobile=%s&password=%s' % (mobile, passwd1)
                    http_client = tornado.httpclient.AsyncHTTPClient()
                    resp = yield tornado.gen.Task(
                            http_client.fetch,
                            url,
                            method='POST',
                            headers=headers,
                            body=body,
                            validate_cert=False)
                r = resp.body
                D = {}
                try:
                    D = json.loads(r)
                except:
                    D = {}
                if not D:
                    d = {'code': -5, 'msg': '系统错误'}
                elif D['code'] != 0:
                    d = D
                else:
                    d = {'code': 0, 'msg':'密码重置成功'}
        d = json.dumps(d)
        self.write(d)
        self.finish()


class RegistHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        mobile    = self.get_argument('mobile', None)
        passwd1   = self.get_argument('password1', None)
        passwd2   = self.get_argument('password2', None)
        sex       = int(self.get_argument('sex', 0))
        token     = self.get_argument('token', None)
        code      = self.get_argument('code',  None)
        t_        = int(self.get_argument('time', 0))
        p = '^(1[356789])[0-9]{9}$'
        if not mobile or not re.match(p, mobile):
            d = {'code':-6, 'msg':'手机号不正确'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        elif not passwd1 or not passwd2 or passwd1 != passwd2:
            d = {'code':-3, 'msg':'两次密码不一致'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        elif sex not in [1,2]:
            d = {'code':-5, 'msg':'性别错误'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        elif not token:
            d = {'code':-4, 'msg':'token非法'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        elif not code:
            d = {'code':-2, 'msg':'验证码不正确'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
        else:
            secret = 'jly'
            s = '%s%d%s' % (code, t_, secret)
            m2 = hashlib.md5()   
            m2.update(s)   
            digest = m2.hexdigest()
            if digest != token:
                d = {'code':-4, 'msg':'token非法'}
                d = json.dumps(d)
                self.write(d)
                self.finish()
            else:
                tn = int(time.time())
                if tn - t_ > 120:
                    d = {'code':-1, 'msg':'验证码超时'}
                    d = json.dumps(d)
                    self.write(d)
                    self.finish()
                else:
                    url = 'http://%s:%s/regist' % (conf.dataserver_ip, conf.dataserver_port)
                    headers = self.request.headers
                    body = 'mobile=%s&password=%s&sex=%d' % (mobile, passwd1, sex)
                    http_client = tornado.httpclient.AsyncHTTPClient()
                    resp = yield tornado.gen.Task(
                            http_client.fetch,
                            url,
                            method='POST',
                            headers=headers,
                            body=body,
                            validate_cert=False)
                    r = resp.body
                    d = {}
                    try:
                        d = json.loads(r)
                    except:
                        d = {}
                    if not d:
                        d = {'code':-7, 'msg':'服务器错误'}
                        d = json.dumps(d)
                        self.write(d)
                        self.finish()
                    else:
                        r = {'code': 0, 'msg':'ok'}
                        if d['code'] == 0:
                            r = {'code': 0, 'msg':'注册成功'}
                        elif d['code'] == -1:
                            r = {'code':-7, 'msg':'服务器错误'}
                        else:
                            r = {'code': -8, 'msg':'手机号已经被注册过了'}
                        r = json.dumps(r)
                        self.write(r)
                        self.finish()

class PersonalCenterHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        para = self.get_argument('data', None)
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='cookie=%s'%cookie,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if d.get('code', -1) == -1:
                ctx = {}
            else:
                ctx = d.get('data', {})
        '''ctx section end'''
        if ctx and ctx.get('user', {}):
            user = ctx['user']
            sex_ = conf.male_name if user['sex'] == 1 else conf.female_name
            name = name if name else sex_ + user['mobile'][-4:]
            self.render('center/center.html', name=name)
        else:
            self.redirect('/')
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='cookie=%s'%cookie,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if d.get('code', -1) == -1:
                ctx = {}
            else:
                ctx = d.get('data', {})
        '''ctx section end'''
        d ={'code':-1, 'msg':'invalid request'}
        if ctx and ctx.get('user', {}):
            d = {'code': 0, 'msg':'ok', 'data': ctx}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class PersonalBasicEditHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='cookie=%s'%cookie,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if d.get('code', -1) == -1:
                ctx = {}
            else:
                ctx = d.get('data', {})
        '''ctx section end'''
        if ctx and ctx.get('user'):
            url = 'http://%s:%s/basic_edit' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            ctx_ = json.dumps(ctx)
            body = self.request.body + '&ctx=%s' % ctx_
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {'code': -1, 'msg': '编辑失败!'}
            try:
                d = json.loads(r)
            except:
                d = {'code': -1, 'msg': '编辑失败!'}
            if d['code'] == 0:
                del d['data']
            d = json.dumps(d)
            self.write(d)
            self.finish()
        else:
            d = {'code': -1, 'msg': '编辑失败!'}
            d = json.dumps(d)
            self.write(d)
            self.finish()

class StatementEditHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='cookie=%s'%cookie,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if d.get('code', -1) == -1:
                ctx = {}
            else:
                ctx = d.get('data', {})
        '''ctx section end'''
        if ctx and ctx.get('user'):
            url = 'http://%s:%s/statement_edit' % (conf.dataserver_ip, conf.dataserver_port)
            headers = self.request.headers
            ctx_ = json.dumps(ctx)
            body = self.request.body + '&ctx=%s' % ctx_
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {'code': -1, 'msg': '编辑失败!'}
            try:
                d = json.loads(r)
            except:
                d = {'code': -1, 'msg': '编辑失败!'}
            if d.get('code', -1) == 0:
                d = {'code': 0, 'msg': '编辑成功!'}
                d = json.dumps(d)
            else:
                d = {'code': -1, 'msg': '编辑失败!'}
                d = json.dumps(d)
            self.write(d)
            self.finish()
        else:
            self.redirect('/')
class OtherEditHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        if not wx and not qq and not email and not mobile:
            self.write('请先编辑联系方式,再提交!');
            self.finish()
        else:
            '''ctx section begin '''
            cookie = self.get_secure_cookie('userid')
            ctx = {}
            if cookie:
                url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
                headers = self.request.headers
                http_client = tornado.httpclient.AsyncHTTPClient()
                resp = yield tornado.gen.Task(
                        http_client.fetch,
                        url,
                        method='POST',
                        headers=headers,
                        body='cookie=%s'%cookie,
                        validate_cert=False)
                b = resp.body
                d = {}
                try:
                    d = json.loads(b)
                except:
                    d = {}
                if d.get('code', -1) == -1:
                    ctx = {}
                else:
                    ctx = d.get('data', {})
            '''ctx section end'''
            if ctx and ctx.get('user'):
                url = 'http://%s:%s/other_edit' % (conf.dataserver_ip, conf.dataserver_port)
                headers = self.request.headers
                ctx_ = json.dumps(ctx)
                body = self.request.body + '&ctx=%s' % ctx_
                http_client = tornado.httpclient.AsyncHTTPClient()
                resp = yield tornado.gen.Task(
                        http_client.fetch,
                        url,
                        method='POST',
                        headers=headers,
                        body=body,
                        validate_cert=False)
                r = resp.body
                d = {'code': -1, 'msg': '编辑失败!'}
                try:
                    d = json.loads(r)
                except:
                    d = {'code': -1, 'msg': '编辑失败!'}
                if d.get('code', -1) == 0:
                    d = {'code': 0, 'msg': '编辑成功!'}
                    d = json.dumps(d)
                else:
                    d = {'code': -1, 'msg': '编辑失败!'}
                    d = json.dumps(d)
                self.write(d)
                self.finish()
            else:
                self.redirect('/')

class PublishHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        kind     = self.get_argument('kind',   None)
        action   = self.get_argument('action', None)
        if not kind or not action:
            d = {'code': -1, 'msg': '不合法提交!'}
            d = json.dumps(d)
            self.write(d)
        elif kind not in ['1', '2', '3', '4']:#手机 qq wx email
            d = {'code': -1, 'msg': '不合法提交!'}
            d = json.dumps(d)
            self.write(d)
        else:
            '''ctx section begin '''
            cookie = self.get_secure_cookie('userid')
            ctx = {}
            if cookie:
                url = 'http://%s:%s/ctx' % (conf.dataserver_ip, conf.dataserver_port)
                headers = self.request.headers
                http_client = tornado.httpclient.AsyncHTTPClient()
                resp = yield tornado.gen.Task(
                        http_client.fetch,
                        url,
                        method='POST',
                        headers=headers,
                        body='cookie=%s'%cookie,
                        validate_cert=False)
                b = resp.body
                d = {}
                try:
                    d = json.loads(b)
                except:
                    d = {}
                if d.get('code', -1) == -1:
                    ctx = {}
                else:
                    ctx = d.get('data', {})
            '''ctx section end'''
            if ctx and ctx.get('user'):
                url = 'http://%s:%s/publish' % (conf.dataserver_ip, conf.dataserver_port)
                headers = self.request.headers
                ctx_ = json.dumps(ctx)
                body = self.request.body + '&ctx=%s' % ctx_
                http_client = tornado.httpclient.AsyncHTTPClient()
                resp = yield tornado.gen.Task(
                        http_client.fetch,
                        url,
                        method='POST',
                        headers=headers,
                        body=body,
                        validate_cert=False)
                r = resp.body
                d = {'code': -1, 'msg': 'failed'}
                try:
                    d = json.loads(r)
                except:
                    d = {'code': -1, 'msg': 'failed'}
                if d.get('code', -1) == 0:
                    d = {'code': 0, 'msg': 'success!'}
                    d = json.dumps(d)
                else:
                    d = {'code': -1, 'msg': 'failed'}
                    d = json.dumps(d)
                self.write(d)
                self.finish()
            else:
                self.redirect('/')

class FileUploadHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        print('aaaa')
        self.finish()

class MySeeHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        ctx = self.get_ctx('userid')
        if ctx:
            self.render('center/mySee.html', ctx=ctx)
        else:
            self.redirect('/')

class SeeMeHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        ctx = self.get_ctx('userid')
        if ctx:
            self.render('center/seeMe.html', ctx=ctx)
        else:
            self.redirect('/')

class ICareHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        ctx = self.get_ctx('userid')
        if ctx:
            self.render('center/icare.html', ctx=ctx)
        else:
            self.redirect('/')

class CareMeHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        ctx = self.get_ctx('userid')
        if ctx:
            self.render('center/mySee.html', ctx=ctx)
        else:
            self.redirect('/')

if __name__ == "__main__":
    tornado.options.parse_command_line()
    settings = {
        "template_path": os.path.join(os.path.dirname(__file__), "templates"),
        "static_path": os.path.join(os.path.dirname(__file__), "static"),
        "cookie_secret": "bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
        "xsrf_cookies": True,
        "login_url": "/",
        "debug":True}
    handler = [
        (r"/static/(.*)", StaticFileHandler, {"path": "static"}),  
        (r"/css/(.*)", StaticFileHandler, {"path": "static/css"}),  
        (r"/js/(.*)", StaticFileHandler, {"path": "static/js"}),  
        (r"/img/(.*)", StaticFileHandler, {"path": "static/img"}), 
        ('/', IndexHandler),
        ('/new', IndexNewHandler),
        ('/find', FindHandler),
        ('/login', LoginHandler),
        ('/logout', LogoutHandler),
        ('/regist', RegistHandler),
        ('/verify_code', VerifyHandler),
        ('/find_verify', FindVerifyHandler),
        ('/find_password', FindPasswordHandler),
        ('/center', PersonalCenterHandler),
        ('/basic_edit', PersonalBasicEditHandler),
        ('/statement_edit', StatementEditHandler),
        ('/other_edit', OtherEditHandler),
       #('/publish', PublishHandler),#对外公开 隐藏
        ('/fileupload', FileUploadHandler),
        ('/mysee', MySeeHandler),
        ('/seeme', SeeMeHandler),
        ('/icare', ICareHandler),
        ('/careme', CareMeHandler),
              ]
    application = tornado.web.Application(handler, **settings)
    http_server = tornado.httpserver.HTTPServer(application, xheaders=True)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
