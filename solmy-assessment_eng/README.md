## You have 3 tasks to fulfill:

1. Complete sign up and sign in, properly encrypting password using bcrypt library. and check the current implementation of incremental id per user.
2. Wrap the signup, using transactions to ensure no race condition occurs during signup process.
3. Wrap the signup, using lock or semaphore to ensure no race condition occurs during signup process.

* Restrictions: You should use mongodb driver for your code. Use of mongoose or any other ERD is not allowed.
* You may need to install npm packages if needed to.
* You may convert this project into typescript if you think that is better to you.


* Note: This code is meant to connect to the device's localhost mongoDB instance. You many change this setup in mongodb/mongo.js
