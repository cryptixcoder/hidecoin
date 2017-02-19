'use strict'

const fs = require('fs')
const _ = require('lodash')

const storage = require('./Storage')

const base = __dirname + '/../'
const path = base + 'data/debugger.log'
const tab = '  '

class Debugger {

  constructor() {
    fs.closeSync(fs.openSync(path, 'w'))
  }
  
  log(data) {
    let dataToWrite = ''
    let level = 0
    
    const toStr = (d) => {
      level++
      if (typeof d === 'object') {
        if (d instanceof Buffer) {
          dataToWrite += '(buffer)' + d.toString('hex') + '\n'
        } else {
          const isArray = d instanceof Array
          dataToWrite += (isArray ? '[\n' : '{\n')
          for (let i in d) {
            const isArray = d instanceof Array
            dataToWrite += _.repeat(tab, level) + '"' + i + '": '
            toStr(d[i])
          }
          dataToWrite += _.repeat(tab, level - 1) + (isArray ? ']' : '}') + '\n'
        }
      } else {
        dataToWrite += '(' + typeof d + ')' + d + '\n'
      }
      level--
    }
    
    toStr(data)
    fs.appendFileSync(path, dataToWrite)
  }
}

storage.session.dbg = new Debugger()