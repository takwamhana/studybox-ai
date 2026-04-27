import 'dotenv/config';
import connectDB from './src/config/database.js';
import Product from './src/models/Product.js';

/**
 * Seed the database with sample products
 * Run with: node scripts/seed.js
 */

const sampleProducts = [
  {
    name: 'The Complete JavaScript Course',
    price: 79.99,
    category: 'courses',
    description: 'Learn JavaScript from beginner to advanced level',
    inStock: true,
  },
  {
    name: 'Introduction to Algorithms',
    price: 49.99,
    category: 'books',
    description: 'Comprehensive guide to algorithm design and analysis',
    inStock: true,
  },
  {
    name: 'Premium Notebook Set',
    price: 24.99,
    category: 'stationery',
    description: '5-pack of high-quality notebooks with grid lines',
    inStock: true,
  },
  {
    name: 'Coding Mechanical Keyboard',
    price: 129.99,
    category: 'tech',
    description: 'RGB mechanical keyboard for developers',
    inStock: true,
  },
  {
    name: 'Linear Algebra Done Right',
    price: 39.99,
    category: 'books',
    description: 'Comprehensive linear algebra textbook',
    inStock: true,
  },
  {
    name: 'Deluxe Pencil Set',
    price: 19.99,
    category: 'stationery',
    description: 'Professional-grade pencil set with eraser',
    inStock: true,
  },
  {
    name: 'Bluetooth Headphones',
    price: 89.99,
    category: 'tech',
    description: 'Noise-cancelling wireless headphones',
    inStock: true,
  },
  {
    name: 'Python for Data Science',
    price: 34.99,
    category: 'books',
    description: 'Learn Python programming for data analysis',
    inStock: true,
  },
  {
    name: 'Study Lamp with USB Charging',
    price: 44.99,
    category: 'supplies',
    description: 'LED desk lamp with USB charging port',
    inStock: true,
  },
  {
    name: 'Graph Paper Pads',
    price: 12.99,
    category: 'stationery',
    description: '3-pack of graph paper pads for mathematical work',
    inStock: true,
  },
  {
    name: 'GitHub Pro Annual Subscription',
    price: 0,
    category: 'software',
    description: 'GitHub Pro subscription for students',
    inStock: true,
  },
  {
    name: 'VS Code Extensions Bundle',
    price: 0,
    category: 'software',
    description: 'Free collection of essential VS Code extensions',
    inStock: true,
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${insertedProducts.length} sample products`);

    console.log('\n📚 Sample Products:');
    insertedProducts.forEach((product) => {
      console.log(`  - ${product.name} ($${product.price})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
