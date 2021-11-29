import Link from 'next/link'

export default function AdminMenu({ className = '' }) {
  return <ul className={`${className} rounded-md mb-4`}>
    <li>
      <Link href="/admin/galleries"><a className="p-2 block border-t hover:bg-white">Galleries</a></Link>
    </li>
    <li>
      <Link href="/admin/orders"><a className="p-2 block border-t hover:bg-white">Orders</a></Link>
    </li>
    <li>
      <Link href="/api/admin/logout"><a className="p-2 block border-t border-b hover:bg-white">Log out</a></Link>
    </li>
  </ul>
}
