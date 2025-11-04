// Script to update contact info via API
const axios = require('axios');

async function updateContactInfo() {
  try {
    console.log('🔄 Updating contact information...');

    const API_URL = 'http://localhost:5001/api/contact/update';
    
    const updateData = {
      address1: "75B Đường Cách Mạng Tháng 8, Phường Lái Thiêu, TP. HCM",
      address2: "",
      email: "info@nextstepviet.com",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4820.5971960873685!2d106.69613438491679!3d10.911019328985056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d79868ace557%3A0x8c18875bc92a3138!2zS2h1IFBo4buRIMSQw7RuZyBUxrAvNzUgxJAuIEPDoWNoIE3huqFuZyBUaMOhbmcgVMOhbSwgTMOhaSBUaGnDqnUsIFRodeG6rW4gQW4sIELDrG5oIETGsMahbmcsIFZp4buHdCBOYW0!5e1!3m2!1svi!2s!4v1760762609922!5m2!1svi!2s"
    };

    const response = await axios.put(API_URL, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ Contact information updated successfully!');
      console.log('📍 Address:', response.data.data.address1);
      console.log('📧 Email:', response.data.data.email);
      console.log('🗺️  Map embedded');
    } else {
      console.error('❌ Failed to update:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

updateContactInfo();














