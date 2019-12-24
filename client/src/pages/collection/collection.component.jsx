import React from 'react';
import './collection.styles.scss';

const CollectionPage = ({ match }) => {
  return (
    <div className="collection-page">
      <h2 className="title">{match.params.collectionID}</h2>
    </div>
  );
};

export default CollectionPage;
