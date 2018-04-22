#-*- coding: utf8 -*-

import random
import hashlib
import urllib2

from conf import conf

class RandomGen():
    def __init__(self):
        self.arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A',\
                    'B', 'C', 'D', 'E', 'F'];
    def rand(self, n):
        if n < 1:
            return 0
        r = ''
        for e in xrange(n):
            L = len(self.arr)
            d = random.random() * L
            d = int(d)
            d = d % L
            r = '%s%s' % (r, self.arr[d])
        return r

Rand = RandomGen()
'''
o_t_n:  商户订单号  out_trade_no     字符串
pro_id: 商品id      product_id       字符串
sc_ip:  终端ip      spbill_create_ip 字符串
num:    费用 单位:分  整型
'''
def genorder(o_t_n, pro_id, sc_ip, num):
    appid = 'wx0267b1a42b591564'
    body  = '佳良缘-示爱豆充值'
    device_info =  'WEB'
    fee_type = 'CNY'
    limit_pay = 'no_credit'
    mch_id = '1501837141'
    nonce_str = Rand.rand(20)
    notify_url = conf.wx_notify_url
    out_trade_no = o_t_n
    product_id = pro_id
    sign_type = 'MD5'
    spbill_create_ip = sc_ip
    total_fee = '%d'%int(num)
    trade_type = 'NATIVE'

    key = conf.wx_key

    line = 'appid=%s&body=%s' % (appid, body)
    line = '%s&device_info=%s&fee_type=%s' % (line, device_info, fee_type)
    line = '%s&limit_pay=%s' % (line, limit_pay)
    line = '%s&mch_id=%s&nonce_str=%s' % (line, mch_id, nonce_str)
    line = '%s&notify_url=%s&out_trade_no=%s' % (line, notify_url,out_trade_no)
    line = '%s&product_id=%s&sign_type=%s' % (line, product_id, sign_type)
    line = '%s&spbill_create_ip=%s&total_fee=%s' % (line, spbill_create_ip, total_fee)
    line = '%s&trade_type=%s&key=%s' % (line, trade_type, key)

    print(line)
    m2 = hashlib.md5()
    m2.update(line)
    sign = m2.hexdigest().upper()


    s = '<xml>' + \
            '<appid>%s</appid>' + \
            '<body>%s</body>' + \
            '<device_info>%s</device_info>' + \
            '<fee_type>%s</fee_type>' + \
            '<limit_pay>%s</limit_pay>' + \
            '<mch_id>%s</mch_id>' + \
            '<nonce_str>%s</nonce_str>' + \
            '<notify_url>%s</notify_url>' + \
            '<out_trade_no>%s</out_trade_no>' + \
            '<product_id>%s</product_id>' + \
            '<sign_type>%s</sign_type>' + \
            '<sign>%s</sign>' + \
            '<spbill_create_ip>%s</spbill_create_ip>' + \
            '<total_fee>%s</total_fee>' + \
            '<trade_type>%s</trade_type>' + \
        '</xml>'
    d = s % (appid, body, device_info, fee_type, limit_pay, mch_id,\
             nonce_str, notify_url, out_trade_no, product_id, sign_type,\
             sign, spbill_create_ip, total_fee, trade_type)
    return d
    '''
    print('xml', d)
    url = conf.wx_order_url
    req = urllib2.Request(url=url, headers={'Content-Type': 'text/xml'},\
                          data=d)
    res = urllib2.urlopen(req)
    res = res.read()
    print(res)
    '''


if __name__ == '__main__':
    r = genorder('20180421143901', '101', '125.69.90.3', 1)
    print(r)
