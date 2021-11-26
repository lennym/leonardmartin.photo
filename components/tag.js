import Close from './icons/close'

export default function Tag({ className = '', label, count, selected = false, onClick }) {

  const color = selected ? 'bg-red-500 text-gray-200' : 'bg-gray-200 text-gray-600'

  return <span className={`${className} p-1 pl-3 mr-2 mb-1 ${color} rounded-full cursor-pointer inline-flex shadow-md`} onClick={onClick}>
    <span className="inline-block p-1 text-sm text-inherit">{ label }</span>
    { count && !selected && <span className="ml-2 inline-block bg-white rounded-full font-bold text-sm w-7 p-1 text-center text-gray-600">{ count }</span> }
    { selected && <span className="ml-2 inline-block bg-white rounded-full font-bold text-sm text-center w-7 p-1 text-center text-gray-200"><Close size="20" /></span> }
  </span>
}