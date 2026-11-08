import Link from 'next/link';

export default function AdminMenu({ className = '' }) {
  return (
    <ul className={`${className} rounded-md mb-4 list-none`}>
      <li>
        <Link
          href="/admin/galleries"
          className="p-2 block border-t hover:bg-white"
        >
          Galleries
        </Link>
      </li>
      <li>
        <Link
          href="/admin/orders"
          className="p-2 block border-t hover:bg-white"
        >
          Orders
        </Link>
      </li>
      <li>
        <Link
          href="/api/admin/logout"
          className="p-2 block border-t border-b hover:bg-white"
        >
          Log out
        </Link>
      </li>
    </ul>
  );
}
