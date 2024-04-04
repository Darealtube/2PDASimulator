$(document).ready(() => {
  const transitions = [
    { currState: "", nextState: "", input: "", stack1: "", stack2: "" },
  ];
  let transitionRowCount = 0;

  const createTransitionTableRow = (transition) => {
    var element = "";

    Object.keys(transition).forEach((key) => {
      element += `<td><input type="text" id="${key}" name="${key}"></td>`; // corrected HTML
    });

    return element;
  };

  transitions.forEach((transition) => {
    $(".transition-list").append(
      `<tr class="transition-row-${transitionRowCount}">${createTransitionTableRow(
        transition
      )}</tr>`
    );
    transitionRowCount++;
  });

  const clearInputs = () => $(input).val("");

  $(".submit").click(function () {
    const inputSymbols = $(".input-symbols").val();
    const stackSymbols = $(".stack-symbols").val();
    const inputString = $(".input-string").val();
    const inputTransitions = [];

    $(".transition-list tr").each(function (index, element) {
      const rowClass = $(element).attr("class");
      const transition = {};
      transition.currState = $(`.${rowClass} #currState`).val().trim();
      transition.nextState = $(`.${rowClass} #nextState`).val().trim();
      transition.input = $(`.${rowClass} #input`).val().trim();
      transition.stack1 = $(`.${rowClass} #stack1`).val().trim();
      transition.stack2 = $(`.${rowClass} #stack2`).val().trim();

      inputTransitions.push(transition);
    });
    /*  clearInputs(); */
  });

  $(".addTransition").click(function (event) {
    const newTransition = {
      currState: "",
      nextState: "",
      input: "",
      stack1: "",
      stack2: "",
    };

    $(".transition-list").append(
      `<tr class="transition-row-${transitionRowCount}">${createTransitionTableRow(
        newTransition
      )}</tr>`
    );

    transitionRowCount++;
  });

  $(".clear").click(function (event) {
    clearInputs();
  });
});
