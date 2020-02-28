/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { Component, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import messages from './messages';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import ProductList from '../../components/ProductList';
import Cart from '../../components/Cart';
import 'react-notifications/lib/notifications.css';
const Title = styled.div`
  font-size: 2.5em;
  text-align: left;
  color: #ff3e6c;
  padding: 20px;
  background: #e0e0e0;
  margin-bottom: 30px;
`;

const MainWrapper = styled.div`
  position: relative;
  width:100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
`;
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const ListWrapper = styled.div`
flex: 1;
`;
const CartWrapper = styled.div`
flex: 0 1 300px;
`;
class HomePage extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        <Title>
          <div className="header">
            <FormattedMessage {...messages.header} />
          </div>
        </Title>
        <MainWrapper className="container-fluid">
          <Row>
            <ListWrapper>
              <ProductList />
            </ListWrapper>
            {this.props.addedItems && this.props.addedItems.length > 0 &&
              <CartWrapper>
                <Cart />
              </CartWrapper>
            }
          </Row>
        </MainWrapper>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  addedItems: state.firestore.ordered.cart,
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  memo,
  firestoreConnect([
    { collection: 'cart' },
  ])
)(HomePage);
