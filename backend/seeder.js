import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Load models
import Product from './models/product/productModel.js';
import Category from './models/product/categoryModel.js';
import Brand from './models/product/brandModel.js';
import Tag from './models/product/tagModel.js';
import User from './models/user/userModel.js';

// Connect to DB
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Tag.deleteMany();
    // Keep users unless you want to reset them too
    // await User.deleteMany();

    console.log('Product, Category, Brand, Tag Data cleared...');

    // --- Ensure Users Exist (or create them if cleared) ---
    // Check if users exist first, create if needed
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    let regularUser = await User.findOne({ email: 'dhiman@gmail.com' });

    if (!adminUser || !regularUser) {
        console.log('Creating initial users...');
        const users = await User.insertMany([
            {
                firstName: 'Admin', lastName: 'User', username: 'adminuser',
                email: 'admin@gmail.com', phoneNumber: '+919999999999',
                password: 'admin', role: 'admin'
            },
            {
                firstName: 'John', lastName: 'Doe', username: 'johndoe',
                email: 'dhiman@gmail.com', phoneNumber: '+918888888888',
                password: 'dhiman1', role: 'user'
            }
        ]);
        adminUser = users[0];
        regularUser = users[1]; // Not used below, but good practice
    }
    const adminUserId = adminUser._id;


    // --- Create Categories, Brands, and Tags ---
    const categories = await Category.insertMany([
      { name: 'Electronics' }, // 0
      { name: 'Books' }, // 1
      { name: 'Clothing' }, // 2
      { name: 'Home & Kitchen' }, // 3
      { name: 'Sports & Outdoors' }, // 4
      { name: 'Toys & Games' }, // 5
      { name: 'Beauty & Personal Care' } // 6
    ]);

    const brands = await Brand.insertMany([
      { name: 'Sony' }, // 0
      { name: 'Penguin Books' }, // 1
      { name: 'Nike' }, // 2
      { name: 'Prestige' }, // 3
      { name: 'Apple' }, // 4
      { name: 'Samsung' }, // 5
      { name: 'Adidas' }, // 6
      { name: 'Random House' }, // 7
      { name: 'Philips' }, // 8
      { name: 'L\'Oréal' } // 9
    ]);

    const tags = await Tag.insertMany([
      { name: 'Gaming' }, // 0
      { name: 'Fiction' }, // 1
      { name: 'Sportswear' }, // 2
      { name: 'Appliances' }, // 3
      { name: 'Best Seller' }, // 4
      { name: 'Mobile' }, // 5
      { name: 'Laptop' }, // 6
      { name: 'Audio' }, // 7
      { name: 'Non-Fiction' }, // 8
      { name: 'Shoes' }, // 9
      { name: 'Accessories' } // 10
    ]);

    // --- Map data for easy access ---
    const categoryMap = {
      'Electronics': categories[0]._id,
      'Books': categories[1]._id,
      'Clothing': categories[2]._id,
      'Home & Kitchen': categories[3]._id,
      'Sports & Outdoors': categories[4]._id,
      'Toys & Games': categories[5]._id,
      'Beauty & Personal Care': categories[6]._id
    };

    const brandMap = {
      'Sony': brands[0]._id,
      'Penguin': brands[1]._id,
      'Nike': brands[2]._id,
      'Prestige': brands[3]._id,
      'Apple': brands[4]._id,
      'Samsung': brands[5]._id,
      'Adidas': brands[6]._id,
      'Random House': brands[7]._id,
      'Philips': brands[8]._id,
      'L\'Oréal': brands[9]._id
    };

    const tagMap = {
        'Gaming': tags[0]._id,
        'Fiction': tags[1]._id,
        'Sportswear': tags[2]._id,
        'Appliances': tags[3]._id,
        'Best Seller': tags[4]._id,
        'Mobile': tags[5]._id,
        'Laptop': tags[6]._id,
        'Audio': tags[7]._id,
        'Non-Fiction': tags[8]._id,
        'Shoes': tags[9]._id,
        'Accessories': tags[10]._id
    };

    // --- Sample Products (Original + 50 New) ---
    const products = [
      // Original 4
      {
        name: 'PlayStation 5',
        description: 'Next-gen gaming console with ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
        price: 49999,
        images: [{ public_id: 'sample_ps5', url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UGxheVN0YXRpb24lMjA1fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=PS5' }],
        category: categoryMap['Electronics'],
        brand: brandMap['Sony'],
        tags: [tagMap['Gaming'], tagMap['Best Seller']],
        stock: 15,
        user: adminUserId,
      },
      {
        name: 'The Alchemist',
        description: 'A classic novel by Paulo Coelho about a shepherd boy named Santiago who travels from his homeland in Spain to the Egyptian desert in search of a treasure.',
        price: 349,
        images: [{ public_id: 'sample_alchemist', url: 'https://images.unsplash.com/photo-1748467390346-e94ad7852366?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFRoZSUyMEFsY2hlbWlzdHxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000/500x500.png?text=Alchemist+Book' }],
        category: categoryMap['Books'],
        brand: brandMap['Penguin'],
        tags: [tagMap['Fiction'], tagMap['Best Seller']],
        stock: 100,
        user: adminUserId,
      },
      {
        name: 'Nike Air Max',
        description: 'Comfortable and stylish sneakers for everyday wear and athletic activities. Features the iconic Nike Air cushioning.',
        price: 8999,
        images: [{ public_id: 'sample_airmax', url: 'https://images.unsplash.com/photo-1711491559395-c82f70a68bfb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TmlrZSUyMEFpciUyME1heHxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000/500x500.png?text=Nike+Air+Max' }],
        category: categoryMap['Clothing'],
        brand: brandMap['Nike'],
        tags: [tagMap['Sportswear'], tagMap['Shoes']],
        stock: 50,
        user: adminUserId,
      },
      {
        name: 'Prestige Induction Cooktop',
        description: 'An efficient and easy-to-use induction cooktop that makes cooking faster and safer. Perfect for modern kitchens.',
        price: 2499,
        images: [{ public_id: 'sample_induction', url: 'https://images.unsplash.com/photo-1548243325-bf5b90ad929f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UHJlc3RpZ2UlMjBJbmR1Y3Rpb24lMjBDb29rdG9wfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=Induction+Cooktop' }],
        category: categoryMap['Home & Kitchen'],
        brand: brandMap['Prestige'],
        tags: [tagMap['Appliances']],
        stock: 75,
        user: adminUserId,
      },
      // --- Start of 50 New Products ---
      {
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with ProMotion technology, A17 Bionic chip, and advanced camera system.',
        price: 134900,
        images: [{ public_id: 'sample_iphone15pro', url: 'https://images.unsplash.com/photo-1702289613007-8b830e2520b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aVBob25lJTIwMTUlMjBQcm98ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000/500x500.png?text=iPhone+15+Pro' }],
        category: categoryMap['Electronics'],
        brand: brandMap['Apple'],
        tags: [tagMap['Mobile'], tagMap['Best Seller']],
        stock: 30,
        user: adminUserId,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship Android smartphone with powerful processor, stunning display, and versatile S Pen.',
        price: 129999,
        images: [{ public_id: 'sample_s24ultra', url: 'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2Ftc3VuZyUyMEdhbGF4eSUyMFMyNCUyMFVsdHJhfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=Galaxy+S24+Ultra' }],
        category: categoryMap['Electronics'],
        brand: brandMap['Samsung'],
        tags: [tagMap['Mobile']],
        stock: 25,
        user: adminUserId,
      },
      {
        name: 'MacBook Air M3',
        description: 'Thin and light laptop powered by the Apple M3 chip, offering incredible performance and battery life.',
        price: 114900,
        images: [{ public_id: 'sample_macbookairm3', url: 'https://images.unsplash.com/photo-1710905018864-d585574d79f8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWFjQm9vayUyMEFpciUyME0zfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=MacBook+Air+M3' }],
        category: categoryMap['Electronics'],
        brand: brandMap['Apple'],
        tags: [tagMap['Laptop']],
        stock: 40,
        user: adminUserId,
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise canceling headphones with exceptional sound quality and comfortable design.',
        price: 29990,
        images: [{ public_id: 'sample_wh1000xm5', url: 'https://images.unsplash.com/photo-1600681341802-14a7cb4dc357?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U29ueSUyMFdILTEwMDBYTTUlMjBIZWFkcGhvbmVzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=Sony+XM5' }],
        category: categoryMap['Electronics'],
        brand: brandMap['Sony'],
        tags: [tagMap['Audio'], tagMap['Best Seller']],
        stock: 60,
        user: adminUserId,
      },
      {
        name: 'Sapiens: A Brief History of Humankind',
        description: 'Yuval Noah Harari explores the history of humankind, from the Stone Age to the present day.',
        price: 450,
        images: [{ public_id: 'sample_sapiens', url: 'https://images.unsplash.com/photo-1581197239179-c1f95f1dc3a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fFNhcGllbnMlM0ElMjBBJTIwQnJpZWYlMjBIaXN0b3J5JTIwb2YlMjBIdW1hbmtpbmR8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000/500x500.png?text=Sapiens+Book' }],
        category: categoryMap['Books'],
        brand: brandMap['Random House'],
        tags: [tagMap['Non-Fiction'], tagMap['Best Seller']],
        stock: 150,
        user: adminUserId,
      },
       {
        name: 'Adidas Ultraboost',
        description: 'High-performance running shoes with responsive Boost cushioning.',
        price: 15999,
        images: [{ public_id: 'sample_ultraboost', url: 'https://images.unsplash.com/photo-1547974009-6fb0db54c905?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QWRpZGFzJTIwVWx0cmFib29zdHxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000/500x500.png?text=Adidas+Ultraboost' }],
        category: categoryMap['Clothing'],
        brand: brandMap['Adidas'],
        tags: [tagMap['Sportswear'], tagMap['Shoes']],
        stock: 80,
        user: adminUserId,
      },
      {
        name: 'Levi\'s 501 Original Fit Jeans',
        description: 'Iconic straight-leg jeans with button fly.',
        price: 3599,
        images: [{ public_id: 'sample_levis501', url: 'https://plus.unsplash.com/premium_photo-1727942419228-9884a26d0eb4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TGV2aSU1QydzJTIwNTAxJTIwT3JpZ2luYWwlMjBGaXQlMjBKZWFuc3xlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000/500x500.png?text=Levi+501+Jeans' }],
        category: categoryMap['Clothing'],
        brand: brandMap['Nike'], // Assuming Nike for variety, replace if needed
        tags: [],
        stock: 120,
        user: adminUserId,
      },
      {
        name: 'Philips Air Fryer XL',
        description: 'Cook healthier meals with less oil using this large-capacity air fryer.',
        price: 9999,
        images: [{ public_id: 'sample_airfryer', url: 'https://images.unsplash.com/photo-1709432767122-d3cb5326911a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8UGhpbGlwcyUyMEFpciUyMEZyeWVyJTIwWEx8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000/500x500.png?text=Philips+Air+Fryer' }],
        category: categoryMap['Home & Kitchen'],
        brand: brandMap['Philips'],
        tags: [tagMap['Appliances']],
        stock: 55,
        user: adminUserId,
      },
      {
        name: 'L\'Oréal Paris Revitalift Serum',
        description: 'Anti-aging serum with Hyaluronic Acid for hydrated and plump skin.',
        price: 799,
        images: [{ public_id: 'sample_revitalift', url: 'https://plus.unsplash.com/premium_photo-1679501217359-b99947b18ab6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TCU1QydPciVDMyVBOWFsJTIwUGFyaXMlMjBSZXZpdGFsaWZ0JTIwU2VydW18ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000/500x500.png?text=Loreal+Serum' }],
        category: categoryMap['Beauty & Personal Care'],
        brand: brandMap['L\'Oréal'],
        tags: [],
        stock: 200,
        user: adminUserId,
      },
      {
        name: 'Yonex Badminton Racket',
        description: 'Lightweight and durable badminton racket suitable for intermediate players.',
        price: 1899,
        images: [{ public_id: 'sample_badminton', url: 'https://images.unsplash.com/photo-1615326882458-e0d45b097f55?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8WW9uZXglMjBCYWRtaW50b24lMjBSYWNrZXR8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000/500x500.png?text=Badminton+Racket' }],
        category: categoryMap['Sports & Outdoors'],
        brand: brandMap['Nike'], // Placeholder brand
        tags: [tagMap['Accessories']],
        stock: 90,
        user: adminUserId,
      },
      // Add 40 more diverse products...
      {
        name: 'Samsung 55" QLED TV',
        description: 'Smart QLED TV with stunning picture quality and vibrant colors.',
        price: 65999,
        images: [{ public_id: 'sample_qledtv', url: 'https://images.unsplash.com/photo-1693943710014-4f177c246ddb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2Ftc3VuZyUyMDU1JTIyJTIwUUxFRCUyMFRWfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=Samsung+QLED+TV' }],
        category: categoryMap['Electronics'],
        brand: brandMap['Samsung'],
        tags: [],
        stock: 20,
        user: adminUserId,
      },
       {
        name: 'Atomic Habits',
        description: 'An easy & proven way to build good habits & break bad ones by James Clear.',
        price: 499,
        images: [{ public_id: 'sample_atomichabits', url: 'https://images.unsplash.com/photo-1613520761471-8d5f28e343c0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QXRvbWljJTIwSGFiaXRzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=Atomic+Habits' }],
        category: categoryMap['Books'],
        brand: brandMap['Random House'],
        tags: [tagMap['Non-Fiction'], tagMap['Best Seller']],
        stock: 250,
        user: adminUserId,
      },
      {
        name: 'Adidas Stan Smith Shoes',
        description: 'Classic tennis-inspired sneakers with a clean, minimalist design.',
        price: 7599,
        images: [{ public_id: 'sample_stansmith', url: 'https://images.unsplash.com/photo-1739444929269-341792e2a4ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000/500x500.png?text=Adidas+Stan+Smith' }],
        category: categoryMap['Clothing'],
        brand: brandMap['Adidas'],
        tags: [tagMap['Shoes']],
        stock: 65,
        user: adminUserId,
      },
       {
        name: 'Prestige Mixer Grinder',
        description: 'Powerful mixer grinder for all your grinding and blending needs.',
        price: 3299,
        images: [{ public_id: 'sample_mixergrinder', url: 'https://plus.unsplash.com/premium_photo-1674914346858-4aa8548e2070?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UHJlc3RpZ2UlMjBNaXhlciUyMEdyaW5kZXJ8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000/500x500.png?text=Mixer+Grinder' }],
        category: categoryMap['Home & Kitchen'],
        brand: brandMap['Prestige'],
        tags: [tagMap['Appliances']],
        stock: 85,
        user: adminUserId,
      },
      {
        name: 'LEGO Star Wars Millennium Falcon',
        description: 'Iconic Star Wars starship LEGO set with intricate details and minifigures.',
        price: 14999,
        images: [{ public_id: 'sample_millenniumfalcon', url: 'https://images.unsplash.com/photo-1639610053599-a0983e0793c4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TEVHTyUyMFN0YXIlMjBXYXJzJTIwTWlsbGVubml1bSUyMEZhbGNvbnxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000/500x500.png?text=LEGO+Falcon' }],
        category: categoryMap['Toys & Games'],
        brand: brandMap['Nike'], // Placeholder
        tags: [tagMap['Gaming']],
        stock: 10,
        user: adminUserId,
      },
       {
        name: 'Neutrogena Hydro Boost Water Gel',
        description: 'Lightweight gel moisturizer for intense hydration.',
        price: 850,
        images: [{ public_id: 'sample_hydroboost', url: 'https://images.unsplash.com/photo-1748263831502-23d923a5c66a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fE5ldXRyb2dlbmElMjBIeWRybyUyMEJvb3N0JTIwV2F0ZXIlMjBHZWx8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000/500x500.png?text=Hydro+Boost+Gel' }],
        category: categoryMap['Beauty & Personal Care'],
        brand: brandMap['L\'Oréal'], // Placeholder
        tags: [],
        stock: 180,
        user: adminUserId,
      },
      {
        name: 'Cosmic Byte Gaming Keyboard',
        description: 'Mechanical gaming keyboard with RGB backlighting.',
        price: 2999,
        images: [{ public_id: 'sample_gamingkeyboard', url: 'https://images.unsplash.com/photo-1706857906952-659b9e99c99e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q29zbWljJTIwQnl0ZSUyMEdhbWluZyUyMEtleWJvYXJkfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=Gaming+Keyboard' }],
        category: categoryMap['Electronics'],
        brand: brandMap['Sony'], // Placeholder
        tags: [tagMap['Gaming'], tagMap['Accessories']],
        stock: 100,
        user: adminUserId,
      },
       {
        name: 'The Great Gatsby',
        description: 'A novel by F. Scott Fitzgerald exploring themes of decadence, idealism, and social upheaval.',
        price: 249,
        images: [{ public_id: 'sample_gatsby', url: 'https://images.unsplash.com/photo-1622594078248-0a1f42ec2141?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VGhlJTIwR3JlYXQlMjBHYXRzYnl8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000/500x500.png?text=Great+Gatsby' }],
        category: categoryMap['Books'],
        brand: brandMap['Penguin'],
        tags: [tagMap['Fiction']],
        stock: 300,
        user: adminUserId,
      },
      {
        name: 'Nike Dri-FIT T-Shirt',
        description: 'Moisture-wicking t-shirt for workouts and sports.',
        price: 1299,
        images: [{ public_id: 'sample_drifit', url: 'https://images.unsplash.com/photo-1739001402245-af41b0f740b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TmlrZSUyMERyaS1GSVQlMjBULVNoaXJ0fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=Nike+Dri-FIT' }],
        category: categoryMap['Clothing'],
        brand: brandMap['Nike'],
        tags: [tagMap['Sportswear']],
        stock: 150,
        user: adminUserId,
      },
       {
        name: 'Borosil Glass Lunch Box Set',
        description: 'Set of airtight glass containers for carrying meals.',
        price: 999,
        images: [{ public_id: 'sample_lunchbox', url: 'https://images.unsplash.com/photo-1684655531429-09beccf4adde?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEJvcm9zaWwlMjBHbGFzcyUyMEx1bmNoJTIwQm94JTIwU2V0fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000/500x500.png?text=Glass+Lunch+Box' }],
        category: categoryMap['Home & Kitchen'],
        brand: brandMap['Prestige'], // Placeholder
        tags: [tagMap['Appliances']],
        stock: 110,
        user: adminUserId,
      },
    


    ];

    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Tag.deleteMany();
    // Keep users unless you want to reset them too
    // await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}