import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
                    password: "hashed_password"
                }
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
                    amount: 1000 + i * 500,
                    status: "ACTIVE"
                }
            })
        )
    );

    const apiKeys = await Promise.all(
        users.map((user, i) =>
            prisma.apiKey.create({
                data: {
                    userId: user.id,
                    name: `Key ${i + 1}`,
                    apiKey: `sk_test_${user.id.slice(0, 8)}`,
                    creditsConsumed: i * 100
                }
            })
        )
    );

    const openai = await prisma.company.create({
        data: {
            name: "OpenAI",
            website: "https://openai.com"
        }
    });

    const anthropic = await prisma.company.create({
        data: {
            name: "Anthropic",
            website: "https://anthropic.com"
        }
    });

    const google = await prisma.company.create({
        data: {
            name: "Google",
            website: "https://ai.google"
        }
    });

    const gpt4 = await prisma.model.create({
        data: {
            name: "GPT-4",
            slug: "gpt-4",
            companyId: openai.id
        }
    });

    const gpt35 = await prisma.model.create({
        data: {
            name: "GPT-3.5",
            slug: "gpt-3.5",
            companyId: openai.id
        }
    });

    const claude = await prisma.model.create({
        data: {
            name: "Claude 3",
            slug: "claude-3",
            companyId: anthropic.id
        }
    });

    const gemini = await prisma.model.create({
        data: {
            name: "Gemini Pro",
            slug: "gemini-pro",
            companyId: google.id
        }
    });

    const openrouter = await prisma.provider.create({
        data: {
            name: "OpenRouter",
            website: "https://openrouter.ai"
        }
    });

    const direct = await prisma.provider.create({
        data: {
            name: "Direct API",
            website: "https://api.direct.com"
        }
    });

    const mappings = await Promise.all([
        prisma.modelProviderMapping.create({
            data: {
                modelId: gpt4.id,
                providerId: openrouter.id,
                inputtokencost: 0.01,
                outputtokencost: 0.03
            }
        }),
        prisma.modelProviderMapping.create({
            data: {
                modelId: gpt35.id,
                providerId: openrouter.id,
                inputtokencost: 0.002,
                outputtokencost: 0.002
            }
        }),
        prisma.modelProviderMapping.create({
            data: {
                modelId: claude.id,
                providerId: openrouter.id,
                inputtokencost: 0.008,
                outputtokencost: 0.024
            }
        }),
        prisma.modelProviderMapping.create({
            data: {
                modelId: gemini.id,
                providerId: direct.id,
                inputtokencost: 0.001,
                outputtokencost: 0.002
            }
        })
    ]);

    for (let i = 0; i < 4; i++) {
        await prisma.conversation.create({
            data: {
                userId: users[i % users.length].id,
                apiKeyId: apiKeys[i % apiKeys.length].id,
                modelProviderMappingId: mappings[i % mappings.length].id,
                input: "Hello AI",
                output: "Hello! How can I help?",
                inputTokenCount: 10 + i,
                outputTokenCount: 20 + i
            }
        });
    }

    await Promise.all(
        users.map((user, i) =>
            prisma.onrampTransaction.create({
                data: {
                    userId: user.id,
                    amount: 100 * (i + 1),
                    status: i % 2 === 0 ? "SUCCESS" : "FAILED"
                }
            })
        )
    );

    console.log("Seeding completed!");
}

main()
    .catch((e) => {
        console.error("Seeder failed:", e);
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });