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

        self.female_name = p.get('name', 'female_name')
        self.male_name   = p.get('name', 'male_name')
        self.baidu_ak    = p.get('map', 'baidu_ak')
        self.baidu_url   = p.get('map', 'baidu_url')

        self.pic_server_ip = p.get('pic_server', 'ip')
        self.pic_server_port = p.get('pic_server', 'port')

        self.mail_page   = p.getint('mail', 'mail_page')

        self.dating_fee  = p.getint('fee', 'dating_fee')

        self.wx_code_url = p.get('login', 'wx_code_url')
        self.wx_access_url=p.get('login', 'wx_access_url')
        self.user_url= p.get('login', 'user_url')

    def dis(self):
        print(self.sys_port)

conf    = Picconf('./conf.txt')

if __name__ == "__main__":
    conf.dis()
