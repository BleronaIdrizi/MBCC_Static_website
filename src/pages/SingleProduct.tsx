import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  ProductItem,
  QuantityInput
} from "../components";
import { addProductToTheCart } from "../features/cart/cartSlice";
import { useAppDispatch } from "../hooks";
import { formatCategoryName } from "../utils/formatCategoryName";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";

const SingleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  // defining default values for input fields
  const [size ] = useState<string>("xs");
  const [color ] = useState<string>("black");
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // defining HOC instances
  // const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const response = await fetch(
        `http://localhost:3000/products/${params.id}`
      );
      const data = await response.json();
      setSingleProduct(data);
    };

    const fetchProducts = async () => {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchSingleProduct();
    fetchProducts();
  }, [params.id]);

  const handleAddToCart = () => {
    if (singleProduct) {
      dispatch(
        addProductToTheCart({
          id: singleProduct.id + size + color,
          image: singleProduct.image,
          title: singleProduct.title,
          category: singleProduct.category,
          price: singleProduct.price,
          quantity,
          size,
          color,
          popularity: singleProduct.popularity,
          stock: singleProduct.stock,
          shortDescription: singleProduct.shortDescription,
          productDetails: singleProduct.productDetails,
          deliveryDetails: singleProduct.deliveryDetails,
          deliveryDays: singleProduct.deliveryDays
        })
      );
      toast.success("Product added to the cart");
    }
  };

  function calculateDeliveryDate(deliveryDays: any): React.ReactNode {
    const today = new Date();
    if (deliveryDays) {
      const deliveryDate = new Date(today.setDate(today.getDate() + deliveryDays));
      return format(deliveryDate, "EEEE, MMMM d")
    } else return ''
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3">
      <div className="grid grid-cols-3 gap-x-8 max-lg:grid-cols-1">
        <div className="lg:col-span-2">
          <img
            src={`/src/assets/${singleProduct?.image}`}
            alt={singleProduct?.title}
            className="max-w-[800px] max-h-[800px] w-full h-auto object-contain object-center"
          />
        </div>
        <div className="w-full flex flex-col gap-5 mt-9">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl">{singleProduct?.title}</h1>
            <div className="flex justify-between items-center">
              <p className="text-base text-secondaryBrown">
                {formatCategoryName(singleProduct?.category || "")}
              </p>
              <p className="text-base font-bold">${singleProduct?.price}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* <SelectInputUpgrade
              selectList={[
                { id: "xs", value: "XS" },
                { id: "sm", value: "SM" },
                { id: "m", value: "M" },
                { id: "lg", value: "LG" },
                { id: "xl", value: "XL" },
                { id: "2xl", value: "2XL" },
              ]}
              value={size}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSize(() => e.target.value)
              }
            /> */}
            {/* <SelectInputUpgrade
              selectList={[
                { id: "black", value: "BLACK" },
                { id: "red", value: "RED" },
                { id: "blue", value: "BLUE" },
                { id: "white", value: "WHITE" },
                { id: "rose", value: "ROSE" },
                { id: "green", value: "GREEN" },
              ]}
              value={color}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setColor(() => e.target.value)
              }
            /> */}

            <QuantityInputUpgrade
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity(() => parseInt(e.target.value))
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button mode="brown" text="Add to cart" onClick={handleAddToCart} />
            <p className="text-secondaryBrown text-sm text-right">
              <p>Delivery estimated on {calculateDeliveryDate(singleProduct?.deliveryDays)}</p>
            </p>
          </div>
          <div>
            <Dropdown dropdownTitle="Description">
              {singleProduct?.shortDescription}
            </Dropdown>

            <Dropdown dropdownTitle="Product Details">
              {singleProduct?.productDetails}
            </Dropdown>

            <Dropdown dropdownTitle="Delivery Details">
              {singleProduct?.deliveryDetails}
            </Dropdown>
          </div>
        </div>
      </div>

      {/* similar products */}
      <div>
        <h2 className="text-black/90 text-5xl mt-24 mb-12 text-center max-lg:text-4xl">
          Similar Products
        </h2>
        <div className="flex flex-wrap justify-between items-center gap-y-8 mt-12 max-xl:justify-start max-xl:gap-5 ">
          {products.slice(0, 3).map((product: Product) => (
            <ProductItem
              key={product?.id}
              id={product?.id}
              image={product?.image}
              title={product?.title}
              category={product?.category}
              price={product?.price}
              popularity={product?.popularity}
              stock={product?.stock}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default SingleProduct;
