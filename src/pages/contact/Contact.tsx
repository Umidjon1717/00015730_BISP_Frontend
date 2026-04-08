import { useRef } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { BsClockFill } from "react-icons/bs";
import toast from "react-hot-toast";

const BOT_TOKEN = "7870707568:AAHnwCxMt8d-pAApzK4MGwIjxBsvo3JkOdM";
const CHAT_ID = "-1002278787927";

const Contact = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim() || "";
    const email = emailRef.current?.value.trim() || "";
    const subject = subjectRef.current?.value.trim() || "";
    const message = messageRef.current?.value.trim() || "";

    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields.", { position: "top-right" });
      return;
    }

    const textMessage = `📩 New Contact Message:
    - 👤 Name: ${name}
    - 📧 Email: ${email}
    - 📝 Subject: ${subject}
    - 💬 Message: ${message}`;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: textMessage }),
        }
      );

      const data = await response.json();

      if (data.ok) {
        toast.success("Message sent successfully!", { position: "top-right" });
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (subjectRef.current) subjectRef.current.value = "";
        if (messageRef.current) messageRef.current.value = "";
      } else {
        toast.error("Failed to send message. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="container">
      <div className="mt-16 text-center px-4">
        <h2 className="text-2xl md:text-4xl lg:text-[44px] font-semibold">
          Get In Touch With Us
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
          For more information about our products & services, feel free to drop
          us an email. Our staff is always here to help!
        </p>
      </div>

      <div className="flex mt-14 flex-col md:flex-row items-start justify-between gap-10 p-8 rounded-lg max-w-4xl mx-auto">
        <div className="w-full md:w-1/2 space-y-8">
          <p className=" dark:text-gray-400 flex items-start gap-4">
            <FaLocationDot className="w-8 h-8 dark:text-white" />
            <span>
              <strong className="text-lg md:text-xl dark:text-gray-300">
                Address
              </strong>
              <br />
              236 5th SE Avenue, New York NY10000, United States
            </span>
          </p>

          <p className=" dark:text-gray-400 flex items-start gap-4">
          <FaPhoneAlt className="w-8 h-8 dark:text-white"/>
            <span>
              <strong className="text-lg md:text-xl">Phone</strong>
              <br />
              Mobile: +(84) 546-6789 <br />
              Hotline: +(84) 456-6789
            </span>
          </p>

          <p className=" dark:text-gray-400 flex items-start gap-4">
          <BsClockFill  className="w-8 h-8 dark:text-white"/>
            <span>
              <strong className="text-lg md:text-xl">Working Hours</strong>
              <br />
              Monday-Friday: 9:00 - 22:00 <br />
              Saturday-Sunday: 9:00 - 21:00
            </span>
          </p>
        </div>

        <div className="w-full md:w-1/2 bg-white dark:bg-zinc-900 pl-8 md:pl-0 rounded-lg">
          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-white dark:bg-zinc-900 rounded-lg space-y-4"
          >
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Your Name
              </label>
              <input
                ref={nameRef}
                required
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full p-3 h-14 border dark:text-black dark:bg-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-[#cec1a3] focus:border-[#B88E2F] outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Email Address
              </label>
              <input
                ref={emailRef}
                required
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 h-14 border dark:text-black dark:bg-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-[#cec1a3] focus:border-[#B88E2F] outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="subject"
                className="text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Subject
              </label>
              <input
                ref={subjectRef}
                type="text"
                id="subject"
                required
                placeholder="Enter subject"
                className="w-full p-3 h-14 border dark:text-black dark:bg-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-[#cec1a3] focus:border-[#B88E2F] outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="message"
                className="text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Message
              </label>
              <textarea
                ref={messageRef}
                id="message"
                required
                placeholder="Enter your message"
                rows={4}
                className="w-full p-3 border dark:text-black dark:bg-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-[#cec1a3] focus:border-[#B88E2F] outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-[237px] bg-[#B88E2F] text-white font-medium py-3 rounded-md transition-all duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
