// vim: foldmethod=syntax

var BasePage = require('../../includes/BasePage.js');
 
function DemoFormPage() {
	
	/** 
	 * "Steal" Parents Constructor
	 * call parent constructor bound to  "this" - the new page object instance
	 */
	//BasePage.call(this);
	
	var self = this;                  // provide access to this for callbacks
	
	var By = this.webdriver.By;
	
	/**
	 * @return {!Promise<void>} A promise that will be resolved when the sleep
	 *                          has finished.
	 */
	this.submit_form = function() {
		return self.driver.findElement(By.css('input[type="submit"]'))
			.then(function(el) {
				return el.click();
			})
			.then(function() {
				return self.driver.sleep(self.config.pause);
			});
	};
	 
	/**
	 * @return {!WebElementPromise} A WebElement that can be used to issue
	 * commands against the located element. If the element is not found, the
	 * element will be invalidated and all scheduled commands aborted.
	 */
	this.get_email_input_field = function() {
		
		return self.driver.findElement(self.webdriver.By.css('[name=email]') );
	};
	 
	/** 
	 * @async
	 * @return {!promise.Thenable<string>} A promise that will be resolved with
	 *                                     the element's visible text.
	 */
	this.get_email_validation_error_message = function() {
		return this.driver.findElement( By.css('[name=email] + span') )
			.getText();
	};
	 
	/** 
	 * Note: uses the driver.findElements() method as it wont error if it can't
	 * find the element ( like findElement() does )
	 *  
	 * @async
	 * @return {!WebElementPromise}  A WebElement that can be used to issue
	 * commands against the located element. If the element is not found, the
	 * element will be invalidated and all scheduled commands aborted.
	 */
	this.try_get_email_input_with_invalid_state = function() {
		return this.driver.findElements(By.css('input[name=email]:invalid'))
		.then((web_elements) => { return web_elements[0]; });
	};
}
DemoFormPage.prototype = new BasePage();

module.exports = DemoFormPage;
