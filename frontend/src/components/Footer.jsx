import { Banknote, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-purple-500 to-orange-500 p-2 rounded-lg">
                                <Banknote className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">धनसाथी | Dhansathi</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            Empowering rural women across India through accessible financial services,
                            education, and entrepreneurship support.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                            <Twitter className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                            <Instagram className="h-6 w-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
                            <Youtube className="h-6 w-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><a href="#services" className="text-gray-300 hover:text-purple-400 transition-colors">Services</a></li>
                            <li><a href="#programs" className="text-gray-300 hover:text-purple-400 transition-colors">Training Programs</a></li>
                            <li><a href="#stories" className="text-gray-300 hover:text-purple-400 transition-colors">Success Stories</a></li>
                            <li><a href="#resources" className="text-gray-300 hover:text-purple-400 transition-colors">Resources</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Apply for Loan</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">FAQs</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Contact Support</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Grievance Portal</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div id="contact">
                        <h3 className="font-bold text-lg mb-6">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Phone className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="text-white font-semibold">Toll Free</div>
                                    <div className="text-gray-300">1800-XXX-XXXX</div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Mail className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="text-white font-semibold">Email</div>
                                    <div className="text-gray-300">support@shaktifinance.in</div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="text-white font-semibold">Head Office</div>
                                    <div className="text-gray-300">New Delhi, India</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 Dhansathi. All rights reserved..
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;