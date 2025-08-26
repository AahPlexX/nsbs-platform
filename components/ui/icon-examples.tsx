import {
  AiFillHeart,
  AiFillStar,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
  AiOutlineUser,
} from "react-icons/ai"
import { BiCog, BiEnvelope, BiHome, BiPhone, BiSearch, BiUser } from "react-icons/bi"
import {
  FaEnvelope,
  FaGithub,
  FaHome,
  FaLinkedin,
  FaPhone,
  FaTwitter,
  FaUser,
} from "react-icons/fa"
import { HiCog, HiHome, HiMail, HiPhone, HiSearch, HiUser } from "react-icons/hi"
import { IoCall, IoHome, IoMail, IoPerson, IoSearch, IoSettings } from "react-icons/io5"
import { MdEmail, MdHome, MdNotifications, MdPhone, MdSearch, MdSettings } from "react-icons/md"

export function IconExamples() {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">React Icons Examples</h2>

      {/* Font Awesome Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Font Awesome Icons (FA)</h3>
        <div className="flex space-x-4 text-2xl">
          <FaHome className="text-blue-500" />
          <FaUser className="text-green-500" />
          <FaEnvelope className="text-red-500" />
          <FaPhone className="text-purple-500" />
          <FaGithub className="text-gray-800" />
          <FaLinkedin className="text-blue-600" />
          <FaTwitter className="text-blue-400" />
        </div>
      </div>

      {/* Material Design Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Material Design Icons (MD)</h3>
        <div className="flex space-x-4 text-2xl">
          <MdHome className="text-blue-500" />
          <MdEmail className="text-red-500" />
          <MdPhone className="text-green-500" />
          <MdSettings className="text-gray-600" />
          <MdSearch className="text-orange-500" />
          <MdNotifications className="text-yellow-500" />
        </div>
      </div>

      {/* Ant Design Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ant Design Icons (AI)</h3>
        <div className="flex space-x-4 text-2xl">
          <AiOutlineHeart className="text-red-500" />
          <AiFillHeart className="text-red-500" />
          <AiOutlineStar className="text-yellow-500" />
          <AiFillStar className="text-yellow-500" />
          <AiOutlineShoppingCart className="text-blue-500" />
          <AiOutlineUser className="text-green-500" />
        </div>
      </div>

      {/* Bootstrap Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Bootstrap Icons (BI)</h3>
        <div className="flex space-x-4 text-2xl">
          <BiHome className="text-blue-500" />
          <BiUser className="text-green-500" />
          <BiEnvelope className="text-red-500" />
          <BiPhone className="text-purple-500" />
          <BiSearch className="text-orange-500" />
          <BiCog className="text-gray-600" />
        </div>
      </div>

      {/* Heroicons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Heroicons (HI)</h3>
        <div className="flex space-x-4 text-2xl">
          <HiHome className="text-blue-500" />
          <HiUser className="text-green-500" />
          <HiMail className="text-red-500" />
          <HiPhone className="text-purple-500" />
          <HiCog className="text-gray-600" />
          <HiSearch className="text-orange-500" />
        </div>
      </div>

      {/* Ionicons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ionicons (IO)</h3>
        <div className="flex space-x-4 text-2xl">
          <IoHome className="text-blue-500" />
          <IoPerson className="text-green-500" />
          <IoMail className="text-red-500" />
          <IoCall className="text-purple-500" />
          <IoSettings className="text-gray-600" />
          <IoSearch className="text-orange-500" />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Usage Examples</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FaUser className="text-blue-500" />
            <span>User Profile</span>
          </div>
          <div className="flex items-center space-x-2">
            <MdEmail className="text-red-500" />
            <span>Email Contact</span>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineShoppingCart className="text-green-500" />
            <span>Shopping Cart</span>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            <BiCog />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default IconExamples
