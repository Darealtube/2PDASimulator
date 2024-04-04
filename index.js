$(document).ready(() => {
  $("#PDAForm").submit(function (event) {
    event.preventDefault();

    const transitionInputs = [{curr}]
    const inputSymbols = $("#input-symbols").val();
    const stackSymbols = $("#stack-symbols").val();
    const inputString = $("#input-string").val();
    const transitions = [{currState: '', nextState: '', input: '', stack1: '', stack2: ''}];

    transitions.forEach((transition) => {
        Object.keys(transition).forEach((key) => {
            const tableRow = $('<tr>');
                const tableCell = $('<td>');
                const inputField = $('<input>', {
                    type: 'text',
                    id: key,
                    name: key
                });

                tableCell.append(inputField);
                tableRow.append(tableCell);
            
            $("#transition-table tbody").append(tableRow);
        })
    })

    $("#transition-table tr").each(function () {
      const transition = {};
      transition.currState = $("#current-state").val().trim();
      transition.nextState = $("#next-state").val().trim();
      transition.input = $("#state-input").val().trim();
      transition.stack1 = $("#stack1-op").val().trim();
      transition.stack2 = $("#stack2-op").val().trim();

      transitions.push(transition);
    });

    $(this).trigger("reset");

    window.location.href = `simulation.html?isym=${encodeURIComponent(
      inputSymbols
    )}&ssym=${encodeURIComponent(stackSymbols)}&s=${encodeURIComponent(
      inputString
    )}&t=${encodeURIComponent(JSON.stringify(transitions))}`;
  });


  $("#addTransition").click(function (event) {
    
  });
});     
