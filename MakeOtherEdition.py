# 生成不同版本的KF Online助手脚本
import re

defaultFileName = 'KF_Online_Assistant' # 标准版文件名
scriptStorageFileName = defaultFileName + '_Script_Storage' # ScriptStorage版文件名
GlobalStorageFileName = defaultFileName + '_Global_Storage' # GlobalStorage版文件名
forMobileFileName = defaultFileName + '_for_Mobile' # 移动版文件名
userScriptExt = '.user.js' # 油猴脚本文件扩展名
metaScriptExt = '.meta.js' # 油猴脚本meta文件扩展名
encoding = 'utf-8' # 文件编码

def getDefaultFileContent():
    '''获取标准版的KF Online助手脚本文件内容

    Returns:
        脚本文件内容
    '''
    return open(defaultFileName + userScriptExt, 'r', encoding = encoding).read()

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
    content = re.sub(r'(// @homepage\s+).+', r'\g<1>https://github.com/miaolapd/KF_Online_Assistant', content, flags=re.I)
    content = re.sub(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant_Script_Storage.meta.js', content, flags=re.I)
    content = re.sub(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant_Script_Storage.user.js', content, flags=re.I)
    content = re.sub(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, flags=re.S | re.I)
    content = content.replace("var storageType = 'Default';", "var storageType = 'Script';")
    open(scriptStorageFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成ScriptStorage版脚本文件')
    open(scriptStorageFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成ScriptStorage版meta文件')

def makeGlobalStorageEdition(content):
    '''生成ScriptStorage版文件

    Args:
        content: 脚本文件内容
    '''
    content = re.sub(r'(// @homepage\s+).+', r'\g<1>https://github.com/miaolapd/KF_Online_Assistant', content, flags=re.I)
    content = re.sub(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant_Global_Storage.meta.js', content, flags=re.I)
    content = re.sub(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant_Global_Storage.user.js', content, flags=re.I)
    content = re.sub(r'(// @grant\s+)none\n', r'\g<1>GM_getValue\n\g<1>GM_setValue\n\g<1>GM_deleteValue\n', content, flags=re.S | re.I)
    content = content.replace("var storageType = 'Default';", "var storageType = 'Global';")
    open(GlobalStorageFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成GlobalStorage版脚本文件')
    open(GlobalStorageFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成GlobalStorage版meta文件')

def makeForMobileEdition(content):
    '''生成移动版文件

    Args:
        content: 脚本文件内容
    '''
    content = re.sub(r'(// @name\s+KF Online助手)', r'\g<1> for Mobile', content, flags=re.I)
    content = re.sub(r'(// @homepage\s+).+', r'\g<1>https://github.com/miaolapd/KF_Online_Assistant', content, flags=re.I)
    content = re.sub(r'(// @updateURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant_for_Mobile.meta.js', content, flags=re.I)
    content = re.sub(r'(// @downloadURL\s+).+', r'\g<1>https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant_for_Mobile.user.js', content, flags=re.I)
    content = content.replace('.pd_pop_box { position: fixed;', '.pd_pop_box { position: absolute;')
    content = re.sub(r"('\.pd_cfg_box\s*\{'\s*\+\n\s*'\s*position:\s*)fixed;", r"\g<1>absolute;", content, flags=re.I)
    open(forMobileFileName + userScriptExt, 'w', encoding = encoding).write(content)
    print('生成移动版脚本文件')
    open(forMobileFileName + metaScriptExt, 'w', encoding = encoding).write(getMetaFileContent(content))
    print('生成移动版meta文件')

def main():
    '''主函数'''
    print('标准版脚本文件：' + defaultFileName + userScriptExt)
    print('ScriptStorage版脚本文件：' + scriptStorageFileName + userScriptExt)
    print('ScriptStorage版meta文件：' + scriptStorageFileName + metaScriptExt)
    print('GlobalStorage版脚本文件：' + GlobalStorageFileName + userScriptExt)
    print('GlobalStorage版meta文件：' + GlobalStorageFileName + metaScriptExt)
    print('移动版脚本文件：' + forMobileFileName + userScriptExt)
    print('移动版meta文件：' + forMobileFileName + metaScriptExt)
    print('-------------------------------------------')

    content = getDefaultFileContent()
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