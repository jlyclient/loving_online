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

        self.redis_ip    = p.get('redis', 'redis_ip')
        self.redis_port  = p.getint('redis', 'redis_port')
        self.redis_db    = p.getint('redis', 'redis_db')
        self.redis_password = p.get('redis', 'redis_password')
        self.redis_timeout = p.getint('redis', 'redis_timeout')

        self.female_name = p.get('name', 'female_name')
        self.male_name   = p.get('name', 'male_name')
        self.baidu_ak    = p.get('map', 'baidu_ak')
        self.baidu_url   = p.get('map', 'baidu_url')


    def dis(self):
        print(self.sys_port)

conf    = Picconf('./conf.txt')

if __name__ == "__main__":
    conf.dis()
