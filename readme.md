
Webdriver Skeleton
==================

This project has been designed to be used as generic boilerplate setup which 
should work for any/most websites/webapps.

Usage
-----

It is expected the way this would be used is to git clone the files contained
in this project into:

    <main_project_root_dir>/tests/webdriver/(all_this_projects_files)

Then at that point:

* delete the `.git` directory that was included with this project, i.e.  
    * `cd main_project_root_dir`
    * `rm -rf /tests/webdriver/.git`
* rewrite/overwrite these boilerplate placeholder files to suit your project. 
* Commit the files into the main projects version control.


Installation / setup - TO BE PERFORMED AT THE PARENT PROJECT LEVEL
--------------------

IMPORTANT:
Whilst this repo has a functioning webdriver installed in development repos of
this webdriver_skeleton project, its `package.json` and `node_modules`
directory can't be wired up to the "consumer" projects node/npm system 
package.json etc).

Therefore the job of installing will have to be performed everytime a project
uses this skeleton.

This project requires a working install of nodejs, NPM and the following:

### Install webdriverjs itself and browser drivers

    npm install selenium-webdriver --save-dev
 
browser drivers, e.g.

* chromedriver
* geckodriver 

**how do these get installed - through NPM or direct download?**

### Dependencies that this boilerplate code uses

* `mocha`
* `chai`
* `chai-as-promised`  (not currently - but possibly in the future)

run:

    npm install mocha chai chai-as-promised --save-dev


### create folder `tests` in root of your project dir (if it doesnt exist)  
i.e.

    mkdir -p tests
    cd tests
    git clone ssh://git@github.com/michaelcoleman/webdriver_skeleton.git webdriver
                                                                         ^^^^^^^^^
                                                                     You will need
                                                                     to supply this
                                                                     to git

### optional: add the `npm run webdriver` command

file: *package.json*

    "scripts": {
          "ctags" : ...
      "webdriver" : "tests/webdriver/webdriver_runner",
            "e2e" : "mocha --recursive  tests/webdriverjs -t 20000",
             "wd" : "./node_modules/.bin/mocha  **/*.spec.js -t 20000"
    },


### Modify test code as necessary to suit your project



### Run it!

Recommended:

    ./path/to/script/webdriver_runner

as this will set the env vars and print a message explaining which browser
is being tested.  
Or, if you have added a `scripts` alias:


    npm run webdriver



