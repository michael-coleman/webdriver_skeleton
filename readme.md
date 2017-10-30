
Webdriver Skeleton
==================

This project has been designed to be used as generic boilerplate setup which 
should would for any/most websites/webapps.

Usage
-----

It is expected the way this would be used is to git clone the files contained
in this project into:

    main_project_root_dir/tests/webdriver

Then at that point:

* delete the .git directory that was included with this project, i.e.  
`main_project_root_dir/tests/webdriver/.git`
* rewrite/overwrite these boilerplate placeholder files to suit your project. 
* Commit the files into the main projects version control.

-----------

Installation / setup
--------------------

This project has some dependencies:

* working install of nodejs and NPM
* browser drivers, e.g.
    * chromedriver
    * geckodriver 
    * how do these get installed - through NPM or direct download?
* `webdriverjs`, `mocha`, `chai`, `chai-as-promised`  
    `npm install selenium-webdriver mocha chai chai-as-promised --save-dev`


### create folder `tests` in root of your project dir (if it doesnt exist)  
i.e.

    mkdir -p tests
    cd tests
    git clone ssh://git@github.com/michaelcoleman/webdriver_skeleton.git webdriver
                                                                       ^^^^^^^^^^^
                                                You will need to supply this to git

### optional: add the `npm run webdriver` command

file: package.json

    "scripts": {
          "ctags" : ...
      "webdriver" : "tests/webdriver/webdriver_runner",
            "e2e" : "mocha --recursive  tests/webdriverjs -t 20000",
             "wd" : "./node_modules/.bin/mocha tests/webdriverjs/**/*.spec.js -t 20000"
    },


### Modify test code as necessary to suit your project

### Run it!

    npm run webdriver


