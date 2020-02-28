import React, { Component, memo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const ProductName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin: 10px 0 0 0;
  color:#777
`;
const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color:#777
`;

const CartButton = styled.button`
  font-weight: 500;
  font-size: 0.7rem;
  text-transform: uppercase;
  border-radius: 2px;
  background-color: #ff3e6c;
  color: #fff;
  letter-spacing: 0.3px;
  cursor: pointer;
  padding: 8px 12px;
  border: none;
`;


const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: .0625rem solid rgba(0,0,0,.05);
  border-radius: .25rem;
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
  margin: 1rem;
  padding: .5rem;
`;
const ImageWrapper = styled.div`
  padding: .25rem;
  background-color: #fff;
  border: .0625rem solid #dee2e6;
  border-radius: .25rem;
  box-shadow: 0 1px 2px rgba(0,0,0,.075);
  width:200px;
  @media (max-width: 900px) {
    width: 190px;
  }
  @media (max-width: 500px) {
    width: 140px;
  }
  
`;
const Img = styled.img`
  width: 100%; 
`;

class ProductList extends Component {
  constructor(props) {
    super(props);
  }
  
  createNotification = (type, payload) => {
    switch (type) {
      case 'success':
        NotificationManager.success(payload);
        break;
      case 'error':
        NotificationManager.error('Error message', 'Click me!', 5000, () => {
          alert('callback');
        });
        break;
    }
  }
  handleCartBtnClick = product => {
    if (this.props.addedItems && this.props.addedItems.length) {      
      let addedItem = this.props.addedItems.find(item=> item.id === product.id);
      if(addedItem){
        this.props.firestore.set({ collection: 'cart', doc: product.id }, { ...product, quantity: addedItem.quantity + 1 });
        this.createNotification('success', 'Quantity updated');
        
      }else{
        this.props.firestore.set({ collection: 'cart', doc: product.id }, { ...product, quantity: 1});
        this.createNotification('success', 'Item added to your cart');
      }

    } else {
      this.props.firestore.set({ collection: 'cart', doc: product.id }, { ...product, quantity: 1 });
      this.createNotification('success', 'Item added to your cart');

    }
  }
  render() {
    return (
      <div>
        <Row >
          {this.fetch_Data()}
          <NotificationContainer/>
        </Row>
      </div>
    )
  }

  fetch_Data() {
    if (this.props.productsList) {
      return (
        this.props.productsList.map((product, key) => (
          <Card key={key} data-id={product.id}>
            <ImageWrapper><Img src={product.image}  ></Img></ImageWrapper>

            <ProductName>{product.name}</ProductName>
            <ProductPrice className="m-0" key={product._id}>${product.price}</ProductPrice>
            <CartButton onClick={() => this.handleCartBtnClick(product)}> Add to bag</CartButton>
          </Card>
        )
        )
      )
    }
  }
}

const mapStateToProps = state => ({
  productsList: state.firestore.ordered.products,
  addedItems: state.firestore.ordered.cart,
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  memo,
  firestoreConnect([
    { collection: 'products' },
    { collection: 'cart' },
  ])
)(ProductList);
