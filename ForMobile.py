# 读取标准版的KF Online助手脚本内容并在处理为for Mobile版后输出到新文件里
import re

oriFilePath = 'KF_Online_Assistant.user.js'
destFilePath = 'KF_Online_Assistant_for_Mobile.user.js'
metaFilePath = 'KF_Online_Assistant_for_Mobile.meta.js'
encoding = 'utf-8'

def main(oriFilePath, destFilePath, encoding):
	# 读取标准版的KF Online助手脚本内容
	content = open(oriFilePath, 'r', encoding = encoding).read()

	# 将内容处理为for Mobile版后输出到新文件里
	content = content.replace('// @name        KF Online助手', '// @name        KF Online助手 for Mobile')
	content = content.replace('// @homepage    https://greasyfork.org/scripts/8615', '// @homepage    https://github.com/miaolapd/KF_Online_Assistant')
	content = content.replace('// @updateURL   https://greasyfork.org/scripts/8615-kf-online%E5%8A%A9%E6%89%8B/code/KF%20Online%E5%8A%A9%E6%89%8B.meta.js', '// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/KF_Online_Assistant_for_Mobile.meta.js')
	content = content.replace('// @downloadURL https://greasyfork.org/scripts/8615-kf-online%E5%8A%A9%E6%89%8B/code/KF%20Online%E5%8A%A9%E6%89%8B.user.js', '// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/KF_Online_Assistant_for_Mobile.user.js')
	content = content.replace('.pd_pop_box { position: fixed;', '.pd_pop_box { position: absolute;')
	content = content.replace('  position: fixed; border: 1px solid #9191FF; display: none; z-index: 1002;', '  position: absolute; border: 1px solid #9191FF; display: none; z-index: 1002;')
	open(destFilePath, 'w', encoding = encoding).write(content)

	# 处理for Mobile版的meta文件
	content = open(destFilePath, 'r', encoding = encoding).read()
	match = re.match('// ==UserScript==.+?// ==/UserScript==', content, re.S)
	if match:
		metaInfo = match.group(0)
		metaInfo = metaInfo.replace('// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/KF_Online_Assistant_for_Mobile.meta.js\n', '')
		metaInfo = metaInfo.replace('// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/KF_Online_Assistant_for_Mobile.user.js\n', '')
		metaInfo += '\n'
		open(metaFilePath, 'w', encoding = encoding).write(metaInfo)
	else:
		print('未找到meta信息！')

	# 输出结果
	print('源文件：' + oriFilePath)
	print('目标文件：' + destFilePath)
	print('meta文件：' + metaFilePath)
	print('【KF Online助手 for Mobile】文件输出成功！')

try:
	main(oriFilePath, destFilePath, encoding)
except Exception as ex:
	print(ex)
finally:
	input()