# Mail Javascript

![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow)
![Server-side API](https://img.shields.io/badge/Server--side%20API-Specify%20API%20Here-orange)

Mail Javascript is a front-end email client that interacts with a server-side API to send and receive emails. It provides features such as sending emails, viewing mailboxes (Inbox, Sent, Archive), viewing email content, archiving/unarchiving emails, and replying to emails.

## Features

- **Send Mail:** Users can compose and send emails using the provided form. Upon submission, the email is sent via a POST request to the server.
- **Mailbox:** Users can view their Inbox, Sent mailbox, or Archive. Emails are loaded dynamically from the server when a mailbox is visited.
- **View Email:** Clicking on an email displays its content, including sender, recipients, subject, timestamp, and body. Emails are marked as read upon viewing.
- **Archive and Unarchive:** Users can archive or unarchive emails in their Inbox. The Archive mailbox displays archived emails, and the action is reversible.
- **Reply:** Users can reply to emails with pre-filled recipient, subject, and body fields based on the original email.

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/NohaGad/Mail-Javascript.git

2. Open `index.html` in a web browser to access the application.

3. Interact with the email client by composing, viewing, archiving, and replying to emails.

## Technologies Used

HTML, CSS, JavaScript

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

