document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const recipients = document.querySelector('#compose-recipients').value
    const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value

    await send_email(recipients, subject, body);

    load_mailbox('sent');

  })

  // By default, load the inbox
  load_mailbox('inbox');
});

async function send_email(recipients, subject, body) {

  await fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

async function get_emails(mailbox_type) {

  const response = await fetch(`/emails/${mailbox_type}`)
  const emails = await response.json()
  return emails
}

function render_emails(emails) {
  const emails_view = document.querySelector('#emails-view')
  emails.forEach(email => {
    let emailDiv = document.createElement('div')
    emailDiv.className = 'emaildiv list-group-item'
    if (email.read === true) {
      emailDiv.className += ' readEmail'
    }

    const senderDiv = document.createElement('div');
    senderDiv.className = 'sender';
    senderDiv.textContent = email.sender;

    const subjectDiv = document.createElement('div');
    subjectDiv.className = 'subject';
    subjectDiv.textContent = email.subject;

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'timestamp';
    timestampDiv.textContent = `Sent at: ${email.timestamp}`;

    emailDiv.appendChild(senderDiv);
    emailDiv.appendChild(subjectDiv);
    emailDiv.appendChild(timestampDiv);

    emails_view.appendChild(emailDiv)
  })
}
async function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  const emails = await get_emails(mailbox)
  console.log(emails)
  render_emails(emails);
}