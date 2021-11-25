import { useRouter } from 'next/router'
import getGalleries from '../../lib/get-galleries'
import GalleryPreview from '../../components/gallery-preview'
import Tag from '../../components/tag'

export async function getStaticProps() {
  const galleries = await getGalleries()
  return {
    props: {
      galleries
    },
    revalidate: 600
  }
}

export default function Galleries({ galleries }) {

  const router = useRouter()
  const activeTags = (router.query.tags || '').split(',').filter(Boolean)

  if (activeTags.length) {
    galleries = galleries.filter(gallery => {
      return activeTags.every(tag => gallery.tags.includes(tag))
    })
  }

  const tags = galleries
    .reduce((tags, gallery) => [...tags, ...gallery.tags], [])
    .filter(tag => !activeTags.includes(tag))
    .reduce((counts, value) => {
      const existing = counts.find(tag => tag.value === value)
      if (!existing) {
        counts.unshift({ value, count:1 })
      } else {
        existing.count++
      }
      return counts
    }, [])
    .sort((a, b) => b.count - a.count);

  const addTag = tag => {
    router.replace(`?tags=${[...activeTags, tag].join(',')}`);
  }
  const removeTag = tag => {
    router.replace(`?tags=${activeTags.filter(t => t !== tag).join(',')}`);
  }
  const toggleTag = tag => {
    return activeTags.includes(tag) ? removeTag(tag) : addTag(tag)
  }

  return (
    <section>
      <h1>Browse galleries</h1>
      <div className="mb-12 flex items-center flex-wrap">
        <span className="mr-2">Tags:</span>
        {
          activeTags.map(tag => <Tag key={tag} onClick={() => toggleTag(tag)} selected={true} label={tag} />)
        }
        {
          tags.map(tag => <Tag key={tag.value} onClick={() => toggleTag(tag.value)} selected={false} label={tag.value} count={tag.count} />)
        }
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-12">
        {
          galleries.map(gallery => (
            <GalleryPreview key={gallery.id} {...gallery} />
          ))
        }
        </div>
    </section>
  )
}
