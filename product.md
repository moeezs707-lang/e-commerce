# IBRAQ Product Documentation & Catalog Specifications

## 1. Product Database Schema
| Field | Type | Description |
|---|---|---|
| `id` | INT (PK, Auto Increment) | Unique product identifier |
| `title` | VARCHAR(200) | Product name |
| `category` | VARCHAR(50) | Categories: For Him, For Her, Gifts, Best Sellers, The Fall Edit |
| `price` | DECIMAL(10,2) | Product price in USD |
| `description` | TEXT | Olfactory story and description |
| `top_notes` | VARCHAR(255) | Opening fragrance accords |
| `heart_notes` | VARCHAR(255) | Middle accords |
| `base_notes` | VARCHAR(255) | Base accords |
| `image_url` | VARCHAR(500) | Image URL (external or `/uploads/...`) |
| `is_featured` | BOOLEAN | Display on homepage hero collection |

## 2. Seeded Products Summary
1. **Oud Royal Black** - $280.00
   - *Category*: Best Sellers
   - *Notes*: Saffron, Bergamot / Cambodian Oud, Rose Absolute / Amber, Leather, Sandalwood
2. **Velvet Rose & Taif** - $210.00
   - *Category*: For Her
   - *Notes*: Taif Rose, Pink Pepper / Bulgarian Rose, Violet / White Musk, Vanilla Bean
3. **Amber Imperial** - $245.00
   - *Category*: The Fall Edit
   - *Notes*: Cardamom, Cinnamon / Golden Amber, Benzoin / Madagascar Vanilla, Cedar
4. **Musk Al Qurashi** - $195.00
   - *Category*: For Him
   - *Notes*: Clary Sage, Bergamot / Royal White Musk / Virginia Cedar, Tonka Bean
5. **The Sultan Coffret** - $450.00
   - *Category*: Gifts
   - *Notes*: Oud, Rose, Amber / Saffron, Frankincense / Pure White Musk

## 3. Bulk JSON Import Payload Template
```json
[
  {
    "title": "Aura Oud Extraordinaire",
    "category": "Best Sellers",
    "price": 310.00,
    "description": "Exquisite 50-year aged wild Indian Oud with honeyed amber.",
    "top_notes": "Bergamot, Saffron",
    "heart_notes": "Indian Oud, Damask Rose",
    "base_notes": "White Amber, Sandalwood",
    "image_url": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    "is_featured": true
  }
]
```
