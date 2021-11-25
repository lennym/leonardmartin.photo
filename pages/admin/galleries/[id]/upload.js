import { Fragment } from 'react'
import Link from 'next/link'
import { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Dropzone from 'react-dropzone'
import md5 from 'spark-md5'
import exif from 'exif-parser'
import { encode } from 'base64-arraybuffer'
import { pick } from 'lodash'

import { withAuthGateway } from '../../../../lib/session'
import { withGallery } from '../../../../lib/get-gallery'

import Image from '../../../../components/image'

export const getServerSideProps = withAuthGateway(withGallery())

export default function Upload({ id, title }) {

  const dispatch = useDispatch()
  const { uploads } = useSelector(state => state)

  const hash = file => {
    const hasher = new md5.ArrayBuffer()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = e => {
        hasher.append(e.target.result)
        const result = hasher.end();
        resolve(result)
      }
      reader.onerror = reject
    })
  }

  const getExif = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = e => {
        const parser = exif.create(e.target.result)
        resolve(parser.parse())
      }
      reader.onerror = reject
    })
  }

  const onDrop = useCallback(async (files) => {
    for await (const file of files) {
      const exifData = await getExif(file)
      file.thumbnail = encode(exifData.getThumbnailBuffer())
      file.exif = pick(exifData.tags, 'CreateDate', 'ISO', 'Model', 'LensModel', 'FNumber', 'ExposureTime')
      dispatch({ type: 'ADD_FILE', file })
    }
    for await (const file of files) {
      dispatch({ type: 'START_FILE', file })

      const checksum = await hash(file)
      const body = new FormData()
      body.append('exif', JSON.stringify(file.exif))
      body.append('file', file)
      const result = await fetch(`/api/admin/galleries/${id}/upload`, {
        method: 'POST',
        body,
        headers: {
          'x-md5': checksum,
          'x-filename': file.path
        }
      })
      const json = await result.json()
      dispatch({ type: 'FINISH_FILE', file: { ...file, skipped: json.skipped } })
    }
  }, [])

  const isUploading = !!Object.keys(uploads).length

  const UploadStatus = ({ path, started, completed, skipped, thumbnail }) => {
    let state = '...'
    if (started) {
      state = 'Uploading...'
    }
    if (completed) {
      state = '✅'
    }
    if (skipped) {
      state = '🕶'
    }
    return <tr className="text-gray-400 text-base">
      <td className="px-2 py-1 w-12"><Image src={`data:image/jpeg;base64,${thumbnail}`} className="w-12" /></td>
      <td className="px-2 py-1">{ path }</td>
      <td className="px-2 py-1 text-right">{ state }</td>
    </tr>
  }

  const UploadList = () => {
    if (!isUploading) {
      return null;
    }
    return (
      <table className="mb-6 border w-full">
        <tbody>
          {
            Object.values(uploads).map(upload => <UploadStatus {...upload} key={upload.path} />)
          }
        </tbody>
      </table>
    )
  }

  return (
    <Fragment>
      <h1>{ title }</h1>
      <UploadList />
      <Dropzone onDrop={onDrop}>
        {({getRootProps, getInputProps}) => (
          <div className="border rounded-md bg-gray-200 mb-12 flex justify-center items-center p-8">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p className="m-0">Drag 'n' drop some files here, or click to select files</p>
            </div>
          </div>
        )}
      </Dropzone>
      <p>
        <Link href={`/admin/galleries/${id}`}><a className="btn">Back</a></Link>
      </p>
    </Fragment>
  )
}
