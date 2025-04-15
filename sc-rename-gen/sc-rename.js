const colorCodes = [
    '&f', '&1', '&2', '&3', '&4', '&5', '&6', '&7', '&8', '&9',
    '&e', '&d', '&c', '&b', '&a', '&0',
  
    '&22', '&zz', '&j1', '&swan1', '&d1', '&d2', '&b1', '&b2',
    '&potato', '&91', '&92', '&71', '&72', '&51', '&52', '&31', '&32',
    '&11', '&12', '&g', '&j', '&e1', '&e2', '&c1', '&c2', '&a1', '&p',
    '&a2', '&q', '&s', '&t', '&u', '&v', '&w', '&81', '&y', '&82',
    '&z', '&61', '&62', '&41', '&42', '&21'
  ];

  const sortedColorCodes = [...colorCodes].sort((a, b) => b.length - a.length);

function insertColorAtSelection(color) {
    const activeInput = document.activeElement;

    const nameInput = document.getElementById("nameInput");

    const start = activeInput.selectionStart;
    const end = activeInput.selectionEnd;

    const valueBefore = activeInput.value.substring(0, start);
    const valueAfter = activeInput.value.substring(end);

    const valueWithColor = valueBefore + color + valueAfter;

    activeInput.value = valueWithColor;

    console.log(activeInput);

    activeInput.focus();

    setTimeout(() => {
      activeInput.focus();
      activeInput.setSelectionRange(end + color.length, end + color.length);
    }, 100);
}

function getLorelineIndices() {
    const parent = document.getElementById("lorelines");
    const forms = Array.from(parent.querySelectorAll("form"));

    const indices = forms.map(form => {
        // Find the class that is just a number
        for (const cls of form.classList) {
          if (!isNaN(cls)) {
            return parseInt(cls, 10);
          }
        }
        return null;
      });

    indices.sort();

    console.log(indices);

    return indices;
}

function addLoreline() {
    const indices = getLorelineIndices();
    let newIndex = 1;

    if (indices.length > 0) {
        newIndex = indices[indices.length - 1] + 1;
    }

    const form = document.createElement("form");
    form.id = "lorelineForm";
    form.classList.add("loreline");
    form.classList.add("" + newIndex);

    const textField = document.createElement("input");
    textField.type = "text";
    textField.id = "lorelineField";
    textField.className = "loreline-input";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-loreline-button";
    removeButton.textContent = "Remove Line"
    removeButton.setAttribute("onclick", `removeLoreline(${newIndex})`);

    form.appendChild(textField);
    form.appendChild(removeButton);

    const parent = document.getElementById("lorelines");
    parent.appendChild(form);
}

function removeLoreline(index) {
    const formsFromDocument = document.querySelectorAll('[id="lorelineForm"]');
    const forms = Array.from(formsFromDocument);

    let formToRemove = forms.find(form => {
        return Array.from(form.classList).includes(String(index));
    });

    if (formToRemove != null) {
        formToRemove.remove();
    }
}

function generateCommands() {
    //remove all generated commands to regenerate
    const allCommands = document.querySelectorAll('[id="commandParent"]');

    for (let i = 0; i < allCommands.length; i++) {
        allCommands[i].remove();
    }

    const nameInput = document.getElementById("nameInput");
    const lorelineInputs = document.querySelectorAll('[id="lorelineField"]');

    const name = nameInput.value;
    let lorelines = [];

    for (let i = 0; i < lorelineInputs.length; i++) {
        lorelines.push(lorelineInputs[i].value);
    }

    console.log(name);

    for (let i = 0; i < lorelines.length; i++) {
        console.log(lorelines[i]);
    }

    addCommand(makeComamand(true, name, 0));

    for (let i = 0; i < lorelines.length; i++) {
        addCommand(makeComamand(false, lorelines[i], i + 1))
    }
}

function makeComamand(isName, input, lorelineIndex) {
    let toOut = ""
    if (!isName) {
        toOut += "/setloreline ";
        toOut += lorelineIndex;
        toOut += " " + input;
    }
    else {
        toOut += "/rename ";
        toOut += input;
    }
    return toOut;
}

function addCommand(commandString) {
    const commandParent = document.createElement("div");
    commandParent.classList.add("command-parent");
    commandParent.id = "commandParent";
    
    const commandText = document.createElement("p")
    commandText.classList.add("command-text");
    commandText.textContent = commandString;

    const copyButton = document.createElement("button")
    copyButton.type = "button";
    copyButton.setAttribute("onclick", `copyText(${JSON.stringify(commandString)})`);
    copyButton.classList.add("copy-button");
    copyButton.textContent = "Copy Command";

    commandParent.appendChild(commandText);
    commandParent.appendChild(copyButton);

    document.getElementById("commands").appendChild(commandParent);
}

function copyText(text) {
    console.log(text);
    navigator.clipboard.writeText(text)
    .then(() => {
      console.log("Copied to clipboard:", text);
    })
    .catch(err => {
      console.error("Failed to copy:", err);
    });
}


function generateDisplay() {
    const prevTexts = document.querySelectorAll('[id="displayText"]');

    for (let i = 0; i < prevTexts.length; i++) {
        prevTexts[i].remove();
    }

    const nameInput = document.getElementById("nameInput");
    const lorelineInputs = document.querySelectorAll('[id="lorelineField"]');

    const container = document.getElementById("tooltipContainer");

    const nameDisplay = document.createElement("p");
    nameDisplay.classList.add("display-text");
    nameDisplay.id = "displayText";

    // console.log(wrapColorSectionsWithSpans(nameInput.value));
    
    nameDisplay.innerHTML = wrapColorSectionsWithSpans(nameInput.value)

    container.appendChild(nameDisplay);

    const nameBreak = document.createElement("br");
    nameBreak.id = "displayText";
    container.appendChild(nameBreak);

    for (let i = 0; i < lorelineInputs.length; i++) {
        const text = wrapColorSectionsWithSpans(lorelineInputs[i].value);
        const loreDisplay = document.createElement("p");
        loreDisplay.classList.add("display-text");
        loreDisplay.id = "displayText";

        loreDisplay.innerHTML = text;

        container.appendChild(loreDisplay);
    }
}

//This code was generated using ChatGPT because I really didn't want to write any string parsing code
function findColorCodeIndices(input) {
    const starts = [];
    const ends = [];
  
    for (let i = 0; i < input.length; i++) {
      for (const code of sortedColorCodes) {
        const slice = input.slice(i, i + code.length);
        if (slice === code) {
          const start = i;
          const end = i + code.length;
          starts.push(start);
          ends.push(end);
          i = end - 1;
          break;
        }
      }
    }
  
    return { starts, ends };
  }

  function wrapColorSectionsWithSpans(input) {
    const { starts, ends } = findColorCodeIndices(input);
    let result = '';
    let currentIndex = 0;
  
    for (let i = 0; i < starts.length; i++) {
      const start = starts[i];
      const end = ends[i];
  
      // Add plain text before the color code
      if (currentIndex < start) {
        result += input.slice(currentIndex, start);
      }
  
      // Extract the color code (e.g. "&potato") and remove the "&"
      const rawCode = input.slice(start, end); // e.g. "&zz"
      const code = rawCode.slice(1);           // e.g. "zz"
  
      // Get the text for this span (up to next color code or end of string)
      const spanStart = end;
      const spanEnd = (i + 1 < starts.length) ? starts[i + 1] : input.length;
      const content = input.slice(spanStart, spanEnd);
  
      result += `<span class="display-color-${code} display-text">${content}</span>`;
  
      currentIndex = spanEnd;
    }
  
    // Add any leftover text after the last color code
    if (currentIndex < input.length) {
      result += input.slice(currentIndex);
    }
  
    return result;
  }


function displayLoop() {
    requestAnimationFrame(displayLoop)
    generateDisplay();
}
displayLoop();


window.addLoreline = addLoreline;
window.generateCommands = generateCommands;
window.insertColorAtSelection = insertColorAtSelection;
window.copyText = copyText;
window.removeLoreline = removeLoreline;