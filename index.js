$(document).ready(() => {
  // START OF VARIABLE DEFINITIONS

  // Variables for input part
  let initialState;
  let finalState;
  let inputSymbols;
  let stackSymbols;
  let inputString;
  let inputTransitions = [];

  // Transition table initial rows
  const transitions = [
    { currState: "", nextState: "", input: "", stack1: "", stack2: "" },
  ];

  // To keep track of the data of the transition rows
  let transitionRowCount = 0;

  // Variables for simulation part
  const definition = {};
  let currInputIndex = -1;
  let stack1 = ["Z0"];
  let stack2 = ["Z1"];
  let verdict = definition.initialState == definition.finalState;
  let action = "";
  let currState = definition.initialState;

  // For simulation "cache" to not recalculate simulation again.
  const simulationHistory = [];

  // END OF VARIABLE DEFINITIONS

  // START OF INPUTTING FUNCTIONALITIES

  // Creates a new row in the transition table.
  const createTransitionTableRow = () => {
    var element = "";

    element += `<td><input type="text" id="currState" name="currState"></td>`;
    element += `<td><input type="text" id="nextState" name="nextState"></td>`;
    element += `<td><input type="text" id="input" name="input"></td>`;
    element += `<td><input type="text" placeholder="stack symbol ; stack symbol" id="stack1" name="stack1"></td>`;
    element += `<td><input type="text" placeholder="stack symbol ; stack symbol" id="stack2" name="stack2"></td>`;

    return element;
  };

  // Initializes the rows of the transition table.
  transitions.forEach((transition) => {
    $(".transition-list").append(
      `<tr class="transition-row-${transitionRowCount}">${createTransitionTableRow(
        transition
      )}</tr>`
    );
    transitionRowCount++;
  });

  // Clears all input textfields in the input part.
  const clearInputs = () => $(".inputDiv input").val("");

  // Reset all variables for input part.
  const resetValues = () => {
    initialState = null;
    finalState = null;
    inputSymbols = null;
    stackSymbols = null;
    inputString = null;
    inputTransitions = [];
  };

  // Disables inputting for the input part (Upon submit)
  const disableInputting = () => {
    $(".inputDiv input").prop("disabled", true);
    $(".inputDiv button").prop("disabled", true);
    resetValues();
  };

  // Enables simulation part (Upon submit)
  const enableSimulation = () => {
    $("#previous-input").prop("disabled", false);
    $("#next-input").prop("disabled", false);
    $("#back-to-start").prop("disabled", false);
    $("#edit").prop("disabled", false);
  };

  // Populates the definition object (For the simulation part)
  const populateDefinition = () => {
    definition.initialState = initialState;
    definition.finalState = finalState;
    definition.inputSymbols = inputSymbols;
    definition.stackSymbols = stackSymbols;
    definition.inputString = inputString;
    definition.inputTransitions = inputTransitions;
    verdict = definition.initialState == definition.finalState;
    action = "";
    currState = definition.initialState;
  };

  // Depopulates the definition object (When going back to input part)
  const depopulateDefinition = () => {
    definition.initialState = "";
    definition.finalState = "";
    definition.inputSymbols = [];
    definition.stackSymbols = [];
    definition.inputString = [];
    definition.inputTransitions = [];
    currInputIndex = -1;
    stack1 = ["Z0"];
    stack2 = ["Z1"];
    verdict = "";
    action = "";
    currState = "";
  };

  // Validates input parts input textfields
  const validateInputs = () => {
    let validInput = 1;
    // Check if ALL inputs have values
    var inputs = $(".inputDiv input");

    // Check if any input is empty
    var allInputsFilled = true;
    inputs.each(function () {
      let inputString = $(this).val();
      if (inputString.trim() === "" && $(this).attr("id") != "input") {
        allInputsFilled = false;
        return false; // Exit the loop early if any input is empty
      }
    });

    if (!allInputsFilled) {
      $(".error-message").text("There are some inputs that are not filled.");
      $(".error-message").css("opacity", 1);
      validInput = 0;
    }

    // Check if initialState exists in the transition list
    // Check if finalState exists in the transition list
    const currStates = inputTransitions.map((tr) => tr.currState);
    const nextStates = inputTransitions.map((tr) => tr.nextState);
    const allStates = [...currStates, ...nextStates];
    if (
      allStates.indexOf(initialState) == -1 ||
      allStates.indexOf(finalState) == -1
    ) {
      $(".error-message").text(
        "Initial/Final state does not exist in the transition table."
      );
      $(".error-message").css("opacity", 1);
      validInput = 0;
    }

    // Check if transition inputs are in the possible input symbols
    const stateInputs = inputTransitions.map((tr) => tr.input);
    stateInputs.forEach((input) => {
      if (inputSymbols.indexOf(input) == -1) {
        $(".error-message").text(
          "Input in transition table is not in input alphabet."
        );
        $(".error-message").css("opacity", 1);
        validInput = 0;
      }
    });

    // Check if stack1 ops are in the stack symbol list
    // Check if stack2 ops are in the stack symbol list
    inputTransitions.forEach((transition) => {
      const stackOp1 = transition.stack1.trim().split(";");
      const stackOp2 = transition.stack2.trim().split(";");

      if (stackOp1.length > 2 || stackOp2.length > 2) {
        $(".error-message").text("Stack Operation is invalid.");
        $(".error-message").css("opacity", 1);
        validInput = 0;
      }

      if (
        stackSymbols.indexOf(stackOp1[0]) == -1 ||
        stackSymbols.indexOf(stackOp1[1]) == -1
      ) {
        $(".error-message").text(
          "Stack Operation 1 contains symbols not in stack symbol alphabet."
        );
        $(".error-message").css("opacity", 1);
        validInput = 0;
      }

      if (
        stackSymbols.indexOf(stackOp2[0]) == -1 ||
        stackSymbols.indexOf(stackOp2[1]) == -1
      ) {
        $(".error-message").text(
          "Stack Operation 2 contains symbols not in stack symbol alphabet."
        );
        $(".error-message").css("opacity", 1);
        validInput = 0;
      }
    });

    // Check if all the characters in the input string are in the input symbols
    inputString.forEach((char) => {
      if (inputSymbols.indexOf(char) == -1) {
        $(".error-message").text(
          "Input string contains input not in input alphabet."
        );
        $(".error-message").css("opacity", 1);
        validInput = 0;
      }
    });

    return validInput;
  };

  // Creates rows on the inputStack (simulation) for each character in the input string
  const populateInputStack = () => {
    inputString.forEach((char, index) => {
      $(".inputStack").append(
        `<tr><td class="input-${index}">${char}</td></tr>`
      );
    });
  };

  // Removes rows on the inputStack (simulation) for each character in the input string
  const depopulateInputStack = () => {
    $(".inputStack tr").remove();
  };

  // Triggers when submitting the input part
  $(".submit").click(function () {
    // Format the inputs
    inputSymbols = $(".input-symbols").val();
    inputSymbols = inputSymbols.split(",").map((str) => str.trim());
    inputSymbols.push("");
    stackSymbols = $(".stack-symbols").val();
    stackSymbols = stackSymbols.split(",").map((str) => str.trim());
    stackSymbols.push("", "Z0", "Z1");
    inputString = $(".input-string").val();
    inputString = inputString.trim().split("");
    initialState = $(".initialState").val();
    initialState = initialState.trim();
    finalState = $(".finalState").val();
    finalState = finalState.trim();

    // For each row in the transition table, create a transition object that contains input, current and next state, and operations on stacks
    $(".transition-list tr").each(function (index, element) {
      const rowClass = $(element).attr("class");
      const transition = {};
      transition.currState = $(`.${rowClass} #currState`).val();
      transition.nextState = $(`.${rowClass} #nextState`).val();
      transition.input = $(`.${rowClass} #input`).val();
      transition.stack1 = $(`.${rowClass} #stack1`).val();
      transition.stack2 = $(`.${rowClass} #stack2`).val();

      inputTransitions.push(transition);
    });

    // Validate the inputs
    if (validateInputs()) {
      // When valid:
      // populate the input string stack for the simulation
      // populate the definition object (for simulation)
      // disable all textfields in the input part
      // enable the simulation part
      populateInputStack();
      populateDefinition();
      disableInputting();
      enableSimulation();
      $(".error-message").css("opacity", 0);
    } else resetValues(); // Otherwise reset the values of the input part variables (but not the textfields)
  });

  // Add a row on the transition table when the button is clicked
  $(".addTransition").click(function (event) {
    $(".transition-list").append(
      `<tr class="transition-row-${transitionRowCount}">${createTransitionTableRow()}</tr>`
    );
    transitionRowCount++;
  });

  // Clears all inputs when the button is clicked
  $(".clear").click(function (event) {
    clearInputs();
  });

  // END OF INPUTTING FUNCTIONALITIES

  // START OF SIMULATION FUNCTIONALITIES

  const addHistory = () => {
    const newHistory = {
      currState,
      currInputIndex,
      stack1,
      stack2,
      action,
      verdict,
    };

    simulationHistory.push(newHistory);
  };

  // Updates the stack based on the stack array values (Used when state is changed)
  const updateStackDisplay = () => {
    stack1.forEach((char) => {
      $(".stack1").append(`<tr><td>${char}</td></tr>`);
    });
    stack2.forEach((char) => {
      $(".stack2").append(`<tr><td>${char}</td></tr>`);
    });
  };

  // Enables inputting again (When edit PDA is clicked)
  const enableInputting = () => {
    $(".inputDiv input").prop("disabled", false);
    $(".inputDiv button").prop("disabled", false);
  };

  // Disables the simulation (When edit PDA is clicked)
  const disableSimulation = () => {
    // Removes all the rows in the stacks
    // Disables all the buttons
    // Reset the text of verdict and action
    $(".inputStack tr").remove();
    $(".stack1 tr").remove();
    $(".stack2 tr").remove();
    $("#previous-input").prop("disabled", true);
    $("#next-input").prop("disabled", true);
    $("#back-to-start").prop("disabled", true);
    $("#edit").prop("disabled", true);
    $(".verdict").text("Verdict: ");
    $(".action").text("Action: ");
    $(".stateCircle").text("State 0");
    $(".stateCircle").css("background-color", "#e63946");
  };

  // Triggers when Edit PDA is clicked
  $("#edit").click(function () {
    // Reset the definition object
    // Reset the input string stack
    // Enables inputting and disables simulation
    depopulateDefinition();
    depopulateInputStack();
    enableInputting();
    disableSimulation();
  });

  // Triggers when next input button is clicked
  $("#next-input").click(function () {
    // Change input string stack highlight
    if (currInputIndex < definition.inputString.length - 1) {
      currInputIndex++;
      $(`.inputStack .input-${currInputIndex - 1}`).css(
        "background-color",
        "antiquewhite"
      );
      $(`.inputStack .input-${currInputIndex}`).css(
        "background-color",
        "#588157"
      );
    }

    // Check cache first if the current simulation already exists.
    if (simulationHistory[currInputIndex]) {
      const nextSimulationData = simulationHistory[currInputIndex];

      stack1 = nextSimulationData.stack1;
      stack2 = nextSimulationData.stack2;
      verdict = nextSimulationData.verdict;
      action = nextSimulationData.action;
      currState = nextSimulationData.currState;

      $(".verdict").text(`Verdict: ${verdict}`);
      $(".action").text(`Action: ${action}`);
      $(".stateCircle").text(currState);
      if (currState == definition.initialState) {
        $(".stateCircle").css("background-color", "#e63946");
      } else if (currState == definition.finalState) {
        $(".stateCircle").css("background-color", "#588157");
      } else $(".stateCircle").css("background-color", "#e9c46a");
      updateStackDisplay();
      return;
    }

    let possibleStateOperations = [];
    let nextState;

    // For each inputTransitions choose the states that are equal to the current state
    definition.inputTransitions.forEach((tr) => {
      if (tr.currState == currState) {
        possibleStateOperations.push(tr);
      }
    });

    // For each possible transitions (that are currState), filter the states
    possibleStateOperations.filter((state) => {
      const stackOp1 = state.stack1.split(";").map((char) => char.trim());
      const stackOp2 = state.stack2.split(";").map((char) => char.trim());
      const stack1Top = stack1[stack1.length - 1];
      const stack2Top = stack2[stack2.length - 1];

      // Only include the states in which the input is equal to the input that has been received.
      // Only include the states in which the stack operations appeal to the symbols on top of both stacks.
      if (
        state.input == definition.inputString[currInputIndex] &&
        stackOp1[0] == stack1Top &&
        stackOp2[0] == stack2Top
      )
        return true;
    });

    console.log(possibleStateOperations);
    // If there are no states that can be transitioned to from this state, do not execute the next state.
    if (possibleStateOperations.length == 0) return;

    // Operate on stacks
    possibleStateOperations.forEach((operation) => {
      const stackOp1 = operation.stack1.split(";").map((char) => char.trim());
      const stackOp2 = operation.stack2.split(";").map((char) => char.trim());

      // ;symbol = insert
      // symbol; = delete
      // ; = do nothing

      if (stackOp1[0] == "" && stackOp1[1] == "") {
        stack1.unshift("");
        stack1.shift();
      } else if (stackOp1[0] == "") {
        stack1.unshift(stackOp1[1]);
      } else if (stackOp1[1] == "") {
        stack1.shift();
      } else if (stackOp1[0] != "" && stackOp1[1] != "") {
        // If none of the symbols is empty, pop the top of the stack and insert the symbol
        stack1.shift();
        stack1.unshift(stackOp1[1]);
      }

      if (stackOp2[0] == "" && stackOp2[1] == "") {
        stack2.unshift("");
        stack2.shift();
      } else if (stackOp2[0] == "") {
        stack2.unshift(stackOp2[1]);
      } else if (stackOp2[1] == "") {
        stack2.shift();
      } else if (stackOp2[0] != "" && stackOp2[1] != "") {
        // If none of the symbols is empty, pop the top of the stack and insert the symbol
        stack2.shift();
        stack2.unshift(stackOp2[1]);
      }

      // Get the next state of the current state
      nextState = operation.nextState;

      // Let the user know what happened
      action = `${operation.stack1}, ${operation.stack2}`;
      $(".action").text(`Action: ${action}`);
    });

    // Update the stack1 and stack2 table rows to reflect the updated stacks
    updateStackDisplay();

    // Assign the nextState to the currState (it's time to transition)
    currState = nextState;
    // Change the state name
    $(".stateCircle").text(currState);

    // Change the state color
    // If initial state: red
    // If final state: green
    // If neither: yellow
    if (currState == definition.initialState) {
      $(".stateCircle").css("background-color", "#e63946");
    } else if (currState == definition.finalState) {
      $(".stateCircle").css("background-color", "#588157");
    } else $(".stateCircle").css("background-color", "#e9c46a");

    // Decide the verdict if the state transitioned to is a final state or not
    verdict = currState == definition.finalState ? "Accepted" : "Rejected";
    $(".verdict").text(`Verdict: ${verdict}`);

    // Add this to the simulation history for cache
    addHistory();
  });

  // Triggers when prev input button is clicked
  $("#previous-input").click(function () {
    // Change input string stack highlight
    if (currInputIndex > -1) {
      currInputIndex--;
      $(`.inputStack .input-${currInputIndex + 1}`).css(
        "background-color",
        "antiquewhite"
      );
      $(`.inputStack .input-${currInputIndex}`).css(
        "background-color",
        "#588157"
      );
    }

    if (currInputIndex == -1) {
      stack1 = ["Z0"];
      stack2 = ["Z1"];
      verdict = definition.initialState == definition.finalState;
      action = "";
      currState = definition.initialState;

      $(".verdict").text(`Verdict: ${verdict}`);
      $(".action").text(`Action: ${action}`);
      $(".stateCircle").text(currState);
      $(".stateCircle").css("background-color", "#e63946");
      updateStackDisplay();
    } else {
      const prevSimulationData = simulationHistory[currInputIndex];

      stack1 = prevSimulationData.stack1;
      stack2 = prevSimulationData.stack2;
      verdict = prevSimulationData.verdict;
      action = prevSimulationData.action;
      currState = prevSimulationData.currState;

      $(".verdict").text(`Verdict: ${currState == definition.finalState ? "Accepted" : "Rejected"}`);
      $(".action").text(`Action: ${action}`);
      $(".stateCircle").text(currState);
      if (currState == definition.initialState) {
        $(".stateCircle").css("background-color", "#e63946");
      } else if (currState == definition.finalState) {
        $(".stateCircle").css("background-color", "#588157");
      } else $(".stateCircle").css("background-color", "#e9c46a");
      updateStackDisplay();
    }
  });

  $("#back-to-start").click(function () {
    $(`.inputStack td`).css("background-color", "antiquewhite");

    currInputIndex = -1;

    stack1 = ["Z0"];
    stack2 = ["Z1"];
    verdict = definition.initialState == definition.finalState;
    action = "";
    currState = definition.initialState;

    $(".verdict").text(`Verdict: ${currState == definition.finalState ? "Accepted" : "Rejected"}`);
    $(".action").text(`Action: ${action}`);
    $(".stateCircle").text(currState);
    $(".stateCircle").css("background-color", "#e63946");
    updateStackDisplay();
  });

  // END OF SIMULATION FUNCTIONALITIES
});
