import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import GalleryPreview from '../components/gallery-preview';
import getGalleries from '../lib/get-galleries';

export async function getStaticProps() {
  const galleries = await getGalleries();
  return {
    props: {
      header: false,
      galleries: galleries.slice(0, 6),
    },
    revalidate: 600,
  };
}

export default function Home({ galleries }) {
  return (
    <Fragment>
      <section className="lg:flex items-center justify-between mt-0 mb-8 lg:mb-16 py-6 bg-white shadow-sm">
        <div className="mr-6 lg: mr-12">
          <h1 className="text-gray-500 mb-2">
            leonardmartin<span className="text-red-500">.photo</span>
          </h1>

          <p className="mb-12 lg:mb-16 text-gray-500 text-lg md:text-2xl">
            Sports photographer
          </p>

          <p className="mb-12 flex flex-wrap">
            <Link href="/galleries" className="btn mb-2">
              Browse galleries
            </Link>
          </p>
        </div>
        <div className="flex-1 grid grid-rows-2 grid-cols-2 gap-4 max-w-screen-lg">
          <div className="w-full aspect-w-3 aspect-h-2 rounded-md drop-shadow-md overflow-hidden">
            <Image src="/images/hero1.jpg" layout="fill" objectFit="cover" />
          </div>
          <div className="w-full aspect-w-3 aspect-h-2 rounded-md drop-shadow-md overflow-hidden">
            <Image src="/images/hero2.jpg" layout="fill" objectFit="cover" />
          </div>
          <div className="w-full aspect-w-3 aspect-h-2 rounded-md drop-shadow-md overflow-hidden">
            <Image src="/images/hero3.jpg" layout="fill" objectFit="cover" />
          </div>
          <div className="w-full aspect-w-3 aspect-h-2 rounded-md drop-shadow-md overflow-hidden">
            <Image src="/images/hero4.jpg" layout="fill" objectFit="cover" />
          </div>
        </div>
      </section>

      <section>
        <h2>Latest galleries</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-12">
          {galleries.slice(0, 2).map((gallery) => (
            <GalleryPreview
              className="md:col-span-2"
              key={gallery.id}
              {...gallery}
            />
          ))}
        </div>
        <p>
          <Link href="/galleries" className="btn">
            View all galleries
          </Link>
        </p>
      </section>
    </Fragment>
  );
}
