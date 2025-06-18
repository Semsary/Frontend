import React from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Home,
    Users,
    Shield,
    FileText,
    ChevronRight,
    Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="mt-30 bg-gray-50 border-t border-gray-200" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Company Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/luxor-uni.firebasestorage.app/o/Ar.png?alt=media&token=413c3087-7cad-4b40-809e-74c27b5f53e7"
                                alt="سمساري"
                                className="h-10 w-auto ml-3"
                            />
                            <h3 className="text-xl font-bold text-gray-800">سمساري</h3>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            منصة العقارات الرائدة في مصر، نربط بين المالكين والباحثين عن السكن
                            لتوفير أفضل الخيارات العقارية.
                        </p>

                        {/* Social Media Links */}
                        <div className="flex space-x-3 space-x-reverse">
                            <a href="#" className="w-8 h-8 bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-200 hover:bg-blue-400 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-200 hover:bg-pink-600 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-200 hover:bg-blue-700 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800">روابط سريعة</h4>
                        <nav className="space-y-2">
                            {[
                                { name: 'الرئيسية', href: '/' },
                                { name: 'العقارات', href: '/properties' },
                                { name: 'عن سمساري', href: '/about' },
                                { name: 'اتصل بنا', href: '/contact' },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="block text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800">خدماتنا</h4>
                        <nav className="space-y-2">
                            {[
                                { name: 'إيجار شهري', href: '/monthly-rental' },
                                { name: 'إيجار يومي', href: '/daily-rental' },
                                { name: 'بيع عقارات', href: '/sale' },
                                { name: 'استشارات عقارية', href: '/consultation' },
                            ].map((service) => (
                                <Link
                                    key={service.name}
                                    to={service.href}
                                    className="block text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                                >
                                    {service.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800">تواصل معنا</h4>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600 text-sm">
                                <MapPin className="w-4 h-4 text-blue-500 ml-2" />
                                <span>الأقصر، مصر</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <Phone className="w-4 h-4 text-green-500 ml-2" />
                                <span>+20 123 456 7890</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <Mail className="w-4 h-4 text-red-500 ml-2" />
                                <span>info@semsary.site</span>
                            </div>
                        </div>

                        {/* Newsletter Subscription */}
                  
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                            <Link to="/privacy" className="hover:text-gray-700 transition-colors duration-200">
                                سياسة الخصوصية
                            </Link>
                            <Link to="/terms" className="hover:text-gray-700 transition-colors duration-200">
                                الشروط والأحكام
                            </Link>
                        </div>

                        <div className="text-gray-500 text-sm">
                            © 2024 سمساري. جميع الحقوق محفوظة.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;