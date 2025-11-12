// rows variable gets reference to rows container (div element in the html file with id "rows")
const rows = document.getElementById("rows");

// state variable loads saved state from localStorage, or initializes an empty state
let state = JSON.parse(localStorage.getItem("habitTrackerState")) || {
  habits: [],
};

// todayKey function returns today's date in YYYY-MM-DD format
// that date is used a key in each habit log
function todayKey() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// getWeekKeys function generates an array of 7 days, in the same YYYY-MM-DD format
function getWeekKeys() {
  const keys = [];
  const d = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(d);
    date.setDate(date.getDate() - i);
    keys.push(date.toISOString().split("T")[0]);
  }
  return keys;
}

// weekKeys variable stores getWeekKeys array so that the table displays the week view for each habit
const weekKeys = getWeekKeys();

// Creating new habit object
// newHabit(name) function returns an object representing a single habit
function newHabit(name) {
  return {
    id: Math.random().toString(36).slice(2, 9), // a unique id for the habit
    name: name, // name of the habit entered by the user
    log: {}, // object storing which days are complited - updates straight away after user ticks/unticks the day
  };
}

// saveState(stateObj) function converst the state object into JSON and stores it to local storage
// that way, the app remembers user's habits and displays them
function saveState(stateObj) {
  localStorage.setItem("habitTrackerState", JSON.stringify(stateObj));
}

// Calculate how many days in a row habit was completed
function computeStreak(habit) {
  let count = 0; // starts counting from 0
  const d = new Date(); // starts checking from todays date
  while (true) {
    // looping until reaches the day that has not been ticked
    const key = d.toISOString().split("T")[0];
    if (habit.log[key]) {
      // if date is found in the habit log
      count++; // increases streak by 1
      d.setDate(d.getDate() - 1); // goes one day back and keeps checking
    } else {
      break; // loop stops when a missed day is found (a day when the habit is not ticked)
    }
  }
  return count; // returns total streak of consecutive days wehen the habi was ticked/done
}

// ===================================================================
// === 1. RENDER UI: Dynamic DOM Generation (State Reconciliation) ===
// ===================================================================

// This function completely rebuilds the habit tracker table in the browser
// It is called every time the data changes (add, toggle, delete, import, etc.) !!!
// It uses the current 'state' object to generate fresh HTML: no templates!

// render(): The master function that draws the entire UI from scratch
function render() {
  // Clear previous HTML so that we start fresh every time
  rows.innerHTML = "";

  // Show "No habits yet" message if the list is empty
  if (state.habits.length === 0) {
    // Creates a row container for placeholder message "No habits yet"
    const row = document.createElement("div"); // creates a div that will behave as a placeholder row of the table
    // styles row as a grid to be consistant with the table layout
    row.setAttribute(
      "style",
      "display:grid;grid-template-columns:1.6fr repeat(7,.9fr) .8fr 1fr;align-items:center;border-bottom:1px solid #eef2f6;"
    );

    // Add habit name column
    const nameCol = document.createElement("div");
    nameCol.setAttribute(
      "style",
      "padding:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
    );
    nameCol.textContent = "No habits yet"; // placeholder message
    row.appendChild(nameCol); // add to the row

    // Add empty day columns
    weekKeys.forEach(() => {
      const col = document.createElement("div");
      col.setAttribute("style", "padding:10px;text-align:center;");
      row.appendChild(col); // add empty column to the row
    });

    // Add streak column (0 for empty state)
    const streakCol = document.createElement("div");
    streakCol.setAttribute(
      "style",
      "padding:10px;font-variant-numeric:tabular-nums;"
    );
    streakCol.textContent = "0"; // placeholder streak
    row.appendChild(streakCol); // add to the row

    // Add actions column
    const actionsCol = document.createElement("div");
    actionsCol.setAttribute("style", "padding:10px;color:#66788a;");
    actionsCol.textContent = "Add a habit"; // message that prompts user to add a habit
    row.appendChild(actionsCol); // add to the row

    // Adding placeholder row to the page
    rows.appendChild(row);

    // it stops here - no further rendering is needed since there are no habits
    return;
  }

  // Loop through each habit in the state object and create a separate row for each
  state.habits.forEach((h) => {
    // Create  a container div for the habit row
    const row = document.createElement("div");
    row.setAttribute(
      "style",
      "display:grid;grid-template-columns:1.6fr repeat(7,.9fr) .8fr 1fr;align-items:center;border-bottom:1px solid #eef2f6;"
    );

    // Create a first column - a habit name
    const nameCol = document.createElement("div");
    // Insert the actual habit name
    nameCol.setAttribute(
      "style",
      "padding:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
    );
    nameCol.textContent = h.name;
    row.appendChild(nameCol); // add to the row

    // Create the columns for the 7 days (week log)
    weekKeys.forEach((k) => {
      const col = document.createElement("div");
      col.setAttribute("style", "padding:10px;text-align:center;");

      // Create a clickable button for each day
      const btn = document.createElement("button");
      btn.type = "button";
      // Accessibility features : describing which date and which habit this button bellongs
      btn.setAttribute("aria-label", `${h.name} on ${k}`);
      btn.setAttribute("role", "checkbox"); // role means that this button behaves like a checkbox

      // Check if this day is marked complete
      const checked = !!h.log[k];
      btn.setAttribute("aria-checked", String(checked));
      btn.textContent = checked ? "Yes" : ""; // showing "Yes" if complited, otherwise empty

      // Attaching habit ID and date to the button
      // This allows click handler to know which habit and day to toggle
      btn.dataset.habitId = h.id; // habit id
      btn.dataset.dateKey = k; // date

      // Style button depending on whether the habit is completed or not, green if completed
      btn.setAttribute(
        "style",
        "display:flex;align-items:center;justify-content:center;width:36px;height:36px;margin:auto;border-radius:8px;border:1px solid #dbe7f0;cursor:pointer;user-select:none;background:" +
          (checked ? "#e9f8ef" : "#fff") +
          ";color:" +
          (checked ? "#1e9e4a" : "inherit") +
          ";font-weight:" +
          (checked ? "700" : "400") +
          ";"
      );

      // Adding click event - toggles habit completion for that day
      btn.addEventListener("click", onToggleDay);

      // Space/Enter keys also toggle for keybord users
      btn.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          // If Space or Enter is pressed
          e.preventDefault(); // prevents default scrolling
          btn.click(); // Space/Enter behave the same like clicking
        }
      });

      col.appendChild(btn); // add button to the column
      row.appendChild(col); // add column to the habit row
    });

    // Streak counter
    // Create a div element to show how many consecutive days the habit was checked/toggled
    const streakCol = document.createElement("div");
    streakCol.setAttribute(
      "style",
      "padding:10px;font-variant-numeric:tabular-nums;"
    );
    streakCol.textContent = String(computeStreak(h)); // calculates streak for this habit
    row.appendChild(streakCol); // adds streak column to the habit row

    // Action buttons
    // This div holds "tick today" and "delete habit" buttons
    const actions = document.createElement("div");
    actions.setAttribute(
      "style",
      "padding:10px;display:flex;gap:8px;flex-wrap:wrap;"
    );

    // Tick today button
    const tick = document.createElement("button"); // dynamically creating a button element
    tick.type = "button"; // set type to button
    tick.textContent = "Tick today"; // text displayed on the button
    // Inline style for appearance
    tick.setAttribute(
      "style",
      "background: #eef7ff;border:1px solid #7796adff;color: #046f95;padding:6px 10px;border-radius:8px;cursor:pointer; transition: 0.15s ease-in-out;"
    );
    // Hover effect  button brightens when hovered over
    tick.addEventListener("mouseenter", () => {
      tick.style.filter = "brightness(1.25)";
    });
    // Color back to normal when mouse leaves
    tick.addEventListener("mouseleave", () => {
      tick.style.filter = "brightness(1)";
    });
    // Click event - marking today's habit as done
    tick.addEventListener("click", () => toggleLog(h.id, todayKey()));
    actions.appendChild(tick); // outting the button inside action container

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete habit"; // text displayed
    // inline styles for appearance
    deleteBtn.style.cssText =
      "padding:6px 12px;border: 1px solid rgba(219, 152, 152, 1);background: #fee;color: #c00;border-radius:8px;cursor:pointer;font-weight:700;transition:filter 0.15s ease-in-out;";
    // Hover effect - brighter color when mouse hovers over a button
    deleteBtn.addEventListener("mouseenter", () => {
      deleteBtn.style.filter = "brightness(1.25)";
    });
    // Hover effect stops - mouse leaves and color back to normal
    deleteBtn.addEventListener("mouseleave", () => {
      deleteBtn.style.filter = "brightness(1)";
    });
    // Click event - confirming and deleting the habit 
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Delete "${h.name}"?`)) { // confirmation 
        state.habits = state.habits.filter((x) => x.id !== h.id); // removing habit from the state object 
        saveState(state); // saving state/updating it 
        render(); //rendering the table again (table renders again after every change)
      }
    });
    actions.appendChild(deleteBtn); // add button to action container 

    row.appendChild(actions); // add action container to row 
    rows.appendChild(row); // add row to the main container with all habit rows
  });
}

// =====================================================================
// EVENT HANDLING & STATE MUTATION
// =====================================================================

// Toggle a habit's log for a specific date - runs when a certain day's button is clicked
function onToggleDay(e) {
  const btn = e.currentTarget; // the button that was clicked
  const habitId = btn.dataset.habitId; // gets habit id stored in the button data attributes (explained in rows 162-165)
  const dateKey = btn.dataset.dateKey; // gets habit date 
  toggleLog(habitId, dateKey); // Calls the function to update the habit log 
}

// Add or remove a checkmark for a specific habit and date
function toggleLog(habitId, dateKey) {
  const habit = state.habits.find((h) => h.id === habitId); // Find the habit in state by using habit id 
  if (habit) { n// If habit exists 
    habit.log[dateKey] = !habit.log[dateKey]; // toggle the value 
    saveState(state); // save the updated state to local storage 
    render(); // render the page again so that the information in the table updates 
  }
}

// =====================================================================
// Add new habit via form
// =====================================================================

// Adding a listener to the form submission event 
document.getElementById("habit-form").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents default behaviour from submission (like reloading the page when the form is sublitted) - that way the habit dont gets lost 
  const input = document.getElementById("habit-name"); // getting the input field where the user types habit name 
  const name = input.value.trim(); // reads text and removes extra spaces at the start and end 
  if (!name) return; // if the imput is empty, no changes are made 

  state.habits.push(newHabit(name)); // creates a new habit and adding it to array 
  saveState(state); // saving the updated State to local storage 
  input.value = ""; // clearing the input field so that the new input can be typed 
  render(); // rendering the table again so that the new habit can appear in the table 
});


// =====================================================================
// Data management
// =====================================================================

// Export habits as JSON file
document.getElementById("export-json").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { // converts the curent state object into JSON string 
    type: "application/json",
  });
  const url = URL.createObjectURL(blob); // creates temporarily URL for JSON file 
  const a = document.createElement("a"); // creates temporarily <a> element to triggers download 
  a.href = url; // set link to the file 
  a.download = "habits-export.json"; // set suggestion for file name 
  a.click(); // clik to start downloading 
  URL.revokeObjectURL(url); // clean the temporary URL 
});

// Import habits from JSON file
document.getElementById("import-json").addEventListener("change", async (e) => {
  const file = e.target.files?.[0]; // get the selected file 
  if (!file) return; // if no file is selected, do nothing 

  try {
    const text = await file.text(); // reading the file content as a text 
    const data = JSON.parse(text); // parse the text into an object 
    if (!Array.isArray(data.habits)) throw new Error("Invalid format"); // validate structure 

    state = data; // replace current state with the imported data 
    saveState(state); // save new state to local storage 
    render(); // rebuild UI with the imported data 
    alert("Import complete. Data loaded."); // Notify user that data is loaded succesfully 
  } catch (err) {
    alert("Import failed. Please check the JSON file format.");
  }
  e.target.value = ""; // clear the input
});

// Reset all data
document.getElementById("reset-all").addEventListener("click", () => {
  if (!confirm("Delete all habits and logs?")) return; // Ask for confirmation before resetting 

  state = { habits: [] }; // reset state to empty 
  saveState(state); // save empty state to local storage 
  render(); // rebuild the UI (with placeholder row and text)
  alert("All data reset."); // Notify user 
});

// Start the app on page load - show the habit table immediately when the page opens 
render();
