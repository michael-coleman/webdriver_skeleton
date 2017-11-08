// vim: foldmethod=syntax


function BasePage() {
	
	// check invocation 
	if ( ! process.env.hasOwnProperty("SELENIUM_BROWSER") ) {
		
		var message =
`[ERROR] no environment var set:

 usage:

    SELENIUM_BROWSER=<browser> npm run e2e

`;
		
		console.log(message);
		process.exit();
	}
	 
	 
	/**
	 * explanation: the callback in the then() of new_driver function cant
	 * reach its own 'this' so need to use a var that the callback can reach
	 * which does point to this
	 * @type {Object} self
	 */
	var self = this;
	 
	// Config stuff
	this.config =  require('./config.js');
	 
	/** 
	 * webdriver namespace
	 */
	this.webdriver = require('selenium-webdriver');
	this.webdriver.promise.USE_PROMISE_MANAGER = false;
	 
	/**
	 * instantiates a new WebDriver instance
	 *
	 * NOTE: the reason the creation of the WebDriver instance isn't done 
	 * automatically on construction of the BasePage "class" is so that 
	 * driver instances can be setup and torn down
	 * (and it might be tricky to run run and manage an async function on
	 * construction)
	 *  
	 * @async
	 * @return {!promise.Thenable<WebDriver>} A promise that will resolve to 
	 *                                         a  WebDriver instance.
	 */
	this.new_driver = function() {
		return new this.webdriver.Builder().forBrowser('chrome').build()
			 .then(function(d) {
				// establish a property "driver" on any instance objects
				self.driver = d;
			});
	};
	 
	/** 
	 * Navigate to a URL then pause for a period to show to a human which page
	 * is being tested.
	 *
	 * The wait period is configurable in config file.
	 *
	 * @async
	 * @param  {String} url             the url to request
	 * @return {!promise.<undefined>}  A promise that will resolve to ?
	 */
	this.get = function(url) {
		return this.driver.get( url )
			.then(function() {
				return self.driver.sleep(self.config.pause);
			});
	};
	
	/**
	 * scrolls to bottom of page (to be run in client)
	 *
	 * @return {Mixed}
	 */
	this.scroll_to_bottom = function () {
		 
		var doc_height = Math.max( 
				document.body.offsetHeight,
				document.documentElement.offsetHeight 
			);
		 
		/**
		 * WARNING: assumes viewport is at top of document/page.
		 * TODO make this smarter?
		 */
		var dist_bottom_viewport_to_bottom_doc = doc_height - 
			                                               window.innerHeight;
		
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
		 
	};
	
	/** 
	 * Gets a reference to the H1 element of a page
	 * @async
	 * @return {!promise.Thenable<string>} A promise that will be resolved with
	 *                                     the element's visible text.
	 */
	this.get_h1_text = function() {
		return self.driver.findElement(this.webdriver.By.css('h1')).getText();
	};
	 
}

module.exports = BasePage;
