define(function (require, exports, module) {
  'use strict'

  var file = require('fa.makarem').split('\n')

  function randomAya(length) {
    try {
      var rnd = Math.floor(Math.random() * file.length)
      if (!length) {
        return clearText(file[rnd])
      }
  
      let words = []
      do {
        words.push(...file[rnd].split(' '))
        rnd++
      } while (words.length <= length)
  
      words.length = length
  
      return clearText(words.join(' '))

    } catch(error) {
      return randomAya(length)
    }

    function clearText(text) {
      return text
        .replace(/[\(\)]/g, '')
        .replace(/‌/g, ' ')
        .replace(/\]/g, '')
        .replace(/\[=\s?/g, 'یعنی ')
        .replace(/\[/g, '')
    }
  }
  
  function checkBeforeCursor(editor, text) {
    var cursor = editor.getCursorPos()
    var ghabl = editor.document.getRange({ch: cursor.ch - persianLorem.length, line: cursor.line}, cursor)
    return ghabl === text
  }

  function getLastCharsBeforeCursor(editor, length = 10) {
    var cursor = editor.getCursorPos()
    var ghabl = editor.document.getRange({ch: cursor.ch - length, line: cursor.line}, cursor)
    return ghabl
  }

  var persianLorem = 'plorem',
      lastChars = [persianLorem[persianLorem.length-1]]

  var CodeHintManager = brackets.getModule('editor/CodeHintManager'),
      editor
  
  var hintProvider = {
    hasHints,
    getHints,
    insertHint
  }
  
  CodeHintManager.registerHintProvider(hintProvider, ['all'], 0)
  
  function hasHints(editorParam, implicitChar) {
    if (lastChars.indexOf(implicitChar) === -1) return false
    editor = editorParam
    return checkBeforeCursor(editor, persianLorem)
  }

  function getHints(implicitChar) {
    return {
      hints: [persianLorem],
      match: persianLorem,
      selectInitial: true,
      handleWideResults: false
    }
  }
  
  function insertHint(hint) {
    var lastChars = getLastCharsBeforeCursor(editor)
    var regex = new RegExp(`${persianLorem}(\\d*)$`, 'i')
    var matchedLength = 0
    var wordsCount = 0
    
    var matchResult = regex.exec(lastChars)
    if (matchResult) {
      matchedLength = matchResult[0].length
      wordsCount = +matchResult[1]
    }

    var cursor = editor.getCursorPos()
    editor.document.replaceRange(randomAya(wordsCount), {ch: cursor.ch - matchedLength, line: cursor.line}, cursor)
  }
  
})