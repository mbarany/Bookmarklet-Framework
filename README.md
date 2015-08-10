# Bookmarklet-Framework
JS and node framework to easily build custom bookmarklets with dependencies of your choosing

## Installation
1. Clone this repo `git clone https://github.com/mbarany/Bookmarklet-Framework.git` on to your web server
2. Run `./update` to install/update project and dependencies
3. Run `./build` to build all your bookmarklets

## Updates
1. Make sure to keep your `git status` clean
2. Pull in updates from github `git pull`
3. Run `./update` to update project and dependencies
4. Run `./build` to build all your bookmarklets

## Building
1. Run `./build` to build all your bookmarklets
We're using LESS to easily namespace our CSS so that our injected CSS is self contained. If your project contains a `gulpfile.js` it will run the `default` task in there.

## Getting Started
Each bookmarklet has its own dedicated directory inside `bookmarklets`. Copy the sample one to get an idea of the structure and how it works. For consistency keep your main JS file called `main.js`. Your LESS will be concatenated and minified into a main.css file.

## Hosting
* Note: Your bookmarklet may fail to load on https enabled websites if you are not hosting your bookmarklet code on a https server.
* Make sure to allow CORS

## Bookmark Code
This is the code to put in your browser's bookmark to bootstrap the framework and load your bookmarklet. Simply replace the `url` and `projectUrl` with your hosted urls. Consider hosting your bookmarklet code on an https enabled server.


```
javascript:(function () {
    var r = Math.random();
    var url = 'http://localhost:8080/bookmarklet.js?_=' + r;
    var projectUrl = 'http://localhost:8080/bookmarklets/sample/main.js?_=' + r;
    var nameSpace = 'com.michaelbarany.bookmarklet';
    var id = nameSpace + '.id';
    var script = document.getElementById(id);
    var s;

    if (script) {
        if (window[nameSpace] && window[nameSpace].die) {
            window[nameSpace].die();
        }
        script.parentElement.removeChild(script);
    }

    s = document.createElement('script');
    s.id = id;
    s.type = 'text/javascript';
    s.src = url;
    s.onload = function () {
        window[nameSpace].run(projectUrl);
    };
    document.body.appendChild(s);
})();
```

## Testing Tips
When coding your bookmarklet, it may help to host it locally. NPM has a small http webserver that will server the current directory to localhost. Install it via `npm install http-server -g` and then run it via `http-server --cors` from the the git root.


License
=======

    Copyright 2015 Michael Barany

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
