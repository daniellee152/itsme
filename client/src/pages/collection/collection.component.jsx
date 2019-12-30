import React, { Component } from 'react';
import './collection.styles.scss';
import axios from 'axios';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CollectionItem from '../../components/collection-item/collection-item.component';
import { selectItems } from '../../redux/shop/shop.selectors';
import { getCollection } from '../../redux/shop/shop.actions';

class CollectionPage extends Component {
  componentDidMount() {
    const { match, getCollection } = this.props;
    axios({
      method: 'get',
      url: `http://localhost:9000/api/v1/shop/${match.params.collectionID}`,
      validateStatus: status => {
        return true; // I'm always returning true, you may want to do it depending on the status received
      }
    })
      .catch(error => {})
      .then(res => {
        getCollection(res.data.collection);
      });
  }

  render() {
    const { match, items } = this.props;
    if (!items) {
      return <div>No Collection</div>;
    }
    return (
      <div className="collection-page">
        <h2 className="title">{match.params.collectionID}</h2>
        <div className="items">
          {Object.values(items).forEach(item => (
            <CollectionItem key={item._id} item={item} />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  items: selectItems
});

const mapDispatchToProps = dispatch => ({
  getCollection: collection => dispatch(getCollection(collection))
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionPage);
