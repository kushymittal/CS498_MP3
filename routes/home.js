var secrets = require('../config/secrets');
var User = require('../models/User');
var Task = require('../models/Task');

module.exports = function (router) {

    // Dummy URL
    var homeRoute = router.route('/');
    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    // GET all users
    var getAllUsers = router.route('/users');
    getAllUsers.get(function (req, res) {
        User.find({}, function (err, users) {
            if (err) {
                console.log(err);
                return res.status(404).send({
                    message: err.message,
                    data: {},
                });
            }
            else {
                return res.status(200).send({
                    message: "OK",
                    data: users,
                });
            }
        });
    });

    // GET user by id
    var userById = router.route('/users/:id');
    userById.get(function (req, res) {

        var id = (req.params.id);

        User.findById(id, function (err, user) {
            if (err) {
                return res.status(500).send({
                    message: err.message,
                    data: {},
                });
            }
            else if (!user) {
                return res.status(404).send({
                    message: "No user with that id found",
                    data: {},
                });
            }
            else {
                return res.status(200).send({
                    message: "OK",
                    data: user,
                })
            }
        });
    });

    // GET all tasks
    var getAllTasks = router.route('/tasks');
    getAllTasks.get(function (req, res) {
        Task.find({}, function (err, tasks) {
            if (err) {
                console.log(err);
                return res.status(404).send({
                    message: err.message,
                    data: {},
                });
            }
            else {
                return res.status(200).send({
                    message: "OK",
                    data: tasks,
                });
            }
        });
    });

    // GET task by id
    var taskById = router.route('/tasks/:id');
    taskById.get(function (req, res) {

        var id = (req.params.id);

        Task.findById(id, function (err, task) {
            if (err) {
                return res.status(500).send({
                    message: err.message,
                    data: {},
                });
            }
            else if (!task) {
                return res.status(404).send({
                    message: "No task with that id found",
                    data: {},
                });
            }
            else {
                return res.status(200).send({
                    message: "OK",
                    data: task,
                })
            }
        });
    });

    // DELETE specified user
    userById.delete(function (req, res) {

        var id = req.params.id;

        User.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).send({
                    message: err.message,
                    data: {},
                })
            }
            else {
                return res.status(200).send({
                    message: "OK",
                    data: "User Deleted Successfully",
                });
            }
        });
    });

    // DELETE speified task
    taskById.delete(function (req, res) {
        
        var id = req.params.id;

        Task.findByIdAndRemove(id, function (err, task) {
            if (err) {
                return res.status(500).send({
                    message: err.message,
                    data: {},
                })
            }
            else {
                return res.status(200).send({
                    message: "OK",
                    data: "User Deleted Successfully",
                });
            }
        });
    });

    // POST create a new user
    getAllUsers.post(function (req, res) {

        // Validate request here
        if ( (!req.body.hasOwnProperty('name')) || (!req.body.hasOwnProperty('email')) ) {
            return res.status(404).send({
                message: "Cannot create a user without a name or email",
                data: {},
            });
        }
        // email already exists
        if (false) {

        }

        // Get params for user here
        var user_name = req.body['name'];
        var user_email = req.body['email'];
        var user_pendingTasks = req.body['pendingTasks'];
        var curr_date = new Date();

        User.create({
            name: user_name,
            email: user_email,
            pendingTasks: user_pendingTasks,
            dateCreated: curr_date,
        },
        function (err, user) {
            if (err) {
                return res.status(500).send(err.message);
            }
            else {
                return res.status(201).send(user);
            }
        });
    });

    // POST create a new task
    getAllTasks.post(function (req, res) {
        // Validate request here
        if ( (!req.body.hasOwnProperty('name')) || (!req.body.hasOwnProperty('deadline')) ) {
            return res.status(404).send({
                message: "Cannot create a user without a name or deadline",
                data: {},
            });
        }

        // Get params for user here
        var task_name = req.body['name'];
        var task_description = req.body['description'];
        var curr_date = new Date();

        console.log(req.body);

        Task.create({
            name: task_name,
            description: task_description,
            //deadline: Date,
            //completed: Boolean,
            //assignedUser: String,
            //assignedUserName: String,
            dateCreated: curr_date,
        },
        function (err, task) {
            if (err) {
                return res.status(500).send(err.message);
            }
            else {
                return res.status(201).send(task);
            }
        });
    });    

    return router;
}
