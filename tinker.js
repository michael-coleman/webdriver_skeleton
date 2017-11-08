 
/**
 * @fileoverview This file is simply to provide bootstrap code for running a
 * command line webdriver instance in the "tinker" style.
 *
 * Usage:
 * 
 * This code will need to be minified with something like 
 * 
 *     npm install --no-save minifier
 *  
 * and
 *  
 *    % ./node_modules/.bin/minify  tinker.js
 *
 * then 
 *
 * * copy the contents of the newly minified file: tinker.min.js
 * * launch node REPL
 * * paste at REPL prompt
 */
var webdriver = require("selenium-webdriver");
 
var driver;
function scroll_to_bottom() {
	 
	 
	var doc_height = Math.max( 
			document.body.offsetHeight,
			document.documentElement.offsetHeight 
		);
	 
	var dist_bottom_viewport_to_bottom_doc = doc_height - window.innerHeight;
	
	var wd_callback = arguments[arguments.length - 1];
	
	var scrolls_done = 0;
	 
	(function scroll_and_increment() {
		
		window.scrollBy(0,1);
		scrolls_done = scrolls_done + 1;
		 
		if (scrolls_done < dist_bottom_viewport_to_bottom_doc) {
			// in 4 milliseconds time - call itself again
			setTimeout(scroll_and_increment, 4);
		} else {
			console.log( "scrolls_done is: " + scrolls_done );
			
			wd_callback("done scrolling, whats next? ");
		}
		 
	})();
	 
}
 
 
new webdriver.Builder().forBrowser("chrome").build()
	.then(function(d) { 
		driver = d;
	})
	.then(function() { 
		return driver.manage().window().setSize(683, 750); 
		
	})
	.then(function() {
		
		return driver.manage().timeouts().setScriptTimeout(300000);
	});


