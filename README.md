# 🌿 Habit Tracker

## Background

This app was developed as a project for Laurea UAS course Dynamic Web Applications with Java Script.
The goal of this project was to build a simple but fully functional web app using vanilla JavaScript, HTML, and CSS. Learning objectives are developing practical skills in DOM manipulation, event handling, localStorage, accessibility, and static deployment through creating usable and interactive tools.

## Description

Habit tracker is a simple, accessible, and responsive web app that help users build and maintain daily habits.  
User can add habits, track progress across the week, and monitor streaks, and all that directly in the browser. Data is stored locally, so no server is needed.

## Relevant Links

[Live App](https://zeljkaz.github.io/habit-tracker/)
[GitHub Repository](https://github.com/ZeljkaZ/habit-tracker)

## Key Features

- ➕ Adding habits with name and category
- ✅ Ticking days when habit is complete
- 🔁 Streak counter automatically updates for each habit
- 💾 Data is saved using **localStorage** (habits are saved across sessions)
- 📁 Importing or exporting data as JSON files
- ♿ Keyboard navigation and screen readers supported for increased accessibility
- 🎨 Modern and visually appealing design

## How to Run Locally

### Windows / macOS

You can run the Habit Tracker directly in your browser — no installation or server required.

### Option 1 — Download ZIP (no Git needed)

- Go to the GitHub repository
- Click the green Code button (Download ZIP)
- Unzip the downloaded file on your computer
- Open the folder and double click index.html. The app will open in your default web browser

### Option 2: Using VS Code with Live Server (Recommended)

- Download or clone this repository:

git clone https://github.com/ZeljkaZ/habit-tracker

- Open the project folder in Visual Studio Code
- Install the Live Server extension (if not already installed)
- Right click on index.html, then select “Open with Live Server”
- Your browser will load the app automatically

## Self-assesment (based on Canvas rubric)

### Core Functionality (8/10 points)

The app lets users complete all main actions (creating and deliting a habit, choosing category, ticking days, exporting/importing habits, and resetting data) without issues. Some error handling is present, for example the app warns users about empty input fields or duplicate habits, but it doesn’t block meaningless input (any string can be saved as a habit, for example "%&/&€##"). Navigation and state are mostly consistent, except for Safari keyboard navigation that breaks midpoint. Since the app loads instantly, empty or loading screens weren’t really needed.

### Code Quality and Architecture (5/5)

The code is organized into small, focused functions with a clear folder structure. Names and comments make the code easy to understand, and there’s no dead code or duplication. Formatting is done used Prettier.

### UX and Accessibility (4/5)

Most aspects of the UI work as expected: forms are user-friendly, accessibility standards are met and the layout doesn’t jump around when content loads. Keyboard navigation works with visible focus, except for small issues with Safari. The main limitation is that the layout isn’t fully responsive on all smaller screens.

### Data Handling and Persistance (3/4)

The app reads and writes data safely to localStorage and imports JSON with basic shape validation. It handles import errors with try/catch, but reading corrupted localStorage could still cause issues. Some user input is directly inserted into the DOM, which could be a potential security risk, so full script injection protection isn’t implemented.

### Documentation (3/3)

The README file includes app description, list of features, instructions for installing and running the app on both Windows and macOS, and relevant screenshots. It clearly explains the architecture of the app, unresolved issues, and includes a self assesment section as well as learning reflections.

### Deployment (2/3)

The app is successfully deployed and accessible via a live link, and the README includes verified links to both the live site and the GitHub repository. While the main deployment and documentation are complete, optional release management practices were not implemented.

### Demo Video and Project Documentation (5/5)

The demo video clearly explains the problem, the solution, and the results in a logical order. It shows key flows and outcomes on screen, includes a reflection on key learning and possible improvements, and is delivered with clear audio and visuals within the recommended duration. Timestamps are included in the README for easy navigation

### Total points suggestion: 30/35

## Learning Reflections

Like I already mentioned in the beginning of this file, the goal of this project was to build a simple app using HTML, CSS and vanilla JavaScript. I already have experience with HTML and CSS from previous courses and projects, but this assignment provided an interesting learning opportunity when it comes to working with JavaScript. I learned more about managing application state, updating the app UI dynamically, and saving data using localStorage. I also gained practical experience with error handling, form validation and improving accessibility by correctly using keyboard navigation and semantic HTML elements.

During development, I ran into several challenges. The most common issues were related to typos in function names or accidentally adding extra characters to the code, which resulted in the app not being able to load properly, or perform main functions. I used Console to inspect these issues and resolve them. To solve formatting inconsistencies, I used the Prettier extension in Visual Studio Code.

Another problem I encountered when tried to add a habit category feature was getting a 404 error. I was confident that my code should work, but for some reason, Visual Studio Code did not display my index.html in the root folder. I checked the local repository and confirmed that index.html was indeed there. So, I went and closed the local folder in VSC, and cleared the browser cache. As a precaution, I pulled the last working version of my code from the remote repository, which resolved the issue.

However, a persisting challenge that I was unable to resolve was keyboard navigation, more precisely keyboard navigation for Safari. I managed to focus on the input fields for naming a habit and choosing a category, but when I pressed the tab, instead of continuing to submit button, the app would redirect me to the URL section of my page, breaking the navigation. The new habit can be created in Safari, but unfortunately, cannot be toggled for a specific day just by using keyboard navigation. However, I checked whether this feature worked in Chrome, and the keyboard navigation worked as expected. So this issue remains on my to-do list for future improvements.

Speaking of future improvements, I am also planning to improve error handling (so that, for example, only a valid string can be entered as a habit, and not any group of characters) and also to fix responsiveness on smaller screens, which I didn't do this time, as I was more focused on the app functionality. Overall, this project gave me a deeper understanding of front-end development, problem-solving when debugging issues, but also, how important it is to be careful with typing code and how useful a tool such as a Console can be for fixing the issues that will inevitably arise.

## Relevant Screenshots

```

```
