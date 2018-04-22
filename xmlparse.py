#-*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import xml.sax

class WxOrderXmlHandler(xml.sax.ContentHandler):
    def __init__(self):
        self.res = {}
        self.CurrentData = ''
        self.return_code = ''
        self.return_msg  = ''
        self.appid       = ''
        self.mch_id      = ''
        self.device_info = ''
        self.nonce_str   = ''
        self.sign        = ''
        self.result_code = ''
        self.prepay_id   = ''
        self.trade_type  = ''
        self.code_url    = ''
    def startElement(self, tag, attributes):
        self.CurrentData = tag
    def endElement(self, tag):
        self.CurrentData = ''
    def _trip(self, s):
        i = s.find('[', 0)
        i = s.find('[', i)
        return s[i+1, -2]
    def characters(self, content):
        a = ['return_code','return_msg','appid','mch_id','device_info',\
             'nonce_str', 'sign','result_code','prepay_id','trade_type',\
             'code_url']
        for e in a:
            if self.CurrentData == e:
                self.res[e] = content
                break
    def dis(self):
        for e in self.res:
            print('%s=%s' % (e, self.res[e]))

#提交订单 微信返回的xml结果 返回字典
def order_response_xml_parse(xml_str):
    h  = WxOrderXmlHandler()
    xml.sax.parseString(xml_str, h)
    return h.res

if __name__ == '__main__':
    line = '<xml><return_code><![CDATA[SUCCESS]]></return_code>\n<return_msg><![CDATA[OK]]></return_msg>\n<appid><![CDATA[wx0267b1a42b591564]]></appid>\n<mch_id><![CDATA[1501837141]]></mch_id>\n<device_info><![CDATA[WEB]]></device_info>\n<nonce_str><![CDATA[pEFGEgSI0JZAr7qu]]></nonce_str>\n<sign><![CDATA[F465D8F20B4A33C83A1A7FD229AC30A6]]></sign>\n<result_code><![CDATA[SUCCESS]]></result_code>\n<prepay_id><![CDATA[wx2118520917735310eedf00732672440847]]></prepay_id>\n<trade_type><![CDATA[NATIVE]]></trade_type>\n<code_url><![CDATA[weixin://wxpay/bizpayurl?pr=woOaN3P]]></code_url>\n</xml>'
    r = order_response_xml_parse(line)
    print(r)
