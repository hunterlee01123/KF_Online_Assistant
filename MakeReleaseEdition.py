# 生成各个Release版本的KF Online助手脚本文件
import os
import re
import time
from jsmin import jsmin

devDirName = 'dev' # 开发版文件夹名
devKFOLFileName = 'KFOL' # 开发版KFOL主文件名
devPartFileNameList = ['Config', 'Const', 'ConfigMethod', 'Tools', 'Func', 'Dialog', 'ConfigDialog', 'Log', 'TmpLog', 'Item', 'Card', 'Bank', 'Loot'] # 开发版各部分文件名
extraDevFileName = 'Extra' # Extra开发版主文件名
extraDevPartFileNameList = ['CustomItem'] # Extra开发版各部分文件名
releaseDirName = 'release' # 正式版文件夹名
defaultFileName = 'KFOLAssistant' # 标准版文件名
greasyForkFileName = 'GreasyFork' # GreasyFork版文件名
scriptStorageFileName = 'ScriptStorage' # ScriptStorage版文件名
globalStorageFileName = 'GlobalStorage' # GlobalStorage版文件名
extraFileName = 'Extra' # Extra脚本文件名
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

def getDefaultEditionContent():
    '''获取标准版文件内容

    Returns:
        标准版文件内容
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
                     '// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/KFOLAssistant.meta.js\n'
                     '// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/KFOLAssistant.user.js',
                     content,
                     count=1,
                     flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('标准版', 1)
    content, num  = re.subn(r'// @pd-require-start.+?// @pd-require-end\n', '', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('标准版', 2)
    return content

def makeDefaultEdition(content):
    '''生成标准版文件

    Args:
        content: 脚本文件内容
    '''
    open(releaseDirName + os.sep + defaultFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成标准版脚本文件')
    metaContent = getMetaFileContent(content)
    open(releaseDirName + os.sep + defaultFileName + minUserScriptExt, 'w', encoding = encoding).write(metaContent + jsmin(content))
    print('生成压缩过的标准版脚本文件')
    open(releaseDirName + os.sep + defaultFileName + metaScriptExt, 'w', encoding = encoding).write(metaContent)
    print('生成标准版meta文件')

def makeGreasyForkEdition(content):
    '''生成GreasyFork版文件

    Args:
        content: 脚本文件内容
    '''
    content, num = re.subn(r'(// @updateURL\s+).+', r'\g<1>https://greasyfork.org/scripts/8615-kf-online%E5%8A%A9%E6%89%8B/code/KF%20Online%E5%8A%A9%E6%89%8B.meta.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('GreasyFork版', 1)
    content, num = re.subn(r'(// @downloadURL\s+).+', r'\g<1>https://greasyfork.org/scripts/8615-kf-online%E5%8A%A9%E6%89%8B/code/KF%20Online%E5%8A%A9%E6%89%8B.user.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('GreasyFork版', 2)
    open(releaseDirName + os.sep + greasyForkFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成GreasyFork版脚本文件')

def makeScriptStorageEdition(content):
    '''生成ScriptStorage版文件

    Args:
        content: 脚本文件内容
    '''
    content, num = re.subn(r'(// @updateURL\s+).+', r'\g<1>https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/ScriptStorage.meta.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 1)
    content, num = re.subn(r'(// @downloadURL\s+).+', r'\g<1>https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/ScriptStorage.user.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 2)
    content, num = re.subn(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 3)
    content, num = re.subn(r'(// @include-jquery\s+true\n)', r'\g<1>// @use-greasemonkey true\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 4)
    content, num = re.subn("var storageType = 'Default';", "var storageType = 'Script';", content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 5)
    open(releaseDirName + os.sep + scriptStorageFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成ScriptStorage版脚本文件')
    open(releaseDirName + os.sep + scriptStorageFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成ScriptStorage版meta文件')

def makeGlobalStorageEdition(content):
    '''生成GlobalStorage版文件

    Args:
        content: 脚本文件内容
    '''
    content, num = re.subn(r'(// @updateURL\s+).+', r'\g<1>https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/GlobalStorage.meta.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 1)
    content, num = re.subn(r'(// @downloadURL\s+).+', r'\g<1>https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/GlobalStorage.user.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 2)
    content, num = re.subn(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 3)
    content, num = re.subn(r'(// @include-jquery\s+true\n)', r'\g<1>// @use-greasemonkey true\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 4)
    content, num = re.subn("var storageType = 'Default';", "var storageType = 'Global';", content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 5)
    open(releaseDirName + os.sep + globalStorageFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成GlobalStorage版脚本文件')
    open(releaseDirName + os.sep + globalStorageFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成GlobalStorage版meta文件')

def getExtraContent():
    '''获取Extra脚本文件内容

    Returns:
        Extra脚本文件内容
    '''
    partContent = ''
    for fileName in extraDevPartFileNameList:
        partContent += open(devDirName + os.sep + fileName + '.js', 'r', encoding = encoding).read() + '\n\n'
    content = open(devDirName + os.sep + extraDevFileName + userScriptExt, 'r', encoding = encoding).read()
    match = re.search('/\*\s*\{PartFileContent\}\s*\*/', content, flags=re.S | re.I)
    if match:
        content = content.replace(match.group(0), partContent)
    else:
        raise Exception('未找到{PartFileContent}占位符')
    content, num  = re.subn(r'// @pd-update-url-placeholder',
                     '// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/Extra.meta.js\n'
                     '// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/Extra.user.js',
                     content,
                     count=1,
                     flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('Extra脚本', 1)
    content, num  = re.subn(r'// @pd-require-start.+?// @pd-require-end\n', '', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('Extra脚本', 2)
    return content

def makeExtraFile(content):
    '''生成Extra脚本文件

    Args:
        content: 脚本文件内容
    '''
    open(releaseDirName + os.sep + extraFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成Extra脚本文件')
    metaContent = getMetaFileContent(content)
    open(releaseDirName + os.sep + extraFileName + minUserScriptExt, 'w', encoding = encoding).write(metaContent + jsmin(content))
    print('生成压缩过的Extra脚本文件')
    open(releaseDirName + os.sep + extraFileName + metaScriptExt, 'w', encoding = encoding).write(metaContent)
    print('生成Extra脚本meta文件')

def main():
    '''主函数'''
    print('开发版文件夹：' + devDirName)
    print('开发版KFOL主文件名：' + devKFOLFileName + userScriptExt)
    print('开发版各部分文件名：' + str(devPartFileNameList))
    print()
    print('Extra开发版主文件名：' + extraDevFileName + userScriptExt)
    print('Extra开发版各部分文件名：' + str(extraDevPartFileNameList))
    print('-------------------------------------------')
    print('正式版文件夹：' + releaseDirName)
    print('标准版脚本文件：' + defaultFileName + userScriptExt)
    print('压缩过的标准版脚本文件：' + defaultFileName + minUserScriptExt)
    print('标准版meta文件：' + defaultFileName + metaScriptExt)
    print('GreasyFork版脚本文件：' + greasyForkFileName + userScriptExt)
    print('ScriptStorage版脚本文件：' + scriptStorageFileName + userScriptExt)
    print('ScriptStorage版meta文件：' + scriptStorageFileName + metaScriptExt)
    print('GlobalStorage版脚本文件：' + globalStorageFileName + userScriptExt)
    print('GlobalStorage版meta文件：' + globalStorageFileName + metaScriptExt)
    print()
    print('Extra脚本文件：' + extraFileName + userScriptExt)
    print('压缩过的Extra脚本文件：' + extraFileName + minUserScriptExt)
    print('Extra脚本meta文件：' + extraFileName + metaScriptExt)
    print('-------------------------------------------')

    content = getDefaultEditionContent()
    makeDefaultEdition(content)
    print()
    makeGreasyForkEdition(content)
    print()
    makeScriptStorageEdition(content)
    print()
    makeGlobalStorageEdition(content)

    print()
    extraContent = getExtraContent()
    makeExtraFile(extraContent)

    print('\n已生成所有文件')

if __name__ == '__main__':
    try:
        main()
    except Exception as ex:
        print(ex)
    finally:
        input()
