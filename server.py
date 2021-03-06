#-*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

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
from wxpay import genorder
from xmlparse import order_response_xml_parse

define("port", default=conf.sys_port, help="run on the given port", type=int)

nation_arr = ['未填', '汉族', '壮族', '满族', '回族', '苗族',
           '维吾尔族', '土家族', '彝族', '蒙古族', '藏族',
           '布依族', '侗族', '瑶族', '朝鲜族', '白族',
           '哈尼族', '哈萨克族', '黎族', '傣族', '畲族',
           '傈傈族', '仡佬族', '东乡族', '高山族', '拉祜族',
           '水族', '佤族', '纳西族', '羌族', '土族',
           '仫佬族', '锡伯族', '柯尔克孜族', '达翰尔族', '景颇族',
           '毛南族', '撒拉族', '布朗族', '塔吉克族', '阿昌族',
           '普米族', '鄂温克族', '怒族', '京族', '基诺族',
           '德昂族', '保安族', '俄罗斯族', '裕固族', '乌孜别克族',
           '门巴族', '鄂伦春族', '独龙族', '塔塔尔族', '赫哲族',
           '珞巴族']
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
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
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
            name = user['nick_name']
            sex_ = u'新用户'
            name = name if name else sex_ + user['mobile'][-4:]
        banner = [{'src':'img/banner%d.jpg'%(i+1)} for i in xrange(4)]
        total = ctx.get('total')
        self.render('index.html', name=name, banner=banner, total=total)

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
            url = 'http://%s:%s/new' % (conf.dbserver_ip, conf.dbserver_port)
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
    def get(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
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
            name = user['nick_name']
            sex_ = u'新用户'
            name = name if name else sex_ + user['mobile'][-4:]
            self.render('self_find.html', name=name, sex=ctx['user']['sex'])
        else:
            self.redirect('/')
        
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        sex          = self.get_argument('sex', None)
#       sex          = int(sex) if sex else -1
        agemin       = self.get_argument('agemin', None)
#       agemin       = int(agemin) if agemin else -1
        agemax       = self.get_argument('agemax', None)
#       agemax       = int(agemax) if agemax else -1
        cur1         = self.get_argument('cur1',    None)
        cur2         = self.get_argument('cur2',    None)
        ori1         = self.get_argument('ori1',    None)
        ori2         = self.get_argument('ori2',    None)
        degree       = self.get_argument('degree', None)
#       degree       = int(degree) if degree else -1
        salary       = self.get_argument('salary', None)
#       salary       = int(salary) if salary else -1
        xz           = self.get_argument('xingzuo', None)
        sx           = self.get_argument('shengxiao', None)
        limit        = self.get_argument('limit', None)
#       limit        = int(limit) if limit else -1
        page         = self.get_argument('page', None)
#       page         = int(page) if page else -1
        next_        = self.get_argument('next', None)
#       next_        = int(next_) if next_ else -1
        print('sex=', sex)
        print('agemin=', agemin)
        print('agemax=', agemax)
        print('cur1=', cur1)
        print('cur2=', cur2)
        print('ori1=', ori1)
        print('ori2=', ori2)
        print('degree=', degree)
        print('salary=', salary)
        print('xz=', xz)
        print('sx=', sx)
        print('limit=', limit)
        print('page=', page)
        print('next=', next_)
        cookie = self.get_secure_cookie('userid')
        print('cookie=', cookie)
        uid = cookie.split('_')[1] if cookie else ''
        url = 'http://%s:%s/find' % (conf.dbserver_ip, conf.dbserver_port)
        headers = self.request.headers
        http_client = tornado.httpclient.AsyncHTTPClient()
        resp = yield tornado.gen.Task(
                http_client.fetch,
                url,
                method='POST',
                headers=headers,
                body=self.request.body + '&uid=%s'%uid,
                validate_cert=False)
        b = resp.body
        d = {'code': -1, 'msg': '服务器错误'}
        try:
            d = json.loads(b)
        except:
            pass
        d = json.dumps(d)
        self.write(d)
        self.finish()

class LoginHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        code = self.get_argument('code', None)
        if not code:
            self.redirect('/')
        else:
            access_url = conf.wx_access_url % code
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(http_client.fetch, access_url)
            d = resp.body
            try:
                d = json.loads(d)
            except:
                d = {}
            if not d:
                self.write('微信服务器错误1')
                self.finish()
            else:
                atk = d.get('access_token')
                if not atk:
                    self.write(d.get('errmsg', 'access_token error!'))
                    self.finish()
                else:
                    openid = d['openid']
                    user_url = conf.user_url % (atk, openid)
                    http_client = tornado.httpclient.AsyncHTTPClient()
                    resp = yield tornado.gen.Task(http_client.fetch, user_url)
                    d = resp.body
                    try:
                        d = json.loads(d)
                    except:
                        d = {}
                    if not d:
                        self.write('微信服务器错误2')
                        self.finish()
                    else:
                        openid    = d.get('openid', '')
                        nick_name = d.get('nickname', '')
                        sex       = d.get('sex', '')
                        img       = d.get('headimgurl', '')
                        print(img)
                        unionid   = d.get('unionid', '')
                        if not unionid:
                            self.write('微信服务器错误2')
                            self.finish()
                        else:
                            body = 'src=%s&nick_name=%s&sex=%s&unionid=%s&openid=%s' % \
                                   (img, nick_name, sex, unionid, openid)
                            url = 'http://%s:%s/wxlogin' % (conf.dbserver_ip, conf.dbserver_port)
                            headers = self.request.headers
                            http_client = tornado.httpclient.AsyncHTTPClient()
                            resp = yield tornado.gen.Task(
                                    http_client.fetch,
                                    url,
                                    method='POST',
                                    headers=headers,
                                    body=body,
                                    validate_cert=False)
                            b = resp.body
                            d = {'code': -1, 'msg': '服务器错误'}
                            try:
                                d = json.loads(b)
                            except:
                                pass
                            if d['code'] == 0:
                                uid = d['data']['uid']
                                needup = d['data']['needup']
                                val = 'userid_%s' % uid
                                self.set_secure_cookie('userid', val)

                                if needup:
                                    url = 'http://%s:%s/wxup' % (conf.pic_server_ip, conf.pic_server_port)
                                    headers = self.request.headers
                                    http_client = tornado.httpclient.AsyncHTTPClient()
                                    body = 'src=%s&uid=%s'%(img,uid)
                                    resp = yield tornado.gen.Task(
                                            http_client.fetch,
                                            url,
                                            method='POST',
                                            headers=headers,
                                            body=body,
                                            validate_cert=False)
                                self.redirect('/center')
                            else:
                                self.write('登录失败')
                                self.finish()



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
            url = 'http://%s:%s/login' % (conf.dbserver_ip, conf.dbserver_port)
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
                    key = 'userid_%d' % user['id']
                    self.set_secure_cookie('userid', key)
                    name = user['nick_name']
                    name = name if len(name) else u'新用户%s' % user['mobile'][-4:]
                    a = {'code': 0, 'msg': 'ok', 'data':{'nick_name':name}}
                except:
                    a = {'code': -2, 'msg': '服务器错误'}
                a = json.dumps(a)
                self.write(a)
            self.finish()

class WxLoginCodeHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        url = conf.wx_code_url
        self.write(url)
        self.finish()

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie('userid')
        self.redirect('/')

class UserHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        uid = self.get_argument('uid', None)
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        cuid = cookie.split('_')[1]
        ctx = {}
        if uid and cookie:
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%cuid,
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
            name = user['nick_name']
            sex_ = u'新用户'
            name = name if name else sex_ + user['mobile'][-4:]
            me = True if int(uid) == int(user['id']) else False
            if me:
                self.redirect('/center')
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if d.get('code', -1) == -1:
                octx = {}
            else:
                octx = d.get('data', {})
            other = octx.get('otherinfo')
            if not other:
                self.write('Not Found!')
                self.finish()
            else:
                url = 'http://%s:%s/sawother' % (conf.dbserver_ip, conf.dbserver_port)
                headers = self.request.headers
                http_client = tornado.httpclient.AsyncHTTPClient()
                resp = yield tornado.gen.Task(
                        http_client.fetch,
                        url,
                        method='POST',
                        headers=headers,
                        body='cuid=%s&uid=%s'%(cuid, uid),
                        validate_cert=False)
                b = resp.body
                d = {}
                try:
                    d = json.loads(b)
                except:
                    d = {}
                saw = {'wx':0,'qq':0,'email': 0,'mobile':0,'yanyuan':0,'email1':0}
                if d and d['code'] == 0:
                    saw = d['data']
                self.render('detail.html', name=name, me=me, other=other, saw=saw)
        else:
            self.redirect('/')

    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        uid = self.get_argument('uid', None)
        coo = self.get_secure_cookie('userid')
        cuid = coo.split('_')[1]
        d = {}
        if not uid:
            d = {'code': -1, 'msg': '参数不正确'}
        else:
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            ctx = {}
            if d.get('code', -1) == -1:
                ctx = {}
            else:
                ctx = d.get('data', {})

            url = 'http://%s:%s/yanyuan_check' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s&cuid=%s'%(uid, cuid),
                    validate_cert=False)
            r = resp.body
            b = {}
            try:
                b = json.loads(r)
            except:
                b = {}
            yanyuan = 0
            if b and b.get('data'):
                yanyuan = b['data']['yanyuan']
            url = 'http://%s:%s/guanzhu_check' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s&cuid=%s'%(uid, cuid),
                    validate_cert=False)
            r = resp.body
            b = {}
            try:
                b = json.loads(r)
            except:
                b = {}
            guanzhu = 0
            if b and b.get('data'):
                guanzhu = b['data']['guanzhu']
            d = {'code': 0, 'msg': 'ok', 'data': ctx, 'yanyuan':yanyuan,
                 'guanzhu': guanzhu}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class EmailHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
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
            name = user['nick_name']
            sex_ = u'新用户'
            name = name if name else sex_ + user['mobile'][-4:]
            self.render('center/inbox.html', name=name)
        else:
            self.redirect('/')

    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        page = self.get_argument('page', conf.mail_page)
        next_ = self.get_argument('next', 0)
        d = {} 
        if not uid:
            d = {'code': 0, 'msg': '参数不正确'}
        else:
            page, next_ = str(page), str(next_)
            url = 'http://%s:%s/email' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s&page=%s&next=%s'%(uid, page, next_),
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if not d:
                d = {'code': -1, 'msg': '服务器错误'}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class SeeEmailHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        eid    = self.get_argument('eid', None)
        coo    = self.get_secure_cookie('userid')
        cuid   = coo.split('_')[1]
        d = {}
        if not eid:
            d = {'code': -1, 'msg': '参数不正确'}
        else:
            url = 'http://%s:%s/see_email' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='cuid=%s&eid=%s'%(cuid, eid),
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if not d:
                d = {'code': -1, 'msg': '服务器错误'}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class LatestConnHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        url = 'http://%s:%s/latest_conn' % (conf.dbserver_ip, conf.dbserver_port)
        headers = self.request.headers
        http_client = tornado.httpclient.AsyncHTTPClient()
        resp = yield tornado.gen.Task(
                http_client.fetch,
                url,
                method='POST',
                headers=headers,
                body='uid=%s'%uid,
                validate_cert=False)
        b = resp.body
        d = {}
        try:
            d = json.loads(b)
        except:
            d = {}
        if not d:
            d = {'code': -1, 'msg':'服务器错误'}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class SendEmailHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        cookie = self.get_secure_cookie('userid')
        cuid = cookie.split('_')[1]
        uid = self.get_argument('uid', None)
        cnt = self.get_argument('content', None)
        eid = self.get_argument('eid', '')
        kind = self.get_argument('kind', '0')
        d = {}
        if not uid or not cnt:
            d = {'code': -1, 'msg': '参数不正确'}
        elif cuid == uid:
            d = {'code': -1, 'msg': '自己不用给自己发信'}
        else:
            url = 'http://%s:%s/sendemail' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='kind=%s&uid=%s&cuid=%s&content=%s&eid=%s'%(kind,uid, cuid, cnt, eid),
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if not d:
                d = {'code': -1, 'msg': '服务器错误'}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class DelEmailHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        eid = self.get_argument('eid', None)
        d = {}
        if not eid:
            d = {'code': -1, 'msg': '参数错误'}
        else:
            url = 'http://%s:%s/del_email' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s&eid=%s'%(uid, eid),
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if not d:
                d = {'code': -1, 'msg': '服务器错误'}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class YanyuanHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        cookie = self.get_secure_cookie('userid')
        cuid = cookie.split('_')[1]
        uid = self.get_argument('uid', None)
        d = {}
        if not uid:
            d = {'code': -1, 'msg': '参数不正确'}
        elif cuid == uid:
            d = {'code': -1, 'msg': '自己不用给自己发眼缘'}
        else:
            url = 'http://%s:%s/yanyuan' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s&cuid=%s'%(uid, cuid),
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if not d:
                d = {'code': -1, 'msg': '服务器错误'}
            d = json.dumps(d)
        self.write(d)
        self.finish()

class PersonalCenterHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
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
            sex_ = u'新用户'
            name = user['nick_name']
            name = name if name else sex_ + user['mobile'][-4:]
            self.render('center/center.html', name=name, nation_arr=nation_arr, ctx=ctx)
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
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
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
        d ={'code':-1, 'msg':'请先登录'}
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
        coo = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        url = 'http://%s:%s/basic_edit' % (conf.dbserver_ip, conf.dbserver_port)
        headers = self.request.headers
        body = self.request.body + '&uid=%s'%uid
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
        d = json.dumps(d)
        self.write(d)
        self.finish()

class StatementEditHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        url = 'http://%s:%s/statement_edit' % (conf.dbserver_ip, conf.dbserver_port)
        headers = self.request.headers
        body = self.request.body
        http_client = tornado.httpclient.AsyncHTTPClient()
        resp = yield tornado.gen.Task(
                http_client.fetch,
                url,
                method='POST',
                headers=headers,
                body=body + '&uid=%s'%uid,
                validate_cert=False)
        r = resp.body
        d = {'code': -1, 'msg': '编辑失败!'}
        try:
            d = json.loads(r)
        except:
            d = {'code': -1, 'msg': '编辑失败!'}
        if d.get('code', -1) == 0:
            d = {'code': 0, 'msg': '编辑成功!'}
        else:
            d = {'code': -1, 'msg': '编辑失败!'}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class OtherEditHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        url = 'http://%s:%s/other_edit' % (conf.dbserver_ip, conf.dbserver_port)
        headers = self.request.headers
        body = self.request.body + '&uid=%s' % uid
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

class SeeOtherHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        uid  = self.get_argument('uid', None)
        kind = self.get_argument('kind', None)
        cookie = self.get_secure_cookie('userid')
        cuid = cookie.split('_')[1]
        d = {'code': -1, 'msg': '参数不对'}
        if not uid or not kind:
            d = {'code': -1, 'msg': '参数不对'}
        elif uid == cuid:
            d = {'code': -1, 'msg': '参数不对'}
        else:
            url = 'http://%s:%s/seeother' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s&cuid=%s&kind=%s'%(uid, cuid, kind),
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if not d:
                d = {'code': -2, 'msg': '服务器错误'}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class PublicHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        #kind:  =1手机 =2微信 =3QQ =4邮箱
        kind     = self.get_argument('kind',   None)
        #=0非公开  =1公开
        action   = self.get_argument('action', None)
        d = {'code': -1, 'msg': '参数不对!'}
        if not kind or not action:
            pass
        #手机 wx qq email
        elif kind not in ['1', '2', '3', '4'] or action not in ['0','1']:
            pass
        else:
            cookie = self.get_secure_cookie('userid')
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/public' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            body = self.request.body + '&uid=%s' % uid
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            try:
                d = json.loads(r)
            except:
                pass
            if d.get('code', -1) == 0:
                d = {'code': 0, 'msg': 'ok!'}
        d = json.dumps(d)
        self.write(d)
        self.finish()

class FileUploadHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        uid  = self.get_secure_cookie('userid')
        kind = self.get_argument('kind', None)
        file_metas  = self.request.files.get('file')
        d = {'code': -1, 'msg': '参数不正确'}
        if not uid or not kind or kind not in ['1', '2']:
            d = json.dumps(d)
            self.write(d)
            self.finish()
        else:
            uid = uid.split('_')[1]
            ip = self.request.remote_ip
            url = 'http://%s:%s/up' % (conf.pic_server_ip, conf.pic_server_port)
            headers = self.request.headers
            body = self.request.body + '&ip=%s' % ip
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
                d = {'code': -1, 'msg': '服务器错误'}
            if d['code'] == 0 and len(d.get('data', [])) == 3:
                url = 'http://%s:%s/img' % (conf.dbserver_ip, conf.dbserver_port)
                [f, s, t] = d['data']
                headers = self.request.headers
                body = 'f=%s&s=%s&t=%s&uid=%s&k=%s' % (f,s,t,uid,kind)
                http_client = tornado.httpclient.AsyncHTTPClient()
                resp = yield tornado.gen.Task(
                        http_client.fetch,
                        url,
                        method='POST',
                #       headers=headers,
                        body=body,
                        validate_cert=False)
                r = resp.body
                d = {'code':-1, 'msg': '服务器错误'}
                try:
                    d = json.loads(r)
                except:
                    d = {'code':-1, 'msg': '服务器错误'}
            d = json.dumps(d)
            self.write(d)
            self.finish()
            
class DelImagHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        src = self.get_argument('src', None)
        cookie = self.get_secure_cookie('userid')
        uid = cookie.split('_')[1]
        d = {'code': -1, 'msg': '请先登录'}
        if not src:
            d = {'code': -2, 'msg': '参数不正确'}
        else:
            url = 'http://%s:%s/delimg' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            body = self.request.body + '&uid=%s&src=%s' % (uid, src)
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {'code':-1, 'msg': '服务器错误'}
            try:
                d = json.loads(r)
            except:
                d = {'code':-1, 'msg': '服务器错误'}
            d = json.dumps(d)
        self.write(d)
        self.finish()

class ISeeHandler(BaseHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
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
            name = user['nick_name']
            sex_ = u'新用户'
            name = name if name else sex_ + user['mobile'][-4:]
            self.render('center/isee.html', name=name)
        else:
            self.redirect('/')

    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        cookie = self.get_secure_cookie('userid')
        if cookie:
            uid = cookie.split('_')[1]
            if not uid:
                d = {'code': -1, 'msg': '请先登录'}
                d = json.dumps(d)
                self.write(d)
                self.finish()
            else:
                url = 'http://%s:%s/isee' % (conf.dbserver_ip, conf.dbserver_port)
                headers = self.request.headers
                body = self.request.body + '&uid=%s' % uid 
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
                    d = {'code': -3, 'msg': '服务器错误'}
                d = json.dumps(d)
                self.write(d)
                self.finish()
        else:
            d = {'code': -1, 'msg': '请先登录'}
            d = json.dumps(d)
            self.write(d)
            self.finish()

class SeeMeHandler(BaseHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
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
            name = user['nick_name']
            sex_ = u'新用户'
            name = name if name else sex_ + user['mobile'][-4:]
            self.render('center/seeme.html', name=name)
        else:
            self.redirect('/')

    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        cookie = self.get_secure_cookie('userid')
        if cookie:
            uid = cookie.split('_')[1]
            if not uid:
                d = {'code': -1, 'msg': '请先登录'}
                d = json.dumps(d)
                self.write(d)
                self.finish()
            else:
                url = 'http://%s:%s/seeme' % (conf.dbserver_ip, conf.dbserver_port)
                headers = self.request.headers
                body = self.request.body + '&uid=%s' % uid 
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
                    d = {'code': -3, 'msg': '服务器错误'}
                d = json.dumps(d)
                self.write(d)
                self.finish()
        else:
            d = {'code': -1, 'msg': '请先登录'}
            d = json.dumps(d)
            self.write(d)
            self.finish()


class ICareHandler(BaseHandler):
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def get(self):
        '''ctx section begin '''
        cookie = self.get_secure_cookie('userid')
        ctx = {}
        if cookie:
            uid = cookie.split('_')[1]
            url = 'http://%s:%s/ctx' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='uid=%s'%uid,
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
            name = user['nick_name']
            sex_ = u'新用户'
            name = name if name else sex_ + user['mobile'][-4:]
            self.render('center/icare.html', name=name)
        else:
            self.redirect('/')

    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        cookie = self.get_secure_cookie('userid')
        if cookie:
            uid = cookie.split('_')[1]
            if not uid:
                d = {'code': -1, 'msg': '请先登录'}
                d = json.dumps(d)
                self.write(d)
                self.finish()
            else:
                url = 'http://%s:%s/icare' % (conf.dbserver_ip, conf.dbserver_port)
                headers = self.request.headers
                body = self.request.body + '&uid=%s' % uid 
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
                    d = {'code': -3, 'msg': '服务器错误'}
                d = json.dumps(d)
                self.write(d)
                self.finish()
        else:
            d = {'code': -1, 'msg': '请先登录'}
            d = json.dumps(d)
            self.write(d)
            self.finish()

class SendCareHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo = self.get_secure_cookie('userid')
        cuid = coo.split('_')[1]
        uid  = self.get_argument('uid', None)
        kind = self.get_argument('kind', None)
        d = {}
        if not uid or not kind:
            d = {'code': -1, 'msg': '参数不正确'}
        else:
            url = 'http://%s:%s/sendcare' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body='cuid=%s&uid=%s&kind=%s'%(cuid, uid, kind),
                    validate_cert=False)
            b = resp.body
            d = {}
            try:
                d = json.loads(b)
            except:
                d = {}
            if not d:
                d = {'code': -1, 'msg': '服务器错误'}
        d = json.dumps(d)
        self.write(d)
        self.finish()


class EmailUnReadHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        d = {'code': -1, 'msg': '参数不正确'}
        if not uid:
            pass
        else:
            url = 'http://%s:%s/email_unread' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            body = 'uid=%s'%uid
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {'code': -1, 'msg': '服务器错误'}
            try:
                d = json.loads(r)
            except:
                pass
        d = json.dumps(d)
        self.write(d)
        self.finish()

class YanYuanReplyHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo  = self.get_secure_cookie('userid')
        cuid = coo.split('_')[1]
        uid  = self.get_argument('uid', None)
        eid  = self.get_argument('eid', None)
        kind = self.get_argument('kind', None)
        d = {'code': -1, 'msg': '参数不正确'}
        if not uid or not cuid or not eid or not kind:
            pass
        else:
            url = 'http://%s:%s/yanyuan_reply' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            body = 'cuid=%s&uid=%s&eid=%s&kind=%s'%(cuid, uid, eid, kind)
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {'code': -1, 'msg': '服务器错误'}
            try:
                d = json.loads(r)
            except:
                pass
        d = json.dumps(d)
        self.write(d)
        self.finish()
            
class YuEHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo  = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        d = {'code': -1, 'msg': '参数不正确'}
        if not uid:
            pass
        else:
            url = 'http://%s:%s/yue' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            body = 'uid=%s'% uid
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {'code': -1, 'msg': '服务器错误'}
            try:
                d = json.loads(r)
            except:
                pass
        d = json.dumps(d)
        self.write(d)
        self.finish()

class QueryPayHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo  = self.get_secure_cookie('userid')
        uid  = coo.split('_')[1]
        otn  = self.get_argument('out_trade_no', None)
        d = {'code': -1, 'msg': '参数不正确'}
        if otn:
            url = 'http://%s:%s/query_order_pay' % (conf.dbserver_ip, conf.dbserver_port)
            headers = self.request.headers
            body = 'uid=%s&out_trade_no=%s'% (uid, otn)
            http_client = tornado.httpclient.AsyncHTTPClient()
            resp = yield tornado.gen.Task(
                    http_client.fetch,
                    url,
                    method='POST',
                    headers=headers,
                    body=body,
                    validate_cert=False)
            r = resp.body
            d = {'code': -1, 'msg': '服务器错误'}
            try:
                d = json.loads(r)
            except:
                pass
        d = json.dumps(d)
        self.write(d)
        self.finish()

class ChongZhiHandler(BaseHandler):
    @tornado.web.authenticated
    @tornado.web.asynchronous
    @tornado.gen.coroutine
    def post(self):
        coo  = self.get_secure_cookie('userid')
        uid = coo.split('_')[1]
        kind = int(self.get_argument('kind', '-1'))#第几个选项
        way  = int(self.get_argument('way', '-1'))#充值方式 0=wx 1=alipay
        print('kind=', kind)
        print('way=', way)
        d = {'code': -1, 'msg': '参数不正确'}
        if not uid or kind == -1 or way == -1:
            pass
        else:
            table = [100, 200, 500,1000,2000,5000,10000]
            i = int(kind)
            if i >= len(table) or i < 0:
                pass
            else:
                num = table[i]
                t = time.localtime()
                now = time.strftime('%Y%m%d%H%M%S', t)
                otn = '%s%02d_%s' % (now, kind, uid)
                pro_id = '1%02d' % kind
                sc_ip = self.request.remote_ip
                xml = genorder(otn, pro_id, sc_ip, num)
                url = conf.wx_order_url
                headers = {'Content-Type':'text/xml'}
                body = xml
                http_client = tornado.httpclient.AsyncHTTPClient()
                resp = yield tornado.gen.Task(
                        http_client.fetch,
                        url,
                        method='POST',
                        headers=headers,
                        body=body,
                        validate_cert=False)
                wx_order_res = order_response_xml_parse(resp.body)
                if not wx_order_res.get('return_code') or wx_order_res['return_code'] != 'SUCCESS' or not wx_order_res.get('code_url'):
                    d = {'code': -1, 'msg': '下单失败'}
                else:
                    code_url = wx_order_res.get('code_url')
                    d = {'code': 0, 'msg': 'ok', 'data':{'code_url': code_url, 'out_trade_no':otn}}
        d = json.dumps(d)
        self.write(d)
        self.finish()


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
        ('/wxlogin_code', WxLoginCodeHandler),
        ('/logout', LogoutHandler),
        ('/user', UserHandler),
        ('/email', EmailHandler),
        ('/see_email', SeeEmailHandler),
        ('/latest_conn', LatestConnHandler),
        ('/sendemail', SendEmailHandler),
        ('/del_email', DelEmailHandler),
        ('/yanyuan', YanyuanHandler),
        ('/center', PersonalCenterHandler),
        ('/editbasic', PersonalBasicEditHandler),
        ('/editstatement', StatementEditHandler),
        ('/other_edit', OtherEditHandler),
        ('/seeother', SeeOtherHandler),
        ('/public', PublicHandler),#对外公开 隐藏
        ('/fileupload', FileUploadHandler),
        ('/delimg', DelImagHandler),
        ('/isee', ISeeHandler),
        ('/seeme', SeeMeHandler),
        ('/icare', ICareHandler),
        ('/sendcare', SendCareHandler),
        ('/email_unread', EmailUnReadHandler),
        ('/yanyuan_reply', YanYuanReplyHandler),
        ('/yue', YuEHandler),
        ('/chongzhi', ChongZhiHandler),
        ('/query_pay_order', QueryPayHandler),
              ]
    application = tornado.web.Application(handler, **settings)
    http_server = tornado.httpserver.HTTPServer(application, xheaders=True)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
