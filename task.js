const fs = require("fs");
const process = require("process-module");

const usage_help = () => {
  let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

  console.log(usage);
};

const addTask = () => {
  let task = "";
  const path = "task.txt";
  var result = false;
  for (var i = 3; i < process.argv.length; ++i) {
    task += process.argv[i] + " ";
  }

  task = task.trim();
  var task_length = task.length;
  var priority = process.argv[3];
  var task_without_priority = task.slice(2, task_length);

  try {
    if (fs.existsSync(path)) {
      result = true;
    }
  } catch (err) {
    console.error(err);
  }

  var task_to_add = task;
  if (result == true) {
    fs.appendFile("task.txt", "\n" + task_to_add, function (err) {
      if (err) {
        return console.error("error");
      }
      console.log(
        `Added task: "${task_without_priority}" with priority ${priority}`
      );
    });
  }
  if (result != true) {
    fs.writeFile("task.txt", task_to_add, function (err) {
      if (err) {
        return console.error("error");
      }
      console.log(
        `Added task: "${task_without_priority}" with priority ${priority}`
      );
    });
  }
};

const doneTask = () => {
  var done_task_index = process.argv[3];
  var done_tasks = fs.readFileSync("task.txt").toString().split("\n");
  const path = "completed.txt";
  var result = false;

  try {
    if (fs.existsSync(path)) {
      result = true;
    }
  } catch (err) {
    console.error(err);
  }

  done_tasks.sort();

  for (var i = 0; i < done_tasks.length; ++i) {
    if (i == done_task_index) {
      if (result != true) {
        var to_add_task = done_tasks[i].slice(2);
        fs.writeFile("completed.txt", to_add_task, function (err) {
          if (err) {
            return console.error("error");
          }
          console.log("Marked item as done.");
        });
      }
      if (result == true) {
        var to_add_task = done_tasks[i].slice(2);
        fs.appendFile("completed.txt", "\n" + to_add_task, function (err) {
          if (err) {
            return console.error("error");
          }
          console.log("Marked item as done.");
        });
      }
    }
  };
  var indexArray = new Array();
  for(i in done_tasks){
    var to_add = done_tasks[i].slice(0,1);
    indexArray.push(to_add);
  }
  let lastElement = indexArray[indexArray.length - 1];
  if(done_task_index != lastElement){
    console.log(`Error: no incomplete item with index #${done_task_index} exists.`)
  }

};

const lsTask = () => {
  const path = "task.txt";
  var result = false;
  var all_task_list = new Array();

  try {
    if (fs.existsSync(path)) {
      result = true;
    }
  } catch (err) {
    console.error(err);
  }

  if (result == true) {
    var all_task = fs.readFileSync("task.txt").toString().split("\n");

    all_task.sort();

    for (var i = 0; i < all_task.length; ++i) {
      var all_task_without_index = all_task[i].slice(2);
      all_task_list.push(all_task_without_index);
    }

    var iterator = 1;
    for (i in all_task_list) {
      console.log(`${iterator}. ` + all_task_list[i] + ` [${iterator}]`);
      iterator += 1;
    }
  }

  if (result != true) {
    console.log("There are no pending tasks!");
  }
};

const reportTask = () =>{
  var tasks = new Array();
  var completedTasks = new Array();
  var intermediate_tasks = new Array();
  const path = "completed.txt";
  var result = false;

  try {
    if (fs.existsSync(path)) {
      result = true;
    }
  } catch (err) {
    console.error(err);
  }

  if(result == true){
    tasks = fs.readFileSync("task.txt").toString().split("\n");
    completedTasks = fs.readFileSync("completed.txt").toString().split("\n");

    for (var i = 0; i < tasks.length; ++i) {
      var all_task_without_index = tasks[i].slice(2);
      intermediate_tasks.push(all_task_without_index);
    }

    let incomplete_tasks = intermediate_tasks.filter(x => !completedTasks.includes(x));
    var count = 0
    for(i in incomplete_tasks){
      count+=1;
    }

    console.log("Pending :",count)
    index = 1
    for(i in incomplete_tasks){
      console.log(`${index}. ` + incomplete_tasks[i] + ` [${index}]`);
      index+=1
    }
    var count = 0
    for(_ in completedTasks){
      count+=1;
    }
    console.log("\nCompleted :",count)
    index = 1
    for(i in completedTasks){
      console.log(`${index}. ` + completedTasks[i]);
      index+=1;
    }
  }


}
function main() {
  var argLength = process.argv.length;
  const argument = process.argv[2];

  if (argument === "help") {
    usage_help();
  }

  if (argument === "add") {
    if (argLength == 3) {
      console.log("Error: Missing tasks string. Nothing added!");
    }

    if (argLength > 3) {
      addTask();
    }
  }

  if (argument === "done") {
    if (argLength == 3) {
      console.log("Error: Missing NUMBER for marking tasks as done.");
    }

    if (argLength > 3) {
      doneTask();
    }
  }

  if (argument === "ls") {
    if (argLength == 3) {
      lsTask();
    }
  }

  if(argument === "report"){
    if(argLength == 3){
      reportTask();
    }
  }

  if (argLength < 3) {
    usage_help();
  }
}

main();
