// import Img from "../static/post9.jpg";
import { FaHeartbeat } from "react-icons/fa";
import { FaHandHoldingUsd } from "react-icons/fa";
import { IoMdHappy } from "react-icons/io";

const AboutUs = () => {
  return (
    <>
      <div className="container flex flex-col mx-auto mt-12 md:w-10/12 lg:w-9/12">
        <h1 className="font-bold mb-4 text-primary text-3xl md:text-4xl lg:text-5xl">
          About Us
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 rounded-xl w-full mb-20">
          <div className="sm:col-span-4 pr-10 text-black text-opacity-60">
            But I must explain to you how all this mistaken idea of denouncing
            pleasure and praising pain was born and I will give you a complete
            account of the system, and expound the actual teachings of the great
            explorer of the truth, the master-builder of human.
          </div>
          <div className="sm:col-span-1 flex items-center">
            <a
              href="./Contact"
              className="rounded-full bg-primary p-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[url('http://localhost:5173/src/static/background.png')] bg-cover bg-center bg-no-repeat w-full h-96 md:h-40 lg:h-40 flex items-center relative">
        <div className="lg:max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-52">
          <div className="leading-6 text-center md:text-left">
            <span className="font-bold text-secondary text-6xl md:text-7xl lg:text-8xl">
              100K+
            </span>
            <br />
            <span className="font-extrabold ml-2 text-primary text-sm md:text-base lg:text-lg">
              Monthly visits
            </span>
          </div>
          <div className="leading-6 text-center md:text-left">
            <span className="font-bold text-secondary text-6xl md:text-7xl lg:text-8xl">
              12K+
            </span>
            <br />
            <span className="font-extrabold ml-2 text-primary text-sm md:text-base lg:text-lg">
              Customers
            </span>
          </div>
          <div className="leading-6 text-center md:text-left">
            <span className="font-bold text-secondary text-6xl md:text-7xl lg:text-8xl">
              1
            </span>
            <br />
            <span className="font-extrabold ml-2 text-primary text-sm md:text-base lg:text-lg">
              Store available
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col ml-10 mt-8 sm:pt-16 md:p-24 lg:m-2 items-center justify-center bg-white">
        <div data-theme="primary" className="pl-5 max-w-6xl">
          <section className="font-sans text-black mb-8">
            <div className="[ lg:flex lg:items-center ] [ fancy-corners fancy-corners--large fancy-corners--top-left fancy-corners--bottom-right ]">
              <div className="flex-shrink-0 self-stretch sm:flex-basis-40 md:flex-basis-50 xl:flex-basis-60">
                <div className="h-full">
                  <article className="h-full">
                    <div className="h-full">
                      {/* <img
                        className="h-full object-cover"
                        src={Img}
                        width="733"
                        height=""
                        alt='""'
                        typeof="foaf:Image"
                      /> */}
                    </div>
                  </article>
                </div>
              </div>
              <div className="p-6 bg-gray-100">
                <div className="leading-loose h-96">
                  <h5 class="leading-loose text-xl font-bold">
                    Why Are We The Most Preferred Online Pharmacy?
                  </h5>
                  <p className="mb-5 text-left ">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate
                  </p>
                  <ul className="flex flex-wrap text-sm font-medium text-gray-700 sm:text-base md:mx-auto md:max-w-screen-sm">
                    <li className=" flex w-full items-center">
                      <svg
                        className="mr-2 flex-shrink-0 text-primary"
                        width="20"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>{" "}
                      I explain to you how all this mistaken idea.
                    </li>
                    <br />
                    <li className=" flex w-full items-center">
                      <svg
                        className="mr-2 flex-shrink-0 text-primary"
                        width="20"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>{" "}
                      I explain to you all this mistaken.
                    </li>
                    <li className=" flex w-full items-center">
                      <svg
                        className="mr-2 flex-shrink-0 text-primary"
                        width="20"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      how all this mistaken idea.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* static */}

      {/* section why you */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
          Why You Should Choose Us
        </h1>
        <h4 className="mb-4 sm:mb-6 lg:mb-10 text-base sm:text-lg lg:text-xl text-center">
          It’s important to address your health conditions during medications
          for the best substance.
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 w-11/12 md:max-w-4xl lg:max-w-6xl mx-auto rounded-xl text-white">
          <div className="bg-primary border-opacity-30 p-6 rounded-md drop-shadow-xl">
            <FaHeartbeat size={70} color="white" />
            <br />
            <span className="font-bold text-[1.2rem] md:text-lg lg:text-xl uppercase">
              Honesty & transparency
            </span>
            <br />
            <span>
              It’s important to address your health conditions during
              medications for the best substance
            </span>
          </div>

          <div className="bg-primary border-opacity-30 p-6 rounded-md drop-shadow-xl">
            <FaHandHoldingUsd size={70} color="white" />
            <br />
            <span className="font-bold text-[1.2rem] md:text-lg lg:text-xl uppercase">
              Extra Discount
            </span>
            <br />
            <span>
              It’s important to address your health conditions during
              medications for the best substance
            </span>
          </div>

          <div className="bg-primary border-opacity-30 p-6 rounded-md drop-shadow-xl">
            <IoMdHappy size={70} color="white" />
            <br />
            <span className="font-bold text-[1.2rem] md:text-lg lg:text-xl uppercase">
              24/7 Support
            </span>
            <br />
            <span>
              It’s important to address your health conditions during
              medications for the best substance
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
