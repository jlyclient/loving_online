#-*- coding: utf-8 -*-
import ConfigParser

class Picconf():
    def __init__(self, name):
        p = ConfigParser.ConfigParser()
        p.read(name)
        self.sys_ip      = p.get('sys', 'sys_ip')
        self.sys_port    = p.getint('sys', 'sys_port')

        self.dataserver_ip   = p.get('dataserver', 'dataserver_ip')
        self.dataserver_port = p.getint('dataserver', 'dataserver_port')

        self.dbserver_ip     = p.get('dbserver', 'dbserver_ip')
        self.dbserver_port   = p.get('dbserver', 'dbserver_port')

        self.female_name = p.get('name', 'female_name')
        self.male_name   = p.get('name', 'male_name')
        self.baidu_ak    = p.get('map', 'baidu_ak')
        self.baidu_url   = p.get('map', 'baidu_url')

        self.pic_server_ip = p.get('pic_server', 'ip')
        self.pic_server_port = p.get('pic_server', 'port')

        self.mail_page   = p.getint('mail', 'mail_page')

        self.dating_fee  = p.getint('fee', 'dating_fee')
        self.zhenghun_fee= p.getint('fee', 'zhenghun_fee')

        self.wx_code_url = p.get('login', 'wx_code_url')
        self.wx_access_url=p.get('login', 'wx_access_url')
        self.user_url= p.get('login', 'user_url')

        self.wx_notify_url = p.get('pay', 'wx_notify_url')
        self.wx_order_url  = p.get('pay', 'wx_order_url')
        self.wx_key        = p.get('pay', 'wx_key')

    def dis(self):
        print(self.sys_port)

conf    = Picconf('./conf.txt')

if __name__ == "__main__":
    conf.dis()
