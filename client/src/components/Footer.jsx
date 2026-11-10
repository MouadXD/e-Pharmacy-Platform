import Container from "./Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    // <div
    //   className="border
    // "
    // >
    //   <div className="p-10">
    //     <Container>
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <h2 className="text-xl font-bold">Company</h2>
    //           <ul className="flex flex-col gap-1 mt-4">
    //             <li>What's New</li>
    //             <li>About</li>
    //             <li>Press</li>
    //             <li>Contact</li>
    //           </ul>
    //         </div>
    //         <div>
    //           <h2 className="text-xl font-bold">Company</h2>
    //           <ul className="flex flex-col gap-1 mt-4">
    //             <li>What's New</li>
    //             <li>About</li>
    //             <li>Press</li>
    //             <li>Contact</li>
    //           </ul>
    //         </div>{" "}
    //         <div>
    //           <h2 className="text-xl font-bold">Company</h2>
    //           <ul className="flex flex-col gap-1 mt-4">
    //             <li>What's New</li>
    //             <li>About</li>
    //             <li>Press</li>
    //             <li>Contact</li>
    //           </ul>
    //         </div>{" "}
    //         <div>
    //           <h2 className="text-xl font-bold">Company</h2>
    //           <ul className="flex flex-col gap-1 mt-4">
    //             <li>What's New</li>
    //             <li>About</li>
    //             <li>Press</li>
    //             <li>Contact</li>
    //           </ul>
    //         </div>
    //       </div>
    //     </Container>
    //   </div>
    //   <div className="bg-secondary w-full p-1  text-sm font-light text-primary">
    //     <Container>
    //       <div className="flex items-center justify-between">
    //         <span>©2024 Medicare</span>
    //         <span>Designed & Developed by Mouad Boufas & Amine Baray</span>
    //       </div>
    //     </Container>
    //   </div>
    // </div>
    <div className="bg-secondary p-3 relative overflow-hidden">
      {/* <div className="opacity-5 absolute top-0 left-0"> */}
      {/* <img
        src="https://res.cloudinary.com/dk3yapeaq/image/upload/v1707595462/mlxpop30tko37dbevnqm.png"
        alt="logo"
        className="w-[30%] opacity-5 absolute top-0 left-0"
      /> */}
      {/* </div> */}
      <Container>
        <div className="text-white text-center m-[50px]">
          <h3 className="text-2xl">Sign up For Newsletter</h3>
          <p className="m-3 font-light">
            Join 60.000+ subscribers and get a new <br /> discount coupon on
            every Saturday.
          </p>
          <div>
            <input
              className="focus:outline-none bg-white text-black text-sm p-2 rounded-[20px] placeholder:pl-2 w-[30%] placeholder:text-sm"
              type="text"
              placeholder="Your Email Adresse"
            />
          </div>
        </div>
        <hr className="opacity-20" />
        <div className="text-white p-[30px] rounded-[10px]">
          <div className="flex justify-between">
            <div>
              <span className="text-md tracking-tight font-bold">Company</span>
              <ul className="mt-3">
                <li className="font-light">What's New</li>
                <li className="font-light">About</li>
                <li className="font-light">Press</li>
                <li className="font-light">Careers</li>
                <li className="font-light">Social Media</li>
                <li className="font-light">Contact</li>
              </ul>
            </div>
            <div>
              <span className="text-md tracking-tight font-bold">
                Community
              </span>
              <ul className="mt-3">
                <li className="font-light">Medicare for Buisness</li>
                <li className="font-light">2024 Creator Report</li>
                <li className="font-light">Charities</li>
                <li className="font-light">Creator Profile Directory</li>
              </ul>
            </div>
            <div>
              <span className="text-md tracking-tight font-bold">Support</span>
              <ul className="mt-3">
                <li className="font-light">Help Topics</li>
                <li className="font-light">Getting Started</li>
                <li className="font-light">Linktree Pro</li>
                <li className="font-light">Feautures & How-Tos</li>
                <li className="font-light">FAQs</li>
                <li className="font-light">Report a Violation</li>
              </ul>
            </div>
            <div>
              <span className="text-md tracking-tight font-bold">
                Trust & Legal
              </span>
              <ul className="mt-3">
                <li className="font-light">Terms & Conditions</li>
                <li className="font-light">Privacy Notice</li>
                <li className="font-light">Cookie Notice</li>
                <li className="font-light">Cookie Preferences</li>
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center justify-between p-5">
          <div className="text-white flex items-center gap-2 p-2 rounded-sm">
            <h4 className="font-light">Our Payment Partners</h4>
            <img
              src="https://assets.pharmeasy.in/web-assets/_next/icons/mastercard.svg"
              alt=""
              className="w-[7%]"
            />
            <img
              src="https://assets.pharmeasy.in/web-assets/_next/icons/visa.svg"
              alt=""
              className="w-[7%]"
            />
            <img
              src="https://www.pharmacy2u.co.uk/_next/image?url=%2Fpayment-providers%2Fpaypal.png&w=96&q=75"
              alt=""
              className="w-[9%]"
            />
          </div>
          <div className="text-white font-light">©{currentYear} Medicare</div>
        </div> */}
      </Container>
    </div>
  );
};

export default Footer;
