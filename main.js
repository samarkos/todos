Todos = new Mongo.Collection("todos");

if(Meteor.isClient){
    // client code goes here
    Template.todos.helpers({
    	todo(){
    		return Todos.find({}, { sort: { createdAt: -1}});
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
    	}
    });
    Template.addTodo.events({
    	"submit form": function(event){
    		event.preventDefault();
    		let todoName = $("[name='todoName']").val(); // jQuery
    		//let todoName = event.target.todoName.value; // non jQuery
    		Todos.insert({
    			name: todoName,
    			completed: false,
    			createdAt: new Date()
    		});
    		$("[name='todoName']").val("");
    	}
    });
}

if(Meteor.isServer){
    // server code goes here
}