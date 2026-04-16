import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Games
  const gamesData = [
    {
      title: 'Memory Match',
      description: 'Luyện tập trí nhớ bằng cách tìm các cặp thẻ bài giống nhau.',
    },
    {
      title: 'Shape Sorter',
      description: 'Phân loại các hình khối vào đúng vị trí để rèn luyện khả năng quan sát không gian.',
    },
    {
      title: 'Speed Calc',
      description: 'Thử thách tính nhẩm nhanh với các phép tính cơ bản trong thời gian giới hạn.',
    },
    {
      title: 'GameTwoShape',
      description: 'Thử thách vẽ hai hình khác nhau bằng hai tay cùng lúc để kích thích hai bán cầu não.',
    },
    {
      title: 'Reaction Time',
      description: 'Kiểm tra tốc độ phản ứng của bạn với các tín hiệu hình ảnh và âm thanh.',
    },
  ];

  console.log('--- Bắt đầu seeding Games ---');
  const games = [];
  for (const item of gamesData) {
    const game = await prisma.game.upsert({
      where: { title: item.title },
      update: {},
      create: item,
    });
    games.push(game);
    console.log(`Đã seed game: ${game.title}`);
  }

  // 2. Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const usersData = [
    { email: 'testuser1@example.com', name: 'Nguyễn Văn A', password: hashedPassword },
    { email: 'testuser2@example.com', name: 'Trần Thị B', password: hashedPassword },
    { email: 'admin@example.com', name: 'Quản trị viên', password: hashedPassword },
  ];

  console.log('\n--- Bắt đầu seeding Users ---');
  const users = [];
  for (const item of usersData) {
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: {},
      create: item,
    });
    users.push(user);
    console.log(`Đã seed user: ${user.email}`);
  }

  // 3. Seed Scores
  console.log('\n--- Bắt đầu seeding Scores mẫu ---');
  for (const user of users) {
    for (const game of games) {
      // Tạo 2-3 lượt chơi ngẫu nhiên cho mỗi user ở mỗi game
      const randomCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < randomCount; i++) {
        await prisma.score.create({
          data: {
            value: Math.floor(Math.random() * 1000) + 100,
            accuracy: parseFloat((Math.random() * 20 + 80).toFixed(2)), // 80% - 100%
            timeSpent: Math.floor(Math.random() * 120) + 30, // 30s - 150s
            userId: user.id,
            gameId: game.id,
          },
        });
      }
    }
  }

  console.log('Hoàn thành tất cả seeding!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
