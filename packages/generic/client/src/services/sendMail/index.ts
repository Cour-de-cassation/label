export { sendMail };

function sendMail({ email, subject, body }: { email: string; subject: string; body: string }) {
  const mailto = document.createElement('a');
  mailto.href = `mailto:${email}?subject=${encodeURI(subject)}&body=${encodeURI(body)}`;
  mailto.click();
}
