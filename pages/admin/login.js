import { Fragment, useState } from 'react'
import Link from 'next/link'
import { withSessionSsr } from '../../lib/session'
import { useRouter } from 'next/router'

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  if (req.session.admin) {
    return {
      redirect: {
        destination: `/admin`
      }
    }
  }
  return { props: {} }
})


export default function Login({  }) {

  const [error, setError] = useState(false)
  const router = useRouter()

  const submit = async e => {
    e.preventDefault()
    const password = e.target.password.value
    const body = JSON.stringify({ password })
    const success = await fetch(`/api/admin/login`, { method: 'post', body, headers: { 'Content-Type': 'application/json' } })
    if (success.status !== 200) {
      return setError(true)
    }
    router.push('/admin')
  }

  return (
    <Fragment>
      <h1>Login</h1>
      <form onSubmit={e => submit(e)}>
        <div className="grid w-full gap-4 mb-6">
          <label htmlFor="password">Password</label>
          { error && <p className="mb-0 text-red-500 text-sm">There was a problem with the password provided.</p> }
          <input type="password" className="p-2 border border-gray-200 rounded-md" name="password" id="password" />

        </div>
        <p>
          <button className="btn" type="submit">Log in</button>
          <Link href="/"><a>Exit</a></Link>
        </p>
      </form>
    </Fragment>
  )
}
