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
    template: 'listPage',
	data(){
		//console.log(this.params.someParameter);
        let currentList = this.params._id;
        return Lists.findOne({ _id: currentList });
	}
});

if(Meteor.isClient){
    // client code goes here
    Template.todos.helpers({
    	todo(){
            var currentList = this._id;
    		return Todos.find({ listId: currentList }, { sort: { createdAt: -1}});
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
            var currentList = this._id;
    		Todos.insert({
    			name: todoName,
    			completed: false,
    			createdAt: new Date(),
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
    		Lists.insert({
    			name: listName
    		});
    		$("[name=listName]").val("");
    	}
    });
    Template.lists.helpers({
    	list(){
    		return Lists.find({}, { sort: { name: 1 }});
    	}
    });
}

if(Meteor.isServer){
    // server code goes here
}
