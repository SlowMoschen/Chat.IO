# Chat Application

## Preview:
<p align="center">
  <img src="https://github.com/SlowMoschen/Chat.IO/blob/main/images/frontpage.PNG" alt="Frontpage" width="45%">
  <img src="https://github.com/SlowMoschen/Chat.IO/blob/main/images/chat.PNG" alt="Chatpage" width="45%">
</p>

## About
Originally, the development of this application aimed to learn websockets using the Node.js library Socket.IO. However, as is often the case with projects, I ended up learning much more than I initially intended. In the first three days of working on the project, I found myself in despair as I reconsidered everything and took an overly complicated approach. Consequently, I decided to reset the entire project and focus entirely on the MVP (Most Valuable Product).

After getting the first functional version up and running, enabling message exchange between different browser windows, I created two new Git branches – one for new features and one for refactoring the existing code. Working with Git branches was a new experience for me up to that point.

Once the basic design of the app was completed, I began thinking about new features. This led to the implementation of features such as direct messages, displaying currently logged-in users, and the ability to switch between different chat rooms.

The learning experiences from this project were significant. In addition to deepening my knowledge of working with websockets and the Socket.IO library, I also gained valuable skills in project management. Resetting the project and focusing on the MVP taught me the importance of clear goals and priorities. Utilizing Git branches provided an efficient way for organizing and developing features. Overall, Chat.IO was not just a technology learning project but also a training ground for effective development practices and decision-making.

## Tech Stack:

- React
- Socket.io
- Node.js
- Express
- Tailwind CSS for styling

## Features:

- Set a username
- Set and join a private room or the global chat
- Display user join and disconnect messages
- Usernames in a room are unique
- Joining a new Room while Logged in
- Send direct messages to another user in a Room
- Displays currently writting user
- Displays Users in a room

## Prerequisites
- Code Editor
- Node.js installed

## Setup Application on your Machine:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/slowmoschen/chat.io.git
    ```

2. **Change into the project directory:**

    ```bash
    cd chat-app
    ```

3. **Install dependencies for both the server and client:**

    ```bash
    # In the server directory
    cd server
    npm install

    # In the client directory
    cd ../client
    npm install
    ```

4. **Start the server and client:**

    ```bash
    # In the server directory
    npm run dev

    # In the client directory
    npm run dev
    ```
