// import { FormattedMessage } from 'react-intl'
// import { AuthContext } from '../../context/authContext'
// import { RoleContext } from '../../context/roleContext'
// import { Role } from '../../services/utils/role'
// import ModalConnexion from '../modal/ModalConnexion'
import { Form, Link } from "@remix-run/react";
// import "./navbar.scss";
import { useContext, useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import Modal from "./Modal";

// import { FlagDropdown } from '../dropdown/FlagDropdown'
// import { CustomNavbarLink } from './CustomNavbarLink'

interface NavbarProps {
  icon?: string;
  user?: any;
}

const Navbar: React.FC<NavbarProps> = ({ icon, user }) => {
  const isConnected = !!user;
  const [scrollPosition, setScrollPosition] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {scrollPosition == 0 && (
        <nav className="bg-orange-400 flex items-center justify-between	">
          <div className="font-sans p-4">
            {isConnected ? (
              <h1 className="text-3xl">Welcome to {user.firstName}</h1>
            ) : (
              <h1>Welcome</h1>
            )}
          </div>

          {user ? (
            <Form method="POST" action="logout">
              <button type="submit">Se déconnecter</button>
            </Form>
          ) : (
            <div onClick={handleClick} className="p-4">
              <h1>S'inscrire</h1>
              <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <LoginForm />
              </Modal>{" "}
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
