// vim: foldmethod=syntax
 
/** Notes about using .then(done, done);
 * ------------------------------------
 *
 * If you write an assertion in the below style and the assertion succeeds, 
 * you can run the code all day long and not have any problems
 *  
 *  .then(function(message) {
 *  	expect(message).to.equal('please complete this');
 *  	done();
 *  });
 *  
 * But ifthe assertion fails, the entire test will not necessarily error
 * out, but for all practical purposes, it will break, you won't get any of
 * chai's assertion error debug message and node will log with something like:
 *
 *    (node:9661) UnhandledPromiseRejectionWarning:
 *                     Unhandled promise rejection (rejection id: 1):
 *    ...
 *  
 * Background
 * It seems mocha wraps the tests in a try/catch, for catching your
 * errors (assuming they are assertion error/failures).
 * So when the assertion errors out the "try" block swallows the error
 * and mocha carries on - business as usual, but because the `done()`
 * is never reached mocha still considers your test to be running,
 * mocha won't progress and eventually mocha's test-case --timeout is
 * reached  with no error messages/explanations.
 * 
 * Short Explanation of the Fix
 * This:
 *
 *    .then(done, done)
 *
 * Registers the done callback that mocha passes into the outer "it" function
 * onto the promise thats gestating the outcome of the assertion handler in
 * both the position of the success and error handlers.
 * Thereby making sure that if the then-promise/assertion handler rejects,
 * mocha's `then` callback gets called.
 *
 * Long Explanation of the Fix
 * The then() method which registers the handler containing the assertion will
 * return a - kind of - ad hoc promise where, the handler returning resolves
 * that promise.
 * if a success handler was registered against the then-promise, the that new
 * handler would be called and it would receive the value returned by the
 * previous handler.
 * 
 * If, however the previous handler errored, then the done() is never reached
 * and without a subsequent error handler registered, the error (assertion
 * failure), essentially goes unhandled.
 *
 * by chaining another .then() on the adhoc promise of the assertion's
 * then(), the callbacks passed will be called in both the cases of
 * the assertion succeeding, or erroring, (i.e. resolution or
 * rejection)
 * 
 *  
 * for more info see:
 * https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35
 * https://stackoverflow.com/a/39718611/4668401
 * http://jamesknelson.com/are-es6-promises-swallowing-your-errors/
 */

var assert = require('assert');
 
//var chai = require('chai'); 
var expect = require('chai').expect; 
// var chai_as_promised = require('chai-as-promised'); 
// var should = chai.should();
// chai.use(chai_as_promised);
 
 
var DemoFormPage = require('./DemoForm.po.js');
var demo_form = new DemoFormPage();

describe('[Helix Demo Form Page]  ' + demo_form.config.host +
			                 'helix/public/demos/demo_form.php', function() {
	 
    before(function(done) {
         
        // create new driver instance, which will be available on the new
        // page object as this.driver
        demo_form.new_driver()
        .then(function() {
            return demo_form.driver.manage().window().setSize(1200, 500);
        })
        .then(function() {
            return demo_form.driver.manage().window().setPosition(0, 0);
        })
        .then(function() {
            if ( process.env.hasOwnProperty("HUMAN") ) {

                // pause for long enough to read the suite title
                setTimeout(function() {
                    done();
                },6000);
            } else {
                done();
            }

        });
    }); 
	 
	after(function(done) {
		
		demo_form.driver.quit();
		done();
	});
	 
    beforeEach(function(done) {

        /**
         * if the test runner is called like this:
         *
         *    HUMAN=true ./webdriver_runner
         *
         * this block will print the test and pause before each test
         */
        if ( process.env.hasOwnProperty("HUMAN") ) {

            console.log('\n    ' + this.currentTest.title);

            // pause for long enough to read the test title
            setTimeout(function() {
                done();
            },6000);
        } else {
            done();
        }
	 
    });

	afterEach(function(done) {
		// re-request the page so each test has the plain page  and not any
		// residual state from the previous tests
		demo_form.driver.get(demo_form.config.host +
			                             'helix/public/demos/demo_form.php')
		.then(function() {
			done();
		});
	});
	
	it('Test the page simply loads when requested', 
		                                                    function(done) {
		
		demo_form.get(demo_form.config.host +
			                              'helix/public/demos/demo_form.php')
			.then(() =>  demo_form.get_h1_text() )
			.then((h1_text) => {
				 
				/** check page content by simply checking that the page content
				 * contains the correct title - yes its a bit of an
				 * oversimplification. However the remaining tests which all
				 * occur on this page with only serve as additional
				 * confirmations that the page exists.
				 */
				expect(h1_text).to.equal('Demo form'); 
			})
			.then(done, done);
	});
	 
	it('prompts user "please complete this" if they submit with blank email field', 
		                                                   function(done) {
		demo_form.submit_form()
			.then(() => demo_form.get_email_validation_error_message() )
			.then((message) => {
				expect(message).to.equal('please complete this');
			})
			.then(done, done);
	});
	 
	it('Throws HTML5 validation error if user tries to submit with a bad email address', 
		                                                     function(done) {
		
		// assumes the browser is still on this demo form page
		demo_form.get_email_input_field()
			.then(email_input => email_input.sendKeys('bigrudy73@') )
			.then(() => demo_form.submit_form() )
			.then(() => demo_form.try_get_email_input_with_invalid_state())
			.then((invalid_email_input) => {
				expect(invalid_email_input, 'topic [invalid_email_input]')
					                                               .to.exist;
			})
			.then(done, done);
	});
	
});
