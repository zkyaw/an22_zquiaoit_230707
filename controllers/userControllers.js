const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../auth');

/*
  Check if the email already exists
  Steps:
    1. Use mongoose 'find' method to find duplicate emails
    2. Use the 'then' method to send a response back to the frontend application based on the result
*/

module.exports.checkEmailExists = (reqBody) => {
  // The result is sent back to the frontend via the 'then' method found in the route file
  return User.find({email : reqBody.email})
    .then(result => {
      // The find method returns a record if a match is found
      if(result.length > 8) {
        return true;
        // No duplication email found
        // The user is not yet registered in the database
      }
      else {
        return false;
      }
    });
};

/*
  User Registration
    1. Create a new user object using mongoose model and the information from request body.
    2. Make sure that the password is encrypted
    3. Save the new user to the database
*/

module.exports.registerUser = (reqBody) => {
	// create a variable 'newUser' and instantiates a new "user" object using mongoose model
	// user the information from the request body to provide the necessary information

	let newUser = new User ({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		// 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password 
		password: bcrypt.hashSync(reqBody.password, 10)
	});
	return newUser.save().then((user, error) => {
		// user registration failed
		if(error){
			return false;
			// user registration successful
		} else {
			return true;
		};
	});
};

// Bcrypt package is one of the many packages that we can use to encrypt information but it is not commonly recommended because of how simple the algorithm for creating encrypted password which have been decoded by hackers

/* JSON web tokens (jwt) are a way to securely transmit information between two parties/application, commonly used in web applications and APIs - digital passport that contains important information about a user or a request
	- Three parts
		- Header
			- The header consist of two part
				- JWT
				- Signing algorithm used to create a signaturee
			- Payload
				- Actual information stored. It contains claims or statements about user or request
			- Signature
				- Is a cryptographic hash of the header, payload and secret key
				- Secret key is known only by the server that issues token -- digital fingerprint of the token
*/

/*
	Steps:
	1. Check the database if the user email exists
	2. Compare the password provided in the login from which the password stored in the database
	3. Gerate/return a json web token if the user is successfully logged in and return false if not
*/

module.exports.loginUser = (reqBody) => {
  // findOne method returns the first recorded in the collection that matched the search criteria
  return User.findOne({email: reqBody.email}).then(result => {
    if (result == null) {
      return false;
    }
    else {
      const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);
      // compareSync method is used to compare a non encypted password from the login form to the encrypted password retrieved from the database and returns 'true/false' value depending on the result
      if (isPasswordCorrect) {
        // If the password match/result --> generate access token
        return {access: auth.createAccessToken(result)}
      }
      else {
        return false;
      };
    };
  });
};

/*
	- find the document in the database using the user's id
	- reassign the password of the returned document to an empty string
	- return the result back 
*/

module.exports.getProfile = (data) => {
	return User.findById(data.userId).then(result => {
		result.password = "";

		return result;
	});
};