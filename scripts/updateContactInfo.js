// Script to update contact information
const mongoose = require('mongoose');
require('dotenv').config();

// Import model
const ContactInfo = require('../models/ContactInfo');

async function updateContactInfo() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean');
    console.log('✅ Connected to MongoDB');

    // Find and update the active contact info
    const contactInfo = await ContactInfo.findOne({ isActive: true });

    if (!contactInfo) {
      console.log('❌ No active contact info found. Creating new one...');
      
      const newContactInfo = new ContactInfo({
        bannerImage: "/uploads/images/contact-page/banner_contact.png",
        address1: "75B Đường Cách Mạng Tháng 8, Phường Lái Thiêu, TP. HCM",
        address2: "",
        email: "info@nextstepviet.com",
        phone: "+84 28 3940 1234",
        workingHours: "Monday - Friday: 8:00 AM - 5:00 PM",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4820.5971960873685!2d106.69613438491679!3d10.911019328985056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d79868ace557%3A0x8c18875bc92a3138!2zS2h1IFBo4buRIMSQw7RuZyBUxrAvNzUgxJAuIEPDoWNoIE3huqFuZyBUaMOhbmcgVMOhbSwgTMOhaSBUaGnDqnUsIFRodeG6rW4gQW4sIELDrG5oIETGsMahbmcsIFZp4buHdCBOYW0!5e1!3m2!1svi!2s!4v1760762609922!5m2!1svi!2s",
        socialLinks: {
          facebook: "https://facebook.com/nextstepviet",
          instagram: "https://instagram.com/nextstepviet",
          youtube: "https://youtube.com/@nextstepviet"
        },
        isActive: true
      });

      await newContactInfo.save();
      console.log('✅ Created new contact info successfully!');
      console.log('📍 Address:', newContactInfo.address1);
      console.log('📧 Email:', newContactInfo.email);
      console.log('🗺️  Map URL:', newContactInfo.mapEmbedUrl);
    } else {
      console.log('Found existing contact info. Updating...');
      
      // Update fields
      contactInfo.address1 = "75B Đường Cách Mạng Tháng 8, Phường Lái Thiêu, TP. HCM";
      contactInfo.address2 = "";
      contactInfo.email = "info@nextstepviet.com";
      contactInfo.mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4820.5971960873685!2d106.69613438491679!3d10.911019328985056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d79868ace557%3A0x8c18875bc92a3138!2zS2h1IFBo4buRIMSQw7RuZyBUxrAvNzUgxJAuIEPDoWNoIE3huqFuZyBUaMOhbmcgVMOhbSwgTMOhaSBUaGnDqnUsIFRodeG6rW4gQW4sIELDrG5oIETGsMahbmcsIFZp4buHdCBOYW0!5e1!3m2!1svi!2s!4v1760762609922!5m2!1svi!2s";

      await contactInfo.save();
      console.log('✅ Updated contact info successfully!');
      console.log('📍 Address:', contactInfo.address1);
      console.log('📧 Email:', contactInfo.email);
      console.log('🗺️  Map URL:', contactInfo.mapEmbedUrl);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the update
updateContactInfo();









