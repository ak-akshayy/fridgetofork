export const RECIPES_DATA = [
  {
    id: 'rec-1',
    title: 'Silky Restaurant-Style Palak Paneer',
    tagline: 'Fresh spinach puree simmered with seared paneer cubes and mild spices.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'North Indian',
    dietary: ['Vegetarian', 'Gluten-Free'],
    tags: ['Hero Recipe', 'High Protein', 'Iron Rich'],
    ingredients: [
      { name: 'Fresh Spinach (Palak)', quantity: 250, unit: 'g', key: 'Spinach', isCritical: true },
      { name: 'Paneer (Cottage Cheese)', quantity: 200, unit: 'g', key: 'Paneer', isCritical: true },
      { name: 'Ripe Tomatoes', quantity: 150, unit: 'g', key: 'Tomatoes', isCritical: false },
      { name: 'Red Onions', quantity: 100, unit: 'g', key: 'Onions', isCritical: false },
      { name: 'Ginger & Garlic Paste', quantity: 20, unit: 'g', key: 'Ginger', isCritical: false },
      { name: 'Plain Yogurt (Dahi)', quantity: 50, unit: 'g', key: 'Yogurt', isCritical: false },
      { name: 'Garam Masala & Indian Spices', quantity: 10, unit: 'g', key: 'Spices', isCritical: false }
    ],
    steps: [
      'Blanch the fresh spinach in boiling salted water for 2 minutes, then plunge directly into ice cold water to preserve the vibrant emerald hue.',
      'Blend the blanched spinach with 1 green chilli and 1 tbsp water into a silky, smooth puree.',
      'Heat 1 tbsp oil or butter in a pan. Lightly sear paneer cubes for 2 minutes until golden; transfer to warm salted water to keep tender.',
      'In the same pan, sauté finely chopped onions and ginger-garlic paste until aromatic and translucent.',
      'Fold in finely diced ripe tomatoes and ground spices. Cook until the oil separates gently from the masala base.',
      'Pour in the blended spinach puree and simmer on low for 5 minutes. Stir in 2 tablespoons of yogurt or cashew paste for velvet richness.',
      'Slide the softened paneer cubes into the sauce. Simmer for 2 minutes, finish with a pinch of garam masala, and serve hot with rotis or rice.'
    ],
    nutrition: {
      calories: 320,
      protein: '18g',
      carbs: '12g',
      fat: '22g',
      fiber: '5g'
    },
    substitutionTip: 'If low on paneer, firm pressed tofu works wonderfully and turns this recipe 100% plant-based vegan!',
    story: 'Spinach leaves lose crispness within 48-72 hours. This recipe transforms wilting greens into a luxurious emerald sauce, preventing 250g of fresh greens from going to waste.'
  },
  {
    id: 'rec-2',
    title: 'Smoky Kadhai Paneer & Crispy Capsicum',
    tagline: 'Bell peppers and succulent cottage cheese tossed in a freshly ground coriander-kadhai spice.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    prepTime: 12,
    cookTime: 18,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'North Indian',
    dietary: ['Vegetarian', 'Gluten-Free'],
    tags: ['Quick Dinner', 'High Protein', 'Bistro Favorite'],
    ingredients: [
      { name: 'Green Capsicum', quantity: 200, unit: 'g', key: 'Capsicum', isCritical: true },
      { name: 'Paneer (Cottage Cheese)', quantity: 200, unit: 'g', key: 'Paneer', isCritical: true },
      { name: 'Ripe Tomatoes', quantity: 200, unit: 'g', key: 'Tomatoes', isCritical: true },
      { name: 'Red Onions', quantity: 150, unit: 'g', key: 'Onions', isCritical: false },
      { name: 'Ginger & Garlic Paste', quantity: 15, unit: 'g', key: 'Ginger', isCritical: false },
      { name: 'Garam Masala & Indian Spices', quantity: 15, unit: 'g', key: 'Spices', isCritical: false }
    ],
    steps: [
      'Dice the green capsicum and red onions into 1-inch crunchy petals. Cut paneer into matching cubes.',
      'Heat oil in a heavy-bottomed wok (kadhai). Flash fry the capsicum and onion petals on high heat for 90 seconds so they stay crunchy.',
      'Remove peppers and in the remaining oil, sauté finely chopped onion and ginger-garlic paste until golden brown.',
      'Add pureed ripe tomatoes, coriander powder, cumin, red chilli, and turmeric. Cook until oil glimmers on top.',
      'Toss in the blistered capsicum, onions, and paneer cubes into the simmering masala.',
      'Gently fold so the gravy coats every morsel. Cook covered for 3 minutes and finish with crushed dried fenugreek (kasuri methi).'
    ],
    nutrition: {
      calories: 340,
      protein: '19g',
      carbs: '14g',
      fat: '24g',
      fiber: '4g'
    },
    substitutionTip: 'Missing heavy cream? Whisk 2 spoons of fresh plain curd with water for a lighter, tangy gravy balance.',
    story: 'Green bell peppers often develop soft spots if left in the crisper. This high-heat stir-fry caramelizes their natural sugars while rescuing both capsicum and aging paneer.'
  },
  {
    id: 'rec-3',
    title: 'Comforting Dal Tadka with Jeera Rice',
    tagline: 'Golden yellow pigeon pea lentils tempered with aromatic cumin, garlic, and ripe tomatoes.',
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Homestyle Indian',
    dietary: ['Vegetarian', 'Gluten-Free'],
    tags: ['Pantry Staple', 'Comfort Food', 'Budget Friendly'],
    ingredients: [
      { name: 'Toor Dal (Yellow Split Pigeon Pea)', quantity: 200, unit: 'g', key: 'Dal', isCritical: true },
      { name: 'Ripe Tomatoes', quantity: 150, unit: 'g', key: 'Tomatoes', isCritical: false },
      { name: 'Red Onions', quantity: 100, unit: 'g', key: 'Onions', isCritical: false },
      { name: 'Basmati Rice', quantity: 250, unit: 'g', key: 'Rice', isCritical: false },
      { name: 'Ginger & Garlic Paste', quantity: 15, unit: 'g', key: 'Ginger', isCritical: false },
      { name: 'Garam Masala & Indian Spices', quantity: 10, unit: 'g', key: 'Spices', isCritical: false },
      { name: 'Butter', quantity: 20, unit: 'g', key: 'Butter', isCritical: false }
    ],
    steps: [
      'Rinse toor dal until water runs clear. Pressure cook with 3 cups water, turmeric, and 1 tsp salt for 4-5 whistles until soft and creamy.',
      'Simultaneously, cook basmati rice with whole cumin seeds (jeera) and a drop of oil until fluffy.',
      'In a tadka skillet, melt butter or ghee. Add mustard seeds and cumin seeds; let them crackle happily.',
      'Add chopped garlic, sliced onions, and green chillies until toasted to a fragrant golden brown.',
      'Add finely diced ripe tomatoes and cook until soft and pulpy.',
      'Pour the sizzling fragrant tadka over the boiled yellow dal. Stir, garnish with fresh coriander, and ladle over steaming jeera rice.'
    ],
    nutrition: {
      calories: 380,
      protein: '16g',
      carbs: '62g',
      fat: '7g',
      fiber: '8g'
    },
    substitutionTip: 'If out of butter, cold-pressed mustard oil or sesame oil provides an incredible rustic dhaba-style punch!',
    story: 'Overripe tomatoes that have softened are the absolute champion ingredient for a rich, saucy dal tempering, giving natural umami balance without any canned tomato paste.'
  },
  {
    id: 'rec-4',
    title: 'Rustic Roasted Tomato & Basil Penne',
    tagline: 'Sweet caramelized tomatoes burst with garlic, wilted greens, and olive oil over al dente pasta.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281745?auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
    dietary: ['Vegetarian'],
    tags: ['Quick Dinner', 'Zero Waste', '15-Minute Meal'],
    ingredients: [
      { name: 'Ripe Tomatoes', quantity: 300, unit: 'g', key: 'Tomatoes', isCritical: true },
      { name: 'Fresh Spinach (Palak)', quantity: 100, unit: 'g', key: 'Spinach', isCritical: false },
      { name: 'Ginger & Garlic Paste', quantity: 15, unit: 'g', key: 'Garlic', isCritical: false },
      { name: 'Red Onions', quantity: 60, unit: 'g', key: 'Onions', isCritical: false },
      { name: 'Basmati Rice', quantity: 150, unit: 'g', key: 'Rice', isCritical: false, note: 'Can substitute pasta with rice bowl' }
    ],
    steps: [
      'Slice overripe tomatoes in halves or quarters.',
      'Heat oil in a wide skillet over medium-high heat. Add sliced garlic and onions until shimmering.',
      'Tumble in the ripe tomatoes cut-side down. Let them blister and caramelize for 5-6 minutes until soft and saucy.',
      'Press gently with a wooden spoon so the natural juices release into an aromatic emulsified sauce.',
      'Toss in washed spinach leaves during the last 2 minutes so they wilt effortlessly in the residual heat.',
      'Combine with cooked pasta or serve as a Mediterranean warm rice bowl. Season with freshly ground black pepper.'
    ],
    nutrition: {
      calories: 290,
      protein: '9g',
      carbs: '48g',
      fat: '8g',
      fiber: '6g'
    },
    substitutionTip: 'Have leftover bread or cooked rice? This tomato sauce makes an incredible bruschetta topping or warm tomato risotto base.',
    story: 'Soft tomatoes have higher concentrated sugars than firm salad tomatoes. Instead of letting them spoil, cooking them down caramelizes those sugars into a restaurant-grade sauce.'
  },
  {
    id: 'rec-5',
    title: 'Maharashtrian Capsicum Besan Pithla (Shimla Mirch Zunka)',
    tagline: 'Tender diced capsicum coated in spiced, roasted chickpea flour crumble.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 12,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'Western Indian',
    dietary: ['Vegan', 'Gluten-Free', 'Vegetarian'],
    tags: ['Quick Sabzi', 'High Protein', 'Gluten Free'],
    ingredients: [
      { name: 'Green Capsicum', quantity: 200, unit: 'g', key: 'Capsicum', isCritical: true },
      { name: 'Besan (Chickpea Flour)', quantity: 100, unit: 'g', key: 'Besan', isCritical: true },
      { name: 'Red Onions', quantity: 80, unit: 'g', key: 'Onions', isCritical: false },
      { name: 'Garam Masala & Indian Spices', quantity: 12, unit: 'g', key: 'Spices', isCritical: false }
    ],
    steps: [
      'Dry roast chickpea flour (besan) on a low skillet for 3 minutes until a warm, nutty aroma wafts through the kitchen. Set aside.',
      'In a pan, heat 1 tbsp oil. Splutter mustard seeds, cumin seeds, and a pinch of asafoetida.',
      'Add chopped onions and sauté for 2 minutes. Add chopped green capsicum and stir-fry on high heat for 3 minutes.',
      'Sprinkle turmeric, red chilli powder, and salt. Toss until the peppers are tender-crisp.',
      'Sprinkle the roasted besan over the peppers in stages while constantly tossing so it coats each pepper piece.',
      'Cover with a lid and steam for 2 minutes. The chickpea flour absorbs the pepper moisture and forms delicious golden savoury morsels.'
    ],
    nutrition: {
      calories: 240,
      protein: '11g',
      carbs: '28g',
      fat: '9g',
      fiber: '7g'
    },
    substitutionTip: 'Besan can also be swapped with roasted sattu or coarse cornmeal for a smoky rustic crunch.',
    story: 'Capsicum besan sabzi is a beloved traditional Indian food-rescue hack: any slightly softened bell pepper gets transformed into a nutty, protein-packed dry curry.'
  },
  {
    id: 'rec-6',
    title: 'Velvety Spiced Carrot, Tomato & Ginger Potage',
    tagline: 'Slow-simmered winter carrots and sweet tomatoes blended with fresh ginger and warming herbs.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'Continental Fusion',
    dietary: ['Vegetarian', 'Gluten-Free'],
    tags: ['Low Calorie', 'Immunity Booster', 'Comfort Soup'],
    ingredients: [
      { name: 'Fresh Carrots', quantity: 300, unit: 'g', key: 'Carrots', isCritical: true },
      { name: 'Ripe Tomatoes', quantity: 200, unit: 'g', key: 'Tomatoes', isCritical: true },
      { name: 'Ginger & Garlic Paste', quantity: 15, unit: 'g', key: 'Ginger', isCritical: false },
      { name: 'Milk', quantity: 100, unit: 'ml', key: 'Milk', isCritical: false },
      { name: 'Butter', quantity: 15, unit: 'g', key: 'Butter', isCritical: false }
    ],
    steps: [
      'Roughly chop carrots and tomatoes.',
      'In a heavy soup pot, melt butter and add grated ginger and garlic. Sauté for 1 minute.',
      'Toss in chopped carrots and tomatoes. Season with salt, black pepper, and cumin.',
      'Add 2 cups of water or vegetable broth. Bring to a rolling boil, then lower heat and simmer for 15 minutes until carrots pierce easily with a fork.',
      'Puree the vegetables with an immersion blender until velvety and uniform.',
      'Stir in warm milk or coconut cream to smooth out the acidity. Serve hot with toasted croutons.'
    ],
    nutrition: {
      calories: 185,
      protein: '4g',
      carbs: '22g',
      fat: '8g',
      fiber: '6g'
    },
    substitutionTip: 'Use cashew paste or oat milk instead of cow milk for a rich vegan soup.',
    story: 'Carrots that have sat in the fridge can easily be revived in a nourishing blended soup where texture variation melts into pure silkiness.'
  },
  {
    id: 'rec-7',
    title: 'Dhaba-Style Paneer Bhurji with Butter Pav',
    tagline: 'Crumbled cottage cheese scrambled with caramelized onions, tomatoes, and crispy green capsicum.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'North Indian',
    dietary: ['Vegetarian', 'Gluten-Free'],
    tags: ['10-Minute Meal', 'High Protein', 'Breakfast / Dinner'],
    ingredients: [
      { name: 'Paneer (Cottage Cheese)', quantity: 200, unit: 'g', key: 'Paneer', isCritical: true },
      { name: 'Green Capsicum', quantity: 100, unit: 'g', key: 'Capsicum', isCritical: false },
      { name: 'Ripe Tomatoes', quantity: 120, unit: 'g', key: 'Tomatoes', isCritical: false },
      { name: 'Red Onions', quantity: 100, unit: 'g', key: 'Onions', isCritical: false },
      { name: 'Butter', quantity: 20, unit: 'g', key: 'Butter', isCritical: false },
      { name: 'Garam Masala & Indian Spices', quantity: 10, unit: 'g', key: 'Spices', isCritical: false }
    ],
    steps: [
      'Gently crumble the fresh paneer between your palms into bite-sized coarse curds.',
      'Melt butter in a skillet. Add cumin seeds and sauté finely diced onions until light golden brown.',
      'Add diced green capsicum and sauté for 2 minutes on high heat to preserve snap and crunch.',
      'Add chopped tomatoes, turmeric, chilli powder, and salt. Cook until tomatoes breakdown into a jammy base.',
      'Fold in the crumbled paneer curds. Stir gently on low heat for only 2-3 minutes so the paneer remains moist and tender (do not overcook!).',
      'Sprinkle garam masala and chopped coriander. Serve piping hot with toasted butter pav or parathas.'
    ],
    nutrition: {
      calories: 360,
      protein: '20g',
      carbs: '10g',
      fat: '26g',
      fiber: '3g'
    },
    substitutionTip: 'Works equally well with pressed tofu scrambled with a dash of nutritional yeast and turmeric.',
    story: 'Paneer that is close to its expiration date is easiest to crumble into bhurji, absorbing all spices and rescuing 200g of dairy before souring.'
  },
  {
    id: 'rec-8',
    title: 'Crispy Aloo Palak (Potato & Wilted Spinach Sabzi)',
    tagline: 'Pan-roasted golden potato cubes tossed with wilted garlic spinach and toasted cumin.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 18,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'North Indian',
    dietary: ['Vegan', 'Gluten-Free', 'Vegetarian'],
    tags: ['Comfort Food', 'Vegan', 'Easy Weeknight'],
    ingredients: [
      { name: 'Fresh Spinach (Palak)', quantity: 200, unit: 'g', key: 'Spinach', isCritical: true },
      { name: 'Potatoes', quantity: 300, unit: 'g', key: 'Potatoes', isCritical: true },
      { name: 'Red Onions', quantity: 100, unit: 'g', key: 'Onions', isCritical: false },
      { name: 'Ginger & Garlic Paste', quantity: 10, unit: 'g', key: 'Ginger', isCritical: false },
      { name: 'Garam Masala & Indian Spices', quantity: 10, unit: 'g', key: 'Spices', isCritical: false }
    ],
    steps: [
      'Parboil or microwave diced potatoes for 4 minutes until almost tender.',
      'Heat oil in a pan. Fry the potato cubes with a pinch of turmeric and salt until golden and crisp on the edges.',
      'Push potatoes to the side. Add cumin seeds, sliced garlic, and chopped onions. Sauté until fragrant.',
      'Add roughly shredded fresh spinach leaves in batches. The voluminous leaves will collapse into the skillet within 90 seconds.',
      'Season with roasted cumin powder, coriander, and dry mango powder (amchur).',
      'Toss together so the potatoes become speckled with tender green ribbons. Serve with warm rotis.'
    ],
    nutrition: {
      calories: 220,
      protein: '6g',
      carbs: '34g',
      fat: '6g',
      fiber: '5g'
    },
    substitutionTip: 'Sweet potatoes or roasted cauliflower can substitute for potatoes for a lower-glycemic twist.',
    story: 'Spinach reduces to less than a third of its raw volume when heat hits it, making it effortless to use up a full 200g bunch before leaves yellow.'
  }
];
