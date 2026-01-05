
import { Product } from './types';

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  const brands = ['OptiStyle Elite', 'Urban Vision', 'Femme Vue', 'Kids Vision', 'Zenith', 'Carbon Tech', 'Aura Luxury', 'Vista Noir'];
  const categories: ('Men' | 'Women' | 'Kids' | 'Luxury')[] = ['Men', 'Women', 'Kids', 'Luxury'];
  
  const frameTypes = {
    Men: ['Wayfarer', 'Aviator', 'Square', 'Rectangle', 'Browline'],
    Women: ['Cat-Eye', 'Round', 'Butterfly', 'Oversized', 'Geometric'],
    Kids: ['Flexible Square', 'Soft Round', 'Sport Wrap', 'Mini Wayfarer'],
    Luxury: ['Rimless Titanium', 'Gold-Plated Aviator', 'Carbon Fiber Shield', 'Limited Edition Horn']
  };

  const materialsList = {
    Men: ['Acetate', 'Stainless Steel', 'TR90'],
    Women: ['Premium Resin', 'Stainless Steel', 'Acetate'],
    Kids: ['Flexible TPE', 'Memory Plastic', 'Silicon'],
    Luxury: ['Titanium', 'Gold Plated', 'Carbon Fiber', 'Aluminum']
  };

  const colorsList = [
    ['Midnight Black', 'Gunmetal', 'Navy'],
    ['Rose Gold', 'Pearl White', 'Crystal Clear'],
    ['Royal Blue', 'Electric Pink', 'Neon Green'],
    ['Matte Black', 'Gold', 'Silver Carbon']
  ];

  // Specific high-quality optical images from Unsplash for realistic inventory
  const imagePool = {
    Luxury: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800', // Gold rimmed
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800', // Premium dark
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800', // Modern clear
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=800', // Designer frames
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800', // Clean luxury
      'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&q=80&w=800', // High-end round
    ],
    Men: [
      'https://th.bing.com/th/id/OIP.CLZvEeCxuJK2Vsj7OuAgGwHaHa?w=183&h=183&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3', // Classic frames
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800', // Wayfarer style
      'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=800', // Professional
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800', // Modern square
      'https://images.unsplash.com/photo-1509631484675-02417336aef1?auto=format&fit=crop&q=80&w=800', // Aviators
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800', // Sporty
    ],
    Women: [
      'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=800', // Cat eye
      'https://images.unsplash.com/photo-1529139513402-2996e3825836?auto=format&fit=crop&q=80&w=800', // Chic frames
      'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?auto=format&fit=crop&q=80&w=800', // Elegant
      'https://images.unsplash.com/photo-1512413316925-fd4793431999?auto=format&fit=crop&q=80&w=800', // Sophisticated
      'https://images.unsplash.com/photo-1582142839970-2b9e04b60f25?auto=format&fit=crop&q=80&w=800', // Modern women
      'https://images.unsplash.com/photo-1594938374182-f893708a3f8b?auto=format&fit=crop&q=80&w=800', // Artistic
    ],
    Kids: [
      'https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?auto=format&fit=crop&q=80&w=800', // Vibrant kids
      'https://images.unsplash.com/photo-1513956589380-bad6da3f7d54?auto=format&fit=crop&q=80&w=800', // Cool junior
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800', // Soft kids
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=800', // Flexible frames
      'https://images.unsplash.com/photo-1516259670064-28444f8f43b7?auto=format&fit=crop&q=80&w=800', // Study time
    ]
  };

  // Manual Featured Items
  products.push(
    {
      id: '1',
      name: 'Aether Gold Aviator',
      brand: 'OptiStyle Elite',
      price: 18500,
      category: 'Luxury',
      image: imagePool.Luxury[0],
      description: 'Gold plated frame with anti-reflective lenses. Crafted for durability and lightweight performance.',
      colors: ['Gold', 'Silver'],
      materials: ['Titanium', 'Sapphire Glass']
    },
    {
      id: '2',
      name: 'Neo-Classic Wayfarer',
      brand: 'Urban Vision',
      price: 5400,
      category: 'Men',
      image: imagePool.Men[0],
      description: 'High-quality acetate frames with blue-light filtering technology. Ideal for daily professional use.',
      colors: ['Midnight Black', 'Tortoise'],
      materials: ['Acetate', 'Polycarbonate']
    },
    {
      id: '3',
      name: 'Serenity Cat-Eye',
      brand: 'Femme Vue',
      price: 7200,
      category: 'Women',
      image: imagePool.Women[0],
      description: 'Elegant silhouettes meet practical design. Lightweight and durable for everyday wear.',
      colors: ['Rose Gold', 'Pearl White'],
      materials: ['Stainless Steel', 'Resin']
    },
    {
      id: '4',
      name: 'Junior Explorer',
      brand: 'Kids Vision',
      price: 3200,
      category: 'Kids',
      image: imagePool.Kids[0],
      description: 'Durable, flexible frames designed for active kids. Impact resistant and comfortable.',
      colors: ['Royal Blue', 'Electric Pink'],
      materials: ['Flexible TPE', 'Impact-Resistant Lens']
    },
    {
      id: '5',
      name: 'Obsidian Minimalist',
      brand: 'Zenith',
      price: 12800,
      category: 'Luxury',
      image: imagePool.Luxury[1],
      description: 'Thin rimless design for a lightweight and unobtrusive visual experience.',
      colors: ['Matte Black', 'Gunmetal'],
      materials: ['Titanium', 'High-Index Glass']
    }
  );

  // Generate 100 more items (25 per category)
  categories.forEach((cat, catIdx) => {
    for (let i = 1; i <= 25; i++) {
      const id = `${cat.toLowerCase()}-${i + 5}`;
      const type = frameTypes[cat][i % frameTypes[cat].length];
      const brand = brands[(i + catIdx) % brands.length];
      const price = cat === 'Luxury' 
        ? 12000 + (Math.floor(Math.random() * 15000))
        : cat === 'Kids' 
          ? 2500 + (Math.floor(Math.random() * 2000))
          : 4500 + (Math.floor(Math.random() * 5000));

      const pool = imagePool[cat];
      const image = pool[i % pool.length];

      products.push({
        id,
        name: `${brand} ${type} V.${i}`,
        brand: brand,
        price: price,
        category: cat,
        image: image,
        description: `High-quality ${brand} ${type} frames. Made with ${materialsList[cat][i % materialsList[cat].length]} for long-lasting durability and standard UV400 protection.`,
        colors: colorsList[catIdx],
        materials: [materialsList[cat][i % materialsList[cat].length], 'UV400 Lens']
      });
    }
  });

  return products;
};

export const PRODUCTS: Product[] = generateProducts();
export const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Luxury'];
