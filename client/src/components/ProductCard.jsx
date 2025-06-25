import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const ProductCard = ({ product, onAdd, onDelete, onEdit }) => {
  const header = <img alt={product.name} src={product.image || 'https://via.placeholder.com/150'} style={{ width: '100%' }} />;

  return (
    <Card title={product.name} subTitle={<Tag severity="success">₹{product.price}</Tag>} header={header} className="p-mb-3" style={{ backgroundColor: 'white', color: 'green' }}>
      <div className="p-d-flex p-ai-center p-jc-between">
        <Button label="Add to Cart" icon="pi pi-shopping-cart" onClick={() => onAdd(product)} className="p-button-success p-mr-2" />
        {onEdit && <Button label="Edit" icon="pi pi-pencil" onClick={() => onEdit(product)} className="p-button-warning p-mr-2" />}
        {onDelete && <Button label="Delete" icon="pi pi-trash" onClick={() => onDelete(product._id)} className="p-button-danger" />}
      </div>
    </Card>
  );
};

export default ProductCard;
