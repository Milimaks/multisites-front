import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { LoaderIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

export default function ChatRoute() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalName, setModalName] = useState("");

  const fetcher = useFetcher<any>();
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (query.trim() !== "" && query.length > 1) {
        fetcher.load(`/users-search?query=${query}`);
      }
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
            className="border-none hover:border-none focus:border-none focus:outline-none placeholder-gray-400 text-sm"
            placeholder="Recherchez un ami"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {searchQuery.length > 1 && (
          <div className="w-full h-full pt-4">
            {fetcher.data && fetcher.data.length > 0 ? (
              fetcher.data.map((user: any, index: number) => (
                <li
                  key={index}
                  className="flex justify-between list-none p-2 border-b"
                >
                  <div className="flex gap-1 items-center">
                    <img
                      src="/image/profile-user.jpeg"
                      className="w-6 h-6"
                      alt="Profile"
                    />
                    <p>{user.firstName}</p>
                  </div>
                  <button
                    onClick={() => handleModal(user.firstName)}
                    className="rounded-full bg-blue-600 w-10 h-10"
                  ></button>
                </li>
              ))
            ) : (
              <li className="list-none p-2 text-gray-500">
                {fetcher.data === undefined ? "Aucun utilisateur trouvé" : ""}
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
