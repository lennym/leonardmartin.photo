export default function TimeStamp({ timestamp }) {

  const date = new Date(timestamp).toLocaleDateString('en-gb', { year: 'numeric', month: 'long', day: 'numeric' })

  return <time dateTime={timestamp}>{ date }</time>
}
