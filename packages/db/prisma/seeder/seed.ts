import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Seeding started...");

  const users = await Promise.all(
    Array.from({ length: 4 }).map((_, i) =>
      prisma.user.upsert({
        where: { email: `user${i + 1}@test.com` },
        update: {},
        create: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@test.com`,
          password: "hashed_password",
        },
      })
    )
  );

  await Promise.all(
    users.map((user, i) =>
      prisma.credit.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          amount: 5000 + i * 2000,
          status: "ACTIVE",
        },
      })
    )
  );

  const apiKeys = await Promise.all(
    users.map((user, i) =>
      prisma.apiKey.create({
        data: {
          userId: user.id,
          name: `Primary Key ${i + 1}`,
          apiKey: `sk_live_${user.id.slice(0, 10)}`,
          creditsConsumed: randomBetween(0, 2000),
          lastUsed: new Date(),
        },
      })
    )
  );

  const companies = await Promise.all([
    prisma.company.create({ data: { name: "OpenAI", website: "https://openai.com" } }),
    prisma.company.create({ data: { name: "Anthropic", website: "https://anthropic.com" } }),
    prisma.company.create({ data: { name: "Google", website: "https://ai.google" } }),
    prisma.company.create({ data: { name: "Meta", website: "https://ai.meta.com" } }),
  ]);

  const modelData = [
    { name: "GPT-4 Turbo", slug: "gpt-4-turbo", company: companies[0] },
    { name: "GPT-4", slug: "gpt-4", company: companies[0] },
    { name: "GPT-3.5", slug: "gpt-3.5", company: companies[0] },

    { name: "Claude 3 Opus", slug: "claude-3-opus", company: companies[1] },
    { name: "Claude 3 Sonnet", slug: "claude-3-sonnet", company: companies[1] },
    { name: "Claude 3 Haiku", slug: "claude-3-haiku", company: companies[1] },

    { name: "Gemini 1.5 Pro", slug: "gemini-1.5-pro", company: companies[2] },
    { name: "Gemini Flash", slug: "gemini-flash", company: companies[2] },

    { name: "LLaMA 3 70B", slug: "llama-3-70b", company: companies[3] },
    { name: "LLaMA 3 8B", slug: "llama-3-8b", company: companies[3] },
  ];

  const models = await Promise.all(
    modelData.map((m) =>
      prisma.model.create({
        data: {
          name: m.name,
          slug: m.slug,
          companyId: m.company.id,
        },
      })
    )
  );

  const providers = await Promise.all([
    prisma.provider.create({ data: { name: "OpenRouter", website: "https://openrouter.ai" } }),
    prisma.provider.create({ data: { name: "Direct OpenAI", website: "https://api.openai.com" } }),
    prisma.provider.create({ data: { name: "Anthropic Direct", website: "https://api.anthropic.com" } }),
    prisma.provider.create({ data: { name: "Google AI", website: "https://ai.google.dev" } }),
    prisma.provider.create({ data: { name: "Together AI", website: "https://together.ai" } }),
  ]);

  const mappings = [];

  for (const model of models) {
    const providerCount = randomBetween(2, 4); 
    const shuffledProviders = [...providers].sort(() => 0.5 - Math.random());

    for (let i = 0; i < providerCount; i++) {
      const provider = shuffledProviders[i];

      const mapping = await prisma.modelProviderMapping.create({
        data: {
          modelId: model.id,
          providerId: provider.id,
          inputtokencost: parseFloat((Math.random() * 0.02).toFixed(4)),
          outputtokencost: parseFloat((Math.random() * 0.04).toFixed(4)),
        },
      });

      mappings.push(mapping);
    }
  }

  const sampleInputs = [
    "Explain quantum computing simply",
    "Write a Python API server",
    "Summarize this article",
    "Generate startup ideas",
    "Fix this bug in my code",
  ];

  const sampleOutputs = [
    "Sure! Here's a simple explanation...",
    "Here's a working solution...",
    "Summary: ...",
    "Here are some ideas...",
    "Bug fixed! Here's the code...",
  ];

  for (let i = 0; i < 25; i++) {
    await prisma.conversation.create({
      data: {
        userId: randomChoice(users).id,
        apiKeyId: randomChoice(apiKeys).id,
        modelProviderMappingId: randomChoice(mappings).id,
        input: randomChoice(sampleInputs),
        output: randomChoice(sampleOutputs),
        inputTokenCount: randomBetween(5, 200),
        outputTokenCount: randomBetween(20, 500),
      },
    });
  }

  for (let i = 0; i < 20; i++) {
    await prisma.onrampTransaction.create({
      data: {
        userId: randomChoice(users).id,
        amount: randomBetween(50, 1000),
        status: randomChoice(["SUCCESS", "FAILED", "PENDING"]),
      },
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seeder failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });