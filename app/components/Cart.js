import React, { Component, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { firestoreConnect } from 'react-redux-firebase';

import { connect } from 'react-redux';
import { compose } from 'redux';
import '../style.css';

const Title = styled.h5`
  font-size: 20px;
  margin: 1rem;
  color:#4e4e4e;
`;
const CartWrapper = styled.div`
  background: #e0e0e0;
  width: 430px;
  padding: .5rem 1rem;
  text-align: center;
  margin: 1rem;
  max-height: 500px;
  overflow-y: auto;
  
`;

const IncrementBtn = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin: 0 10px;
  color: #ff3e6c;
  cursor: pointer;
`;
const DecrementBtn = styled(IncrementBtn)``;
const QuantityField = styled.span`
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  font-size: 15px;
  color: #ff3e6c;
`;

class Cart extends Component {
  constructor(props) {
    super(props);
    this.incrementQty = this.incrementQty.bind(this);
    this.decrementQty = this.decrementQty.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.updateCartTotal = this.updateCartTotal.bind(this);

    this.state = {
      total: 0,
      addedItems: []
    };

  }
  componentWillReceiveProps() { 
    this.setState({
      addedItems: this.props.addedItems
    });
    
  }
  render() {
    return (

      <CartWrapper  >
        {
          <div>
            <div className="container">
              <Title>ORDER</Title>
              <hr className="my-3" />
              {this.updateCart()}
              <div className="row">
                <div className="col-md-12">{this.updateCartTotal()}</div>
              </div>
            </div>
          </div>
        }
      </CartWrapper>
    );
  }

  updateCartTotal() {
    if (this.props.addedItems) {
      return (
        <Title>
          Total :{' '}
          {this.props.addedItems.reduce((a, b) => a + b.price * b.quantity, 0)}
        </Title>
      );
    }
  }

  updateCart() {
    if (this.props.addedItems) {
      return this.props.addedItems.map((item, key) => (
        <div key={key}>
          <ul className="cartItemWrapper">
            <li className="productImage">
              <img src={item.image} className="img-fluid" alt="" />
            </li>
            <li className="productName">
              <p>{item.name}</p>
            </li>
            <li className="productQuantityWrapper">
              <DecrementBtn
                onClick={() => this.decrementQty(item)}
              >
                <span className="increment">-</span>
              </DecrementBtn>
              <QuantityField>
                <span className="quantity">{item.quantity} </span>
              </QuantityField>
              <IncrementBtn onClick={() => this.incrementQty(item)}>
                <span className="increment">+</span>
              </IncrementBtn>
            </li>
            <li className="productPrice">
              <p>{item.price}</p>
            </li>
            <li className="productDelete">
              <i
                className="fa fa-trash-o"
                aria-hidden="true"
                onClick={() => {
                  this.deleteItem(item.id);
                }}
              />
            </li>
          </ul>
          <hr className="my-2" />
        </div>
      ));
    }
  }

  deleteItem(id) {
    this.props.addedItems.filter(item => {
      if (item.id === id) {
        this.props.firestore.delete({ collection: 'cart', doc: id });
      }
    });
  }

  incrementQty(product) {
    this.props.firestore.set(
      { collection: 'cart', doc: product.id },
      { ...product, quantity: product.quantity + 1 },
    );
  }

  decrementQty(product) {
    if (product.quantity <= 1) {
      this.props.firestore.delete({ collection: 'cart', doc: product.id });
    }
    else {
      this.props.firestore.set(
        { collection: 'cart', doc: product.id },
        { ...product, quantity: product.quantity - 1 },
      );
    }

  }
}

const mapStateToProps = state => ({
  addedItems: state.firestore.ordered.cart,
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  memo,
  firestoreConnect([{ collection: 'cart' }]),
)(Cart);
