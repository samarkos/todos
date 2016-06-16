Todos = new Mongo.Collection("todos");

Lists = new Mongo.Collection("lists");

Router.configure({
	layoutTemplate: 'main'
});

Router.route('/', {
	//options for the route
	name: 'home',
	template: 'home'
});

Router.route('/register');

Router.route('/login');

Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
	data(){
		//console.log(this.params.someParameter);
        let currentList = this.params._id;
        let currentUser = Meteor.userId();
        return Lists.findOne({ _id: currentList, createdBy: currentUser });
	},
    onRun(){
        console.log("You triggered 'onRun' for 'listPage' route.");
        this.next();
    },
    onRerun(){
        console.log("You triggered 'onRerun' for 'listPage' route.");
    },
    onBeforeAction(){
        console.log("You triggered 'onBeforeAction' for 'listPage' route.");
        let currentUser = Meteor.userId();
        if (currentUser) {
            this.next(); // “Just let this route do what it would normally do.” 
        } else {
            this.render('login');
        }
    },
    onAfterAction(){
        console.log("You triggered 'onAfterAction' for 'listPage' route.");
    },
    onStop(){
        console.log("You triggered 'onStop' for 'listPage' route.");
    }
});

if(Meteor.isClient){
    // client code goes here
    Template.todos.helpers({
    	todo(){
            let currentList = this._id;
            let currentUser = Meteor.userId();
    		return Todos.find({ listId: currentList, createdBy: currentUser }, { sort: { createdAt: -1}});
    	}
    });
    Template.todoItem.helpers({
    	checked(){
    		let isCompleted = this.completed;
    		if(isCompleted)
    			return "checked";
    		else
    			return "";
    	}
    });
    Template.todoItem.events({
    	"click .delete-todo": function(event){
    		event.preventDefault();
    		let documentId = this._id;
    		let confirm = window.confirm("Delete this task?");
    		if(confirm)
    			Todos.remove({ _id: documentId });
    	},
    	"keyup [name=todoItem]": function(event){
    		if(event.which == 13 || event.which == 27) {
    			$(event.target).blur();
    		} else {
    			let documentId = this._id;
	    		let todoItem = $(event.target).val();
	    		Todos.update({ _id: documentId }, { $set: {name: todoItem }});	    		
    		}
    	},
    	"change [type=checkbox]": function(){
    		let documentId = this._id;
    		let isCompleted = this.completed;
    		if(isCompleted){
		        Todos.update({ _id: documentId }, {$set: { completed: false }});
		        console.log("Task marked as incomplete.");
		    } else {
		        Todos.update({ _id: documentId }, {$set: { completed: true }});
		        console.log("Task marked as complete.");
		    }
    	}
    });
    Template.addTodo.events({
    	"submit form": function(event){
    		event.preventDefault();
    		let todoName = $("[name='todoName']").val(); // jQuery
    		//let todoName = event.target.todoName.value; // non jQuery
            let currentUser = Meteor.userId();
            let currentList = this._id;
    		Todos.insert({
    			name: todoName,
    			completed: false,
    			createdAt: new Date(),
                createdBy: currentUser,
                listId: currentList
    		});
    		$("[name='todoName']").val("");
    	}
    });
    Template.todosCount.helpers({
    	totalTodos(){
            var currentList = this._id;
    		return Todos.find({ listId: currentList }).count();
    	},
    	completedTodos(){
            var currentList = this._id;
    		return Todos.find({ listId: currentList, completed: true }).count();
    	}
    });
    Template.addList.events({
    	"submit form": function(event){
    		event.preventDefault();
    		let listName = $("[name=listName]").val();
            let currentUser = Meteor.userId();
    		Lists.insert({
    			name: listName,
                createdBy: currentUser
    		}, function(error, results){
                //console.log(results);
                Router.go('listPage', { _id: results});
            });
    		$("[name=listName]").val("");
    	}
    });
    Template.lists.helpers({
    	list(){
            let currentUser = Meteor.userId();
    		return Lists.find({ createdBy: currentUser }, { sort: { name: 1 }});
    	}
    });
    Template.navigation.events({
        "click .logout": function(event){
            event.preventDefault();
            Meteor.logout();
            Router.go('login');
        }
    });
    Template.register.events({
        "submit form": function(event){
            event.preventDefault();
            let email = $("[name=email]").val();
            let password = $("[name=password]").val();
            Accounts.createUser({
                email,
                password
            }, function(error){
                if(error)
                    console.log(error.reason); // Output error if registration fails
                else
                    Router.go('home'); // Redirect user if registration succeeds
            });
            Router.go('home');
        }
    });
    Template.login.events({
        "submit form": function(event){
            event.preventDefault();
            var email = $("[name=email]").val();
            var password = $("[name=password]").val();
            Meteor.loginWithPassword(email, password, function(error){
                if(error) 
                    console.log(error.reason);
                else
                    Router.go('home');
            });
        }
    });
}

if(Meteor.isServer){
    // server code goes here
}
