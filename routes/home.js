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

        my_limit = 100000;
        my_count = false;
        my_skip = 0;

        if ( req.query.hasOwnProperty('limit')) {
            my_limit = parseInt(req.query['limit'], 10);
        }

        if ( req.query.hasOwnProperty('count')) {
            my_count = req.query['count'];
        }

        if ( req.query.hasOwnProperty('skip')) {
            my_skip = parseInt(req.query['skip'], 10);
        }
        
        my_sort = {};
        my_select = {};
        my_where = {};

        if ( req.query.hasOwnProperty('sort')) {
            my_sort = JSON.parse(req.query['sort']);
        }

        if ( req.query.hasOwnProperty('select')) {
            my_select = JSON.parse(req.query['select']);
        }

        if ( req.query.hasOwnProperty('where')) {
            my_where = JSON.parse(req.query['where']);
        }      
        if (my_count === 'true') {
            User.count({}, function (err, count) {
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
                        data: {
                            'count': count
                        }
                    });
                }
            })
            .where(my_where)
            .limit(my_limit)
            .skip(my_skip);
        }
        else {
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
            })
            .where(my_where)
            .limit(my_limit)
            .sort(my_sort)
            .select(my_select)
            .skip(my_skip);
        }

        
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

        my_limit = 100;
        my_count = false;
        my_skip = 0;

        if ( req.query.hasOwnProperty('limit')) {
            my_limit = parseInt(req.query['limit'], 10);
        }

        if ( req.query.hasOwnProperty('count')) {
            my_count = req.query['count'];
        }

        if ( req.query.hasOwnProperty('skip')) {
            my_skip = parseInt(req.query['skip'], 10);
        }
        
        my_sort = {};
        my_select = {};
        my_where = {};
        if ( req.query.hasOwnProperty('sort')) {
            my_sort = JSON.parse(req.query['sort']);
        }

        if ( req.query.hasOwnProperty('select')) {
            my_select = JSON.parse(req.query['select']);
        }

        if ( req.query.hasOwnProperty('where')) {
            my_where = JSON.parse(req.query['where']);
        }

        if (my_count === 'true') {
            Task.count({}, function (err, count) {
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
                        data: {
                            'count': count
                        },
                    });
                }
            })
            .where(my_where)
            .limit(my_limit)
            .skip(my_skip);
        }
        else {
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
            })
            .where(my_where)
            .limit(my_limit)
            .sort(my_sort)
            .select(my_select)
            .skip(my_skip);
        }
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
                    data: "Task Deleted Successfully",
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

        // Get params for user here
        var user_name = req.body['name'];
        var user_email = req.body['email'];
        var user_pendingTasks = req.body['pendingTasks'] || [];
        var curr_date = new Date();

        // email already exists
        User.findOne({
            'email': user_email
        },
        function (err, user) {
            if (user) {
                return res.status(201).send({
                    message: "User with email already exists",
                    data: {}
                });
            }
            else {
                User.create({
                    name: user_name,
                    email: user_email,
                    pendingTasks: user_pendingTasks,
                    dateCreated: curr_date,
                },
                function (err, user) {
                    if (err) {
                        return res.status(500).send({
                            message: err.message,
                            data: {}
                        });
                    }
                    else {
                        return res.status(201).send({
                            message: "OK",
                            data: user
                        });
                    }
                });
            }
        });
    });

    // POST create a new task
    getAllTasks.post(function (req, res) {
        // Validate request here
        if ( (!req.body.hasOwnProperty('name')) || (!req.body.hasOwnProperty('deadline')) ) {
            return res.status(404).send({
                message: "Cannot create a task without a name or deadline",
                data: {},
            });
        }

        // Get params for user here
        var task_name = req.body['name'];
        var task_description = req.body['description'] || "";
        var task_deadline = req.body['deadline'];
        var task_completed = req.body['completed'] || false;
        var task_assignedUser = req.body['assignedUser'] || "";
        var task_assignedUserName = req.body['assignedUserName'] || "";
        var curr_date = new Date();

        Task.create({
            name: task_name,
            description: task_description,
            deadline: task_deadline,
            completed: task_completed,
            assignedUser: task_assignedUser,
            assignedUserName: task_assignedUserName,
            dateCreated: curr_date,
        },
        function (err, task) {
            if (err) {
                return res.status(500).send({
                    message: err.message,
                    data: {}
                });
            }
            else {
                return res.status(201).send({
                    message: "OK",
                    data: task
                });
            }
        });
    }); 
    
    // PUT update user
    userById.put(function (req, res) {
        console.log(req.body);

        // Validate request here
        if ( (!req.body.hasOwnProperty('name')) || (!req.body.hasOwnProperty('email')) ) {
            return res.status(404).send({
                message: "Cannot update a user without a name or email",
                data: {},
            });
        }

        var id = req.params.id;

        // Get params for user here
        var user_name = req.body['name'];
        var user_email = req.body['email'];
        var user_pendingTasks = req.body['pendingTasks'] || [];
        var curr_date = new Date();


        User.findByIdAndUpdate(id, {
            name: user_name,
            email: user_email,
            pendingTasks: user_pendingTasks,
            dateCreated: curr_date,
        }, 
        {new: true}, 
        function (err, user) {
            if (err) {
                return res.status(500).send({
                    message: err.message,
                    data: {}
                });
            }
            else {
                return res.status(201).send({
                    message: "OK",
                    data: user
                });
            }
        });
    });

    // PUT update task
    taskById.put(function (req, res) {
        // Validate request here
        if ( (!req.body.hasOwnProperty('name')) || (!req.body.hasOwnProperty('deadline')) ) {
            return res.status(404).send({
                message: "Cannot create a task without a name or deadline",
                data: {},
            });
        }

        var id = req.params.id;

        // Get params for user here
        var task_name = req.body['name'];
        var task_description = req.body['description'] || "";
        var task_deadline = req.body['deadline'];
        var task_completed = req.body['completed'] || false;
        var task_assignedUser = req.body['assignedUser'] || "";
        var task_assignedUserName = req.body['assignedUserName'] || "";
        var curr_date = new Date();

        Task.findByIdAndUpdate(id, {
            name: task_name,
            description: task_description,
            deadline: task_deadline,
            completed: task_completed,
            assignedUser: task_assignedUser,
            assignedUserName: task_assignedUserName,
            dateCreated: curr_date,
        },
        {new: true},
        function (err, task) {
            if (err) {
                return res.status(500).send({
                    message: err.message,
                    data: {}
                });
            }
            else {
                return res.status(201).send({
                    message: "OK",
                    data: task
                });
            }
        });
    }); 

    // AUTOGRADER BUILD ERROR

    return router;
}
