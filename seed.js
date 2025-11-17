const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Sync database (create tables)
    await sequelize.sync({ force: true }); // This will drop and recreate tables
    console.log('✅ Tables created');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@sccg.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create test user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      role: 'user'
    });
    console.log('✅ Test user created');

    // Create sample products
    const products = [
      {
        name: 'Premium Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 299.99,
        category: 'Electronics',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        price: 399.99,
        category: 'Electronics',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
      },
      {
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum laptop stand',
        price: 49.99,
        category: 'Accessories',
        stock: 100,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 29.99,
        category: 'Accessories',
        stock: 200,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400'
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with cherry switches',
        price: 149.99,
        category: 'Accessories',
        stock: 75,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'
      },
      {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with multiple ports',
        price: 39.99,
        category: 'Accessories',
        stock: 150,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400'
      },
      {
        name: 'Webcam HD',
        description: '1080p HD webcam with auto-focus',
        price: 79.99,
        category: 'Electronics',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1624920701028-a5f1e8c6f5b0?w=400'
      },
      {
        name: 'Phone Case',
        description: 'Durable protective phone case',
        price: 19.99,
        category: 'Accessories',
        stock: 300,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400'
      }
    ];

    for (const product of products) {
      await Product.create(product);
    }
    console.log('✅ Sample products created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test credentials:');
    console.log('Admin: admin@sccg.com / admin123');
    console.log('User: john@example.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
