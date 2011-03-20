sys = require 'sys'
{spawn} = require 'child_process'

task 'compileTests', 'compiles coffee-script test files to js', ->
  watcher = spawn 'coffee', ['--compile', '--lint', 'test/']
  watcher.stdout.on 'data', (data) ->
    sys.print data.toString()
  watcher.stderr.on 'data', (data) ->
    sys.print data.toString()
