import Link from 'next/link'
import { useState } from 'react'

export default function EditGallery({ id, title = '', updated, published = false, tags = '', cancel = '/admin' }) {

  const [errors, setErrors] = useState({});

  const validate = e => {
    const errors = {}
    setErrors({})
    if (!e.target.id.value.match(/^[a-z0-9\-]+$/i)) {
      errors.id = 'Enter a valid id'
    }
    if (e.target.updated.value && !e.target.updated.value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
      errors.updated = 'Enter a valid date'
    }
    if (Object.keys(errors).length) {
      setErrors(errors)
      e.preventDefault()
    }
  }

  const ErrorMessage = ({ children }) => {
    if (!children) {
      return null
    }
    return <p className="mb-0 text-red-500 text-sm">{ children }</p>
  }

  return <form onSubmit={validate} action={`/api/admin/galleries/${id}`} method="post">
    <div className="grid w-full gap-4 mb-6">

      <label htmlFor="id">ID</label>
      <ErrorMessage>{ errors.id }</ErrorMessage>
      <input type="text" className="p-2 border border-gray-200 rounded-md" name="id" id="id" defaultValue={id === 'new' ? '' : id} disabled={id !== 'new'} />

      <label htmlFor="title">Title</label>
      <ErrorMessage>{ errors.title }</ErrorMessage>
      <input type="text" className="p-2 border border-gray-200 rounded-md" name="title" id="title" defaultValue={title} />

      <label htmlFor="updated">Date</label>
      <ErrorMessage>{ errors.updated }</ErrorMessage>
      <input type="text" className="p-2 border border-gray-200 rounded-md" name="updated" id="updated" defaultValue={updated} />

      <label htmlFor="tags">Tags</label>
      <input type="text" className="p-2 border border-gray-200 rounded-md" name="tags" id="tags" defaultValue={tags} />

      <div className="flex items-center">
        <input type="checkbox" className="border border-gray-200 rounded-md w-8 h-8 mr-2" name="public" id="public" value="true" defaultChecked={published} />
        <label htmlFor="public">Published</label>
      </div>

    </div>
    <p><button className="btn" type="submit">Save</button> <Link href={cancel}><a>Cancel</a></Link></p>
  </form>
}
