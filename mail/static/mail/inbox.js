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
  document.querySelector('#email-view-by-id').style.display = 'none';

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

function render_emails(emails, mailbox) {
  const emails_view = document.querySelector('#emails-view')
  emails.forEach(email => {
    let emailDiv = document.createElement('div')
    emailDiv.className = 'emaildiv list-group-item'
    if (email.read === true) {
      emailDiv.className += ' readEmail'
    }

    const senderDiv = document.createElement('div');
    senderDiv.className = 'senderdiv';
    senderDiv.textContent = email.sender;

    const subjectDiv = document.createElement('div');
    subjectDiv.className = 'subjectdiv';
    subjectDiv.textContent = email.subject;

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'timestampdiv';
    timestampDiv.textContent = `Sent at: ${email.timestamp}`;

    emailDiv.appendChild(senderDiv);
    emailDiv.appendChild(subjectDiv);
    emailDiv.appendChild(timestampDiv);

    emails_view.appendChild(emailDiv);
    emailDiv.addEventListener('click', () => load_email_id(email.id, mailbox))

  })
}
async function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view-by-id').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  const emails = await get_emails(mailbox)
  render_emails(emails, mailbox);
}

async function get_email_id(id) {
  const response = await fetch(`/emails/${id}`)
  const email = await response.json()
  return email
}

function mark_read(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}
function render_email_id(email, mailbox) {
  const email_view = document.querySelector('#email-view-by-id')
  email_view.innerHTML = ''
  const emailinfo = document.createElement('div')
  emailinfo.className = 'email-info'

  const sender = document.createElement('h4');
  sender.className = 'sender';
  sender.textContent = `From: ${email.sender}`;

  const recipients = document.createElement('h4');
  recipients.className = 'recipients';
  recipients.textContent = `To: ${email.recipients}`;

  const subject = document.createElement('h4');
  subject.className = 'subject';
  subject.textContent = `Subject: ${email.subject}`;

  const timestamp = document.createElement('h4');
  timestamp.className = 'timestamp';
  timestamp.textContent = `At : ${email.timestamp}`;
  emailinfo.appendChild(sender);
  emailinfo.appendChild(recipients);
  emailinfo.appendChild(subject);
  emailinfo.appendChild(timestamp);
  email_view.appendChild(emailinfo);

  const reply = document.createElement('button');
  reply.className = 'reply btn btn-sm btn-outline-primary'
  reply.innerHTML = 'Reply'
  email_view.appendChild(reply)
  email_view.appendChild(document.createElement('hr'));

  const email_body = document.createElement('div');
  email_body.className = 'email-body'
  email_body.textContent = email.body;

  if (mailbox === 'inbox') {
    const arch = document.createElement('button');
    arch.className = 'archive btn btn-sm btn-outline-danger'
    arch.innerHTML = 'Archive'
    arch.addEventListener('click', () => {
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true
        })
      })
      load_mailbox('inbox');
    })
    emailinfo.appendChild(arch)
  }
  else if (mailbox === 'archive') {
    const unarch = document.createElement('button');
    unarch.className = 'unarchive btn btn-sm btn-outline-secondary'
    unarch.innerHTML = 'Unarchive'
    unarch.addEventListener('click', () => {
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false
        })
      })
      load_mailbox('inbox');
    })
    emailinfo.appendChild(unarch)

  }
  email_view.appendChild(email_body);

}
async function load_email_id(id, mailbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view-by-id').style.display = 'block';

  const email = await get_email_id(id)
  render_email_id(email, mailbox)
  mark_read(id)

}