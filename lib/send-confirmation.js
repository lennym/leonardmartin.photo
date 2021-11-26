import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

export default async function(to, orderId) {
  const msg = {
    to,
    from: 'orders@leonardmartin.photo',
    subject: 'Your photos are ready to download',
    text: `Thank you for your order from leonardmartin.photo.

    Your photos are available to download now from https://leonardmartin.photo/orders/${orderId}`,
    html: `
    <p>Thank you for your order from leonardmartin.photo.</p>
    <p>Your photos are available to <a href="https://leonardmartin.photo/orders/${orderId}">download now</a></p>
    `,
  }
  try {
    return sendgrid.send(msg)
  } catch(error) {
    console.error(error)
  }
}