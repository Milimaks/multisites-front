export interface navbarData {
  title: string;
  image?: string;
  link?: string;
  content?: { description: string; href?: string }[];
}

export const navbarWelcomeData: navbarData[] = [
  {
    title: "Document visuel",
    content: [
      {
        description: "Suites studio",
        href: "/",
      },
      {
        description: "Docs",
        href: "/",
      },
      {
        description: "Présentation",
        href: "/",
      },
      {
        description: "Tableau blanc",
        href: "/",
      },
      {
        description: "Modifier un PDF",
        href: "/",
      },
      {
        description: "Graphique et diagramme",
        href: "/",
      },
    ],
  },
  {
    title: "Photo et vidéo",
    content: [
      {
        description: "Montage vidéo",
        href: "/",
      },
      {
        description: "Editeur de vidéos YouTube",
        href: "/",
      },
      {
        description: "Montage Photos",
        href: "/",
      },
      {
        description: "Retouche Photos",
        href: "/",
      },
      {
        description: "Effaceur d'arrière-plan",
        href: "/",
      },
    ],
  },
];
