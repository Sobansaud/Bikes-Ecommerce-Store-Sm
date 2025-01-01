
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { IoMdSettings } from "react-icons/io";
import { FaSearchLocation } from "react-icons/fa";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { AiOutlineDollarCircle } from "react-icons/ai";
import debounce from "lodash/debounce";

interface carDataType {
  name: string;
  price: string;
  features: string;
  pictures: string[];
  route: string;
  brand: string;
}

const Cart = () => {
  const [index, setIndex] = useState<number>(-1);
  const [icon, setIcon] = useState<boolean>(false);
  const [data, setData] = useState<carDataType[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCartData = JSON.parse(localStorage.getItem("cartData") || "[]");
      setData(storedCartData);
    }
  }, []);

  // Debounced function for removing car
  const debouncedRemoveCar = useCallback(
    debounce((route: string) => {
      const updatedCarRoutes: carDataType[] = data.filter(
        (val) => val.route !== route
      );
      localStorage.setItem("cartData", JSON.stringify(updatedCarRoutes));
      setData(updatedCarRoutes);
    }, 300),
    [data] // Now data is a dependency of this function
  );

  // Function to empty the cart data
  const emptyCarData = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartData", "[]");
      setData([]); // Clear state as well
    }
  };

  return (
    <div
      className="relative h-auto w-full bg-black pt-16 bg-no-repeat bg-center bg-cover overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/backpic1.jpg)",
      }}
    >
      <Link href="/">
        <button
          className={`fixed bottom-5 right-5 z-[2000] h-12 w-12 bg-red-900 rounded-full items-center justify-center ${data && data.length > 0 ? "flex" : "hidden"}`}
          title="Remove All"
          onClick={emptyCarData}
        >
          <IoIosRemoveCircleOutline className="h-4/5 w-4/5 text-white" />
        </button>
      </Link>

      <h1 className="text-white w-full text-7xl text-center my-6 font-bold txt uppercase drop-shadow-txt">
        Cart
      </h1>

      <div className="flex gap-8 flex-wrap items-center justify-center p-5 overflow-hidden">
        {/* Empty Cart Message */}
        <div
          className={`relative h-[440px] w-full flex flex-col gap-5 items-center justify-start py-4 ${data && data.length > 0 ? "hidden" : ""}`}
        >
          <h1 className="uppercase font-semibold text-white/60 sm:text-3xl text-2xl text-center w-full">
            Your Cart Is Empty, Please Add Something!
          </h1>
          <Link href="/Inventory">
            <button className="py-2 px-4 rounded-md bg-red-800 text-white font-semibold capitalize shadow-car">
              Inventory
            </button>
          </Link>
        </div>

        {/* Cart Items */}
        {data.length > 0 &&
          data.map((val: carDataType, ind: number) => (
            <div key={ind} className="h-[440px] w-[380px] overflow-hidden shadow-car rounded-xl">
              <motion.div
                initial={{ transform: "translateY(100%)" }}
                animate={{ transform: "translateY(0%)" }}
                transition={{ duration: 0.5, delay: ind * 0.15 }}
                className="relative h-full w-full bg-black overflow-hidden p-4 text-white bg-no-repeat bg-center bg-cover bg-[url('/d.png')] border-2 border-black"
              >
                {/* SETTINGS BUTTON */}
                <div
                  className="absolute bottom-5 right-5 h-16 w-16 cursor-pointer z-50 rounded-full flex items-end justify-end"
                  onClick={() => {
                    setIcon((prevIcon) => !prevIcon);
                    setIndex(ind);
                  }}
                >
                  <IoMdSettings
                    className={`h-1/2 w-1/2 text-red-800 duration-500 ${icon && index === ind ? "rotate-180" : "-rotate-180"}`}
                  />
                </div>

                {/* REMOVE CAR BUTTON */}
                <div
                  className={`z-30 absolute h-10 w-10 rounded-full duration-500 backdrop-blur-glass bg-black/40 border-[1px] border-red-800 flex items-center justify-center cursor-pointer ${icon && index === ind ? "bottom-5 xxs:right-28 right-24 opacity-100" : "bottom-5 right-5 opacity-0"}`}
                  onClick={() => {
                    debouncedRemoveCar(val.route);
                    setIndex(ind);
                    setIcon(false);
                  }}
                  title="Remove Car"
                >
                  <IoIosRemoveCircleOutline className="h-3/5 w-3/5 text-red-800" />
                </div>

                {/* VIEW CAR BUTTON */}
                <Link href={`/Inventory/${val.brand}/${val.route}`}>
                  <div
                    className={`z-30 absolute h-10 w-10 rounded-full duration-500 backdrop-blur-glass bg-black/40 border-[1px] border-red-800 flex items-center justify-center cursor-pointer ${icon && index === ind ? "xxs:bottom-28 bottom-24 right-5 opacity-100" : "bottom-5 right-5 opacity-0"}`}
                    title="View Car"
                  >
                    <FaSearchLocation className="h-1/2 w-1/2 text-red-800" />
                  </div>
                </Link>

                {/* BUY CAR BUTTON */}
                <Link href="/Buy">
                  <div
                    className={`z-30 absolute h-10 w-10 rounded-full duration-500 backdrop-blur-glass bg-black/40 border-[1px] border-red-800 flex items-center justify-center cursor-pointer ${icon && index === ind ? "xxs:bottom-24 bottom-20 xxs:right-24 right-20 opacity-100" : "bottom-5 right-5 opacity-0"}`}
                    title="Buy Car"
                  >
                    <AiOutlineDollarCircle className="h-3/5 w-3/5 text-red-800" />
                  </div>
                </Link>

                {/* Car Image */}
                <div className={`relative h-[60%] w-full bg-no-repeat bg-center bg-contain ${val.pictures[0]} rounded-md bg-transparent`}></div>

                {/* Car Info */}
                <div className="relative">
                  <h1 className="text-2xl font-semibold my-2">{val.name}</h1>
                  <h2 className="text-lg my-2 text-white/70">{val.price}</h2>
                </div>
              </motion.div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Cart;














