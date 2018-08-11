var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/tasks", { useNewUrlParser: true });

var Schema = mongoose.Schema;

// Define Database Schema
var TaskSchema = new Schema({
	title: {type: String, required: true},
	description: {type: String},
	status: {type: Boolean, required: true},
}, {collection: 'tasks'});

// Define Schema Object
var Task = mongoose.model('Task', TaskSchema);


/* GET Tasks page. */
router.get('/', function(req, res, next) {
	Task.find().sort({_id: -1})
	.then(function(docs) {
		res.render('tasks/index', {tasks: docs})

	})
});

/* GET Task Single page. */
router.get('/view/id', function(req, res, next) {

	Task.findById(id)
	.then(function(docs) {
		res.render('tasks/show', {task: docs})

	})
});


/* GET Task Single page. */
router.get('/add', function(req, res, next) {
	res.render('tasks/create', {title: "Create New Task", success: req.session.success, errors: req.session.errors});
});


/* Post Task Single page. */
router.post('/store', function(req, res, next) {

	req.check('title', "Please give a title").notEmpty();
	req.check('status', "Please give status for task").notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/add');
	}else {
		req.session.success = true;

		var task = 
		{
			'title': req.body.title,
			'description': req.body.description,
			'status': req.body.status
		};

		var task = new Task(task);
		task.save();res.redirect('/');
	}

});

		router.post('/update', function(req, res, next) {

			var id = req.body.id;

		//validate first
		req.check('title', "Please give a title").notEmpty();
		req.check('status', "Please give status for task").notEmpty();

		var errors = req.validationErrors();
		if (errors) {
			req.session.errors = errors;
			req.session.success = false;
			res.redirect('/');
		}else {
			req.session.success = true;
			Task.findById(id, function (err, doc) {
				if (err) {
					console.log('Error To find the docs');
				}else {
					doc.title = req.body.title;
					doc.description = req.body.description;
					doc.status = req.body.status;
					doc.save();
					res.redirect('/');
				}
			})
		}

	});
			/* Delete Task */
			router.post('/delete', function(req, res, next) {
				var id = req.body.id;
				Task.findByIdAndRemove(id).exec();
				res.redirect('/');
			});



			module.exports = router;
