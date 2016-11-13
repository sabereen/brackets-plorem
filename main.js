define(function (require, exports, module) {
  'use strict'

  var file = require('fa.makarem').split('\n')
  function randomAya() {
    var rnd = Math.floor(Math.random() * file.length)
    return file[rnd]
  }
  
  function checkBeforeCursor(editor, text) {
    var cursor = editor.getCursorPos()
    var ghabl = editor.document.getRange({ch: cursor.ch - persianLorem.length, line: cursor.line}, cursor)
    return ghabl === text
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
    var cursor = editor.getCursorPos()
    if (checkBeforeCursor(editor, persianLorem)) {
      editor.document.replaceRange(randomAya(), {ch: cursor.ch - persianLorem.length, line: cursor.line}, cursor)
    }
  }
  
  $(document).keydown((ev) => {
    if (ev.keyCode === 9) insertHint()
  })

  
})