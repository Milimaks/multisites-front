import { useLocation } from "@remix-run/react";
import { Button } from "~/@/components/ui/button";
import { Card, CardTitle } from "~/@/components/ui/card";
import CardCanva from "~/@/components/ui/card-canva";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/@/components/ui/carousel";
import { useOptionalUser } from "~/root";
import Navbar from "../Navbar";

const carouselItems = Array.from({ length: 5 }).map((_, index) => ({
  id: index,
  title: `Slide ${index + 1}`,
  description: `Description of slide ${index + 1}`,
  image: `https://picsum.photos/seed/${index}/800/400`,
}));

type CarouselItemProps = {
  title: string;
  imageUrl: string;
};

const CarouselItemData: CarouselItemProps[] = [
  {
    title: "Titre 1",
    imageUrl: "image/ig_post_fr_fr_desktop.avif",
  },
  {
    title: "Titre 2",
    imageUrl: "image/presentations_fr_be.avif",
  },
  {
    title: "Titre 3",
    imageUrl: "image/prints_fr_fr_desktop.avif",
  },
  {
    title: "Titre 4",
    imageUrl: "image/social_fr_fr_desktop.avif",
  },
  {
    title: "Titre 5",
    imageUrl: "image/videos_en_au_desktop.avif",
  },
  {
    title: "Titre 6",
    imageUrl: "image/websites_fr_desktop.avif",
  },
  {
    title: "Titre 7",
    imageUrl: "image/whiteboards_fr_fr_desktop.avif",
  },
];

const cardCanvaData = [
  {
    target: "Pour une seule personne",
    isPremium: false,
    title: "Version gratuite de Canva",
    description: "Pour créer un design ou travailler sur ce que vous voulez.",
    button: "Obtenir Version gratuite de Canva",
  },
  {
    target: "Pour une seule personne",
    isPremium: true,
    title: "Canva Pro",
    description:
      "Pour faire grandir votre marque ou le projet de vos rêves avec des outils premium.",
    button: "Essayer Pro gratuitement",
  },
  {
    target: "Pour votre équipe",
    isPremium: true,
    title: "Canva en Equipe",
    description:
      "Pour les équipes qui souhaitent créer à plusieurs avec des outils et des processus de travail premium.",
    button: "Essayer Équipe gratuitement",
  },
  {
    target: "Pour votre organisation",
    isPremium: true,
    title: "Canva Entreprise",
    description:
      "Pour les organisations qui souhaitent travailler de manière homogène et gérer leurs équipes, marques et designs.",
    button: "Contacter l’équipe commerciale",
  },
];

const DisconnectedUserIndex: React.FC = () => {
  const user = useOptionalUser();
  const location = useLocation();
  const pathsToHideNavbar = ["/register", "/forgot-password"];
  const shouldHideNavbar = pathsToHideNavbar.includes(location.pathname);
  return (
    <main className="mt-32 pr-8 pl-8">
      {!shouldHideNavbar && <Navbar user={user} />}
      <section
        id="hero-section"
        className="flex justify-center flex-col items-center gap-8"
      >
        <h1 className="text-5xl font-bold text-center">
          Qu'allez vous <span className="text-title-can">créer</span>{" "}
          aujourd'hui ?
        </h1>

        <p className="text-center text-xl text-gray-500">
          Avec Canva, créez, partagez et imprimez facilement des designs
          professionnels.
        </p>
        <Button variant={"canva"} className="">
          Commencer à créer
        </Button>
      </section>
      <Carousel className="pt-8">
        <CarouselContent className="">
          {CarouselItemData.map((item, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/4 lg:basis-1/6 transform transition-transform duration-300 hover:scale-110 cursor-pointer"
            >
              <div className="">
                <Card className=" rounded-md">
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <CardTitle className="absolute top-0 left-0 w-full  text-white text-center p-2">
                      {item.title}
                    </CardTitle>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <section className="mt-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center">
          Idéal pour tous et toutes
        </h1>
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          {cardCanvaData.map((card, index) => (
            <CardCanva key={index} {...card} />
          ))}
        </div>
        <p className="mt-10">
          Consultez notre page Tarifs pour en savoir plus. Les institutions
          scolaires et les associations à but non lucratif peuvent bénéficier
          gratuitement des outils premium de Canva.
        </p>
      </section>
    </main>
  );
};

export default DisconnectedUserIndex;
