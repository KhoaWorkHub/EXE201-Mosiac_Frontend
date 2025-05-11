import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Carousel, Rate, message } from 'antd';
import { ArrowRightOutlined, FireOutlined, GiftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFeaturedProducts, fetchLatestProducts } from '@/store/slices/productSlice';
import ProductCarousel from '@/features/products/components/ProductCarousel';
import ProductsGrid from '@/features/products/components/ProductsGrid';
import type { ProductResponse } from '@/types/product.types';
import { useCart } from '@/contexts/CartContext';
import type { UUID } from 'crypto';

const { Title, Text, Paragraph } = Typography;

// Categories
const categories = [
  {
    id: 'womens',
    image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlldG5hbWVzZSUyMGFvJTIwZGFpfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    count: 152,
    url: '/products?category=womens'
  },
  {
    id: 'mens',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmlldG5hbWVzZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    count: 98,
    url: '/products?category=mens'
  },
  {
    id: 'accessories',
    image: 'https://images.unsplash.com/photo-1621164078873-a944ea50a9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmlldG5hbWVzZSUyMGFjY2Vzc29yaWVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    count: 64,
    url: '/products?category=accessories'
  },
  {
    id: 'home',
    image: 'https://images.unsplash.com/photo-1616486395688-b8d1438bd3bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHZpZXRuYW1lc2UlMjBkZWNvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    count: 47,
    url: '/products?category=home'
  }
];

// Region sections
const regions = [
  {
    id: 'north',
    image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhcGElMjB2aWV0bmFtfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    url: '/regions/north'
  },
  {
    id: 'central',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aHVlJTIwdmlldG5hbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    url: '/regions/central'
  },
  {
    id: 'south',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVrb25nJTIwZGVsdGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    url: '/regions/south'
  }
];

// Testimonials
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Toronto, Canada',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4
  },
  {
    id: 3,
    name: 'Emma Nguyen',
    location: 'Sydney, Australia',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    rating: 5
  }
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Category Card Component
interface CategoryCardProps {
  category: {
    id: string;
    image: string;
    count: number;
    url: string;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t } = useTranslation(['common']);
  
  return (
    <motion.div variants={fadeInUp}>
      <Link to={category.url}>
        <div className="relative overflow-hidden rounded-lg group cursor-pointer">
          <div className="h-64 overflow-hidden">
            <img 
              src={category.image} 
              alt={t(`common:categories.${category.id}.name`)} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <h3 className="text-xl font-bold mb-1">{t(`common:categories.${category.id}.name`)}</h3>
            <p className="text-sm text-gray-200">{category.count} {t('common:categories.items')}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    location: string;
    avatar: string;
    rating: number;
  };
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { t } = useTranslation(['common']);
  
  return (
    <motion.div variants={fadeInUp}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
        <div className="flex items-center mb-4">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white">{testimonial.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</p>
          </div>
        </div>
        <Rate disabled defaultValue={testimonial.rating} className="mb-3" />
        <p className="text-gray-700 dark:text-gray-300 italic">
          {t(`common:testimonials.${testimonial.id}.text`)}
        </p>
      </div>
    </motion.div>
  );
};

const HomePage: React.FC = () => {
  const { t } = useTranslation(['common', 'product']);
  const dispatch = useAppDispatch();
  const { 
    latestProducts, 
    featuredProducts, 
    loading 
  } = useAppSelector(state => state.products);
  
  useEffect(() => {
    // Fetch latest products (6 products)
    dispatch(fetchLatestProducts({ size: 6 }));
    
    // Fetch featured products (6 products)
    dispatch(fetchFeaturedProducts({ size: 6 }));
  }, [dispatch]);
  
  // Handle add to cart
  const { addToCart } = useCart();

  const handleAddToCart = async (product: ProductResponse) => {
    try {
      await addToCart({
        productId: product.id as UUID,
        quantity: 1,
      }, product);
      // The notification will be shown by the CartNotification component
    } catch (error) {
      console.error('Failed to add to cart:', error);
      message.error(t('cart:notifications.error_adding'));
    }
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = (product: ProductResponse) => {
    // Will implement actual wishlist functionality later
    message.success(`${product.name} added to wishlist!`);
  };
  
  return (
    <MainLayout>
      {/* Hero Section with Latest Products Carousel */}
      <section className="relative">
        <Carousel autoplay effect="fade" className="hero-carousel">
          <div>
            <div className="relative h-[70vh] bg-center bg-cover" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557750255-c76072a7fdf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW8lMjBkYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1400&q=80)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="container mx-auto relative z-10 flex items-center h-full px-4">
                <motion.div 
                  className="max-w-2xl text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Title level={1} className="text-white text-4xl md:text-5xl mb-4 font-bold">
                    {t('common:hero.slide1.title')}
                  </Title>
                  <Paragraph className="text-gray-200 text-lg mb-8">
                    {t('common:hero.slide1.description')}
                  </Paragraph>
                  <Link to="/products">
                    <Button type="primary" size="large" className="mr-4">
                      {t('common:actions.shop_now')} <ArrowRightOutlined />
                    </Button>
                  </Link>
                  <Link to="/collections">
                    <Button size="large">
                      {t('common:nav.collections')}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
          <div>
            <div className="relative h-[70vh] bg-center bg-cover" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1624371711241-e15e6d554040?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlldG5hbWVzZSUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1400&q=80)' }}>
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="container mx-auto relative z-10 flex items-center h-full px-4">
                <div className="max-w-2xl text-white">
                  <Title level={1} className="text-white text-4xl md:text-5xl mb-4 font-bold">
                    {t('common:hero.slide2.title')}
                  </Title>
                  <Paragraph className="text-gray-200 text-lg mb-8">
                    {t('common:hero.slide2.description')}
                  </Paragraph>
                  <Link to="/products?sort=createdAt,desc">
                    <Button type="primary" size="large" className="mr-4">
                      {t('common:nav.new_arrivals')} <ArrowRightOutlined />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="large">
                      {t('common:nav.about')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('common:features.craftsmanship.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('common:features.craftsmanship.description')}</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v1h-2V8a1 1 0 00-1-1H6a1 1 0 00-1 1v7h1.05a2.5 2.5 0 014.9 0H15V8a1 1 0 00-1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('common:features.shipping.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('common:features.shipping.description')}</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('common:features.returns.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('common:features.returns.description')}</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('common:features.sustainable.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('common:features.sustainable.description')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="mb-2 dark:text-white">{t('common:nav.new_arrivals')}</Title>
              <Text className="text-gray-600 dark:text-gray-400">
                {t('common:sections.featured_products.subtitle')}
              </Text>
            </div>
            <Link to="/products?sort=createdAt,desc">
              <Button type="link" className="font-semibold">
                {t('common:actions.view_all')} <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
          
          <ProductCarousel 
            products={latestProducts} 
            loading={loading}
            autoplay={true}
            slidesToShow={4}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2 dark:text-white">{t('common:sections.categories.title')}</Title>
            <Text className="text-gray-600 dark:text-gray-400">{t('common:sections.categories.subtitle')}</Text>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="mb-2 dark:text-white">{t('common:sections.featured_products.title')}</Title>
              <Text className="text-gray-600 dark:text-gray-400">{t('common:sections.featured_products.subtitle')}</Text>
            </div>
            <Link to="/products?featured=true">
              <Button type="link" className="font-semibold">
                {t('common:actions.view_all')} <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
          
          <ProductsGrid 
            products={featuredProducts} 
            loading={loading}
            cols={4}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-xl bg-primary text-white">
            <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlldG5hbWVzZSUyMGFvJTIwZGFpfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" 
                alt={t('common:special_offer.image_alt')} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <FireOutlined className="text-2xl mr-3" />
                    <span className="text-xl font-bold">{t('common:special_offer.label')}</span>
                  </div>
                  <Title level={2} className="text-white text-3xl md:text-4xl mb-4">
                    {t('common:special_offer.title')}
                  </Title>
                  <Paragraph className="text-gray-100 mb-8 text-lg">
                    {t('common:special_offer.description')}
                  </Paragraph>
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-2xl font-bold">00</span>
                        <p className="text-xs">{t('common:special_offer.countdown.days')}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-2xl font-bold">12</span>
                        <p className="text-xs">{t('common:special_offer.countdown.hours')}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-2xl font-bold">45</span>
                        <p className="text-xs">{t('common:special_offer.countdown.mins')}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-2xl font-bold">30</span>
                        <p className="text-xs">{t('common:special_offer.countdown.secs')}</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/products?category=aodai">
                    <Button size="large" className="bg-white text-primary hover:bg-gray-100 border-white">
                      {t('common:special_offer.button')} <ArrowRightOutlined />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Collections */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2 dark:text-white">{t('common:sections.regions.title')}</Title>
            <Text className="text-gray-600 dark:text-gray-400">{t('common:sections.regions.subtitle')}</Text>
          </div>

          {regions.map((region, index) => (
            <motion.div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 mb-12 last:mb-0`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="lg:w-1/2">
                <div className="overflow-hidden rounded-lg h-full">
                  <img 
                    src={region.image} 
                    alt={t(`common:regions.${region.id}.name`)} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 flex flex-col justify-center">
                <Title level={3} className="mb-3 dark:text-white">{t(`common:regions.${region.id}.name`)}</Title>
                <Paragraph className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {t(`common:regions.${region.id}.description`)}
                </Paragraph>
                <Link to={region.url}>
                  <Button type="primary" size="large" className="max-w-max">
                    {t('common:actions.explore_collection')} <ArrowRightOutlined />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2 dark:text-white">{t('common:sections.testimonials.title')}</Title>
            <Text className="text-gray-600 dark:text-gray-400">{t('common:sections.testimonials.subtitle')}</Text>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <GiftOutlined className="text-4xl mb-4" />
            <Title level={2} className="text-white mb-3">{t('common:newsletter.title')}</Title>
            <Paragraph className="text-gray-100 mb-8 text-lg">
              {t('common:newsletter.description')}
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder={t('common:newsletter.placeholder')} 
                className="flex-grow py-3 px-4 rounded-lg text-gray-800 focus:outline-none"
              />
              <Button size="large" className="bg-white text-primary hover:bg-gray-100 border-white">
                {t('common:newsletter.button')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;