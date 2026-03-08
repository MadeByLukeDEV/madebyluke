// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed sample projects based on Lukas's CV
  await prisma.project.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "TenkaiStudio Backend",
        description:
          "A Node.js/Express backend managing core functions of TenkaiStudio, including Discord OAuth2 authentication, Spotify integration for tracking currently playing songs, and a MariaDB/Sequelize data layer.",
        links: JSON.stringify([
          { label: "GitHub", url: "https://github.com/AboutSelphy" },
        ]),
        tags: JSON.stringify(["Node.js", "Express", "Discord API", "Spotify API", "MariaDB"]),
        featured: true,
        published: true,
        order: 0,
      },
      {
        title: "JackSparrow — Twitch Chatbot",
        description:
          "A gamified Twitch chatbot that converts user activity into redeemable points. Points can be exchanged for exclusive Discord cosmetics, enhancing community engagement.",
        links: JSON.stringify([
          { label: "GitHub", url: "https://github.com/AboutSelphy" },
        ]),
        tags: JSON.stringify(["Discord.js", "Twitch.js", "Node.js", "MongoDB"]),
        featured: false,
        published: true,
        order: 1,
      },
    ],
  });

  console.log("✅ Seed complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
