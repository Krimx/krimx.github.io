function submit() {
    //Gets user input
    const inputField = document.getElementById("user-input");
    const userInputText = inputField.value;

    if (userInputText != "") { //Check if user input is not empty (we dont want any output if there is no input)
        const outputField = document.getElementById("output"); //Get output area as well

        inputField.value = ""; //Clears input field
    
        //Adds user input to output field
        const userInputToOutput = document.createElement("p");
        userInputToOutput.innerHTML = "<br>> " + userInputText + "<br>";
        outputField.appendChild(userInputToOutput);
        
        //Add output of command to output field
        const newOutput = document.createElement("p")
        newOutput.innerHTML = parseCommand(userInputText);
        outputField.appendChild(newOutput);
    
        //Auto scroll output area to bottom
        const output = document.querySelector('.output');
        output.scrollTop = output.scrollHeight;
    }
}

//Keylistener for enter key because need it for waka waka
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      submit();
    }
  });

function parseCommand(command) {
    //Good command syntax = action: param
    command = command.replace(/\s+/g, ''); //Gets rid of spaces
    command = command.toLowerCase(); //Remove case sensitivity

    //Various predetermined outputs
    const invalidSyntaxReturn = "Invalid command syntax";
    const invalidActionReturn = "Invalid command given"
    const invalidParamReturn = "Invalid parameter given"

    //Valid actions and params for each valid action
    const actions = ["describe", "download"];
    const actionParams = {
        describe: ["project", "cs320"],
        download: [".jar"]
    }

    const indexOfFirstColon = command.indexOf(':');
    if (indexOfFirstColon == -1) return invalidSyntaxReturn;
    else {
        const action = command.substring(0, indexOfFirstColon);
        const param = command.substring(indexOfFirstColon + 1, command.length);

        const validAction = actions.includes(action); //Checks if action is valid (see actions array)

        if (!validAction) return invalidActionReturn;
        else {
            const validParam = actionParams[action].includes(param); //Checks if param is valid against given action (see actionParams object)

            if (!validParam) return invalidParamReturn;
            else {
                // action and parameter has been validated, now we can have some hardcoded responses
                if (action == "describe") {
                    if (param == "project") return "Huzzah! Thy desire'st knowledge of projects of the past!<br>Prithee, sit thine ass down, for this tale is old as time itself, and magical as Merlin.<br>Jk the project is still being worked on. It should be done by May.<br><br>Stay tuned for updates!";
                    if (param == "cs320") return "CS320 is the first major class for computer science majors at York College of Pennsylvania.<br>It stems off of the knowledge gained from CS201, which is an object-oriented programming class.<br>It focusses on learning how to work on a project as a team with a focus on agile design and using git.<br>There is also an individual project that takes place, but it is not the top priority of the class. It's main purpose is to give students an excuse to learn something that they never had time to invest in before.<br>My individual project was this very website. I wanted to learn three.js and deepen my knowledge of how to use Javascript."
                }
                if (action == "download") {
                    if (param == ".jar") return "There is no product to download yet. Stay tuned for updates!";
                }
            }
        }

    }
}

parseCommand("passy");