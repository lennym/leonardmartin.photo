import { Fragment } from 'react';

import { withGallery } from '../../../../lib/get-gallery';
import { withAuthGateway } from '../../../../lib/session';

import EditGallery from '../../../../components/admin/edit-gallery';

export const getServerSideProps = withAuthGateway(withGallery());

export default function Gallery({
  id,
  title,
  updated,
  public: published,
  tags = [],
}) {
  return (
    <Fragment>
      <h1>{title}</h1>
      <EditGallery
        id={id}
        title={title}
        updated={updated}
        published={published}
        tags={tags.join(', ')}
        cancel={`/admin/galleries/${id}`}
      />
    </Fragment>
  );
}
