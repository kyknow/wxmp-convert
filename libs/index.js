const fg = require('fast-glob')
const fs = require('fs-plus')
const path = require('path')
function _convertFile(file,type) {
  _changeFileContent(file,type)
  const {ext} = path.parse(file)
  if(ext === '.wxml') {
    _changeExtName(file,'wxml',`${type}ml`)
  } else if (ext === '.wxss') {
    _changeExtName(file, 'wxss', `${type}ss`)
  }
}
function _changeFileContent(file,type) {
  let str = fs.readFileSync(file).toString()
  str = str.replace(/wx\./g,`${type}.`)
  str = str.replace(/\.wxml/g,`.${type}ml`)
  str = str.replace(/\.wxss/g,`.${type}ss`)
  fs.writeFileSync(file,str)
}
function _changeExtName(file,ext,newExt) {
  console.log('convert file name ', file, file.replace(new RegExp(`${ext}$`), newExt))
  fs.renameSync(file, file.replace(new RegExp(`${ext}$`),newExt))
}
class Convert {
  static async convert(inPath,out,type) {
    const realPath = path.join(process.cwd(), inPath)
    const outPath = path.join(process.cwd(), out)
    fs.copySync(realPath,outPath)
    const globPath = path.join(outPath, '/**/*{.js,.wxml,.wxss}')
    const files = await fg(globPath)
    for(let f of files) {
      _convertFile(f, type)
    }
  }
}
module.exports = Convert