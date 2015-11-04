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

def makeDefaultEdition():
    '''生成标准版文件'''
    partContent = ''
    for fileName in devPartFileNameList:
        partContent += open(devDirName + os.sep + fileName + '.js', 'r', encoding = encoding).read() + '\n\n'
    content = open(devDirName + os.sep + devKFOLFileName + userScriptExt, 'r', encoding = encoding).read()
    content = content.replace('/* {PartFileContent} */', partContent)
    content = re.sub(r'// @require.+?// @version', '// @version', content, flags=re.S | re.I)
    open(releaseDirName + os.sep + defaultFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成标准版脚本文件')
    open(releaseDirName + os.sep + defaultFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成标准版meta文件')

def getMetaFileContent(content):
    '''获取meta文件内容

    Args:
        content: 脚本文件内容

    Returns:
        meta文件内容
    '''
    metaContent = ''
    match = re.match('// ==UserScript==.+?// ==/UserScript==', content, flags=re.S | re.I)
    if match:
        metaContent = match.group(0)
        metaContent = re.sub(r'// @updateURL.+?\n', '', metaContent, flags=re.S | re.I)
        metaContent = re.sub(r'// @downloadURL.+?\n', '', metaContent, flags=re.S | re.I)
        metaContent += '\n'
    else:
        print('未找到meta信息')
    return metaContent

def makeScriptStorageEdition(content):
    '''生成ScriptStorage版文件

    Args:
        content: 脚本文件内容
    '''
    content = re.sub(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/ScriptStorage.meta.js', content, flags=re.I)
    content = re.sub(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/ScriptStorage.user.js', content, flags=re.I)
    content = re.sub(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, flags=re.S | re.I)
    content = content.replace("var storageType = 'Default';", "var storageType = 'Script';")
    open(releaseDirName + os.sep + scriptStorageFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成ScriptStorage版脚本文件')
    open(releaseDirName + os.sep + scriptStorageFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成ScriptStorage版meta文件')

def makeGlobalStorageEdition(content):
    '''生成ScriptStorage版文件

    Args:
        content: 脚本文件内容
    '''
    content = re.sub(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/GlobalStorage.meta.js', content, flags=re.I)
    content = re.sub(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/GlobalStorage.user.js', content, flags=re.I)
    content = re.sub(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, flags=re.S | re.I)
    content = content.replace("var storageType = 'Default';", "var storageType = 'Global';")
    open(releaseDirName + os.sep + GlobalStorageFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成GlobalStorage版脚本文件')
    open(releaseDirName + os.sep + GlobalStorageFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成GlobalStorage版meta文件')

def makeForMobileEdition(content):
    '''生成移动版文件

    Args:
        content: 脚本文件内容
    '''
    content = re.sub(r'(// @name\s+KF Online助手)', r'\g<1> for Mobile', content, flags=re.I)
    content = re.sub(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/ForMobile.meta.js', content, flags=re.I)
    content = re.sub(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/release/ForMobile.user.js', content, flags=re.I)
    content = content.replace('.pd_pop_box { position: fixed;', '.pd_pop_box { position: absolute;')
    content = re.sub(r"('\.pd_cfg_box\s*\{'\s*\+\n\s*'\s*position:\s*)fixed;", r"\g<1>absolute;", content, flags=re.I)
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
