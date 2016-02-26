#-------------------------------------------------------------------------------
# Copyright 2016 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the “License”);
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an “AS IS” BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#-------------------------------------------------------------------------------

require "cakex"

preReqFile = "../ragents-test/tmp/pre-reqs-updated.txt"

#-------------------------------------------------------------------------------
task "watch", "source file changes -> build, serve", -> taskWatch()
task "serve", "start server",                        -> taskServe()

WatchSpec = "lib/**/* www/**/*"

#-------------------------------------------------------------------------------
mkdir "-p", "tmp"

#-------------------------------------------------------------------------------
watchIter = ->
  taskClean()
  taskServe()

#-------------------------------------------------------------------------------
taskWatch = ->
  watchIter()

  watch
    files: WatchSpec.split " "
    run:   watchIter

  watch
    files: "Cakefile"
    run: (file) ->
      return unless file == "Cakefile"
      log "Cakefile changed, exiting"
      exit 0

#-------------------------------------------------------------------------------
taskServe = ->
  log "restarting server at #{new Date()}"

  daemon.start "server", "node", ["app"]

#-------------------------------------------------------------------------------
taskClean = ->
  rm "-rf", "bower_components/"
  rm "-rf", "tmp"

#-------------------------------------------------------------------------------
cleanDir = (dir) ->
  mkdir "-p", dir
  rm "-rf", "#{dir}/*"
