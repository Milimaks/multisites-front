import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import Modal from "~/@/components/ModalClickOutside";
import { Button } from "~/@/components/ui/button";
import { getOptionalUser } from "~/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getOptionalUser({ request });
  return json({
    firstName: user?.firstName,
    email: user?.email,
  });
}
const usersData = [
  { id: 1, name: "Alice Dupont" },
  { id: 2, name: "Bob Martin" },
  { id: 3, name: "Charlie Durand" },
  { id: 4, name: "David Moreau" },
  { id: 5, name: "Eve Lefevre" },
];

export default function ChatRoute() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(usersData);
  const [modalName, setModalName] = useState("");

  const [isFetching, setIsFetching] = useState(false);

  const fetcher = useFetcher();
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsFetching(true);
    if (query.length <= 1) {
      setFilteredUsers([]);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (query.trim() !== "" && query.length > 1) {
        const results = usersData.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(results);
      }
      setIsFetching(false);
    }, 500);
  };

  const handleModal = (name: string) => {
    setModalName(name);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-full flex">
      <aside className="flex flex-col h-85dvh w-80 bg-gray-100">
        <div className="rounded-md flex items-center justify-center pt-4">
          <Search className="w-5 h-5 text-muted-foreground m-1" />
          <input
            type="text"
            className=" border-none hover:border-none focus:border-none focus:outline-none placeholder-gray-400 text-sm"
            placeholder="Recherchez un ami"
            value={searchQuery}
            onChange={handleSearch}
          ></input>
        </div>
        {searchQuery.length > 1 && (
          <div className="w-full h-full pt-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <li
                  key={index}
                  className="flex justify-between list-none p-2 border-b"
                >
                  <div className="flex gap-1 items-center">
                    <img src="/image/profile-user.jpeg" className="w-6 h-6" />
                    <p>{user.name}</p>
                  </div>
                  <button
                    onClick={() => handleModal(user.name)}
                    className="rounded-full bg-blue-600 w-10 h-10"
                  ></button>
                </li>
              ))
            ) : (
              <li className="list-none p-2 text-gray-500">
                {!isFetching && "Aucun utilisateur trouvé"}
              </li>
            )}
          </div>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="p-10"
        >
          <p>
            Voulez vous rajouter{" "}
            <span className="font-semibold">{modalName}</span> à votre List
            d'amis ?
          </p>
          <div className="flex justify-end pt-4">
            <Button variant={"ghost"} className="mr-2">
              Oui
            </Button>
            <Button variant={"default"} onClick={() => setIsModalOpen(false)}>
              Non
            </Button>
          </div>
        </Modal>
      </aside>
      <div></div>
    </div>
  );
}
