Todos = new Mongo.Collection("todos");

if(Meteor.isClient){
    // client code goes here
    Template.todos.helpers({
    	todo(){
    		return Todos.find({}, { sort: { createdAt: -1}});
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