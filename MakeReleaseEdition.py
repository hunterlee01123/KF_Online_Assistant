# 生成各个Release版本的KF Online助手脚本文件
import os
import re

devDirName = 'dev' # 开发版文件夹名
devKFOLFileName = 'KFOL' # 开发版KFOL主文件名
devPartFileNameList = ['Config', 'ConfigMethod', 'Tools', 'Dialog', 'ConfigDialog', 'Log', 'TmpLog', 'Item', 'Card', 'Bank', 'Loot'] # 开发版各部分文件名
releaseDirName = 'release' # 正式版文件夹名
defaultFileName = 'KFOLAssistant' # 标准版文件名
scriptStorageFileName = 'ScriptStorage' # ScriptStorage版文件名
GlobalStorageFileName = 'GlobalStorage' # GlobalStorage版文件名
forMobileFileName = 'ForMobile' # 移动版文件名
userScriptExt = '.user.js' # 油猴脚本文件扩展名
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

def makeDefaultEdition():
    '''生成标准版文件'''
    partContent = ''
    for fileName in devPartFileNameList:
        partContent += open(devDirName + os.sep + fileName + '.js', 'r', encoding = encoding).read() + '\n\n'
    content = open(devDirName + os.sep + devKFOLFileName + userScriptExt, 'r', encoding = encoding).read()
    match = re.search('/\*\s*\{PartFileContent\}\s*\*/', content, flags=re.S | re.I)
    if match:
        content = content.replace(match.group(0), partContent)
    else:
        raise Exception('未找到{PartFileContent}占位符')
    content, num  = re.subn(r'(// @description.+?)(// @include)',
                     r'\g<1>'
                     '// @updateURL   https://greasyfork.org/scripts/8615-kf-online%E5%8A%A9%E6%89%8B/code/KF%20Online%E5%8A%A9%E6%89%8B.meta.js\n'
                     '// @downloadURL https://greasyfork.org/scripts/8615-kf-online%E5%8A%A9%E6%89%8B/code/KF%20Online%E5%8A%A9%E6%89%8B.user.js\n'
                     r'\g<2>',
                     content,
                     count=1,
                     flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('标准版', 1)
    content, num  = re.subn(r'// @require.+?(// @version)', '\g<1>', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('标准版', 2)
    open(releaseDirName + os.sep + defaultFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成标准版脚本文件')
    open(releaseDirName + os.sep + defaultFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成标准版meta文件')

def makeScriptStorageEdition(content):
    '''生成ScriptStorage版文件

    Args:
        content: 脚本文件内容
    '''
    content, num = re.subn(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/ScriptStorage.meta.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 1)
    content, num = re.subn(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/ScriptStorage.user.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 2)
    content, num = re.subn(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 3)
    content, num = re.subn("var storageType = 'Default';", "var storageType = 'Script';", content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('ScriptStorage版', 4)
    open(releaseDirName + os.sep + scriptStorageFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成ScriptStorage版脚本文件')
    open(releaseDirName + os.sep + scriptStorageFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成ScriptStorage版meta文件')

def makeGlobalStorageEdition(content):
    '''生成GlobalStorage版文件

    Args:
        content: 脚本文件内容
    '''
    content, num = re.subn(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/GlobalStorage.meta.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 1)
    content, num = re.subn(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/GlobalStorage.user.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 2)
    content, num = re.subn(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 3)
    content, num = re.subn("var storageType = 'Default';", "var storageType = 'Global';", content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('GlobalStorage版', 4)
    open(releaseDirName + os.sep + GlobalStorageFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成GlobalStorage版脚本文件')
    open(releaseDirName + os.sep + GlobalStorageFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成GlobalStorage版meta文件')

def makeForMobileEdition(content):
    '''生成移动版文件

    Args:
        content: 脚本文件内容
    '''
    content, num = re.subn(r'(// @name\s+KF Online助手)', r'\g<1> for Mobile', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('移动版', 1)
    content, num = re.subn(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/ForMobile.meta.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('移动版', 2)
    content, num = re.subn(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/ForMobile.user.js', content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('移动版', 3)
    content, num = re.subn(r"\s*\$\(window\)\.on\('resize\.'\s*\+\s*id,\s*function\s*\(\)\s*\{\n\s*Dialog\.show\(id\);\n\s*\}\);", "", content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('移动版', 4)
    content, num = re.subn(r"\s*\$\(window\)\.off\('resize\.'\s*\+\s*id\);", "", content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('移动版', 5)
    content, num = re.subn(r'(\.pd_pop_box\s*\{\s*position:\s*)fixed;', r'\g<1>absolute;', content, count=1, flags=re.S | re.I)
    if num == 0: raise NoFoundReplaceStringError('移动版', 6)
    content, num = re.subn(r"('\.pd_cfg_box\s*\{'\s*\+\n\s*'\s*position:\s*)fixed;", r"\g<1>absolute;", content, count=1, flags=re.I)
    if num == 0: raise NoFoundReplaceStringError('移动版', 7)
    open(releaseDirName + os.sep + forMobileFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成移动版脚本文件')
    open(releaseDirName + os.sep + forMobileFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成移动版meta文件')

def main():
    '''主函数'''
    print('开发版文件夹：' + devDirName)
    print('开发版KFOL主文件名：' + devKFOLFileName + userScriptExt)
    print('开发版各部分文件名：' + str(devPartFileNameList))
    print('-------------------------------------------')
    print('正式版文件夹：' + releaseDirName)
    print('标准版脚本文件：' + defaultFileName + userScriptExt)
    print('ScriptStorage版脚本文件：' + scriptStorageFileName + userScriptExt)
    print('ScriptStorage版meta文件：' + scriptStorageFileName + metaScriptExt)
    print('GlobalStorage版脚本文件：' + GlobalStorageFileName + userScriptExt)
    print('GlobalStorage版meta文件：' + GlobalStorageFileName + metaScriptExt)
    print('移动版脚本文件：' + forMobileFileName + userScriptExt)
    print('移动版meta文件：' + forMobileFileName + metaScriptExt)
    print('-------------------------------------------')

    makeDefaultEdition()
    print()
    content = open(releaseDirName + os.sep + defaultFileName + userScriptExt, 'r', encoding = encoding).read()
    makeScriptStorageEdition(content)
    print()
    makeGlobalStorageEdition(content)
    print()
    makeForMobileEdition(content)

    print('\n已生成所有文件')

if __name__ == '__main__':
    try:
        main()
    except Exception as ex:
        print(ex)
    finally:
        input()
