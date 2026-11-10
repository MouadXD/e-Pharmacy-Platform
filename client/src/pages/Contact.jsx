import { MdOutlinePhoneInTalk } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

function Contact() {
  return (
    <>
      <div className="flex flex-col lg:flex-row ml-8 lg:ml-32 mt-14 mr-8 lg:mr-32 mb-32">
        <div className="flex-initial w-full lg:w-2/5 mb-8 lg:mb-0">
          <h1 className="font-bold text-2xl mb-4">Contact Us</h1>
          <div>
            <span>Multi-line telephone hotline daily</span> <br />
            <span className="font-normal">08:00am – 09:00pm</span>
          </div>
          <div className="mt-8">
            <div className="flex items-center font-bold text-xl mb-6">
              <MdOutlinePhoneInTalk className="mr-5" color="green" size={30} />
              <h2 className="font-bold text-xl"> +212-61223-3445</h2>
            </div>
            <span>Calls from mobile and landlines within Morocco are free</span>{" "}
            <br />
            <button className="mt-2">
              <span className="text-orange text-sm">
                Email : Amine Baray | Mouaad Boufas
              </span>
            </button>
          </div>
          <div className="mt-8">
            <div className="flex items-center font-bold text-xl mb-6">
              <IoLocationOutline className="mr-5" color="green" size={30} />
              <h2 className="font-bold text-xl">Errachidia</h2>
            </div>
            <span className="text-orange text-sm mb-4">
              101 Draa tafilalt, Lycee Technique, BTS
            </span>
          </div>
          <div className="mt-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d492676.7948281666!2d-5.467938786524783!3d35.78417428715183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sparmacy!5e0!3m2!1sen!2sma!4v1717689170089!5m2!1sen!2sma"
              width="80%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        <div className="flex-auto w-full lg:w-3/5">
          <label htmlFor="" className="font-bold text-2xl">
            Message
          </label>
          <div className="mt-4">
            <span>
              Got any problems with purchase? Wanna ask for a piece of advice or
              leave a suggestion?
            </span>
            <br />
            <span>Don’t hesitate and write to our Email!</span>
          </div>
          <form>
            <div className="col-span-full mt-8">
              <label
                htmlFor=""
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Your name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name=""
                  id=""
                  autoComplete=""
                  className="block w-full rounded-md bg-primary bg-opacity-5 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-visible:outline-none sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full mt-4">
              <label
                htmlFor=""
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Your email
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name=""
                  id=""
                  autoComplete=""
                  className="block w-full rounded-md bg-primary bg-opacity-5 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-visible:outline-none sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full mt-4">
              <label
                htmlFor=""
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Subject
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name=""
                  id=""
                  autoComplete=""
                  className="block w-full rounded-md border-0 bg-primary bg-opacity-5 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-visible:outline-none sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Your message (optional)
              </label>
              <textarea
                id="about"
                name="about"
                rows={8}
                className="block w-full rounded-lg pl-4 bg-primary bg-opacity-5 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-visible:outline-none sm:text-sm sm:leading-6"
                placeholder=""
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-primary my-5 px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
