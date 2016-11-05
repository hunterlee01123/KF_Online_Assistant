# 生成各个Release版本的KF Online助手脚本文件
import os
import re
from jsmin import jsmin

devDirName = 'dev' # 开发版文件夹名
devKFOLFileName = 'KFOL' # 开发版KFOL主文件名
devPartFileNameList = ['Config', 'Const', 'ConfigMethod', 'Tools', 'Func', 'Dialog', 'ConfigDialog', 'Log', 'TmpLog', 'Item', 'Card', 'Bank', 'Loot'] # 开发版各部分文件名
releaseDirName = 'dist' # 编译版文件夹名
commonFileName = 'Common' # 通用版文件名
fullFileName = 'Full' # 全功能版文件名
forFirefoxFileName = 'ForFirefox' # ForFirefox版文件名
userScriptExt = '.user.js' # 油猴脚本文件扩展名
minUserScriptExt = '.min.user.js' # 压缩过的油猴脚本文件扩展名
metaScriptExt = '.meta.js' # 油猴脚本meta文件扩展名
encoding = 'utf-8' # 文件编码

class NoFoundReplaceStringError(Exception):
    '''未找到所需替换字符串的错误类'''

    def __init__(self, fileName, replaceNo):
        '''构造方法

        Args:
            fileName: 所需替换的文件名称描述
            replaceNo: 替换的次序
        '''
        self.fileName = fileName
        self.replaceNo = replaceNo

    def __str__(self):
        return '错误：在{0}文件的第{1}次替换中未找到所需替换的字符串'.format(self.fileName, self.replaceNo)

def getMetaFileContent(content):
    '''获取meta文件内容

    Args:
        content: 脚本文件内容

    Returns:
        meta文件内容
    '''
    metaContent = ''
    match = re.search('// ==UserScript==.+?// ==/UserScript==', content, flags=re.S | re.I)
    if match:
        metaContent = match.group(0)
        metaContent, num = re.subn(r'// @updateURL.+?\n', '', metaContent, count=1, flags=re.S | re.I)
        if num == 0: raise NoFoundReplaceStringError('meta', 1)
        metaContent, num = re.subn(r'// @downloadURL.+?\n', '', metaContent, count=1, flags=re.S | re.I)
        if num == 0: raise NoFoundReplaceStringError('meta', 2)
        metaContent += '\n'
    else:
        raise Exception('未找到meta信息')
    return metaContent

def getCommonEditionContent():
    '''获取通用版文件内容

    Returns:
        通用版文件内容
    '''
    partContent = ''
    for fileName in devPartFileNameList:
        partContent += open(devDirName + os.sep + fileName + '.js', 'r', encoding = encoding).read() + '\n\n'
    content = open(devDirName + os.sep + devKFOLFileName + userScriptExt, 'r', encoding = encoding).read()
    match = re.search('/\*\s*\{PartFileContent\}\s*\*/', content, flags=re.S | re.I)
    if match:
        content = content.replace(match.group(0), partContent)
    else:
        raise Exception('未找到{PartFileContent}占位符')
    content, num  = re.subn(r'// @pd-update-url-placeholder',
                     '// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/Common.meta.js\n'
                     '// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/Common.user.js',
                     content,
                     count=1,
                     flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('通用版', 1)
    return content

def makeCommonEdition(content):
    '''生成通用版文件

    Args:
        content: 脚本文件内容
    '''
    open(releaseDirName + os.sep + commonFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成通用版脚本文件')
    metaContent = getMetaFileContent(content)
    open(releaseDirName + os.sep + commonFileName + minUserScriptExt, 'w', encoding = encoding).write(metaContent + jsmin(content))
    print('生成压缩过的通用版脚本文件')
    open(releaseDirName + os.sep + commonFileName + metaScriptExt, 'w', encoding = encoding).write(metaContent)
    print('生成通用版meta文件')

def makeFullEdition(content):
    '''生成全功能版文件

    Args:
        content: 脚本文件内容
    '''
    content, num = re.subn(r'(// @updateURL\s+).+', r'\g<1>https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/Full.meta.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('全功能版', 1)
    content, num = re.subn(r'(// @downloadURL\s+).+', r'\g<1>https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/Full.user.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('全功能版', 2)
    content, num = re.subn(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('全功能版', 3)
    content, num = re.subn(r'(// @include-jquery\s+true\n)', r'\g<1>// @use-greasemonkey true\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('全功能版', 4)
    open(releaseDirName + os.sep + fullFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成全功能版脚本文件')
    open(releaseDirName + os.sep + fullFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成全功能版meta文件')

def makeForFirefoxEdition(content):
    '''生成For Firefox版文件

    Args:
        content: 脚本文件内容
    '''
    content, num = re.subn(r'(// @updateURL\s+).+', r'\g<1>https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/ForFirefox.meta.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('For Firefox版', 1)
    content, num = re.subn(r'(// @downloadURL\s+).+', r'\g<1>https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/ForFirefox.user.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('For Firefox版', 2)
    content, num = re.subn(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('For Firefox版', 3)
    content, num = re.subn(r'(// @include-jquery\s+true\n)', r'// @require     https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/src/lib/jquery.min.js?V2.2.4\n\g<1>// @use-greasemonkey true\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('For Firefox版', 4)
    open(releaseDirName + os.sep + forFirefoxFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成For Firefox版脚本文件')
    open(releaseDirName + os.sep + forFirefoxFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成For Firefox版meta文件')

def main():
    '''主函数'''
    print('开发版文件夹：' + devDirName)
    print('开发版KFOL主文件名：' + devKFOLFileName + userScriptExt)
    print('开发版各部分文件名：' + str(devPartFileNameList))
    print('-------------------------------------------')
    print('正式版文件夹：' + releaseDirName)
    print('通用版脚本文件：' + commonFileName + userScriptExt)
    print('压缩过的通用版脚本文件：' + commonFileName + minUserScriptExt)
    print('通用版meta文件：' + commonFileName + metaScriptExt)
    print('全功能版脚本文件：' + fullFileName + userScriptExt)
    print('全功能版meta文件：' + fullFileName + metaScriptExt)
    print('For Firefox版脚本文件：' + forFirefoxFileName + userScriptExt)
    print('For Firefox版meta文件：' + forFirefoxFileName + metaScriptExt)
    print('-------------------------------------------')

    content = getCommonEditionContent()
    makeCommonEdition(content)
    print()
    makeFullEdition(content)
    print()
    makeForFirefoxEdition(content)

    print('\n已生成所有文件')

if __name__ == '__main__':
    try:
        main()
    except Exception as ex:
        print(ex)
    finally:
        input()
