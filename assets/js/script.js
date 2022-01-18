var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//event listener for when the <p> element is clicked
$(".list-group").on("click", "p", function () {
  //converts user input to variable 'text'
  var text = $(this)
    .text()
    .trim();
  
  //$("textarea") will search for and SELECT <textarea> elements. $("<textarea>") will CREATE a <textarea> element
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);
  
  //replaces the <p> element with the textInput variable (which is a created <textarea> element)
  $(this).replaceWith(textInput);

  //allows user to edit on first click (instead of a second click to highlight/focus textarea)
  textInput.trigger("focus");
});


//event listener for any interaction other than textarea to save changes
$(".list-group").on("blur", "textarea", function () {
  //get text area current value/text
  var text = $(this)
    .val()
    .trim();
  
  //get the parent ul's id attribute 
  //plain JS operators can be chained with jQuery operators
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  
  //get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();
  
  //tasks is an object. tasks[status] returns array eg toDo. tasks[status][index] returns the object at the given index in the array. tasks[status][index].text returns the text property of the object at the given index. 
  tasks[status][index].text = text;
  //update tasks object in local storage
  saveTasks();

  // recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);
  
  //replace text area with p element
  $(this).replaceWith(taskP);
});

//due date was clicked
$(".list-group").on("click", "span", function () {
  //get current text
  var date = $(this)
    .val()
    .trim();
  
  //create new input element
  var dateInput = $("<input>")
    .attr("type", "text") //one argument gets attribute, two arguments sets attribute
    .addClass("form-control")
    .val(date);
  
  //swap out elements
  $(this).replaceWith(dateInput);

  //automatically focus on new element
  dateInput.trigger("focus");
});

//value of due date changed
$(".list-group").on("blur", "input[type='text']", function () {
  //get current text
  var date = $(this)
    .val()
    .trim();
  
  //get parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  
  //get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group")
    .index();
  
  //update task in array and re-save to local storage
  tasks[status][index].date = date;
  saveTasks();

  //recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);
  
  //replace input with span element
  $(this).replaceWith(taskSpan);
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


