export default function TimeStamp({ timestamp, showTime=false }) {
  const inst = new Date(timestamp)
  const date = inst.toLocaleDateString('en-gb', { year: 'numeric', month: 'long', day: 'numeric' })
  const time = inst.toLocaleTimeString('en-gb', { hour: '2-digit', minute: '2-digit', hour12: false })
  return <time dateTime={timestamp}>{ date } { showTime && time }</time>
}
