
'use client'; // This marks this file as a client component

import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";
import { PiEnvelopeFill } from "react-icons/pi";
import { MdPhone } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import {
  hayabusaBikeData,
  kawasakiBikeData,
  royalEnfieldBikeData,
  BikeFeautersData,
  BikeRatings,
  descriptionFunc,
  BikeDescriptions,
  ratingFunc,
  shufflingFeatures,
  setReport,
} from "../../bikeData";
import Link from "next/link";

// Define the Params interface
interface Params {
  manufacture: string;
  bikes: string;
}

interface BikeDataType {
  name: string;
  price: string;
  features: string;
  pictures: string[];
  route: string;
  brand: string;
}

interface BikeFeautersType {
  img: string;
  name: string;
}


export interface PageProps {
  params: Params;
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [BikeData, setBikeData] = useState<BikeDataType | null>(null);
  const [btnAnim, setBtnAnim] = useState(false);
  const [slide, setSlide] = useState(0);
  const [leftDis, setLeftDis] = useState(true);
  const [rightDis, setRightDis] = useState(false);
  const [btnDis, setBtnDis] = useState(false);
  const [startAnimate, setStartAnimate] = useState(false);
  const [featureDis, setFeatureDis] = useState(false);
  const [starsArrangment, setStarsArrangment] = useState<string[]>([]);
  const [BikeFeauters, setBikeFeauters] = useState<BikeFeautersType[] | null>(null);

  useEffect(() => {
    if (params.manufacture && params.bikes) {
      const bikeData = checkBikeData(params.manufacture, params.bikes);
      setBikeData(bikeData);
    }
  }, [params]);

  const checkBikeData = (manufacture: string, bikes: string): BikeDataType | null => {
    let selectedModel: BikeDataType[] = [];
    switch (manufacture) {
      case "hayabusa":
        selectedModel = hayabusaBikeData;
        break;
      case "kawasaki":
        selectedModel = kawasakiBikeData;
        break;
      case "royalenfield":
        selectedModel = royalEnfieldBikeData;
        break;
      default:
        return null;
    }
    const selectedBike = selectedModel.find((val) => val.route === bikes);
    return selectedBike || selectedModel[0];
  };

  const addToCart = () => {
    if (typeof window !== "undefined") {
      let data = localStorage.getItem("cartData") || "[]";
      const cartArray = JSON.parse(data);
      if (BikeData) {
        cartArray.push(BikeData);
      }
      localStorage.setItem("cartData", JSON.stringify(cartArray));
      localStorage.setItem("route", `/Inventory/${params.manufacture}`);
    }
  };

  const scrollToTop = () => {
    setFeatureDis((val) => !val);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (BikeData?.pictures?.length) {
      setLeftDis(slide === 0);
      setRightDis(slide === BikeData.pictures.length - 1);
    } else {
      setLeftDis(true);
      setRightDis(true);
    }
    setStartAnimate(true);
  }, [slide, BikeData]);
  

  useEffect(() => {
    ratingStarsArrangment();
    setBikeFeauters(shufflingFeatures(BikeFeautersData));
    if (typeof window !== "undefined") {
      const storedCartData = localStorage.getItem("cartData");
      if (storedCartData) {
        const data: BikeDataType[] = JSON.parse(storedCartData);
        if (data.some((val) => params.bikes === val.route)) {
          addBikeHandler();
        }
      }
    }
  }, [BikeData]);


   const setReportPercent = () => {
        let count = 0;
        setReport(BikeData!.features).data.forEach((val) => {
          count += val.percentage;
        });
        return count / 50;
      };
    

  const ratingStarsArrangment = () => {
    const starsData: string[] = ["full", "full"];
    if (starsData.length <= 5) {
      switch (BikeData?.features) {
        case "A":
        case "E":
          starsData.push("half", "empty", "empty");
          break;
        case "C":
        case "J":
          starsData.push("full", "full", "half");
          break;
        case "H":
        case "D":
          starsData.push("full", "half", "empty");
          break;
        case "B":
        case "F":
          starsData.push("full", "full", "empty");
          break;
        default:
          starsData.push("full", "full", "full");
      }
    }
    setStarsArrangment(starsData.slice(0, 5));
  };

  const slideController = (direction: string) => {
    direction === "left" ? setSlide(slide - 1) : setSlide(slide + 1);
  };

  const addBikeHandler = () => {
    setBtnDis(true);
    setTimeout(() => {
      setBtnAnim(true);
    }, 100);
  };

  if (!BikeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative bg-black h-auto w-full pt-16 flex flex-row-reverse gap-1 overflow-hidden">
      <div
        className="fixed mmd:hidden inline-block h-10 w-10 z-[100] bottom-5 right-5 bg-no-repeat bg-center bg-cover bg-[url('/feature-icon.svg')] cursor-pointer"
        onClick={scrollToTop}
      ></div>
    

    {/* SIDE BAR  */}
         <aside
            className={`mmd:relative absolute ${!featureDis && "-translate-y-[120%]" } z-10 mmd:w-[28vw] w-auto h-auto px-3 py-5 bg-red-900 ${
              !startAnimate ? "-translate-y-[120%]" : "mmd:translate-y-0"
            } duration-100`}
          >
            {/* SELLER DETAILS */}
            <section className="relative h-auto w-full border-2 border-black rounded-xl text-white py-5 px-4 flex flex-col gap-4 bg-black/70">
              <h1 className="w-full text-center text-3xl font-semibold capitalize mb-4">
                Seller Details
              </h1>
              <h3 className="text-xl">Dealer: Muhammad Soban Saud</h3>
              <h3 className="text-xl">Address: Karachi, Pakistan</h3>
              <h3 className="text-xl">Timings: 12:00 AM to 11:00 PM</h3>
              <div className="flex gap-5 flex-col mt-5">
                <Link href="/Contact">
                  <button className="h-14 rounded-2xl w-full text-md border-2 border-red-900 text-red-900 font-semibold uppercase flex items-center justify-center">
                    <span className="h-14 w-14 flex items-center justify-center">
                      <PiEnvelopeFill className="h-3/5 w-3/5" />
                    </span>
                    <h1 className="text-lg font-semibold">Send Message</h1>
                  </button>
                </Link>
                <Link href="/Contact">
                  <button className="h-14 pr-7 rounded-2xl w-full text-md border-2 border-red-900 text-red-900 font-semibold uppercase flex items-center justify-center">
                    <span className="h-14 w-14 flex items-center justify-center">
                      <MdPhone className="h-3/5 w-3/5" />
                    </span>
                    <h1 className="text-lg font-semibold">Phone</h1>
                  </button>
                </Link>
              </div>
            </section>
            {/* Bike FEATURES */}
            <section className="h-auto w-full mt-5 rounded-xl bg-center bg-contain bg-black/70 text-white py-5 px-4">
              <h1 className="w-full text-center text-3xl font-semibold capitalize mb-5">
                Bike Features
              </h1>
              <div className="h-auto w-full flex flex-col gap-2 py-2 px-2">
                {BikeFeauters?.map((val, ind) => (
                  <div key={ind} className="h-[12vh] w-full flex items-center justify-start gap-5 hover:text-red-800 cursor-pointer">
                    <span
                    // ${val.img}
                      className={`h-[5vh] w-[5vh] hover:scale-125 flex bg-no-repeat bg-center bg-cover ${val.img}`}
                    ></span>
                    <h3 className="text-xl font-semibold capitalize">
                      {val.name}
                    </h3>
                  </div>
                ))}
              </div>
            </section>

            </aside>  




            {/* LEFT SECTION */}
            <section
              className={`duration-100 mmd:w-[70vw] w-full ${!startAnimate && "-translate-x-[200%]"} ${featureDis ? "opacity-0" : "opacity-100"}`}
            >
              {/* BikeS */}
              <section className="relative h-auto w-full flex flex-col px-2">
                <div className="relative xs:h-28 h-auto w-full text-red-900 my-5">
                  <div
                    className={`bg-zinc-900 rounded-xl flex items-center justify-center border-2 border-[#331010] duration-500`}
                  >
                    <h1 className="font-bold sm:text-5xl xs:text-[5vw] text-3xl sm:py-7 py-5 text-center">{BikeData.name}</h1>
                  </div>
                </div>
                <div
                  className={`relative w-full xs:h-screen h-[70vh] bg-no-repeat bg-center bg-cover ${
                    !startAnimate && "-translate-x-full"
                  } duration-100`}
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/backpic1.jpg)",
                  }}
                 >
                  {/* Bike VIEW */}
                  <div className="absolute rounded-xl h-[60%] sm:w-[80%] w-full left-1/2 top-1/2 -translate-x-1/2  xs:-translate-y-[70%] -translate-y-[85%] bg-black overflow-hidden shadow-Bike">
                    <span
                      className={`absolute bottom-6 left-8 h-12 w-12 bg-black/30 rounded-full flex items-center justify-center cursor-pointer z-10 ${
                        leftDis && "hidden"
                      }`}
                      onClick={() => slideController("left")}
                    >
                      <MdKeyboardArrowLeft className="h-1/2 w-1/2 text-white" />
                    </span>
                    <span
                      className={`absolute bottom-6 right-8 h-12 w-12 bg-black/30 rounded-full flex items-center justify-center cursor-pointer z-10 ${
                        rightDis && "hidden"
                      }`}
                      onClick={() => slideController("right")}
                    >
                      <MdKeyboardArrowRight className="h-1/2 w-1/2 text-white" />
                    </span>
    
                    {BikeData.pictures.map((val, ind) => (
                      <div
                        key={ind}
                        className={`relative h-full w-full bg-center bg-contain bg-no-repeat ${val} duration-300 shadow-Biked`}
                        style={{
                          transform: `translateY(-${ind * 100}%) translateX(${
                            ind * 100
                          }%) translateX(-${slide}00%)`,
                        }}
                      ></div>
                    ))}
                  </div>
    
                  {/* Bike SMALL PICS */}
                  <div className="absolute left-1/2 md:bottom-5 xs:bottom-10 bottom-12 -translate-x-1/2 md:h-32 xs:h-24 h-20 xs:w-[75%] w-[60%] overflow-hidden">
                    {BikeData.pictures.map((val, ind) => (
                      <div
                        key={ind}
                        className={`relative h-[75%] md:w-36 xs:w-28 w-20 rounded-md bg-no-repeat bg-center bg-cover duration-50 border-white ${val} ${
                          slide === ind && "border-[3px]"
                        }`}
                        style={{
                          transform: `translateY(-${ind * 100}%) translateX(${
                            ind * 120
                          }%) translateX(-${slide * 120}%)`,
                        }}>
                        <div
                          className={`h-full w-full absolute top-0 left-0 bg-black/50 ${
                            slide === ind && "bg-transparent"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              {/* Bike PRICE */}
              <section className="relative w-full flex justify-between bg-zinc-900 px-4 py-5 text-white rounded-xl overflow-hidden sm:flex-row flex-col">
                <div className="sm:w-auto w-full">
                <h1 className="sm:text-4xl xxs:text-3xl text-2xl font-semibold my-2">{BikeData.name}</h1>
                <h2 className="sm:text-xl xxs:text-lg text-sm font-semibold opacity-50">
                {BikeData.price}
                </h2>
                </div>
                
                <div className={`flex h-auto sm:w-1/2 w-full flex-row-reverse xxs:gap-5 gap-2 items-end justify-start`}>
                  <button
                    className={`py-2 xxs:px-4 px-2 xs:text-sm text-xs font-semibold xs:rounded-md rounded-sm bg-red-800 duration-100 ${
                      btnDis && "hidden"
                    }`}
                    onClick={() => {
                      addToCart();
                      addBikeHandler();
                    }}
                  >
                    Add To Cart
                  </button>
                  <button
                    className={`xs:py-2 py-1 xs:pr-4 xxs:pr-2 pr-1 xs:pl-6 xxs:pl-4 pl-2 text-sm font-semibold text-red-800 xs:rounded-md rounded-sm border-red-800 border-2 duration-500 items-center justify-center xs:gap-2 gap-1 ${
                      btnAnim ? "translate-y-0" : "translate-y-[500%]"
                    } ${btnDis ? "flex" : "hidden"}`}
                   >
                    <h3 className="xs:text-sm text-xs">Added</h3>
                    <span className="xs:h-5 h-3 xs:w-5 w-3 flex items-center justify-center">
                      <TiTickOutline className="h-4/5 w-4/5" />
                    </span>
                  </button>
                  <Link href="/Cart">
                    <button
                      className={`xs:py-[10px] py-[6px] xxs:px-4 px-2 xs:text-sm text-xs xxs:font-semibold font-normal xs:rounded-md rounded-sm bg-red-800 duration-100 ${
                        btnAnim ? "translate-y-0" : "translate-y-[500%]"
                      } ${btnDis ? "inline-block" : "hidden"}`}
                    >
                      View Cart
                    </button>
                  </Link>
                </div>
              </section>
              {/* DESCRIPTION */}
              <section className="h-auto w-full bg-zinc-900 py-10 my-5 text-white px-4 rounded-xl">
                <h1 className="text-3xl font-semibold mb-4">Description</h1>
                <p>
                  {descriptionFunc(BikeData.features, BikeDescriptions, BikeData.name)}
                </p>
              </section>
              <div className="h-auto w-full flex sm:flex-row flex-col gap-2 items-start justify-center">
                {/* REPORT */}
                <section className="relative h-auto w-full bg-zinc-900 rounded-xl px-4 py-5 text-white mb-5">
                  <h1 className="text-2xl font-semibold">
                    SM-AutoMobiles Inspection Report
                  </h1>
                  <h3 className="text-md font-semibold capitalize opacity-50">
                    All Are Verified
                  </h3>
                  <div className="relative text-lg font-semibold capitalize w-full border-b-[1px] pb-3 my-4">
                    Overall Rating
                    <p className="absolute right-0 top-1 text-sm">
                      {setReportPercent()} / 10
                    </p>
                  </div>
                  {setReport(BikeData.features).data.map((val, ind) => (
                    <div key={ind} className="relative h-[20%] w-full text-white py-2">
                      <p>{val.text}</p>
                      <p className="absolute right-1 top-3 text-sm">
                        {val.percentage}%
                      </p>
                      <div className="relative mt-1 h-2 w-full bg-white rounded-full overflow-hidden">
                        <div
                          className={`absolute left-0 h-full bg-red-800`}
                          style={{ width: `${val.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </section>
                {/* RATING */}
                <section className="h-auto w-full bg-zinc-900 rounded-xl py-5 px-4 mb-5 text-white flex items-center justify-center flex-col">
                  <h1 className="text-3xl font-semibold w-full text-center pb-3">
                    Rating Section
                  </h1>
                  <p>{ratingFunc(BikeData.features, BikeRatings, BikeData.name)}</p>
                  <div className="my-10 h-16 w-4/5 flex items-center justify-center">
                    {starsArrangment.map((val, ind) => {
                      let star: JSX.Element = (
                        <IoMdStar className="h-4/5 w-4/5 text-red-800" />
                      );
                      switch (val) {
                        case "full":
                          star = <IoMdStar className="h-4/5 w-4/5 text-red-800" />;
                          break;
                        case "half":
                          star = (
                            <IoMdStarHalf className="h-4/5 w-4/5 text-red-800" />
                          );
                          break;
                        case "empty":
                          star = (
                            <IoMdStarOutline className="h-4/5 w-4/5 text-red-800" />
                          );
                          break;
                      }
                      return (
                        <span
                          key={ind}
                          className="h-14 w-14 flex items-center justify-center">
                          {star}
                        </span>
                      );
                    })}
                  </div>
                </section>
              </div>
            </section>
          </div>
                  );
    }
    


export default Page